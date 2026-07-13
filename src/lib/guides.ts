import type { CollectionEntry } from 'astro:content';

export function guideSlug(guide: CollectionEntry<'guides'>): string {
  const sidsteDel = guide.id.split('/').pop();
  if (!sidsteDel) throw new Error(`Ugyldigt guide-id: ${guide.id}`);
  return sidsteDel;
}

export function guideUrl(guide: CollectionEntry<'guides'>): string {
  return `/${guide.data.kategori}/${guideSlug(guide)}/`;
}
