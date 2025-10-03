import React from "react";

export default function UploadModal({ show, onClose }) {
  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="close" onClick={onClose}>&times;</button>
        <h2>Upload Your Child&apos;s Drawing</h2>
        <p>
          Take a photo or scan of the artwork. For best results, use good
          lighting and avoid shadows.
        </p>

        <div className="upload-box">
          <span role="img" aria-label="upload">☁️⬆️</span>
          <p>
            Drag &amp; drop your image here<br />
            or click to browse files
          </p>
        </div>

        <div className="steps">
          <div className="step active">1 Upload</div>
          <div className="step">2 Generate</div>
          <div className="step">3 Download</div>
        </div>

        <p className="info">⚡ AI generation typically takes 2–5 minutes per image</p>

        <button className="btn primary btn-kids">✨ Generate AI Art</button>
      </div>
    </div>
  );
}
