import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function UploadModal({ show, onClose }) {
  const [image, setImage] = useState(null);
  const [compressedFile, setCompressedFile] = useState(null);
  const [originalUrl, setOriginalUrl] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [progress, setProgress] = useState(null);
  const [generatedImages, setGeneratedImages] = useState([]); // 🆕 toate imaginile generate
  const fileInputRef = useRef(null);

  // 🧹 Cleanup pentru URL.createObjectURL
  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
    };
  }, [originalUrl]);

  // ✅ Compresie imagine
  const compressImage = (file) =>
    new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxSize = 800;
        const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => {
            if (!blob) return resolve(file);
            resolve(new File([blob], file.name, { type: blob.type }));
          },
          "image/jpeg",
          0.7
        );
      };
      img.src = URL.createObjectURL(file);
    });

  // 📂 Când se selectează o imagine
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const compressed = await compressImage(file);
    setImage(file);
    setCompressedFile(compressed);
    setOriginalUrl(URL.createObjectURL(compressed));
    setGeneratedImages([]); // resetăm istoria la o nouă imagine
  };

  // 📥 Când se face drag & drop
  const handleDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const compressed = await compressImage(file);
    setImage(file);
    setCompressedFile(compressed);
    setOriginalUrl(URL.createObjectURL(compressed));
    setGeneratedImages([]); // resetăm istoria
  };

  const handleDragOver = (e) => e.preventDefault();

  // 🧠 Generare imagine AI
  const handleGenerate = async (styleToUse = null) => {
    const style = styleToUse || selectedStyle;
    if (!compressedFile || !style) {
      alert("Please upload an image and choose a style first!");
      return;
    }

    setSelectedStyle(style);
    setProgress("Preparing your masterpiece...");

    const formData = new FormData();
    formData.append("file", compressedFile);
    formData.append("style", style);

    try {
      const res = await fetch("/api/generate-art", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to generate image");
      setProgress("Generating AI image...");

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // 🆕 Adaugă un nou rezultat în listă
      setGeneratedImages((prev) => [
        ...prev,
        { style, imageUrl: data.imageUrl },
      ]);

      setProgress(null);
    } catch (err) {
      console.error(err);
      setProgress(
        <span style={{ color: "red" }}>
          ❌ Something went wrong.{" "}
          <button
            onClick={() => {
              setGeneratedImages([]);
              setOriginalUrl(null);
              setSelectedStyle(null);
              setImage(null);
              setCompressedFile(null);
              setProgress(null);
            }}
            style={{
              background: "#ffcc00",
              border: "none",
              borderRadius: "6px",
              padding: "4px 10px",
              marginLeft: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Try again
          </button>
        </span>
      );
    }
  };

  // 🎨 Stiluri disponibile
  const styles = [
    { name: "Realistic", desc: "Detailed and lifelike visuals" },
    { name: "Disney", desc: "Cartoony and full of charm" },
    { name: "Futuristic", desc: "Sci-fi and sleek aesthetics" },
    { name: "Dreamscape", desc: "Surreal and glowing imagery" },
    { name: "Comic Hero", desc: "Bold and dynamic contrasts" },
    { name: "Fantasy", desc: "Magical and storybook style" },
  ];

  // 🧱 Randare modal
  return show ? (
    <div className="modal-overlay" onClick={() => !progress && onClose()}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="close" onClick={() => !progress && onClose()}>
          &times;
        </button>

        {/* 🧩 Header inițial */}
        {generatedImages.length === 0 && (
          <>
            <h2>Upload Your Drawing</h2>
            <p>
              Take a photo or scan of your artwork. For best results, use good
              lighting and avoid shadows.
            </p>
          </>
        )}

        {/* 🧩 După generare */}
        {generatedImages.length > 0 && originalUrl && (
          <div className="generated-section">
            <h3 style={{ margin: 0 }}>Your AI-Enhanced Artwork</h3>

            {/* 🔁 Afișăm fiecare versiune generată */}
            {generatedImages.map((item, idx) => (
              <div key={idx} className="image-row">
                <div>
                  <p>Original</p>
                  <img src={originalUrl} alt="original" className="preview" />
                </div>
                <div>
                  <p>
                    AI: <strong>{item.style}</strong>
                  </p>
                  <Link href="">
                    <img
                      src={item.imageUrl}
                      alt={`AI ${item.style}`}
                      className="preview"
                    />
                    <button className="btn btn-kids btn-happy">
                      I want this one!
                    </button>
                  </Link>
                </div>
              </div>
            ))}

            {progress &&
              <p className="progress">
                {progress}
                <br />
                <span style={{ color:"black",fontWeight:"100" }}>(this may take up to 2 minutes)</span>
              </p>
            }

            {!progress && (
              <>
                <h3>Try a different style</h3>
              </>
            )}

            <div className="style-options">
              {styles.map((style) => (
                <div
                  key={style.name}
                  className={`style-box ${
                    selectedStyle === style.name ? "selected" : ""
                  }`}
                  onClick={() => !progress && handleGenerate(style.name)}
                  style={{
                    cursor: progress ? "not-allowed" : "pointer",
                    opacity: progress ? 0.5 : 1,
                  }}
                >
                  <h4>{style.name}</h4>
                  <p>{style.desc}</p>
                </div>
              ))}
            </div>

            {/* 🔁 Reset complet */}
            <button
              className="btn btn-kids"
              onClick={() => {
                if (progress) return;
                setGeneratedImages([]);
                setOriginalUrl(null);
                setSelectedStyle(null);
                setImage(null);
                setCompressedFile(null);
                setProgress(null);
              }}
              style={{ marginTop: "20px" }}
              disabled={!!progress}
            >
              {progress ? "⏳ Please wait..." : "Start a new artwork from scratch"}
            </button>
          </div>
        )}

        {/* 🧩 Upload inițial */}
        {generatedImages.length === 0 && (
          <>
            <div
              className="upload-box"
              onClick={() => !progress && fileInputRef.current.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              style={{ opacity: progress ? 0.5 : 1 }}
            >
              {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  alt="Uploaded"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "180px",
                    borderRadius: "8px",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <>
                  <span
                    style={{ fontSize: "42px" }}
                    role="img"
                    aria-label="upload"
                  >
                    ☁️
                  </span>
                  <p>
                    Drag &amp; drop your image here
                    <br />
                    or click to browse files
                  </p>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </div>

            {image && (
              <>
              {!progress && (
                <h3 style={{ marginTop: "20px" }}>Choose a Style</h3>
              )}
                {progress && <p className="progress">{progress}</p>}
                <div className="style-options">
                  {styles.map((style) => (
                    <div
                      key={style.name}
                      className={`style-box ${
                        selectedStyle === style.name ? "selected" : ""
                      }`}
                      onClick={() => !progress && setSelectedStyle(style.name)}
                      style={{
                        cursor: progress ? "not-allowed" : "pointer",
                        opacity: progress ? 0.5 : 1,
                      }}
                    >
                      <h4>{style.name}</h4>
                      <p>{style.desc}</p>
                    </div>
                  ))}
                </div>

                <button
                  className="btn primary btn-kids"
                  onClick={() => handleGenerate()}
                  disabled={!!progress}
                  style={{ marginTop: "20px" }}
                >
                  {progress ? "⏳ Please wait..." : "✨ Generate AI Art"}
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  ) : null;
}
