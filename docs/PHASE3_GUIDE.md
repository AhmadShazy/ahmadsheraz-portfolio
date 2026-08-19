# PHASE 3 GUIDE — building the admin panel

The **how**. [EXECUTION_PLAN.md](../EXECUTION_PLAN.md) is the **what and when**
(sub-phases P3.0–P3.6). Read that for scope; read this for the code.

Everything here was verified against the versions actually installed
(`next@16.2.9`, `mongoose@9.7.1`, Node ≥ 20.9) on 2026-08-20 — not from memory.
Where the old plan said something that does not work, this file says so and
gives the replacement.

---

## 0. The five things the old plan got wrong

Read these before writing any code. Each one was a real dead end.

| # | The old plan said | What actually happens | Do this instead |
|---|---|---|---|
| 1 | Verify JWT in `src/middleware.js` with `jsonwebtoken` | `middleware.*` compiles to the **Edge** runtime, where `jsonwebtoken` (`require("crypto")`) cannot resolve. Build fails. Also `middleware` is a **deprecated filename** in Next 16 | Use **`src/proxy.js`** + **`jose`** — §1 |
| 2 | `JWT_SECRET=same_secret_as_portfolio` | The portfolio has **no** `JWT_SECRET`. Blank secret ⇒ `jose` signs with the 9-byte string `"undefined"` ⇒ forgeable tokens | Generate a **fresh** secret — §2 |
| 3 | Admin edits "reflect on the portfolio immediately" | The homepage is an **ISR snapshot with `revalidate = 3600`**. Worst case ~1 hour, and the first visitor after expiry still gets the *old* page | Add an on-demand revalidate hook **in the portfolio repo** — §3 |
| 4 | Drag to reorder projects updates `rank` | `Project.rank` is `unique: true`. Any swap collides ⇒ **E11000** | Reorder via `bulkWrite` with a parking offset — §5 |
| 5 | Build editors for Hero text and Social Links | Hero, About, Hire Me, Contact and the social URLs are **hardcoded in components**. Those edits change nothing on the live site | Wire them to the DB first, in **P3.0** — §4 |

**The consequence of #3 and #5 together:** Phase 3 *must* touch the portfolio
repo. The old rule "Phase 3 never touches the portfolio app" is impossible —
what it actually means, and what still holds absolutely, is that **no admin
code, URL, or reference may ever enter the portfolio app**. Portfolio-side work
in Phase 3 is confined to P3.0 and is all public-safe.

---

## 1. Authentication

### File layout

```
ahmadsheraz-admin/
├── src/
│   ├── proxy.js                       ← NOT middleware.js
│   ├── lib/
│   │   ├── auth.js                    ← sign / verify / cookie helpers
│   │   ├── mongodb.js                 ← copied verbatim from the portfolio
│   │   └── models/                    ← copied verbatim from the portfolio
│   ├── app/
│   │   ├── login/page.js
│   │   ├── dashboard/…
│   │   └── api/
│   │       ├── auth/login/route.js
│   │       ├── auth/logout/route.js
│   │       └── admin/…
```

### Why `proxy.js` and not `middleware.js`

Verified in `next@16.2.9`:

- `dist/build/entries.js` — `isProxyFile(page)` → `onServer()` (**always Node**);
  `isMiddlewareFile(page)` → `onEdgeServer()` unless it exports
  `runtime = 'nodejs'`.
- `dist/lib/constants.js` — `MIDDLEWARE_FILENAME = 'middleware'`,
  `PROXY_FILENAME = 'proxy'`.
- `dist/build/index.js` — building a `middleware` file logs *"file convention is
  deprecated, please use proxy"*; having **both** files is a hard error.
- `dist/build/analysis/get-page-static-info.js` — putting
  `export const runtime = …` in a proxy file **throws E1031**: *"Proxy always
  runs on Node.js runtime."*

So: name the file `src/proxy.js`, export a function named `proxy`, and **do not
add a `runtime` export**.

### `src/lib/auth.js`

```js
import { SignJWT, jwtVerify } from "jose";

// Fail loudly at module load rather than silently signing with a weak key.
// jose encodes undefined as the 9-byte string "undefined" — a guessable HMAC
// key that would let anyone forge an admin session.
const SECRET = process.env.JWT_SECRET;
if (!SECRET || SECRET.length < 32) {
  throw new Error("JWT_SECRET is missing or shorter than 32 characters.");
}
const KEY = new TextEncoder().encode(SECRET);

export const COOKIE_NAME = "admin_token";
const MAX_AGE = 60 * 60 * 24; // 24 hours, in seconds

export async function createToken() {
  return new SignJWT({ sub: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(KEY);
}

// Throws on a bad signature, a wrong algorithm, or expiry — callers catch.
export async function verifyToken(token) {
  const { payload } = await jwtVerify(token, KEY, { algorithms: ["HS256"] });
  return payload;
}

// One definition of the cookie so the login and logout routes cannot drift.
export function sessionCookie(value, maxAge = MAX_AGE) {
  return {
    name: COOKIE_NAME,
    value,
    httpOnly: true,                                   // JS can never read it
    secure: process.env.NODE_ENV === "production",    // HTTPS only in prod
    sameSite: "lax",                                  // blocks cross-site POSTs
    path: "/",
    maxAge,
  };
}
```

`jose` is pure WebCrypto and runs in either runtime, so this file is safe to
import from the proxy, from route handlers, and from server components alike.

### `src/proxy.js`

```js
import { NextResponse } from "next/server";
import { COOKIE_NAME, verifyToken } from "@/lib/auth";

export async function proxy(request) {
  const token = request.cookies.get(COOKIE_NAME)?.value;

  try {
    if (!token) throw new Error("no session cookie");
    await verifyToken(token);
    return NextResponse.next();
  } catch {
    // API routes get a clean 401; page routes get sent to the login screen.
    if (request.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

// Guard the dashboard AND the admin API from the very first sub-phase —
// leaving /api/admin/* open "until the CRUD lands" is an open write endpoint
// on the public internet.
export const config = {
  matcher: ["/dashboard/:path*", "/api/admin/:path*"],
};
```

The proxy is a **gate, not the only lock.** Every `/api/admin/*` handler must
verify independently too — one bad `matcher` edit should not expose writes.

### Login route

```js
// src/app/api/auth/login/route.js
import bcrypt from "bcryptjs";
import { createToken, sessionCookie } from "@/lib/auth";

const HASH = process.env.ADMIN_PASSWORD_HASH;
if (!HASH) throw new Error("ADMIN_PASSWORD_HASH is not set.");

export async function POST(request) {
  const { password } = await request.json().catch(() => ({}));
  if (typeof password !== "string") {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const ok = await bcrypt.compare(password, HASH);
  if (!ok) {
    // Constant, vague message — never reveal which part failed.
    return Response.json({ error: "Incorrect password." }, { status: 401 });
  }

  const res = Response.json({ ok: true });
  res.cookies.set(sessionCookie(await createToken()));
  return res;
}
```

`bcryptjs` imports Node's `crypto` at the top level, so it may **only** be used
in a route handler — never in `proxy.js`.

### Logout must be a route, not client JS

The old plan installed `js-cookie` to clear the cookie. It cannot: the cookie is
`httpOnly`, which is the entire point. Clearing it requires a server response.

```js
// src/app/api/auth/logout/route.js
import { sessionCookie } from "@/lib/auth";

export async function POST() {
  const res = Response.json({ ok: true });
  res.cookies.set(sessionCookie("", 0)); // same name/path, expired
  return res;
}
```

Do **not** install `js-cookie` or `cookie`. Next's own cookie API covers this.

### Brute-force protection

The login route is public and unauthenticated. Reuse the shape already proven in
the portfolio's `/api/contact` — count attempts in MongoDB so the limit survives
serverless cold starts, and **fail closed** here (unlike the contact form, which
fails open):

```js
// A LoginAttempt model: { ipHash, at: Date }, TTL index on `at` (1 hour).
// Before comparing the password:
//   • > 5 failures from this ipHash in the last 15 minutes → 429, no compare
//   • on success, delete that ipHash's attempts
// If the DB is unreachable, return 503 — refusing logins beats allowing
// unlimited guesses.
```

Hash the IP with a salt exactly as `src/app/api/contact/route.js` does. Never
store or log a raw IP.

### CSRF

`sameSite: "lax"` blocks the cross-site form POST that CSRF depends on, and the
admin API only accepts `application/json` (browsers cannot send that
cross-origin without a preflight). Together that is sufficient here. Do **not**
add `sameSite: "none"`. If a token scheme is ever wanted, add it then — for a
single-admin CMS it is not worth the moving parts today.

---

## 2. Environment variables

```env
# ahmadsheraz-admin/.env.local — mirror this into .env.example (blank values)

# Shared with the portfolio — must match EXACTLY
MONGODB_URI=...                 # required
MONGODB_DB=portfolio            # required here — see the warning below

# Admin-only
JWT_SECRET=...                  # required, fresh, >= 32 chars, NOT the portfolio's
ADMIN_PASSWORD_HASH=...         # required, a bcrypt hash — never the plaintext

# Points at the portfolio's revalidate hook (see §3)
PORTFOLIO_URL=https://www.ahmadsheraz.com
REVALIDATE_SECRET=...           # required, must match the portfolio's copy
```

**The variable is `ADMIN_PASSWORD_HASH`, not `ADMIN_PASSWORD`.** The old plan
used both names for the same value. If code reads one and Vercel holds the
other, `bcrypt.compare(password, undefined)` returns `false` and the live panel
rejects the correct password with a 401 that looks exactly like a typo.

**`MONGODB_DB` is not optional in the admin.** The portfolio pins `dbName` in
`src/lib/mongodb.js`; if the copied file loses that, the admin writes to the
`test` database, every save appears to succeed, and nothing changes on the site.

Generate the secrets locally, never in chat:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

```bash
node -e "console.log(require('bcryptjs').hashSync(process.argv[1],12))" "YOUR-PASSWORD"
```

---

## 3. Making edits actually appear on the live site

`src/app/page.js` sets `export const revalidate = 3600`. That is
stale-while-revalidate: after an hour the **next** visitor still receives the
cached page while regeneration happens in the background. So an admin edit can
take an hour, and the person who checks immediately after saving sees the old
page and assumes the save failed.

`revalidatePath()` called inside the **admin** app is a no-op for the portfolio —
they are separate deployments with separate caches. The portfolio has to
invalidate itself.

Verified in `next@16.2.9`:
`revalidateTag(tag, profile)` now takes a **required** second argument, and
`updateTag()` is Server-Actions-only. `revalidatePath(path, type?)` is
unchanged. The data layer uses **no cache tags at all**, so `revalidatePath` is
both simpler and the only one that works without refactoring
`src/lib/data.js`.

### In the **portfolio** repo (P3.0)

```js
// src/app/api/revalidate/route.js
import { revalidatePath } from "next/cache";

// Private hook: the admin panel calls this after a content write so the live
// page refreshes in seconds instead of waiting out the ISR hour.
// It is unauthenticated by design — the shared secret IS the authentication —
// so it must do nothing except purge a cache.
export async function POST(request) {
  const secret = request.headers.get("x-revalidate-secret");

  if (!process.env.REVALIDATE_SECRET) {
    console.error("[revalidate] REVALIDATE_SECRET is not set");
    return Response.json({ error: "Not configured." }, { status: 500 });
  }
  if (secret !== process.env.REVALIDATE_SECRET) {
    // Same body and status for wrong and missing — no probing signal.
    return Response.json({ error: "Not found." }, { status: 404 });
  }

  revalidatePath("/");
  return Response.json({ revalidated: true });
}
```

Add `REVALIDATE_SECRET` to `.env.example`, to `.env.local`, and to **both**
Vercel projects with the identical value.

This endpoint is safe to have in a public repo: it takes no user input, writes
nothing, and reveals nothing. It must never mention the admin app.

### In the **admin** repo

```js
// src/lib/revalidate.js
// Best-effort: a failed cache purge must never fail the save that already
// succeeded. Worst case the edit appears within the normal ISR hour.
export async function revalidatePortfolio() {
  try {
    const res = await fetch(`${process.env.PORTFOLIO_URL}/api/revalidate`, {
      method: "POST",
      headers: { "x-revalidate-secret": process.env.REVALIDATE_SECRET },
      cache: "no-store",
    });
    if (!res.ok) console.error("[revalidate] portfolio returned", res.status);
  } catch (err) {
    console.error("[revalidate] could not reach portfolio:", err.message);
  }
}
```

Call it at the end of every successful create / update / delete, and surface the
result in the UI honestly — *"Saved. Live site updates within a minute."*

---

## 4. What the admin can actually edit today

Only four content types reach the live site from MongoDB:

| Section | Source | Admin-editable? |
|---|---|---|
| Projects | `getProjects()` | ✅ yes |
| Skills | `getSkillsGrouped()` | ✅ yes |
| Education | `getEducation()` | ✅ yes |
| Experience | `getExperience()` | ✅ yes |
| Hero roles + tagline | hardcoded `ROLES` in `HeroContent.jsx` | ❌ until P3.0 |
| About bio + stats | hardcoded `BIO_PARAGRAPHS`, `STATS` | ❌ until P3.0 |
| Hire Me services | hardcoded `SERVICES` | ❌ until P3.0 |
| Contact email | hardcoded `EMAIL` | ❌ until P3.0 |
| Social links | hardcoded in `HeroContent.jsx` **and** `ContactSection.jsx` | ❌ until P3.0 |

`SocialLink`, `getSocialLinks()` and `/api/social` all exist and all work — and
**nothing renders them.** Building a social-links editor before P3.0 produces a
screen where saving succeeds and the site never changes.

### P3.0 fixes this two ways

**Social links** — already modelled. Just consume them:

```js
// HeroContent.jsx and ContactSection.jsx are client components, so the parent
// server section fetches and passes them down as props.
const social = await getSocialLinks();
```

**Everything else** — needs a home. Prefer **one typed `SiteContent` document**
over the old plan's `{ key, value: Mixed }` Settings model, which accepts a
typo'd key silently and gives you no validation at all:

```js
// src/lib/models/SiteContent.js
const SiteContentSchema = new mongoose.Schema({
  // Exactly one document. The enum makes a second one impossible.
  singleton: { type: String, default: "main", unique: true, enum: ["main"] },

  hero: {
    roles: { type: [String], default: [] },
    tagline: { type: String, trim: true },
    availableForWork: { type: Boolean, default: true },
  },
  about: {
    paragraphs: { type: [String], default: [] },
    stats: [{ label: String, value: String }],
  },
  services: [{ title: String, description: String, icon: String }],
  contactEmail: { type: String, trim: true },
}, { timestamps: true });
```

Real field names, real types, one document to fetch. A typo is now a schema
error instead of a silent no-op.

---

## 5. CRUD patterns that will not blow up

### Reordering projects — `rank` is unique

`src/lib/models/Project.js` declares `rank: { type: Number, required: true,
unique: true }`. Swapping ranks 2 and 3 with two `updateOne` calls throws
**E11000** on the first write, because rank 3 still exists.

Two options, in order of preference:

**(a) Drop the unique constraint** — it protects nothing the UI cannot enforce,
and every reorder fights it:

```js
rank: { type: Number, required: true, index: true },
```

Then drop the existing index once, against the live cluster:
`db.projects.dropIndex("rank_1")`.

**(b) Keep it and park the values** — one round trip, no partial state:

```js
// Move everything out of the way, then write the final order.
const OFFSET = 10000;
await Project.bulkWrite(
  ordered.map((p, i) => ({
    updateOne: { filter: { _id: p.id }, update: { $set: { rank: i + OFFSET } } },
  }))
);
await Project.bulkWrite(
  ordered.map((p, i) => ({
    updateOne: { filter: { _id: p.id }, update: { $set: { rank: i + 1 } } },
  }))
);
```

M0 Atlas clusters are replica sets, so transactions are available if you want
one — but the two-pass `bulkWrite` is enough here.

### Skills — the compound unique index

`SkillSchema.index({ category: 1, name: 1 }, { unique: true })` throws E11000
when you add a duplicate name inside a category, rename a skill onto an existing
one, or move a skill into a category that already has that name. The seed data
already contains names that repeat **across** categories, so the third case is
reachable on day one. Catch `err.code === 11000` in every skills write and
return a readable 409 — never a 500.

### Icons — validate against the real list

`Skill.icon` is free text resolved to a `lucide-react` component at render. An
unknown name renders `undefined` as a component and **crashes the Skills
section on the live site**. The admin's icon field must be a picker backed by
the actual export list, never a text input.

### Deleting inbox messages has a side effect

`/api/contact` counts `Message` documents by `ipHash` to enforce its 3/hour and
8/day limits. **Deleting messages resets the abuse counter for that sender.**
Prefer archive-and-hide (`isArchived: true`) over hard delete; if you keep a
delete button, label it honestly.

### Everything else

- Add `{ timestamps: true }` to the content schemas — an admin needs to see what
  changed when, and no model has it.
- `Education` has no `order` field and is sorted by `endYear` descending. Add
  `order` if you ever have two degrees ending in the same year.
- Verify auth **inside every handler**, not just via the proxy matcher.
- Validate on the server. The admin is a trusted user, not a trusted client.

---

## 6. Sharing models across two repos

The admin needs the exact same Mongoose schemas. "Import from `lib/models/`"
is not possible across repo boundaries.

**Copy the files, and make the copy loud.** A shared npm package or a submodule
buys correctness at the price of a publish/update step on every schema change —
for one developer with six small schemas, that ceremony is what actually causes
drift, because it gets skipped.

So: copy `src/lib/mongodb.js` and all of `src/lib/models/` into the admin repo
verbatim, and put this at the top of every copied file:

```js
// ⚠️ COPY of ahmadsheraz-portfolio/src/lib/models/Project.js
// Both apps write the same MongoDB collection. Change one, change the other in
// the same session, or the two apps disagree about the shape of the data.
```

Add the same rule to the admin repo's `CLAUDE.md`. Two apps writing one
collection with different schemas is the failure mode worth fearing here — a
missing field in a copy means the admin silently drops data the site renders.

`jsconfig.json` uses `@/* → ./src/*`, and `create-next-app --import-alias "@/*"`
reproduces it, so imports resolve unchanged.

---

## 7. Keeping the admin private

The admin is only as hidden as its weakest edge:

- **Private GitHub repo.** Not public-with-no-links.
- **Vercel Deployment Protection** on the admin project — a second lock in front
  of the app's own login (RUNBOOK §7).
- **`noindex` in the admin app**, not the portfolio:
  ```js
  // admin src/app/layout.js
  export const metadata = { robots: { index: false, follow: false } };
  ```
- **Never** add the admin hostname to the portfolio's `robots.txt` or sitemap.
  The portfolio has neither today; listing the subdomain there would publish the
  very thing being hidden.
- The old checklist item *"admin URL not in portfolio robots.txt"* passes
  vacuously and should be replaced by: **grep the portfolio for the string.**
  ```bash
  grep -ri "admin\." src/ public/ *.md
  ```

---

## 8. Before the first destructive edit

Back up the collections. The admin's whole purpose is mutation, and `npm run
seed` — still a live command — wipes everything it manages.

```bash
mongodump --uri "$MONGODB_URI" --db portfolio --out ./backup-$(date +%Y%m%d)
```

Do this once before P3.2 ships and again before any bulk operation.

---

## 9. Definition of done for Phase 3

- [ ] Wrong password → 401; five wrong passwords → 429
- [ ] `/dashboard` and `/api/admin/*` both reject a missing or forged cookie
- [ ] Logout actually clears the session (verify in devtools → Application)
- [ ] Every content type: create, edit, delete, reorder — no E11000, no 500s
- [ ] An edit is visible on **www.ahmadsheraz.com** within a minute
- [ ] `grep -ri "admin\." src/ public/ *.md` in the portfolio returns nothing
- [ ] The admin's own URL returns Vercel's protection screen when logged out
- [ ] `npm run build` and `npm run lint` pass in **both** repos
- [ ] The portfolio still scores the same on Speed Insights as before P3.0

---

*Companion to [EXECUTION_PLAN.md](../EXECUTION_PLAN.md) · verified against
next@16.2.9 on 2026-08-20*
