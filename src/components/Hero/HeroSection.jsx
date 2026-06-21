"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import HeroContent from "./HeroContent";
import { ChevronDown } from "lucide-react";

// The 3D canvas is loaded only on the client (ssr: false) and code-split out of
// the main bundle, so Three.js never ships in the server HTML and only loads
// when the canvas actually mounts.
const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });

// Smooth-scroll to a section by id
function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

// Full-viewport hero. Two columns on desktop (content left, 3D right) and a
// single stacked column on mobile. The 3D scene is hidden on very small screens
// (and not even mounted there) to protect performance on phones.
export default function HeroSection() {
  // Mount tier: only mount the WebGL canvas at >=640px (sm) so phones skip
  // loading Three.js entirely. (HeroCanvas separately treats <=767px as the
  // "mobile" quality tier — fewer particles/segments, no cursor interaction —
  // so the 640-767px band renders a lighter scene.)
  const [show3D, setShow3D] = useState(false);
  // Whether the hero is currently on screen — used to pause the 3D render loop.
  const [inView, setInView] = useState(true);
  const canvasWrapperRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const update = () => setShow3D(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Pause the 3D render loop when the hero scrolls out of view (the page is a
  // long single-page scroll, so the canvas is off-screen most of the time).
  useEffect(() => {
    const el = canvasWrapperRef.current;
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
      className="relative flex min-h-screen items-center justify-center px-6 py-24"
    >
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2">
        {/* Left column — text content */}
        <HeroContent />

        {/* Right column — 3D scene (hidden + unmounted below sm for performance) */}
        <div
          id="hero-3d-canvas"
          ref={canvasWrapperRef}
          className="hidden h-80 items-center justify-center sm:flex sm:h-96 lg:h-[28rem]"
        >
          {show3D && <HeroCanvas inView={inView} />}
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
