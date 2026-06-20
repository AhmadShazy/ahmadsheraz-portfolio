import Link from "next/link";

// Branded call-to-action button. Renders as a Next.js Link when `href` is
// supplied, otherwise as a <button>. Two looks:
//   primary — solid teal background, white text, darkens on hover
//   outline — transparent with teal border/text, fills teal on hover
export default function TealButton({
  children,
  onClick,
  href,
  variant = "primary",
  className = "",
}) {
  // Shared sizing / shape for both variants
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 font-medium transition-all duration-300";

  // Variant-specific colors
  const variants = {
    primary: "bg-teal text-white hover:bg-[#0B7C72]",
    outline:
      "border border-teal bg-transparent text-teal hover:bg-teal hover:text-white",
  };

  const classes = `${base} ${variants[variant] || variants.primary} ${className}`;

  // Render as a link when a destination is supplied
  if (href) {
    return (
      <Link href={href} onClick={onClick} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
