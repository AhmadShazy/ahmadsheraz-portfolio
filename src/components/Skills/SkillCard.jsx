"use client";

import { useState } from "react";
import SkillRow from "./SkillRow";

// A category glass card: uppercase teal title with a hairline underline, then a
// list of SkillRows. Lays the rows out in two columns when twoCol is set or the
// list has 6+ skills. Hover lifts the border to teal with a soft teal shadow.
export default function SkillCard({ title, skills, twoCol = false }) {
  const [hovered, setHovered] = useState(false);

  // Two columns when explicitly requested or with 6+ skills
  const useTwoCol = twoCol || skills.length >= 6;
  const cols = useTwoCol ? 2 : 1;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "rgba(255,255,255,0.52)",
        border: hovered
          ? "0.5px solid rgba(13,148,136,0.35)"
          : "0.5px solid rgba(255,255,255,0.8)",
        borderRadius: "16px",
        padding: "16px 18px",
        boxShadow: hovered ? "0 8px 28px rgba(13,148,136,0.1)" : "none",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
      }}
    >
      <h3
        style={{
          fontSize: "10.5px",
          fontWeight: 500,
          letterSpacing: "0.09em",
          textTransform: "uppercase",
          color: "#0D9488",
          borderBottom: "0.5px solid rgba(13,148,136,0.18)",
          marginBottom: "12px",
          paddingBottom: "9px",
        }}
      >
        {title}
      </h3>

      <div
        style={
          useTwoCol
            ? { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 8px" }
            : undefined
        }
      >
        {skills.map((skill, i) => (
          <SkillRow
            key={skill.name}
            icon={skill.icon}
            name={skill.name}
            isLast={i >= skills.length - cols}
          />
        ))}
      </div>
    </div>
  );
}
