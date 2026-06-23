"use client";

import { useState } from "react";

// Reusable frosted-glass card — the site's signature surface.
// Applies the shared `.glass-card` styles (defined in globals.css) and lifts
// slightly (scale up + deeper shadow) on hover. When an onClick handler is
// provided the card becomes a keyboard-operable button: it is focusable, lifts
// on focus too (parity with mouse hover), shows a focus ring, and activates on
// Enter/Space.
export default function GlassCard({ children, className = "", onClick }) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const isClickable = typeof onClick === "function";

  // Let keyboard users activate a clickable card with Enter or Space
  const handleKeyDown = (e) => {
    if (isClickable && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onClick(e);
    }
  };

  // Lift for either mouse hover or keyboard focus (interactive variant)
  const elevated = hovered || focused;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={isClickable ? () => setFocused(true) : undefined}
      onBlur={isClickable ? () => setFocused(false) : undefined}
      onKeyDown={isClickable ? handleKeyDown : undefined}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      className={`glass-card ${className}`}
      style={{
        // Inline styles override the base `.glass-card` box-shadow reliably,
        // regardless of CSS layer ordering.
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        transform: elevated ? "scale(1.02)" : "scale(1)",
        boxShadow: elevated
          ? "0 16px 48px rgba(13, 148, 136, 0.18)"
          : "0 8px 32px rgba(13, 148, 136, 0.08)",
        cursor: isClickable ? "pointer" : "default",
        // Visible focus ring for keyboard users (clickable variant only)
        outline: focused ? "2px solid var(--color-teal)" : "none",
        outlineOffset: "2px",
      }}
    >
      {children}
    </div>
  );
}
