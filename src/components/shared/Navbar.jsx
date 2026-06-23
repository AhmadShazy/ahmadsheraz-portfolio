"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

// Navigation links — ids must match the section ids set via SectionWrapper.
const NAV_LINKS = [
  { label: "About", id: "about" },
  { label: "Skills", id: "skills" },
  { label: "Projects", id: "projects" },
  { label: "Education", id: "education" },
  { label: "Experience", id: "experience" },
  { label: "Hire Me", id: "hire-me" },
  { label: "Contact", id: "contact" },
];

// Sticky frosted-glass navbar. Shows the brand on the left and smooth-scroll
// links on the right. Collapses to a hamburger dropdown on mobile, highlights
// the section currently in view, and gains a teal bottom border once scrolled.
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState("");

  // Teal bottom border once the user scrolls past 50px
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the section currently in view with an IntersectionObserver. The
  // detection band sits near the top of the viewport (15%–20%); the topmost
  // section overlapping it (in document/NAV_LINKS order) is the active one.
  useEffect(() => {
    const visible = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        const active = NAV_LINKS.find((link) => visible.has(link.id));
        setActiveId(active ? active.id : "");
      },
      { rootMargin: "-15% 0px -80% 0px", threshold: 0 }
    );

    const sections = NAV_LINKS.map((link) =>
      document.getElementById(link.id)
    ).filter(Boolean);
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  // Smooth-scroll to a section, then close the mobile menu
  const handleNavClick = (e, id) => {
    e.preventDefault();
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
    setMenuOpen(false);
  };

  // Brand click returns to the top of the page
  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        background: "rgba(255, 255, 255, 0.6)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: scrolled
          ? "1px solid rgba(13, 148, 136, 0.22)"
          : "1px solid transparent",
        transition: "border-color 0.3s ease",
      }}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4"
      >
        {/* Brand / name */}
        <a
          href="#"
          onClick={scrollToTop}
          className="text-xl font-bold text-teal"
        >
          Ahmad Sheraz
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                onClick={(e) => handleNavClick(e, link.id)}
                className={`text-sm font-medium transition-colors hover:text-teal ${
                  activeId === link.id ? "text-teal" : "text-text-secondary"
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger toggle */}
        <button
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen((open) => !open)}
          className="text-teal md:hidden"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <ul
          id="mobile-nav"
          className="flex flex-col gap-1 px-6 pb-4 md:hidden"
          style={{
            background: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          {NAV_LINKS.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                onClick={(e) => handleNavClick(e, link.id)}
                className={`block rounded-lg px-3 py-2 text-base font-medium transition-colors hover:bg-teal/10 hover:text-teal ${
                  activeId === link.id ? "text-teal" : "text-text-secondary"
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
