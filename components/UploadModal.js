import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  AiOutlineCheck, 
  AiOutlineUpload, 
  AiOutlineExperiment, 
  AiOutlineDownload 
} from "react-icons/ai";

export default function UploadModal({ show, onClose }) {
  const [image, setImage] = useState(null);
  const [compressedFile, setCompressedFile] = useState(null);
  const [originalUrl, setOriginalUrl] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [progress, setProgress] = useState(null);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [savedDescription, setSavedDescription] = useState(null); // 🧠 GPT-4o description saved here
  const [analysisInfo, setAnalysisInfo] = useState(null); // 🧩 vizual info pt user
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

  // 📂 Upload normal
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const compressed = await compressImage(file);
    setImage(file);
    setCompressedFile(compressed);
    setOriginalUrl(URL.createObjectURL(compressed));
    setGeneratedImages([]);
    setSavedDescription(null); // 🧠 resetăm analiza
    setAnalysisInfo(null);
  };

  // 📥 Drag & drop
  const handleDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const compressed = await compressImage(file);
    setImage(file);
    setCompressedFile(compressed);
    setOriginalUrl(URL.createObjectURL(compressed));
    setGeneratedImages([]);
    setSavedDescription(null);
    setAnalysisInfo(null);
  };

  const handleDragOver = (e) => e.preventDefault();

  // 🧠 Generare imagine AI
  const handleGenerate = async (styleToUse = null) => {
    const style = styleToUse || selectedStyle;
    if (!compressedFile && !savedDescription) {
      alert("Please upload an image first!");
      return;
    }
    if (!style) {
      alert("Please choose a style!");
      return;
    }

    setSelectedStyle(style);
    setProgress("Preparing your masterpiece...");

    // 🧩 stabilim mesajul informativ
    if (savedDescription) {
      setAnalysisInfo("Using saved analysis ✅");
    } else {
      setAnalysisInfo("Analyzing new drawing 🧠 ...");
    }

    const formData = new FormData();
    if (compressedFile) formData.append("file", compressedFile);
    formData.append("style", style);
    if (savedDescription) formData.append("description", savedDescription);

    try {
      const res = await fetch("/api/generate-art", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to generate image");
      setProgress("Generating AI image...");

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // 🧠 salvăm descrierea pentru stilurile următoare
      if (data.description) {
        setSavedDescription(data.description);
      }

      // 🆕 Adaugăm rezultatul nou
      setGeneratedImages((prev) => [
        ...prev,
        { style, imageUrl: data.imageUrl },
      ]);

      setProgress(null);
      setAnalysisInfo(null);
    } catch (err) {
  console.error("❌ GENERATE-ART ERROR:", err);

  // extragem un mesaj lizibil, dacă există
  const errorText =
    err?.message ||
    (typeof err === "string" ? err : "An unexpected error occurred.");

  setProgress(null); // scoatem spinnerul
  setAnalysisInfo(null); // ascundem mesajele de analiză

  // afișăm mesajul vizual, fără să resetăm datele
  setProgress(
    <div style={{ color: "red", marginTop: "10px" }}>
      ❌ <strong>Something went wrong.</strong>
      <br />
      <span style={{ fontSize: "14px", color: "#333" }}>
        {errorText.includes("rate") ||
        errorText.includes("timeout") ||
        errorText.includes("limit")
          ? "The AI service is currently busy. Please try again in a few seconds."
          : "Please try again — your drawing and settings are still safe."}
      </span>
      <br />
      <button
        onClick={() => {
          setProgress(null);
          handleGenerate(selectedStyle); // reîncearcă cu același stil
        }}
        style={{
          background: "#ffcc00",
          border: "none",
          borderRadius: "6px",
          padding: "5px 12px",
          marginTop: "10px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        🔁 Try Again
      </button>
    </div>
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

  // 🧱 Render
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

            {analysisInfo && (
              <p
                style={{
                  color: "#444",
                  fontStyle: "italic",
                  fontSize: "14px",
                  marginTop: "6px",
                }}
              >
                {analysisInfo}
              </p>
            )}

            {progress && (
              <p className="progress">
                {progress}
                <br />
                <span style={{ color: "black", fontWeight: "100" }}>
                  (this may take up to 2 minutes)
                </span>
              </p>
            )}

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
                setSavedDescription(null);
                setProgress(null);
                setAnalysisInfo(null);
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
                  <span style={{ fontSize: "42px" }} role="img" aria-label="upload">
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

            {!progress && (
              <div className="steps-small">
                <div className="step-icon step-icon-small">
                  <AiOutlineUpload size={40} />
                  <p>Upload the Drawing</p>
                </div>
                <div className="step-icon step-icon-small">
                  <AiOutlineExperiment size={40} />
                  <p>AI Magic Transformation</p>
                </div>
                <div className="step-icon step-icon-small">
                  <AiOutlineDownload size={40} />
                  <p>Download or Print</p>
                </div>
                <div className="steps-small-line"></div>
              </div>
            )}

            {image && (
              <>
                {!progress && <h3 style={{ marginTop: "20px" }}>Choose a Style</h3>}

                {analysisInfo && (
                  <p
                    style={{
                      color: "#444",
                      fontStyle: "italic",
                      fontSize: "14px",
                      marginTop: "6px",
                    }}
                  >
                    {analysisInfo}
                  </p>
                )}

                {progress && (
                  <p className="progress">
                    {progress}
                    <br />
                    <span style={{ color: "black", fontWeight: "100" }}>
                      (this may take up to 2 minutes)
                    </span>
                  </p>
                )}

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
