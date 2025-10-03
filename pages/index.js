import { useState, useEffect } from "react";
import Image from "next/image";
import UploadModal from "../components/UploadModal";
import Showcase from "../components/Showcase";
import BeforeAfterSlider from "../components/BeforeAfterSlider";
import Testimonials from "../components/Testimonials";
import FAQ from "../components/FAQ";

import { 
  AiOutlineCheck, 
  AiOutlineUpload, 
  AiOutlineExperiment, 
  AiOutlineDownload 
} from "react-icons/ai";




export default function Home() {
  const [showModal, setShowModal] = useState(false);


// total imagini disponibile
const totalItems = 6;

// câte să fie vizibile inițial
const [visibleCount, setVisibleCount] = useState(3);

const handleViewMore = () => {
  setVisibleCount((prev) => Math.min(prev + 3, totalItems));
};



  return (
    <main className="home">
      <header className="hero">


      <Image
        src="/img/hero-3.png"
        alt="Hero Background"
        className="hero-bg"
        width={1920}
        height={1080}
        priority
        unoptimized
      />



        <div className="badge" style={{ top: '580px', right: '520px' }}>
          <div className="pulse-dot"></div>
          <div className="badge-text">
            <div className="line1">Personalized<br />T-Shirt</div>
            <div className="line2">Price: $9</div>
          </div>
        </div>

        <div className="badge" style={{ top: '760px', right: '680px', color: 'white' }}>
          <div className="pulse-dot"></div>
          <div className="badge-text">
            <div className="line1">Personalized<br />Mug</div>
            <div className="line2">Price: $12</div>
          </div>
        </div>        

        <div className="badge" style={{ top: '200px', right: '280px' }}>
          <div className="pulse-dot"></div>
          <div className="badge-text">
            <div className="line1">Canvas</div>
            <div className="line2">Price: $19</div>
          </div>
        </div>


        <div className="hero-content">

          <p className="hero-tagline not-mobile">From doodles to lifelong memories</p>
          <h1>Turn your child’s drawings into timeless art</h1>
          <p>
            Our AI transforms your child’s sketches into beautiful, semi-realistic digital art. Ready to print on canvas, mugs, t-shirts, and more.
          </p>
          <div className="hero-buttons" style={{ zIndex:"4" }}>
            <button
              className="btn-kids btn-upload"
              onClick={() => setShowModal(true)}
            >
              Upload Your Child’s Drawing
            </button>
          </div>

          <Showcase />

        </div>

      </header>

      <section id="how" className="how-works">
        <h2>How it Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-icon">
              <AiOutlineUpload size={80} />
            </div>
            <h3>Upload the Drawing</h3>
            <p>Snap a photo or scan your child’s artwork. Clear images give the best results.</p>
          </div>

          <div className="step">
            <div className="step-icon">
              <AiOutlineExperiment size={80} />
            </div>
            <h3>AI Magic Transformation</h3>
            <p>Our AI turns the doodle into stunning digital art while keeping your child’s unique style alive.</p>
          </div>

          <div className="step">
            <div className="step-icon">
              <AiOutlineDownload size={80} />
            </div>
            <h3>Download or Print</h3>
            <p>Download the artwork instantly or order it on a canvas, mug, t-shirt, and more.</p>
          </div>
        </div>
      </section>

      <section id="gallery" className="gallery">
      <div className="container">
        <h2>Before & After Gallery</h2>
        <div className="gallery-grid">
          {Array.from({ length: visibleCount }).map((_, idx) => (
            <BeforeAfterSlider
              key={idx}
              before={`/img/draw_${idx + 1}_before.png`}
              after={`/img/draw_${idx + 1}_ai.png`}
            />
          ))}
        </div>

        {visibleCount < totalItems && (
          <button className="btn btn-kids" onClick={handleViewMore}>
            View More Examples
          </button>
        )}
      </div>
    </section>

      <section id="pricing" className="pricing">
        <h2>Simple, Affordable Pricing</h2>
        <div className="pricing-cards">

          <div className="card">
            <h3>Basic</h3>
            <p>Perfect for trying out</p>
            <p className="price">$4.99</p>
            <ul className="features">
              <li>
                <AiOutlineCheck className="icon" />
                1 artwork transformation
              </li>
              <li>
                <AiOutlineCheck className="icon" />
                AI-enhanced quality
              </li>
              <li>
                <AiOutlineCheck className="icon" />
                Fast delivery (2–5 min)
              </li>
            </ul>
            <button className="btn btn-kids">Get Basic</button>
          </div>

          <div className="card popular">
              <h3>Premium</h3>
              <p>For occasional transformations</p>
              <p className="price">$9.99</p>
              <ul className="features">
                <li>
                  <AiOutlineCheck className="icon" />
                  2-3 transformations
                </li>
                <li>
                  <AiOutlineCheck className="icon" />
                  Sharper rendering
                </li>
                <li>
                  <AiOutlineCheck className="icon" />
                  Enhanced stylization
                </li>
              </ul>
              <button className="btn btn-kids">Get Premium</button>
          </div>

          <div className="card">
              <h3>Iupii Club</h3>
              <p>For creative families</p>
              <p className="price">$14.99</p>
              <ul className="features">
                <li>
                  <AiOutlineCheck className="icon" />
                  4-10 transformations
                </li>
                <li>
                  <AiOutlineCheck className="icon" />
                  Priority rendering
                </li>
                <li>
                  <AiOutlineCheck className="icon" />
                  Seasonal styles access
                </li>
              </ul>
              <button className="btn btn-kids">Get Dream Club</button>
          </div>



        </div>
      </section>

      <Testimonials />

      <FAQ />





      {/* Modal separat */}
      <UploadModal show={showModal} onClose={() => setShowModal(false)} />
    </main>
  );
}
