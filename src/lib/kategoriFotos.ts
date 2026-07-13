import type { ImageMetadata } from 'astro';
import type { Kategori } from './kategorier';
import kortLaer from '../assets/fotos/kort-laer.jpg';
import kortManoevrer from '../assets/fotos/kort-manoevrer.jpg';
import kortRegler from '../assets/fotos/kort-regler.jpg';
import kortHavne from '../assets/fotos/kort-havne.jpg';

export const KATEGORI_FOTOS: Record<Kategori, { billede: ImageMetadata; alt: string }> = {
  'laer-at-sejle': {
    billede: kortLaer,
    alt: 'Hånd på bådens rat med solbeskinnet vand i baggrunden',
  },
  'havnemanoevrer': {
    billede: kortManoevrer,
    alt: 'Fortøjningstov lagt om pullert på rødt båddæk',
  },
  'regler': {
    billede: kortRegler,
    alt: 'Rød sideafmærkningsbøje i blåt farvand',
  },
};

export const HAVNE_FOTO: { billede: ImageMetadata; alt: string } = {
  billede: kortHavne,
  alt: 'Dansk havneløb med fortøjede både og Dannebrog i masten',
};
