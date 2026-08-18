import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import HeroSection from "@/components/Hero/HeroSection";
import AboutSection from "@/components/About/AboutSection";
import SkillsSection from "@/components/Skills/SkillsSection";
import ProjectsSection from "@/components/Projects/ProjectsSection";
import EducationSection from "@/components/Education/EducationSection";
import ExperienceSection from "@/components/Experience/ExperienceSection";
import HireMeSection from "@/components/HireMe/HireMeSection";
import ContactSection from "@/components/Contact/ContactSection";

// Incremental Static Regeneration: the page is pre-rendered to static HTML and
// refreshed at most once an hour. Visitors are served from the CDN and never
// wait on a database round-trip, but content edits (Phase 3 admin panel) still
// appear without a redeploy.
export const revalidate = 3600;

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col">
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <EducationSection />
        <ExperienceSection />
        <HireMeSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
