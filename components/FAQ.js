import { useState } from "react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    { q: "What products can I print my child’s artwork on?", a: "We offer high-quality prints on canvas, mugs, t-shirts, posters and more." },
    { q: "What printing method do you use?", a: "We use professional sublimation and giclée printing..." },
    { q: "How long does delivery take?", a: "Digital downloads are instant. Printed products ship within 3-5 business days." },
    { q: "Do I need a high-quality photo of the drawing?", a: "Yes, clear scans or photos work best." },
    { q: "Can I order multiple prints of the same artwork?", a: "Yes, once transformed you can order as many as you want." }
  ];

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="faq">
      <h2>Frequently Asked Questions</h2>
      <div className="faq-list">
        {faqs.map((item, idx) => (
          <div
            key={idx}
            className={`faq-item ${openIndex === idx ? "open" : ""}`}
            onClick={() => toggle(idx)}
          >
            <h3>{item.q}</h3>
            {openIndex === idx && <p>{item.a}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
