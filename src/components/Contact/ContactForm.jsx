"use client";

import { useState, useRef, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import GlassCard from "@/components/shared/GlassCard";
import TealButton from "@/components/shared/TealButton";

// Simple email format check (good enough for client-side UX validation)
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Shared input look: transparent background, teal bottom border, and a clear
// teal focus ring for keyboard users (the field border color is added per-field).
const INPUT_BASE =
  "w-full rounded-sm bg-transparent border-b px-1 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/50 outline-none transition-all focus-visible:ring-2 focus-visible:ring-teal/40";

const EMPTY = { name: "", email: "", subject: "", message: "" };

// Glass contact form with client-side validation. No email is sent yet — that's
// wired up in Phase 2; for now a valid submit shows a success state and resets.
export default function ContactForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const successRef = useRef(null);

  // Move focus to the success message when it appears so keyboard users aren't
  // dropped to <body> when the form unmounts (the role=status also announces it).
  useEffect(() => {
    if (submitted && successRef.current) successRef.current.focus();
  }, [submitted]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    // Clear a field's error as soon as the user edits it
    setErrors((er) => ({ ...er, [name]: undefined }));
  };

  // Returns an object of field -> error message (empty when valid)
  const validate = () => {
    const e = {};
    if (!values.name.trim()) e.name = "Please enter your name.";
    if (!values.email.trim()) e.email = "Please enter your email address.";
    else if (!EMAIL_RE.test(values.email.trim()))
      e.email = "Please enter a valid email address.";
    if (!values.subject.trim()) e.subject = "Please enter a subject.";
    if (!values.message.trim()) e.message = "Please enter a message.";
    else if (values.message.trim().length < 10)
      e.message = "Message must be at least 10 characters.";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    // Fake submit — Phase 2 replaces this with a real API call
    setSubmitted(true);
    setValues(EMPTY);
  };

  // Success state replaces the form
  if (submitted) {
    return (
      <div
        ref={successRef}
        role="status"
        aria-live="polite"
        tabIndex={-1}
        className="outline-none"
      >
        <GlassCard
          hoverBorder={false}
          className="flex flex-col items-center p-8 text-center sm:p-10"
        >
          <CheckCircle2 size={48} className="text-teal" aria-hidden="true" />
          <p className="mt-4 text-lg font-semibold text-text-primary">
            Message received! I&apos;ll be in touch soon.
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="mt-4 text-sm font-medium text-teal transition-colors hover:text-teal-light"
          >
            Send another message
          </button>
        </GlassCard>
      </div>
    );
  }

  // Per-field border: red when errored (keeping a focus cue), teal otherwise
  const fieldBorder = (field) =>
    errors[field]
      ? "border-red-400 focus:border-red-500"
      : "border-teal-border focus:border-teal";

  return (
    <GlassCard hoverBorder={false} className="p-6 sm:p-8">
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Full Name */}
        <div>
          <label
            htmlFor="name"
            className="mb-1 block text-sm font-medium text-text-primary"
          >
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={handleChange}
            placeholder="Your name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={`${INPUT_BASE} ${fieldBorder("name")}`}
          />
          {errors.name && (
            <p id="name-error" className="mt-1 text-xs text-red-500">
              {errors.name}
            </p>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-text-primary"
          >
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={handleChange}
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={`${INPUT_BASE} ${fieldBorder("email")}`}
          />
          {errors.email && (
            <p id="email-error" className="mt-1 text-xs text-red-500">
              {errors.email}
            </p>
          )}
        </div>

        {/* Subject */}
        <div>
          <label
            htmlFor="subject"
            className="mb-1 block text-sm font-medium text-text-primary"
          >
            Subject
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            value={values.subject}
            onChange={handleChange}
            placeholder="What's this about?"
            aria-invalid={!!errors.subject}
            aria-describedby={errors.subject ? "subject-error" : undefined}
            className={`${INPUT_BASE} ${fieldBorder("subject")}`}
          />
          {errors.subject && (
            <p id="subject-error" className="mt-1 text-xs text-red-500">
              {errors.subject}
            </p>
          )}
        </div>

        {/* Message */}
        <div>
          <label
            htmlFor="message"
            className="mb-1 block text-sm font-medium text-text-primary"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={values.message}
            onChange={handleChange}
            placeholder="Tell me about your project or idea..."
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : undefined}
            className={`${INPUT_BASE} resize-none ${fieldBorder("message")}`}
          />
          {errors.message && (
            <p id="message-error" className="mt-1 text-xs text-red-500">
              {errors.message}
            </p>
          )}
        </div>

        <TealButton type="submit" variant="primary" className="w-full">
          Send Message
        </TealButton>
      </form>
    </GlassCard>
  );
}
