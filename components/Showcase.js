import { useState, useEffect } from "react";
import Image from "next/image";

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

      setShowCanvas(false);
      setShowTshirt(false);
      setShowMug(false);

      setTimeout(() => setShowCanvas(true), 500);
      setTimeout(() => setShowTshirt(true), 800);
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
          <Image
            key={`before-${fadeKey}`}
            src={`/img/draw_${index + 1}_before.png`}
            alt="Draw before"
            width={300}
            height={300}
          />
          <div className="caption">Sketch by {name}, {age} years old</div>
        </div>

        <div
          className="polaroid"
          style={{ width: "200px", position: "absolute", bottom: "120px", left: "300px", rotate: "5deg" }}
        >
          <Image
            src={`/img/draw_${index + 1}_ai.png`}
            alt="AI Art"
            width={200}
            height={200}
          />
          <div className="caption">AI transformed!</div>
        </div>

        {/* Canvas */}
        {showCanvas && (
          <div className="canvas-ai magic-wrapper">
            <Image
              key={`canvas-${fadeKey}`}
              src={`/img/draw_${index + 1}_ai.png`}
              alt="Canvas with AI Art"
              width={162}
              height={185}
              className="magic-image"
            />
            <div key={`stars-canvas-${fadeKey}`} className="stars" />
          </div>
        )}

        {/* T-shirt */}
        {showTshirt && (
          <div className="tshirt-ai magic-wrapper">
            <Image
              key={`tshirt-${fadeKey}`}
              src={`/img/draw_${index + 1}_ai.png`}
              alt="T-Shirt with AI Art"
              width={200}
              height={200}
              className="magic-image"
            />
            <div key={`stars-tshirt-${fadeKey}`} className="stars" />
          </div>
        )}

        {/* Mug */}
        {showMug && (
          <div className="mug-ai magic-wrapper">
            <Image
              key={`mug-${fadeKey}`}
              src={`/img/draw_${index + 1}_mug.png`}
              alt="Mug with AI Art"
              width={150}
              height={150}
              className="magic-image"
            />
            <div key={`stars-mug-${fadeKey}`} className="stars" />
          </div>
        )}
      </div>

      <div className="polaroid-mobile">
        <div>
          <Image
            key={`before-${fadeKey}`}
            src={`/img/draw_${index + 1}_before.png`}
            alt="Draw before"
            width={250}
            height={250}
          />
          <div className="caption">Sketch by {name},<br />{age} years old</div>
        </div>
        <div>
          <Image
            src={`/img/draw_${index + 1}_ai.png`}
            alt="AI Art"
            width={250}
            height={250}
          />
          <div className="caption">AI transformed!</div>
        </div>
      </div>
    </>
  );
}
