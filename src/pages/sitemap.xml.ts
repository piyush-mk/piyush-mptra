import type { APIRoute } from "astro";
import { projects } from "../content/profile";

export const GET: APIRoute = ({ site }) => {
  const paths = ["/", "/work/portbot", ...projects.map((p) => `/work/${p.slug}`)];
  const urls = paths.map((p) => `<url><loc>${new URL(p, site).href}</loc></url>`).join("");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {
    headers: { "Content-Type": "application/xml" },
  });
};
