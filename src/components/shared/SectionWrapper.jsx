"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useReducedMotion from "@/hooks/useReducedMotion";

// Wraps a page section: gives it an `id` for navbar smooth-scroll targeting and
// fades its contents in (slide up 30px) as the section scrolls into view.
//
// The section is rendered already hidden (opacity 0, shifted down 30px) so its
// server-rendered markup matches the animation's start state. Without this the
// browser would paint the section visible, then GSAP would snap it to opacity 0
// and fade it back in — a visible flash. This is a JS-driven interactive
// portfolio (GSAP/Three.js are core), so requiring JS for the reveal is fine.
//
// When the user prefers reduced motion, the section is shown immediately at its
// final state — no animation, no ScrollTrigger.
export default function SectionWrapper({ children, id, className = "" }) {
  const sectionRef = useRef(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    // Reduced motion: reveal instantly (overrides the hidden inline style)
    if (prefersReduced) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }

    // Register the plugin on the client only (avoids SSR window access)
    gsap.registerPlugin(ScrollTrigger);

    // Scope every tween/ScrollTrigger to this element for clean teardown
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%", // start when the section's top hits 85% of viewport
            toggleActions: "play none none none",
          },
        }
      );
    }, el);

    // Trigger start/end positions are cached at creation time. Fonts and
    // lazy-loaded 3D canvases can change layout height afterwards, so recompute
    // them once the current layout settles.
    const refreshId = requestAnimationFrame(() => ScrollTrigger.refresh());

    // Tear down this section's tweens + ScrollTriggers on unmount
    return () => {
      cancelAnimationFrame(refreshId);
      ctx.revert();
    };
  }, [prefersReduced]);

  return (
    <section
      id={id}
      ref={sectionRef}
      className={className}
      // Initial hidden state matches the GSAP "from" values to avoid a flash
      style={{ opacity: 0, transform: "translateY(30px)" }}
    >
      {children}
    </section>
  );
}
