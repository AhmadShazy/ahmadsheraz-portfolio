"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import HeroContent from "./HeroContent";
import { ChevronDown } from "lucide-react";

// The constellation is a client-only, code-split background. A subtle teal
// gradient fills the slot while the chunk loads (no blank flash / layout shift).
const ParticleConstellation = dynamic(
  () => import("./ParticleConstellation"),
  {
    ssr: false,
    loading: () => (
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, rgba(20,184,166,0.18), rgba(204,251,241,0.10) 70%, transparent)",
        }}
      />
    ),
  }
);

// Smooth-scroll to a section by id
function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

// Full-viewport hero. A particle constellation fills the background; the text
// content sits above it. The render loop pauses when the hero scrolls off-screen.
export default function HeroSection() {
  const [inView, setInView] = useState(true);
  const sectionRef = useRef(null);

  // Pause the constellation when the hero is off-screen (long single-page scroll)
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative flex min-h-screen items-center overflow-hidden px-6 py-24"
    >
      {/* Full-bleed background constellation */}
      <ParticleConstellation active={inView} />

      {/* Foreground content (above the 3D layer) */}
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <HeroContent />
      </div>

      {/* Bouncing scroll-down indicator */}
      <button
        type="button"
        aria-label="Scroll to About section"
        onClick={() => scrollToId("about")}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-teal"
      >
        <ChevronDown size={32} className="animate-bounce" />
      </button>
    </section>
  );
}
