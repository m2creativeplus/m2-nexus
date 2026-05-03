/**
 * Canonical public origin for absolute URLs (metadata, sitemap, robots).
 * Set `NEXT_PUBLIC_SITE_URL` in Vercel to your production domain (no trailing slash).
 */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (fromEnv) return fromEnv;

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, "")}`;

  return "https://m2-nexus.vercel.app";
}
