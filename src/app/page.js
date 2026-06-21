import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import HeroSection from "@/components/Hero/HeroSection";
import AboutSection from "@/components/About/AboutSection";
import SkillsSection from "@/components/Skills/SkillsSection";
import ProjectsSection from "@/components/Projects/ProjectsSection";
import EducationSection from "@/components/Education/EducationSection";
import ExperienceSection from "@/components/Experience/ExperienceSection";

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
      </main>
      <Footer />
    </>
  );
}
