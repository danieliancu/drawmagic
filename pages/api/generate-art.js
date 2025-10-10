import OpenAI from "openai";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import imageSize from "image-size";
import { v2 as cloudinary } from "cloudinary";
import os from "os"; // ✅ pentru tmpdir

export const config = {
  api: { bodyParser: false },
};

// 🔹 Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ✅ Director temporar sigur (Vercel → /tmp)
const tempDir = os.tmpdir();

export default async function handler(req, res) {
  let filePath = null;

  try {
    // 📂 Parse form-data în folder temporar sigur
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

    // 🔠 Normalizează extensia
    const ext = path.extname(filePath);
    const lowerExt = ext.toLowerCase();
    if (ext !== lowerExt) {
      const newPath = filePath.replace(ext, lowerExt);
      fs.renameSync(filePath, newPath);
      filePath = newPath;
    }

    // 🖼️ Dimensiuni imagine
    let width = 512, height = 512;
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

    // 🧠 Prompt
const safePrompt = `
  You are a professional digital illustrator. 
  Use the uploaded sketch as artistic inspiration and reinterpret it 
  in a ${style} illustration style.
  Keep the same visual composition and proportions (${width}x${height}), 
  enriching the scene with balanced colors, clean shapes, and creative atmosphere.
  Preserve any existing characters, animals, or objects — refine their details
  and artistic quality while keeping their recognizable form and personality.
  Recreate and extend the background in harmony with the subject, 
  making the entire image cohesive, colorful, and visually engaging.
  The final artwork should look like a vivid, imaginative digital illustration — 
  detailed, expressive, and family-friendly, avoiding photorealistic or human portrait rendering.
`;



    // 🧠 Upload imagine -> OpenAI
    const fileResult = await openai.files.create({
      file: fs.createReadStream(filePath),
      purpose: "vision",
    });

    // 🪄 Generare imagine
    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "user",
          content: [
            { type: "input_text", text: safePrompt },
            { type: "input_image", file_id: fileResult.id },
          ],
        },
      ],
      tools: [{ type: "image_generation" }],
    });

    // 🖼️ Extragem imaginea generată
    const imageData = response.output
      ?.filter((o) => o.type === "image_generation_call")
      ?.map((o) => o.result);

    if (!imageData?.length) {
      throw new Error("Image generation failed — no output returned.");
    }

    const base64Data = imageData[0].replace(/^data:image\/\w+;base64,/, "");

    // ☁️ Upload pe Cloudinary
    const uploadResult = await cloudinary.uploader.upload(
      `data:image/png;base64,${base64Data}`,
      {
        folder: "ai_art",
        resource_type: "image",
      }
    );

    res.status(200).json({ imageUrl: uploadResult.secure_url });
  } catch (err) {
    console.error("❌ GENERATE-ART ERROR DETAILS:");
    console.error("Message:", err.message);
    res.status(500).json({
      error: err.message || "Unknown error during image generation",
    });
  } finally {
    // 🧹 Curățare fișier temporar
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (cleanupErr) {
        console.warn("⚠️ Could not delete temp file:", cleanupErr);
      }
    }
  }
}
