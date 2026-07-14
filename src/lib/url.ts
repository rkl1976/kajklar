/**
 * Prefikser en rod-relativ sti med sitets base-sti (import.meta.env.BASE_URL).
 * Nødvendig for GitHub Pages-projektsites, hvor sitet serveres fra en understi
 * (fx /kajklar/). Astro tilføjer IKKE automatisk base til hardkodede href="/...".
 * Ved deployment til eget domæne (base: '/') returnerer den stien uændret.
 */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
