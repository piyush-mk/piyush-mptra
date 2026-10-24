// www.piyush-mptra.com -> piyush-mptra.com, keeping path and query.
export default {
  fetch(req: Request): Response {
    const url = new URL(req.url);
    url.hostname = "piyush-mptra.com";
    url.protocol = "https:";
    return new Response(null, {
      status: 301,
      headers: {
        Location: url.toString(),
        "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
        "Cache-Control": "public, max-age=86400",
      },
    });
  },
};
