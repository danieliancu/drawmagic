import OpenAI from "openai";
import formidable from "formidable";
import fs from "fs";
import os from "os";
import { v2 as cloudinary } from "cloudinary";
import imageSize from "image-size";

export const config = {
  api: { bodyParser: false },
};

// ☁️ Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const tempDir = os.tmpdir();

export default async function handler(req, res) {
  let filePath = null;

  try {
    const form = formidable({
      multiples: false,
      uploadDir: tempDir,
      keepExtensions: true,
    });

    const [fields, files] = await form.parse(req);

    const style = fields.style?.[0];
    const uploadedFile = files.file?.[0];
    const existingDescription = fields.description?.[0]; // 🆕 primim descrierea anterioară, dacă există

    if (!style) return res.status(400).json({ error: "Missing style" });

    let description = existingDescription || null;
    let imageUrl = null;

    // dacă userul a trimis o imagine nouă → facem analiza GPT-4o
    if (uploadedFile) {
      filePath = uploadedFile.filepath;

      // Upload original în Cloudinary
      const uploadOriginal = await cloudinary.uploader.upload(filePath, {
        folder: "ai_art_uploads",
        resource_type: "image",
        overwrite: true,
      });
      imageUrl = uploadOriginal.secure_url;

      // Analiză cu GPT-4o (doar o dată)
      const analysis = await openai.responses.create({
        model: "gpt-4o",
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: `
                  You are an art assistant.
                  Look carefully at this child's drawing and describe in detail what it represents —
                  include the main subject, pose, and scene in one or two sentences.
                `,
              },
              { type: "input_image", image_url: imageUrl },
            ],
          },
        ],
      });

      description =
        analysis.output_text?.trim() ||
        "a simple child's drawing of an imaginative creature";
    } else if (!existingDescription) {
      // dacă nu avem nici fișier nou, nici descriere anterioară → eroare
      return res.status(400).json({ error: "Missing file or description" });
    }

    // Generare imagine artistică (GPT-image-1)
    const safePrompt = `
      Recreate ${description} in a ${style} digital illustration style.
      Keep the same subject and composition as the child's original drawing.
      Use vivid colors, clean shapes, and a family-friendly atmosphere.
      Avoid photorealism — make it artistic and imaginative.
    `;

    const result = await openai.images.generate({
      model: "gpt-image-1",
      prompt: safePrompt,
      size: "1024x1024",
    });

    const base64Image = result.data?.[0]?.b64_json;
    if (!base64Image) throw new Error("No image returned from OpenAI.");

    // Upload imagine finală în Cloudinary
    const uploadFinal = await cloudinary.uploader.upload(
      `data:image/png;base64,${base64Image}`,
      { folder: "ai_art_results", resource_type: "image" }
    );

    res.status(200).json({
      imageUrl: uploadFinal.secure_url,
      original: imageUrl,
      description, // 🧠 o trimitem la frontend pentru reutilizare
      size: "1024x1024",
      estimated_cost: "$0.045",
    });
  } catch (err) {
    console.error("❌ GENERATE-ART ERROR:", err.message);
    res.status(500).json({ error: err.message });
  } finally {
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (cleanupErr) {
        console.warn("⚠️ Could not delete temp file:", cleanupErr);
      }
    }
  }
}
