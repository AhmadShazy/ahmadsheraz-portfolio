"use client";

import { useState } from "react";

// Reusable frosted-glass card — the site's signature surface and the SINGLE
// source of truth for card hover behavior across the whole site. Change the
// hover rule here and every card that renders through GlassCard updates.
//
// Resting: the shared `.glass-card` glass (globals.css) with a faint teal border.
// Hover — or keyboard focus on a clickable card — gently scales the card up (1.02),
// turns the border solid teal, and elevates the shadow. Scaling is transform-based
// (GPU-composited), so there's no layout reflow.
//
// Pass `hoverBorder={false}` to opt a card out of the hover elevation entirely
// (e.g. a form, where a hovering/scaling card feels off) — it stays static.
//
// When an onClick handler is provided the card becomes a keyboard-operable
// button: focusable, activates on Enter/Space, and shows a focus ring.
export default function GlassCard({
  children,
  className = "",
  onClick,
  hoverBorder = true,
}) {
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

  // Elevate on mouse hover or keyboard focus — unless this card opts out.
  const elevated = (hovered || focused) && hoverBorder;

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
        // Inline styles override the base `.glass-card` border/shadow reliably,
        // regardless of CSS layer ordering.
        border: elevated
          ? "1px solid #0D9488"
          : "1px solid rgba(13, 148, 136, 0.22)",
        transform: elevated ? "scale(1.02)" : "scale(1)",
        boxShadow: elevated
          ? "0 12px 40px rgba(13, 148, 136, 0.18)"
          : "0 8px 32px rgba(13, 148, 136, 0.08)",
        transition:
          "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
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
