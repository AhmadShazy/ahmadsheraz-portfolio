/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // The About photo is served from /api/profile-photo with a ?v=<upload time>
    // so each photo gets its own URL and can be cached immutably. Next 16
    // refuses a local image whose src carries a query string unless the path is
    // listed here — and it throws during render, which took down regeneration
    // of "/" entirely: the page kept failing, so Next went on serving the last
    // good copy and the new photo never appeared.
    //
    // ⚠️ Defining localPatterns at all flips local images from allow-everything
    // to allow-listed (see hasLocalMatch in next/dist/shared/lib/match-local-pattern).
    // The second entry is therefore NOT optional — without it the bundled
    // /profile-v2.jpg fallback stops working too.
    localPatterns: [
      // `search` omitted means any query string is accepted on this path.
      { pathname: "/api/profile-photo" },
      // Everything shipped in public/. These never carry a query, and saying so
      // keeps the allowance narrow.
      { pathname: "/**", search: "" },
    ],
  },
};

export default nextConfig;
