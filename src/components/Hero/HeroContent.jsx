"use client";

import { useEffect, useRef } from "react";
import Typed from "typed.js";
import TealButton from "@/components/shared/TealButton";
import SocialLinks from "@/components/shared/SocialLinks";

// Smooth-scroll to a section by id
function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

// Left-hand hero content: badge, name, typewriter roles, bio, CTAs, socials.
// Centered on mobile, left-aligned from the lg breakpoint up.
// `hero` and `social` come from MongoDB via the HeroSection server component.
export default function HeroContent({ hero, social }) {
  const typedRef = useRef(null);
  const roles = hero?.roles ?? [];

  // Typed.js is imperative and re-initialises whenever the role list changes.
  // The array is joined into a stable dependency so an identical list from a
  // re-render doesn't tear down and restart the animation.
  const rolesKey = roles.join("|");

  useEffect(() => {
    const list = rolesKey ? rolesKey.split("|") : [];
    if (!typedRef.current || list.length === 0) return;

    // Respect reduced-motion: skip the looping animation, show a static role
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      typedRef.current.textContent = list[0];
      return;
    }

    // Typed.js drives the cycling role subtitle
    const typed = new Typed(typedRef.current, {
      strings: list,
      typeSpeed: 60,
      backSpeed: 35,
      backDelay: 1500,
      startDelay: 300,
      loop: true,
      smartBackspace: true,
    });

    // Clean up on unmount to avoid duplicate instances
    return () => typed.destroy();
  }, [rolesKey]);

  return (
    <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
      {/* Availability badge — gold text on a glass pill */}
      {hero?.availableForWork && hero?.availabilityLabel && (
        <span
          className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-gold"
          style={{
            background: "rgba(255, 255, 255, 0.42)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.75)",
          }}
        >
          {/* Pulsing status dot */}
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
          </span>
          {hero.availabilityLabel}
        </span>
      )}

      {/* Name with a layered text-shadow for a subtle 3D depth */}
      <h1
        className="text-5xl font-bold text-text-primary sm:text-6xl lg:text-7xl"
        style={{
          textShadow:
            "0 1px 0 #d7e0de, 0 2px 0 #c3d0cd, 0 3px 0 #aebfbc, 0 6px 14px rgba(13, 148, 136, 0.28)",
        }}
      >
        Ahmad Sheraz
      </h1>

      {/* Typewriter role subtitle. The animated span is decorative (hidden from
          assistive tech); a static list exposes the roles to screen readers so
          they aren't read character-by-character on the infinite loop. */}
      {roles.length > 0 && (
        <p className="mt-4 text-2xl font-semibold text-teal sm:text-3xl">
          <span className="sr-only">{roles.join(", ")}</span>
          <span ref={typedRef} aria-hidden="true" />
        </p>
      )}

      {/* Short hero bio */}
      {hero?.tagline && (
        <p className="mt-4 max-w-md text-base text-text-secondary sm:text-lg">
          {hero.tagline}
        </p>
      )}

      {/* Primary + outline call-to-action buttons */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <TealButton variant="primary" onClick={() => scrollToId("projects")}>
          View My Work
        </TealButton>
        <TealButton variant="outline" onClick={() => scrollToId("contact")}>
          Let&apos;s Talk
        </TealButton>
      </div>

      {/* Social links, from the database */}
      <SocialLinks links={social} className="mt-8" />
    </div>
  );
}
