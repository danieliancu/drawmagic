import { useState, useEffect } from "react";

const testimonials = [
  {
    text: "My daughter was amazed when she saw her simple drawing transformed …",
    name: "Sarah J."
  },
  {
    text: "As a teacher, I&apos;ve used DoodleDream to create special end-of-year gifts …",
    name: "Michael T."
  },
  {
    text: "We turned my son&apos;s dinosaur drawing into a poster …",
    name: "Lisa M."
  },
  {
    text: "Absolutely love it! Such a unique way to preserve kids&apos; creativity …",
    name: "David P."
  },
  {
    text: "The quality of the print was beyond my expectations. Five stars!",
    name: "Anna R."
  },
  {
    text: "Our whole family enjoyed the surprise gift made from my son&apos;s art …",
    name: "James K."
  }
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000); // slide every 4s
    return () => clearInterval(timer);
  }, []);

  const visible = [
    testimonials[index],
    testimonials[(index + 1) % testimonials.length],
    testimonials[(index + 2) % testimonials.length]
  ];

  return (
    <section id="testimonials" className="testimonials">
      <div className="testimonial-container">
        <h2>What Parents Are Saying</h2>
        <div className="testi-slider">
          {visible.map((t, i) => (
            <div key={i} className="testi">
              <div className="stars">★★★★★</div>
              <p>&quot;{t.text}&quot;</p>
              <span>— {t.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
