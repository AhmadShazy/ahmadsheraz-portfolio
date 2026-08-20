"use client";

import { useState } from "react";
import { Mail, Copy, Check } from "lucide-react";
import SocialLinks from "@/components/shared/SocialLinks";

// Left-hand contact column: heading, blurb, copy-to-clipboard email, socials.
// Client-side only because of the Clipboard API; the content itself comes from
// MongoDB via the ContactSection server component.
export default function ContactInfo({ contact, social }) {
  const [copied, setCopied] = useState(false);
  const email = contact?.email ?? "";

  const copyEmail = async () => {
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — ignore silently
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">
        Get In Touch
      </h2>
      <div className="mt-3 h-1 w-20 rounded-full bg-teal" />

      {contact?.blurb && (
        <p className="mt-6 max-w-md text-base text-text-secondary sm:text-lg">
          {contact.blurb}
        </p>
      )}

      {/* Email with copy-to-clipboard */}
      {email && (
        <>
          <button
            type="button"
            onClick={copyEmail}
            aria-label={`Copy email address ${email}`}
            className="mt-8 inline-flex items-center gap-2 text-teal transition-colors hover:text-teal-light"
          >
            <Mail size={18} aria-hidden="true" />
            <span className="font-medium">{email}</span>
            {copied ? (
              <Check size={16} aria-hidden="true" />
            ) : (
              <Copy size={16} aria-hidden="true" />
            )}
          </button>
          {/* Live region announces the copy result to assistive tech */}
          <span aria-live="polite" className="sr-only">
            {copied ? "Email address copied to clipboard" : ""}
          </span>
          {copied && (
            <p className="mt-1 text-xs font-medium text-teal" aria-hidden="true">
              Copied!
            </p>
          )}
        </>
      )}

      {/* Social links, from the database */}
      <SocialLinks links={social} className="mt-8" />
    </div>
  );
}
