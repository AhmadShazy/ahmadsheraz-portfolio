import { getSiteContent, getSocialLinks } from "@/lib/data";
import ContactInfo from "./ContactInfo";
import SectionWrapper from "@/components/shared/SectionWrapper";
import ContactForm from "./ContactForm";

// Contact section: info + social links on the left, the glass form on the right
// (stacked on mobile, info first). Wrapped in SectionWrapper for the scroll
// reveal. The email and social links come from MongoDB; the info column is a
// client component only because copy-to-clipboard needs the browser.
export default async function ContactSection() {
  const [content, social] = await Promise.all([
    getSiteContent(),
    getSocialLinks(),
  ]);

  return (
    <SectionWrapper id="contact" className="px-6 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left — heading, subtext, email, socials */}
          <ContactInfo contact={content.contact} social={social} />

          {/* Right — the form */}
          <div>
            <ContactForm />
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
