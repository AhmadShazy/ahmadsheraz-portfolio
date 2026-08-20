import { revalidatePath } from "next/cache";

// POST /api/revalidate — purge the cached home page on demand.
//
// The page is an ISR snapshot (`revalidate = 3600` in src/app/page.js), so a
// content edit would otherwise take up to an hour to show, and the first
// visitor after expiry still receives the stale copy while it regenerates.
// A content editor calls this after a successful write and the change is live
// in seconds.
//
// The shared secret IS the authentication, so this handler deliberately does
// nothing else: it reads no request body, writes nothing, and returns no
// information about the system. That is what makes it safe to ship in a public
// repository.
export async function POST(request) {
  // A missing secret must not mean "allow everyone" — refuse and say so in the
  // logs, where the operator will actually see it.
  if (!process.env.REVALIDATE_SECRET) {
    console.error("[revalidate] REVALIDATE_SECRET is not set — refusing");
    return Response.json({ error: "Not configured." }, { status: 500 });
  }

  const provided = request.headers.get("x-revalidate-secret");

  // Identical response for a wrong secret and a missing one, so the endpoint
  // gives a prober no signal that it exists or that it is close to correct.
  if (provided !== process.env.REVALIDATE_SECRET) {
    return Response.json({ error: "Not found." }, { status: 404 });
  }

  revalidatePath("/");
  return Response.json({ revalidated: true });
}
