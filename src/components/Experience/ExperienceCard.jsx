import GlassCard from "@/components/shared/GlassCard";

// A single experience entry: role, company, optional duration, and bullet
// responsibilities. Uses the same 3px teal left accent as EducationCard.
export default function ExperienceCard({ role, company, duration, bullets = [] }) {
  return (
    <GlassCard className="relative h-full overflow-hidden p-6 pl-7">
      {/* Teal left accent line */}
      <span aria-hidden="true" className="absolute left-0 top-0 h-full w-[3px] bg-teal" />

      <h3 className="text-lg font-bold text-text-primary">{role}</h3>
      <p className="mt-1 font-medium text-teal">{company}</p>
      {duration && (
        <p className="mt-1 text-sm text-text-secondary">{duration}</p>
      )}

      {bullets.length > 0 && (
        <ul className="mt-4 space-y-2">
          {bullets.map((bullet, i) => (
            <li
              key={i}
              className="flex gap-2 text-sm leading-relaxed text-text-secondary"
            >
              <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-teal" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      )}
    </GlassCard>
  );
}
