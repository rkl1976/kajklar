import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(160),
    kategori: z.enum(['laer-at-sejle', 'havnemanoevrer', 'regler']),
    raekkefoelge: z.number().int().positive(),
    svaerhedsgrad: z.enum(['begynder', 'oevet']).default('begynder'),
  }),
});

const havne = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/havne' }),
  schema: z.object({
    navn: z.string(),
    position: z.object({ lat: z.number(), lng: z.number() }),
    dybde: z.string(),
    vhf: z.string().optional(),
    faciliteter: z.array(z.string()),
    indsejling: z.string(),
  }),
});

const logbog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/logbog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().max(160),
      dato: z.coerce.date(),
      forfatter: z.string().default('KajKlar'),
      billede: image().optional(),
      billedeAlt: z.string().optional(),
    }),
});

export const collections = { guides, havne, logbog };
