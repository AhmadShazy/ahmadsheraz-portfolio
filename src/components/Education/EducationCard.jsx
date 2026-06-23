import GlassCard from "@/components/shared/GlassCard";

// A single education entry: degree, university, duration, focus, coursework
// pills, and final-year project. The 3px teal left accent is an absolutely
// positioned bar (the unlayered .glass-card border can't be overridden by a
// Tailwind border utility, so we add the accent as a child instead).
export default function EducationCard({
  degree,
  university,
  duration,
  specialization,
  coursework = [],
  fyp,
}) {
  return (
    <GlassCard className="relative h-full overflow-hidden p-6 pl-7">
      {/* Teal left accent line */}
      <span aria-hidden="true" className="absolute left-0 top-0 h-full w-[3px] bg-teal" />

      <h3 className="text-lg font-bold text-text-primary">{degree}</h3>
      <p className="mt-1 font-medium text-teal">{university}</p>
      <p className="mt-1 text-sm text-text-secondary">{duration}</p>

      {specialization && (
        <p className="mt-3 text-sm text-text-secondary">
          <span className="font-semibold text-text-primary">Focus:</span>{" "}
          {specialization}
        </p>
      )}

      {coursework.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {coursework.map((course) => (
            <span
              key={course}
              className="rounded-full border border-teal-border bg-white/40 px-2.5 py-1 text-xs font-medium text-text-primary"
            >
              {course}
            </span>
          ))}
        </div>
      )}

      {fyp && (
        <p className="mt-4 text-sm text-text-secondary">
          <span className="font-semibold text-teal">Final Year Project:</span>{" "}
          {fyp}
        </p>
      )}
    </GlassCard>
  );
}
