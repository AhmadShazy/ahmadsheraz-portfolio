"use client";

import { useRef } from "react";
import {
  BarChart3, Blocks, Bot, BrainCircuit, Cloud, Code2, Database,
  Gauge, LayoutDashboard, LineChart, Plug, Rocket, ShieldCheck,
  Sparkles, Workflow, Zap,
} from "lucide-react";
import SectionWrapper from "@/components/shared/SectionWrapper";
import GlassCard from "@/components/shared/GlassCard";
import TealButton from "@/components/shared/TealButton";
import useStaggerReveal from "@/hooks/useStaggerReveal";

// Explicit icon map, not a wildcard `import * as Icons from "lucide-react"`.
// Two reasons: a wildcard import defeats tree-shaking and drags the whole icon
// set into the bundle, and — because service icons are now admin-editable — an
// unrecognised name must fall back to something rather than render `undefined`
// as a component and crash the section.
//
// This map is the authoritative list of icons a service can use. The admin
// panel offers exactly these names — anything outside it silently becomes the
// fallback, which is the "saves fine, changes nothing" failure this whole phase
// exists to avoid. **Adding a name here means adding it to the admin's picker
// too**, and vice versa.
const ICONS = {
  BarChart3, Blocks, Bot, BrainCircuit, Cloud, Code2, Database,
  Gauge, LayoutDashboard, LineChart, Plug, Rocket, ShieldCheck,
  Sparkles, Workflow, Zap,
};
const FALLBACK_ICON = Sparkles;

// Smooth-scroll to a section by id
function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

// Hire Me — premium glassmorphism CTA section positioned as an AI engineer who
// ships full-stack products (NOT a web developer). Animated shimmer background,
// staggered service cards, a JobCraft AI proof card, and a glowing CTA.
export default function HireMeContent({ hireMe }) {
  const cardsRef = useRef(null);
  const services = hireMe?.services ?? [];

  // Stagger the service cards in on scroll (respects reduced motion)
  useStaggerReveal(cardsRef, "[data-service-card]");

  return (
    <SectionWrapper
      id="hire-me"
      className="relative overflow-hidden px-6 py-20 lg:py-28"
    >
      {/* Animated gradient shimmer behind the content */}
      <div
        aria-hidden="true"
        className="hire-shimmer pointer-events-none absolute inset-0 opacity-60"
      />

      <div className="relative mx-auto max-w-5xl text-center">
        {/* Headline + teal divider + subheading */}
        <h2 className="text-3xl font-bold text-text-primary sm:text-4xl lg:text-5xl">
          Let&apos;s Build Something Intelligent
        </h2>
        <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-teal" />
        {hireMe?.intro && (
          <p className="mx-auto mt-5 max-w-2xl text-base text-text-secondary sm:text-lg">
            {hireMe.intro}
          </p>
        )}

        {/* Service cards (staggered reveal) */}
        <div
          ref={cardsRef}
          className="mt-12 grid grid-cols-1 gap-6 text-left md:grid-cols-3"
        >
          {services.map((service) => {
            const Icon = ICONS[service.icon] ?? FALLBACK_ICON;
            return (
              <div key={service.title} data-service-card>
                <GlassCard className="h-full p-6">
                  <Icon size={28} className="text-gold" aria-hidden="true" />
                  <h3 className="mt-4 text-lg font-bold text-teal">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    {service.description}
                  </p>
                </GlassCard>
              </div>
            );
          })}
        </div>

        {/* Proof — JobCraft AI showcase */}
        <div className="mt-14">
          <p className="text-xs font-semibold uppercase tracking-wider text-teal">
            My Work
          </p>
          <div className="mx-auto mt-4 max-w-2xl text-left">
            <GlassCard className="p-6">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-bold text-text-primary">
                  JobCraft AI
                </h3>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-teal/15 px-3 py-1 text-xs font-semibold text-text-primary">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal" />
                  Live Product
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                AI-powered job application generator — tailored resumes, cover
                letters, and a screening-question assistant, built on a 5-model
                Gemini fallback chain with production-grade auth.
              </p>
            </GlassCard>
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <TealButton
            variant="primary"
            onClick={() => scrollToId("contact")}
            className="cta-glow px-8 py-4 text-base"
          >
            Start a Project
          </TealButton>
          <button
            type="button"
            onClick={() => scrollToId("projects")}
            className="text-sm font-medium text-teal transition-colors hover:text-teal-light"
          >
            View full portfolio →
          </button>
        </div>
      </div>
    </SectionWrapper>
  );
}
