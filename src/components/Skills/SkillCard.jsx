"use client";

import { useRef, useEffect } from "react";
import GlassCard from "@/components/shared/GlassCard";
import useReducedMotion from "@/hooks/useReducedMotion";

// Maximum tilt angle (degrees) in each axis
const MAX_TILT = 15;

// A single skill tile built on GlassCard. On hover it tilts in 3D toward the
// cursor (CSS transforms, no R3F), shows a cursor-following shine, and reveals a
// gold accent dot. Tilt is driven by direct DOM writes (no React re-render per
// mousemove) and is disabled when the user prefers reduced motion.
export default function SkillCard({ name, Icon }) {
  const wrapperRef = useRef(null);
  const shineRef = useRef(null);
  const prefersReduced = useReducedMotion();

  // If reduced-motion turns on while a card is mid-hover, the last tilt was
  // already written to the DOM and handleMouseMove now no-ops — so clear the
  // inline transform/shine immediately rather than waiting for mouseleave.
  useEffect(() => {
    if (!prefersReduced) return;
    if (wrapperRef.current) {
      wrapperRef.current.style.transform =
        "perspective(1000px) rotateX(0deg) rotateY(0deg)";
    }
    if (shineRef.current) shineRef.current.style.opacity = "0";
  }, [prefersReduced]);

  const handleMouseMove = (e) => {
    if (prefersReduced) return;
    const el = wrapperRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0..1 across the card
    const py = (e.clientY - rect.top) / rect.height; // 0..1 down the card

    // Map cursor offset from center to a tilt angle (invert X so the card
    // leans toward the cursor)
    const rotateY = (px - 0.5) * 2 * MAX_TILT;
    const rotateX = -(py - 0.5) * 2 * MAX_TILT;
    el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

    // Move the shine highlight to follow the cursor
    if (shineRef.current) {
      shineRef.current.style.background = `radial-gradient(circle at ${
        px * 100
      }% ${py * 100}%, rgba(255, 255, 255, 0.55), transparent 60%)`;
      shineRef.current.style.opacity = "1";
    }
  };

  const handleMouseLeave = () => {
    const el = wrapperRef.current;
    if (el) el.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
    if (shineRef.current) shineRef.current.style.opacity = "0";
  };

  return (
    <div
      ref={wrapperRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transition: "transform 0.2s ease-out" }}
    >
      <GlassCard className="group relative h-full overflow-hidden p-5">
        {/* Cursor-following shine (decorative) */}
        <div
          ref={shineRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ opacity: 0, transition: "opacity 0.3s ease" }}
        />

        {/* Gold accent dot — fades in on hover */}
        <span
          aria-hidden="true"
          className="absolute right-3 top-3 h-2 w-2 rounded-full bg-gold opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />

        {/* Icon + skill name */}
        <div className="relative flex flex-col items-center gap-2 text-center">
          {Icon ? (
            <Icon size={22} className="text-teal" aria-hidden="true" />
          ) : (
            <span className="text-xl" aria-hidden="true">
              ⚙️
            </span>
          )}
          <span className="text-sm font-medium text-text-primary">{name}</span>
        </div>
      </GlassCard>
    </div>
  );
}
