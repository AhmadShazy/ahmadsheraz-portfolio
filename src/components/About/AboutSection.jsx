import Image from "next/image";
import SectionWrapper from "@/components/shared/SectionWrapper";
import GlassCard from "@/components/shared/GlassCard";

// Bio copy — verbatim from CONTEXT.md (single source of truth)
const BIO_PARAGRAPHS = [
  "I'm Ahmad Sheraz — a Computer Science student with a deep focus on AI/ML, Data Engineering, and Backend Engineering. I don't just write code — I engineer systems that think, scale, and solve real problems.",
  "From building multimodal AI systems that detect human emotion in real time, to designing distributed data pipelines that handle high-velocity IoT streams, I approach every project with the mindset of a systems engineer — not just a developer.",
  "Currently building AI-powered products that make businesses smarter. Always learning. Always shipping.",
];

// Quick stats (from CONTEXT.md). Availability is intentionally NOT a stat here —
// the "Available for work" pill under the photo is the single source of that.
// The Fields stat spans the full width for a balanced 3-stat layout.
const STATS = [
  { label: "Years Coding", value: "3+" },
  { label: "Projects Built", value: "8+" },
  { label: "Fields of Expertise", value: "AI/ML · Data Eng · Backend", full: true },
];

// About section: bio on the left; on the right ONE glass card combining a
// profile photo (+ availability pill) and the quick stats, split by a teal
// divider. Both columns stack on mobile. Reveals on scroll via SectionWrapper.
export default function AboutSection() {
  return (
    <SectionWrapper id="about" className="px-6 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl">
        {/* Heading with teal underline */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">
            About Me
          </h2>
          <div className="mt-3 h-1 w-20 rounded-full bg-teal" />
        </div>

        {/* Two columns on desktop, single column on mobile */}
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left column — bio text with a decorative teal accent line */}
          <div className="relative pl-6">
            <span
              aria-hidden="true"
              className="absolute left-0 top-1 bottom-1 w-1 rounded-full bg-teal/40"
            />
            <div className="space-y-5">
              {BIO_PARAGRAPHS.map((paragraph, i) => (
                <p
                  key={i}
                  className="text-base leading-relaxed text-text-secondary sm:text-lg"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Right column — one unified profile + stats glass card */}
          <div className="lg:pl-8">
            <GlassCard className="p-6 sm:p-8">
              {/* Section 1 — profile photo (centered) */}
              <div className="flex flex-col items-center">
                {/* 280x280 image well with a teal ring; tinted bg shows if the
                    image file isn't present yet (no broken-icon, no crash) */}
                <div
                  className="relative h-[280px] w-[280px] overflow-hidden rounded-xl ring-2 ring-teal/40"
                  style={{ background: "rgba(13, 148, 136, 0.06)" }}
                >
                  <Image
                    src="/profile.jpg"
                    alt="Ahmad Sheraz"
                    fill
                    sizes="280px"
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              {/* Divider — thin teal line between the two sections */}
              <div
                aria-hidden="true"
                className="my-6 h-px w-full bg-teal-border"
              />

              {/* Section 2 — quick stats (3, availability dropped) */}
              <div className="grid grid-cols-2 gap-6">
                {STATS.map((stat) => (
                  <div key={stat.label} className={stat.full ? "col-span-2" : ""}>
                    <p className="text-2xl font-bold text-teal">{stat.value}</p>
                    <p className="mt-1 text-sm font-medium text-text-secondary">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* The single "Available for work" indicator, below the stats */}
              <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/40 px-3 py-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
                </span>
                <span className="text-sm font-medium text-text-secondary">
                  Available for work
                </span>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
