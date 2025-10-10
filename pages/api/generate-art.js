import OpenAI from "openai";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import imageSize from "image-size";
import { v2 as cloudinary } from "cloudinary";

export const config = {
  api: { bodyParser: false },
};

// 🔹 Configurare Cloudinary (folosește variabilele din .env.local)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  let filePath = null;

  try {
    // 📂 Parse form-data
    const form = formidable({ multiples: false, uploadDir: "./temp", keepExtensions: true });
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
    let width = 512, height = 512, aspectRatio = 1;
    try {
      const buffer = fs.readFileSync(filePath);
      const dims = imageSize(buffer);
      if (dims.width && dims.height) {
        width = dims.width;
        height = dims.height;
        aspectRatio = width / height;
      }
    } catch {
      console.warn("⚠️ Could not read image dimensions, using default 1:1 ratio.");
    }

    // 📤 Upload imagine către OpenAI
    const fileResult = await openai.files.create({
      file: fs.createReadStream(filePath),
      purpose: "vision",
    });

    // 🧠 Prompt AI
    const safePrompt = `
      You are an AI illustrator. Recreate the uploaded hand-drawn artwork 
      in a ${style} illustration style. 
      Keep the same layout and proportions (${width}x${height}), 
      enhancing it with vibrant colors and imagination. 
      The uploaded image is a child's drawing of imaginary characters or objects. 
      Ensure the output is artistic, family-friendly, and non-photorealistic.
    `;

    // 🪄 Generare imagine AI
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

    // 🔄 Convertim base64 → upload Cloudinary
    const base64Data = imageData[0].replace(/^data:image\/\w+;base64,/, "");

    const uploadResult = await cloudinary.uploader.upload(
      `data:image/png;base64,${base64Data}`,
      {
        folder: "ai_art",
        resource_type: "image",
      }
    );

    // ✅ Trimitem URL-ul public
    res.status(200).json({ imageUrl: uploadResult.secure_url });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ error: err.message });
  } finally {
    // 🧹 Curățăm fișierul temporar
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (cleanupErr) {
        console.warn("⚠️ Could not delete temp file:", cleanupErr);
      }
    }
  }
}
