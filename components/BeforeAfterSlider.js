import { useState, useRef } from "react";

export default function BeforeAfterSlider({ before, after }) {
  const [position, setPosition] = useState(50); 
  const containerRef = useRef(null);

  const updatePosition = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let x = clientX - rect.left;
    let percent = (x / rect.width) * 100;
    percent = Math.max(0, Math.min(100, percent));
    setPosition(percent);
  };

  const handleMouseDown = () => {
    const move = (ev) => updatePosition(ev.clientX);
    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  const handleTouchStart = () => {
    const move = (ev) => updatePosition(ev.touches[0].clientX);
    const up = () => {
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", up);
    };
    window.addEventListener("touchmove", move);
    window.addEventListener("touchend", up);
  };

  return (
    <div className="ba-container" ref={containerRef}>
      {/* BEFORE (desen) pe fundal */}
      <img src={before} alt="Before" className="ba-img" />

      {/* AFTER (AI) peste, dar decupat astfel încât să apară doar în dreapta sliderului */}
      <img
        src={after}
        alt="After"
        className="ba-img ba-after"
        style={{
          clipPath: `inset(0 0 0 ${position}%)`
        }}
      />

      {/* Handler */}
      <div
        className="ba-handle"
        style={{ left: `${position}%` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="ba-bar"></div>
        <div className="ba-knob"></div>
      </div>
    </div>
  );
}
