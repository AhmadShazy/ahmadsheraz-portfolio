// Brand marks as inline SVG. This lucide-react version ships no brand icons,
// and the two places that needed them (hero + contact) each carried their own
// copy of the markup — this is the one definition.
//
// Keyed by lowercased platform name. A platform WITHOUT a mark here still
// renders, using the generic globe below: an earlier version filtered unknown
// platforms out entirely, which meant adding one in the admin saved
// successfully and changed nothing on the site. A slightly generic icon is a
// far better failure than a link that silently disappears.
const BRAND_PATHS = {
  github:
    "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
  linkedin:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  x: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
};

// Aliases, so the admin can call it whichever name the owner thinks in.
const ALIASES = { twitter: "x" };

function markFor(platform) {
  const key = platform?.toLowerCase?.() ?? "";
  return BRAND_PATHS[ALIASES[key] ?? key] ?? null;
}

// Drawn with primitives rather than a path so it needs no brand asset.
function GenericMark() {
  return (
    <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.5 2.5 3.8 5.6 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.6-3.8-9s1.3-6.5 3.8-9z" />
    </g>
  );
}

// A row of external profile links, rendered from the database.
// `links` is the output of getSocialLinks(): [{ id, platform, url, order }].
export default function SocialLinks({ links = [], className = "" }) {
  // A link still needs a URL — that is the one thing there is no sane fallback
  // for. Everything else renders.
  const usable = links.filter((link) => link.url);
  if (usable.length === 0) return null;

  return (
    <div className={`flex items-center gap-5 ${className}`}>
      {usable.map((link) => {
        const path = markFor(link.platform);
        return (
          <a
            key={link.id ?? link.platform}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${link.platform} profile`}
            className="text-teal transition-transform duration-300 hover:scale-110"
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill={path ? "currentColor" : "none"}
              aria-hidden="true"
            >
              {path ? <path d={path} /> : <GenericMark />}
            </svg>
          </a>
        );
      })}
    </div>
  );
}
