import { getSiteContent } from "@/lib/data";
import HireMeContent from "./HireMeContent";

// Server component: reads the Hire Me copy and service cards from MongoDB.
// The body is a client component because it uses a scroll-reveal hook and
// smooth-scroll handlers, and icon components cannot cross the server/client
// boundary — so services carry an icon *name* and the client resolves it.
export default async function HireMeSection() {
  const { hireMe } = await getSiteContent();
  return <HireMeContent hireMe={hireMe} />;
}
