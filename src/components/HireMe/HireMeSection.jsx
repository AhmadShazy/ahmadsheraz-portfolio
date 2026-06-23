"use client";

import { useRef } from "react";
import { Bot, LayoutDashboard, BarChart3 } from "lucide-react";
import SectionWrapper from "@/components/shared/SectionWrapper";
import GlassCard from "@/components/shared/GlassCard";
import TealButton from "@/components/shared/TealButton";
import useStaggerReveal from "@/hooks/useStaggerReveal";

// Services — AI-first positioning (CONTEXT.md / CLAUDE.md). AI is the star;
// web dev is the vehicle. Gold icon + teal title per card.
const SERVICES = [
  {
    icon: Bot,
    title: "AI-Powered Web Applications",
    description:
      "Intelligent apps with AI built in from the ground up — chatbots, document generators, smart search, and recommendation engines.",
  },
  {
    icon: LayoutDashboard,
    title: "Smart Management Systems",
    description:
      "Business automation for SMBs — inventory, attendance, customer management, and workflows that make operations smarter.",
  },
  {
    icon: BarChart3,
    title: "Data Pipelines & Dashboards",
    description:
      "Make sense of your data — automated pipelines, real-time dashboards, and reporting that turns raw data into clear decisions.",
  },
];

// Smooth-scroll to a section by id
function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

// Hire Me — premium glassmorphism CTA section positioned as an AI engineer who
// ships full-stack products (NOT a web developer). Animated shimmer background,
// staggered service cards, a JobCraft AI proof card, and a glowing CTA.
export default function HireMeSection() {
  const cardsRef = useRef(null);

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
        <p className="mx-auto mt-5 max-w-2xl text-base text-text-secondary sm:text-lg">
          I build AI-powered web applications and smart management systems for
          small businesses that want to automate and think smarter.
        </p>

        {/* Service cards (staggered reveal) */}
        <div
          ref={cardsRef}
          className="mt-12 grid grid-cols-1 gap-6 text-left md:grid-cols-3"
        >
          {SERVICES.map((service) => {
            const Icon = service.icon;
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
