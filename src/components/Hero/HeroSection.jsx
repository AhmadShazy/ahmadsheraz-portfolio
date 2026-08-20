import { getSiteContent, getSocialLinks } from "@/lib/data";
import HeroShell from "./HeroShell";

// Server component: reads the hero copy and social links from MongoDB and hands
// them to the client shell. Split this way because the shell needs browser APIs
// (IntersectionObserver, a dynamic ssr:false import) while the data has to be
// fetched on the server — the same pattern as the Skills and Projects sections.
export default async function HeroSection() {
  const [content, social] = await Promise.all([
    getSiteContent(),
    getSocialLinks(),
  ]);

  return <HeroShell hero={content.hero} social={social} />;
}
