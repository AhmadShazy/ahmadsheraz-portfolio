"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useReducedMotion from "./useReducedMotion";

// Staggers child items into view on scroll. Pass a ref to the container and a
// selector for the items to animate (default `[data-reveal-item]`).
//
// Respects prefers-reduced-motion: when reduced motion is requested, the items
// are simply left in their natural (visible) state and no animation/ScrollTrigger
// is created. This is the single place reveal motion is gated, so SectionWrapper
// + every card stagger behave consistently.
export default function useStaggerReveal(
  containerRef,
  itemSelector = "[data-reveal-item]"
) {
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    // Reduced motion: leave items visible, no animation
    if (prefersReduced) return;

    gsap.registerPlugin(ScrollTrigger);
    const items = el.querySelectorAll(itemSelector);
    if (!items.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.12,
          scrollTrigger: { trigger: el, start: "top 80%" },
        }
      );
    }, el);

    // Recompute trigger positions once layout settles (fonts, lazy 3D, etc.)
    const refreshId = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(refreshId);
      ctx.revert();
    };
  }, [containerRef, itemSelector, prefersReduced]);
}
