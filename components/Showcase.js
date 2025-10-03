import { useState, useEffect } from "react";

const sketches = [
  { name: "John", age: 3 },
  { name: "Emily", age: 4 },
  { name: "Sophia", age: 2 },
  { name: "Daniel", age: 5 },
  { name: "Lucas", age: 3 },
  { name: "Olivia", age: 4 },
];

export default function Showcase() {
  const [index, setIndex] = useState(0);
  const [fadeKey, setFadeKey] = useState(0);
  const [showCanvas, setShowCanvas] = useState(true);
  const [showTshirt, setShowTshirt] = useState(true);
  const [showMug, setShowMug] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % sketches.length);
      setFadeKey((prev) => prev + 1);

      // ascunde toate
      setShowCanvas(false);
      setShowTshirt(false);
      setShowMug(false);

      // canvas apare primul
      setTimeout(() => setShowCanvas(true), 500);

      // t-shirt după mic delay
      setTimeout(() => setShowTshirt(true), 800);

      // mug după încă puțin
      setTimeout(() => setShowMug(true), 1100);

    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const { name, age } = sketches[index];

  return (
    <>
    <div className="showcase">

      {/* Polaroid fix */}
      <div className="polaroid">
        <img
          key={`before-${fadeKey}`}
          src={`/img/draw_${index + 1}_before.png`}
          alt="Draw before"
        />
        <div className="caption">Sketch by {name}, {age} years old</div>
      </div>

      <div className="polaroid" style={{ width:'200px', position: 'absolute', bottom: '120px', left: '300px', rotate: '5deg' }}>
        <img
          src={`/img/draw_${index + 1}_ai.png`}
          alt="AI Art"
          style={{ height: '200px' }}
        />
        <div className="caption">AI transformed!</div>
      </div>      

      {/* Canvas */}
      {showCanvas && (
        <div className="canvas-ai magic-wrapper">
          <img
            key={`canvas-${fadeKey}`}
            src={`/img/draw_${index + 1}_ai.png`}
            alt="Canvas with AI Art"
            className="magic-image"
          />
          <div key={`stars-canvas-${fadeKey}`} className="stars" />
        </div>
      )}

      {/* T-shirt */}
      {showTshirt && (
        <div className="tshirt-ai magic-wrapper">
          <img
            key={`tshirt-${fadeKey}`}
            src={`/img/draw_${index + 1}_ai.png`}
            alt="T-Shirt with AI Art"
            className="magic-image"
          />
          <div key={`stars-tshirt-${fadeKey}`} className="stars" />
        </div>
      )}

      {/* Mug */}
      {showMug && (
        <div className="mug-ai magic-wrapper">
          <img
            key={`mug-${fadeKey}`}
            src={`/img/draw_${index + 1}_mug.png`}
            alt="Mug with AI Art"
            className="magic-image"
          />
          <div key={`stars-mug-${fadeKey}`} className="stars" />
        </div>
      )}
    </div>

      <div className="polaroid-mobile">
        <div>
        <img
          key={`before-${fadeKey}`}
          src={`/img/draw_${index + 1}_before.png`}
          alt="Draw before"
        />
        <div className="caption">Sketch by {name},<br />{age} years old</div>
        </div>
        <div>
        <img
          src={`/img/draw_${index + 1}_ai.png`}
          alt="AI Art"
        />
        <div className="caption">AI transformed!</div>
        </div>
      </div>

    </>
  );
}
