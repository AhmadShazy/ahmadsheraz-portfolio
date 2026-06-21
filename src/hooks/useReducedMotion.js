"use client";

import { useState, useEffect } from "react";

// Returns true when the user has asked the OS to reduce motion, and updates if
// that preference changes. Use this to gate JS-driven animation (Three.js,
// GSAP, Typed.js) that the CSS `@media (prefers-reduced-motion)` block cannot
// reach (it only neutralizes CSS animations/transitions, not requestAnimationFrame).
export default function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
}
