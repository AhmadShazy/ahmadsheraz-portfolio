"use client";

import { useState } from "react";

// A single skill row: teal icon in a fixed 18px slot + skill name. On hover the
// row nudges right and the name turns teal. Bottom hairline divider except on
// the last row. Pixel-exact styles per the Option D design, so we drive them
// with inline styles + a hover state rather than utility classes.
export default function SkillRow({ icon: Icon, name, isLast = false }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "6px 0",
        paddingLeft: hovered ? "4px" : "0px",
        borderBottom: isLast ? "none" : "0.5px solid rgba(0,0,0,0.04)",
        transition: "all 0.15s ease",
      }}
    >
      {/* Fixed 18px icon slot, 16px teal glyph centered */}
      <span
        aria-hidden="true"
        style={{
          width: "18px",
          flexShrink: 0,
          display: "inline-flex",
          justifyContent: "center",
        }}
      >
        <Icon size={16} color="#0D9488" />
      </span>
      <span
        style={{
          fontSize: "12.5px",
          color: hovered ? "#0D9488" : "var(--color-text-primary)",
          transition: "color 0.15s ease",
        }}
      >
        {name}
      </span>
    </div>
  );
}
