export const KATEGORIER = {
  'laer-at-sejle': {
    titel: 'Lær at sejle',
    emoji: '🧭',
    beskrivelse: 'Grundkursus i motorbådssejlads — fra klargøring til sikker sejlads.',
  },
  'havnemanoevrer': {
    titel: 'Havnemanøvrer',
    emoji: '🪢',
    beskrivelse: 'Sådan lægger du til og fra — trin for trin, også når det blæser.',
  },
  'regler': {
    titel: 'Regler',
    emoji: '📖',
    beskrivelse: 'Vigeregler, afmærkning og krav — det skal du vide, før du sejler.',
  },
} as const;

export type Kategori = keyof typeof KATEGORIER;
