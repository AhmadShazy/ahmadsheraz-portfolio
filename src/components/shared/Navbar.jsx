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

  useEffect(() => {
    const updateNavState = () => {
      // Add the teal bottom border once the user scrolls past 50px
      setScrolled(window.scrollY > 50);

      // Determine which section is currently in view (last one whose top has
      // passed ~120px below the viewport top wins).
      let current = "";
      for (const link of NAV_LINKS) {
        const section = document.getElementById(link.id);
        if (section && section.getBoundingClientRect().top <= 120) {
          current = link.id;
        }
      }
      setActiveId(current);
    };

    updateNavState(); // run once on mount to set initial state

    // Recompute on scroll, but also on events that move sections without a
    // scroll: viewport resize, full load (fonts/images settling), and arriving
    // via a hash link such as /#projects.
    window.addEventListener("scroll", updateNavState, { passive: true });
    window.addEventListener("resize", updateNavState);
    window.addEventListener("load", updateNavState);
    window.addEventListener("hashchange", updateNavState);
    return () => {
      window.removeEventListener("scroll", updateNavState);
      window.removeEventListener("resize", updateNavState);
      window.removeEventListener("load", updateNavState);
      window.removeEventListener("hashchange", updateNavState);
    };
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
