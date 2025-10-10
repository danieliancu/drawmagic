import { useState, useEffect } from "react";
import Image from "next/image";
import UploadModal from "../components/UploadModal";
import Showcase from "../components/Showcase";
import BeforeAfterSlider from "../components/BeforeAfterSlider";
import Testimonials from "../components/Testimonials";
import FAQ from "../components/FAQ";

  import { loadStripe } from "@stripe/stripe-js";


import { 
  AiOutlineCheck, 
  AiOutlineUpload, 
  AiOutlineExperiment, 
  AiOutlineDownload 
} from "react-icons/ai";




export default function Home({ openUploadModal }) {
  const [showModal, setShowModal] = useState(false);


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);



// total imagini disponibile
const totalItems = 6;

// câte să fie vizibile inițial
const [visibleCount, setVisibleCount] = useState(3);

const handleViewMore = () => {
  setVisibleCount((prev) => Math.min(prev + 3, totalItems));
};


const handleCheckout = async (name, amount) => {
  console.log("Creating checkout for:", name, amount);

  const res = await fetch("/api/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, amount }),
  });

  const data = await res.json();
  console.log("Stripe session:", data);

  if (data.url) {
    // ✅ redirecționează corect către Stripe
    window.location.href = data.url;
  } else {
    // ❌ dacă nu s-a primit URL, afișează eroare
    alert("Eroare la crearea sesiunii Stripe!");
  }
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
              onClick={() => openUploadModal()}
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
            <Image src={`/img/icon-download.png`} alt="Download" height={40} width={40} />  
            <h3>Download</h3>
            <p>Instant digital artwork</p>
            <p className="price">£4.99</p>
            <ul className="features">
              <li>
                <AiOutlineCheck className="icon" />
                1 AI transformation
              </li>
              <li>
                <AiOutlineCheck className="icon" />
                Enhanced quality
              </li>
              <li>
                <AiOutlineCheck className="icon" />
                Instant delivery
              </li>
            </ul>
              <button className="btn btn-kids" onClick={() => handleCheckout("Download", 4.99)}>
              Get Download
            </button>

          </div>

          <div className="card popular">
            <p>Most Popular</p>
            <Image src={`/img/icon-tshirt.png`} alt="T-Shirt" height={40} width={40} />              
            <h3>T-Shirt</h3>
            <p>Art on premium fabric</p>
            <p className="price">£14.99</p>
            <ul className="features">
              <li>
                <AiOutlineCheck className="icon" />
                Transport included
              </li>
              <li>
                <AiOutlineCheck className="icon" />
                Multiple size options
              </li>
              <li>
                <AiOutlineCheck className="icon" />
                High-definition print
              </li>
            </ul>
            <button className="btn btn-kids" onClick={() => openUploadModal()}>Order T-Shirt</button>
          </div>

          <div className="card">
            <Image src={`/img/icon-coffee-cup.png`} alt="Mug" height={40} width={40} />              
            <h3>Mug</h3>
            <p>Perfect for gifts</p>
            <p className="price">£12.99</p>
            <ul className="features">
              <li>
                <AiOutlineCheck className="icon" />
                Transport included
              </li>
              <li>
                <AiOutlineCheck className="icon" />
                Multiple design options
              </li>
              <li>
                <AiOutlineCheck className="icon" />
                Dishwasher-safe
              </li>
            </ul>
            <button className="btn btn-kids" onClick={() => openUploadModal()}>Order Mug</button>
          </div>

          <div className="card">
            <Image src={`/img/icon-picture.png`} alt="Canvas" height={40} width={40} />              
            <h3>Canvas</h3>
            <p>Gallery-style wall art</p>
            <p className="price">£24.99</p>
            <ul className="features">
              <li>
                <AiOutlineCheck className="icon" />
                Transport included
              </li>
              <li>
                <AiOutlineCheck className="icon" />
                Multiple size options
              </li>
              <li>
                <AiOutlineCheck className="icon" />
                Ready-to-hang finish
              </li>
            </ul>
            <button className="btn btn-kids" onClick={() => openUploadModal()}>Order Canvas</button>
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
