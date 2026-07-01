import GlassCard from "@/components/shared/GlassCard";
import SkillRow from "./SkillRow";

// A category card built on the shared GlassCard so it inherits the site-wide
// standard hover (gentle scale + solid-teal border). Renders an uppercase teal
// title with a hairline underline, then the SkillRows in one or two columns.
export default function SkillCard({ title, skills, twoCol = false }) {
  // Two columns when explicitly requested or with 6+ skills
  const useTwoCol = twoCol || skills.length >= 6;
  const cols = useTwoCol ? 2 : 1;

  return (
    <GlassCard className="p-[16px_18px]">
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
    </GlassCard>
  );
}
