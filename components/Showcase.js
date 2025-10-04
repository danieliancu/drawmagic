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

      setShowTshirt(false);
      setShowMug(false);

      setShowCanvas(true);


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
            width={200}
            height={200}
          />
          <div className="caption">Sketch by {name}, {age} years old</div>
        </div>

        <div
          className="polaroid"
          style={{ height:"200px", width: "150px", position: "absolute", top: "570px", left: "300px", rotate: "5deg" }}
        >
          <Image
            src={`/img/draw_${index + 1}_ai.png`}
            alt="AI Art"
            width={100}
            height={150}
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
      <div className="mobile-only" style={{ display:"none", justifyContent:"center", gap:"10px", marginTop:"60px" }}>

        <Image
          src={`/img/icon-tshirt.png`}
          alt="T-Shirt"
          height={40}
          width={40}
        />
        <Image
          src={`/img/icon-coffee-cup.png`}
          alt="Mug"
          height={40}
          width={40}
        />        
        <Image
          src={`/img/icon-picture.png`}
          alt="Mug"
          height={40}
          width={40}
        />                
        <Image
          src={`/img/icon-download.png`}
          alt="Mug"
          height={40}
          width={40}
        />                        
        
      </div>
    </>
  );
}
