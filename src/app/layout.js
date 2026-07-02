import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Ahmad Sheraz — AI Engineer",
  description: "AI/ML Engineer building intelligent full-stack products.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        {/* Single continuous background gradient for the whole page — sections
            are transparent so there are no seams between them. flex-1 keeps the
            gradient covering the full viewport even on short pages. */}
        <div className="page-gradient flex flex-1 flex-col">{children}</div>
        {/* Vercel Web Analytics (no-op locally; reports on the deployed site) */}
        <Analytics />
      </body>
    </html>
  );
}
