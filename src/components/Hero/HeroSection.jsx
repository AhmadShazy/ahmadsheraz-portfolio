"use client";

import HeroContent from "./HeroContent";
import { ChevronDown } from "lucide-react";

// Smooth-scroll to a section by id
function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

// Full-viewport hero. Two columns on desktop (content left, 3D right) and a
// single stacked column on mobile. The right column is a placeholder for now —
// the real Three.js scene is added in P1.3.
export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center px-6 py-24"
    >
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2">
        {/* Left column — text content */}
        <HeroContent />

        {/* Right column — 3D scene placeholder (real canvas in P1.3) */}
        <div id="hero-3d-canvas" className="flex items-center justify-center">
          <div
            className="glass-card flex h-72 w-full max-w-md items-center justify-center sm:h-96"
            // Teal border to distinguish the upcoming 3D area
            style={{ border: "1px solid rgba(13, 148, 136, 0.22)" }}
          >
            <p className="text-center text-base font-medium text-text-secondary">
              3D Scene — Coming in P1.3
            </p>
          </div>
        </div>
      </div>

      {/* Bouncing scroll-down indicator */}
      <button
        type="button"
        aria-label="Scroll to About section"
        onClick={() => scrollToId("about")}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-teal"
      >
        <ChevronDown size={32} className="animate-bounce" />
      </button>
    </section>
  );
}
