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

// 🧠 Director temporar sigur pentru Vercel
const tempDir = os.tmpdir();

export default async function handler(req, res) {
  let filePath = null;

  try {
    // 1️⃣ Parse form-data în /tmp
    const form = formidable({
      multiples: false,
      uploadDir: tempDir,
      keepExtensions: true,
    });

    const [fields, files] = await form.parse(req);
    const style = fields.style?.[0];
    const uploadedFile = files.file?.[0];

    if (!uploadedFile || !style) {
      return res.status(400).json({ error: "Missing file or style" });
    }

    filePath = uploadedFile.filepath;

    // 2️⃣ Determină dimensiunea imaginii
    let width = 512,
      height = 512;
    try {
      const buffer = fs.readFileSync(filePath);
      const dims = imageSize(buffer);
      if (dims.width && dims.height) {
        width = dims.width;
        height = dims.height;
      }
    } catch {
      console.warn("⚠️ Could not read image dimensions.");
    }

// 3️⃣ Dimensiune fixă (cea mai ieftină și sigură)
const size = "1024x1024";


    // 4️⃣ Upload inițial în Cloudinary
    const uploadOriginal = await cloudinary.uploader.upload(filePath, {
      folder: "ai_art_uploads",
      resource_type: "image",
      overwrite: true,
    });

    const imageUrl = uploadOriginal.secure_url;

    // 5️⃣ Analiză imagine → prompt detaliat cu GPT-4o (nu mini)
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
                include the main subject, body parts, pose, objects, and environment, 
                in one or two sentences suitable for an illustrator to recreate it faithfully.
              `,
            },
            { type: "input_image", image_url: imageUrl },
          ],
        },
      ],
    });

    const description = analysis.output_text?.trim() || "a simple child drawing of an imaginative creature";


    // 6️⃣ Creează promptul final pentru gpt-image-1
    const safePrompt = `
      Recreate ${description} in a ${style} digital illustration style.
      Keep the same subject and composition as the child's original drawing.
      Use vivid colors, clean shapes, and a soft, family-friendly look.
      Avoid photorealism — make it look artistic and imaginative.
    `;

    // 7️⃣ Generare imagine finală
    const result = await openai.images.generate({
      model: "gpt-image-1",
      prompt: safePrompt,
      size,
    });

    const base64Image = result.data?.[0]?.b64_json;
    if (!base64Image) throw new Error("No image returned from OpenAI.");

    // 8️⃣ Upload imagine finală în Cloudinary
    const uploadFinal = await cloudinary.uploader.upload(
      `data:image/png;base64,${base64Image}`,
      { folder: "ai_art_results", resource_type: "image" }
    );

    // 9️⃣ Returnează răspunsul
    res.status(200).json({
      original: imageUrl,
      description,
      imageUrl: uploadFinal.secure_url,
      size,
      estimated_cost: size === "1024x1024" ? "$0.081" : "$0.123",
    });
  } catch (err) {
    console.error("❌ GENERATE-ART ERROR:", err.message);
    res.status(500).json({ error: err.message });
  } finally {
    // 🔹 Curăță fișierul temporar
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (cleanupErr) {
        console.warn("⚠️ Could not delete temp file:", cleanupErr);
      }
    }
  }
}
