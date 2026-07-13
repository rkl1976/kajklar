# Til Kaj — Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Byg "Til Kaj" — et statisk, dansksproget indholdssite for nye motorbådssejlere i Limfjorden — med 20 guides, 10 havnesider og "Frisk fjord"-design, klar til statisk hosting.

**Architecture:** Astro 5 med content collections (Zod-validerede markdown-filer i `guides` og `havne`), Tailwind CSS 4 via `@tailwindcss/vite`, 100 % statisk output. Dynamiske routes genererer sektions-, guide- og havnesider ud fra indholdet.

**Tech Stack:** Astro ^5, Tailwind CSS ^4 (+ @tailwindcss/typography), TypeScript (strict), @astrojs/sitemap, @astrojs/check.

**Spec:** `docs/superpowers/specs/2026-07-13-til-kaj-website-design.md`

## Global Constraints

- Node.js ≥ 20 og npm forudsættes installeret. Arbejdsmappe: repo-roden (`C:\Dev\Private\boat`).
- Alt indhold på **dansk** i du-form med korrekt ortografi (æ, ø, å — aldrig ae/oe/aa i brødtekst).
- URL-slugs og filnavne er ASCII: æ→ae, ø→oe, å→aa (fx `laer-at-sejle`, `havnemanoevrer`, `nykoebing-mors`).
- Sitets navn er **"Til Kaj"**. Domæne-placeholder: `https://tilkaj.dk` (sat ét sted: `astro.config.mjs` → `site`).
- Ingen eksterne requests fra siderne: ingen CDN-fonte, ingen trackere, ingen eksterne scripts. Systemfont-stack.
- Farvetokens hedder `fjord` (teal-skala) og `rav` (accent) og defineres i `src/styles/global.css` under `@theme`.
- Kvalitetsport i hver task: `npm run check` (astro check) og `npm run build` skal begge afslutte uden fejl.
- Faktuelle påstande om regler, broer og havne SKAL verificeres via websøgning mod officielle kilder (soefartsstyrelsen.dk, retsinformation.dk, havnens egen hjemmeside), og kilderne angives i bunden af guiden under overskriften "Kilder".
- Commit efter hver task. Commit-beskeder: `feat: <dansk beskrivelse>` og afslut med tom linje + `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
- Guide-tone: konkret, venlig, korte afsnit, målgruppe = nybegynder. Hver guide er 700–1200 ord og slutter med en blockquote, der starter med `> **Husk:**`.

---

### Task 1: Projekt-skelet (Astro + Tailwind + TypeScript)

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `src/styles/global.css`
- Create: `src/pages/index.astro`

**Interfaces:**
- Consumes: intet (første task).
- Produces: npm-scripts `dev`, `build`, `check`, `preview`; `src/styles/global.css` som Task 2 udvider; `src/pages/index.astro` som Task 2 og 6 erstatter.

- [ ] **Step 1: Skriv `package.json`**

```json
{
  "name": "til-kaj",
  "type": "module",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "check": "astro check",
    "preview": "astro preview"
  },
  "dependencies": {
    "@astrojs/sitemap": "^3.2.0",
    "astro": "^5.0.0"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.4",
    "@tailwindcss/typography": "^0.5.15",
    "@tailwindcss/vite": "^4.0.0",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.6.0"
  }
}
```

- [ ] **Step 2: Skriv `astro.config.mjs`**

```js
// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://tilkaj.dk',
  vite: { plugins: [tailwindcss()] },
});
```

- [ ] **Step 3: Skriv `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 4: Skriv `src/styles/global.css` (minimal — tema kommer i Task 2)**

```css
@import "tailwindcss";
```

- [ ] **Step 5: Skriv `src/pages/index.astro` (midlertidig forside)**

```astro
---
import '../styles/global.css';
---
<!doctype html>
<html lang="da">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Til Kaj</title>
  </head>
  <body class="p-8 font-sans">
    <h1 class="text-2xl font-bold">⚓ Til Kaj — under opbygning</h1>
  </body>
</html>
```

- [ ] **Step 6: Installér og verificér build**

Kør: `npm install` — Forventet: afslutter uden fejl.
Kør: `npm run build` — Forventet: "Complete!" og `dist/index.html` findes.
Kør: `grep -c "Til Kaj" dist/index.html` — Forventet: mindst 1.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json src/
git commit -m "feat: opret Astro-projekt med Tailwind og TypeScript"
```

---

### Task 2: Designtokens og BaseLayout ("Frisk fjord")

**Files:**
- Modify: `src/styles/global.css`
- Create: `src/layouts/BaseLayout.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `src/styles/global.css` fra Task 1.
- Produces: `BaseLayout.astro` med props `{ title: string; description: string }` — bruges af ALLE sider i Task 4–7. Tailwind-tokens `fjord-50…900`, `rav-100/500/600`, klassen `dark:` (class-baseret) og typografi-plugin (`prose`).

- [ ] **Step 1: Erstat `src/styles/global.css` med tema**

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --color-fjord-50: #f0fafc;
  --color-fjord-100: #e0f2f7;
  --color-fjord-200: #bae5ef;
  --color-fjord-500: #1191b4;
  --color-fjord-600: #0e7490;
  --color-fjord-700: #0c5f77;
  --color-fjord-900: #0f3b4c;
  --color-rav-100: #fef3e2;
  --color-rav-500: #f59e0b;
  --color-rav-600: #d97706;
  --font-sans: ui-sans-serif, system-ui, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}
```

- [ ] **Step 2: Skriv `src/layouts/BaseLayout.astro`**

```astro
---
import '../styles/global.css';

interface Props {
  title: string;
  description: string;
}

const { title, description } = Astro.props;
const nav = [
  { href: '/laer-at-sejle/', label: 'Lær at sejle' },
  { href: '/havnemanoevrer/', label: 'Havnemanøvrer' },
  { href: '/regler/', label: 'Regler' },
  { href: '/havne/', label: 'Havne' },
];
---
<!doctype html>
<html lang="da">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title} · Til Kaj</title>
    <meta name="description" content={description} />
    <meta property="og:title" content={`${title} · Til Kaj`} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <script is:inline>
      const theme = localStorage.getItem('theme')
        ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', theme === 'dark');
    </script>
  </head>
  <body class="flex min-h-screen flex-col bg-white font-sans text-fjord-900 dark:bg-slate-900 dark:text-slate-100">
    <header class="sticky top-0 border-b border-fjord-100 bg-white/90 backdrop-blur dark:border-slate-700 dark:bg-slate-900/90">
      <div class="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3">
        <a href="/" class="text-lg font-extrabold text-fjord-600 dark:text-fjord-200">⚓ Til Kaj</a>
        <nav class="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm" aria-label="Hovedmenu">
          {nav.map((item) => (
            <a href={item.href} class="hover:text-fjord-600 dark:hover:text-fjord-200">{item.label}</a>
          ))}
          <button id="theme-toggle" type="button" aria-label="Skift mellem lys og mørk visning"
            class="rounded-full border border-fjord-100 px-2 py-1 dark:border-slate-600">🌓</button>
        </nav>
      </div>
    </header>
    <main class="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
      <slot />
    </main>
    <footer class="mt-12 border-t border-fjord-100 dark:border-slate-700">
      <div class="mx-auto max-w-5xl px-4 py-6 text-sm text-slate-500 dark:text-slate-400">
        <p>Til Kaj vejleder — officielle regler og kilder gælder altid. <a href="/om/" class="underline">Om sitet</a>.</p>
      </div>
    </footer>
    <script is:inline>
      document.getElementById('theme-toggle')?.addEventListener('click', () => {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
      });
    </script>
  </body>
</html>
```

- [ ] **Step 3: Opdatér `src/pages/index.astro` til at bruge layoutet**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="Forside" description="Guides, havnemanøvrer, regler og havneinfo for nye motorbådssejlere i Limfjorden.">
  <h1 class="text-3xl font-extrabold">⚓ Til Kaj — under opbygning</h1>
</BaseLayout>
```

- [ ] **Step 4: Verificér**

Kør: `npm run check` — Forventet: 0 errors.
Kør: `npm run build` — Forventet: uden fejl.
Kør: `grep -c "theme-toggle" dist/index.html` — Forventet: mindst 1 (layout er i brug).

- [ ] **Step 5: Commit**

```bash
git add src/
git commit -m "feat: tilfoej Frisk fjord-designtokens og BaseLayout med moerk tilstand"
```

---

### Task 3: Content collections med Zod-skemaer

**Files:**
- Create: `src/content.config.ts`
- Create: `src/lib/kategorier.ts`
- Create: `src/lib/guides.ts`
- Create: `src/content/guides/laer-at-sejle/kend-din-baad.md`
- Create: `src/content/havne/thyboroen.md`

**Interfaces:**
- Consumes: intet nyt.
- Produces:
  - Collection `guides` med frontmatter `{ title: string; description: string (≤160 tegn); kategori: 'laer-at-sejle' | 'havnemanoevrer' | 'regler'; raekkefoelge: number; svaerhedsgrad: 'begynder' | 'oevet' (default 'begynder') }`. Entry-id = `<kategori-mappe>/<filnavn-uden-.md>`, fx `laer-at-sejle/kend-din-baad`.
  - Collection `havne` med frontmatter `{ navn: string; position: { lat: number; lng: number }; dybde: string; vhf?: string; faciliteter: string[]; indsejling: string }`. Entry-id = filnavn uden `.md`, fx `thyboroen`.
  - `KATEGORIER: Record<Kategori, { titel: string; emoji: string; beskrivelse: string }>` og `type Kategori` fra `src/lib/kategorier.ts`.
  - `guideSlug(guide): string` og `guideUrl(guide): string` fra `src/lib/guides.ts`.

- [ ] **Step 1: Skriv `src/content.config.ts`**

```ts
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

export const collections = { guides, havne };
```

- [ ] **Step 2: Skriv `src/lib/kategorier.ts`**

```ts
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
```

- [ ] **Step 3: Skriv `src/lib/guides.ts`**

```ts
import type { CollectionEntry } from 'astro:content';

export function guideSlug(guide: CollectionEntry<'guides'>): string {
  const sidsteDel = guide.id.split('/').pop();
  if (!sidsteDel) throw new Error(`Ugyldigt guide-id: ${guide.id}`);
  return sidsteDel;
}

export function guideUrl(guide: CollectionEntry<'guides'>): string {
  return `/${guide.data.kategori}/${guideSlug(guide)}/`;
}
```

- [ ] **Step 4: Skriv `src/content/guides/laer-at-sejle/kend-din-baad.md` (udbygges i Task 9)**

```markdown
---
title: "Kend din båd — terminologi og udstyr"
description: "Lær de vigtigste ord og dele på en motorbåd at kende, før du sejler ud første gang."
kategori: "laer-at-sejle"
raekkefoelge: 1
svaerhedsgrad: "begynder"
---

Før du overhovedet starter motoren, er det en god idé at kende din båd. Når du ved, hvad tingene hedder, bliver alt andet nemmere — både når du læser guides, og når nogen på kajen råber "tag springet!".

*Denne guide udbygges.*
```

- [ ] **Step 5: Skriv `src/content/havne/thyboroen.md` (udbygges i Task 12)**

```markdown
---
navn: "Thyborøn"
position: { lat: 56.699, lng: 8.214 }
dybde: "ca. 4 m (verificér)"
faciliteter: ["Gæstepladser", "Strøm og vand", "Toilet og bad", "Brændstof"]
indsejling: "Indsejling fra Thyborøn Kanal — følg det afmærkede løb. (verificér)"
---

Thyborøn er porten til Limfjorden fra Nordsøen. *Denne side udbygges.*
```

- [ ] **Step 6: Verificér at skemaet HÅNDHÆVES (negativ test)**

Opret midlertidig fil `src/content/guides/regler/test-ugyldig.md` med bevidst manglende `description`:

```markdown
---
title: "Ugyldig testguide"
kategori: "regler"
raekkefoelge: 99
---

Denne fil skal få buildet til at fejle.
```

Kør: `npm run build` — Forventet: **FEJLER** med Zod-fejl om manglende `description` for `test-ugyldig`.
Slet derefter filen `src/content/guides/regler/test-ugyldig.md`.

- [ ] **Step 7: Verificér at gyldigt indhold bygger**

Kør: `npm run check` — Forventet: 0 errors.
Kør: `npm run build` — Forventet: uden fejl.

- [ ] **Step 8: Commit**

```bash
git add src/
git commit -m "feat: tilfoej content collections med Zod-skemaer for guides og havne"
```

---

### Task 4: Sektions- og guidesider

**Files:**
- Create: `src/pages/[kategori]/index.astro`
- Create: `src/pages/[kategori]/[slug].astro`

**Interfaces:**
- Consumes: `BaseLayout` (Task 2); `KATEGORIER`, `Kategori`, `guideSlug`, `guideUrl` og collections (Task 3).
- Produces: URL-mønstrene `/{kategori}/` og `/{kategori}/{slug}/` for alle guides. Regel-guides får automatisk en advarselsboks.

- [ ] **Step 1: Skriv `src/pages/[kategori]/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import { KATEGORIER, type Kategori } from '../../lib/kategorier';
import { guideUrl } from '../../lib/guides';

export function getStaticPaths() {
  return (Object.keys(KATEGORIER) as Kategori[]).map((kategori) => ({ params: { kategori } }));
}

const kategori = Astro.params.kategori as Kategori;
const info = KATEGORIER[kategori];
const guides = (await getCollection('guides', ({ data }) => data.kategori === kategori))
  .sort((a, b) => a.data.raekkefoelge - b.data.raekkefoelge);
---
<BaseLayout title={info.titel} description={info.beskrivelse}>
  <h1 class="text-3xl font-extrabold">{info.emoji} {info.titel}</h1>
  <p class="mt-2 text-slate-600 dark:text-slate-300">{info.beskrivelse}</p>
  <ol class="mt-8 space-y-3">
    {guides.map((guide) => (
      <li>
        <a href={guideUrl(guide)}
          class="flex items-start gap-4 rounded-xl border border-fjord-100 p-4 transition hover:border-fjord-500 dark:border-slate-700 dark:hover:border-fjord-200">
          <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-fjord-100 font-bold text-fjord-700 dark:bg-slate-800 dark:text-fjord-200">
            {guide.data.raekkefoelge}
          </span>
          <span>
            <span class="font-semibold">{guide.data.title}</span>
            <span class="mt-1 block text-sm text-slate-600 dark:text-slate-400">{guide.data.description}</span>
          </span>
        </a>
      </li>
    ))}
  </ol>
</BaseLayout>
```

- [ ] **Step 2: Skriv `src/pages/[kategori]/[slug].astro`**

```astro
---
import { getCollection, render } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import { KATEGORIER } from '../../lib/kategorier';
import { guideSlug, guideUrl } from '../../lib/guides';

export async function getStaticPaths() {
  const guides = await getCollection('guides');
  return guides.map((guide) => ({
    params: { kategori: guide.data.kategori, slug: guideSlug(guide) },
    props: { guide },
  }));
}

const { guide } = Astro.props;
const { Content } = await render(guide);
const info = KATEGORIER[guide.data.kategori];
const soeskende = (await getCollection('guides', ({ data }) => data.kategori === guide.data.kategori))
  .sort((a, b) => a.data.raekkefoelge - b.data.raekkefoelge);
const index = soeskende.findIndex((g) => g.id === guide.id);
const forrige = index > 0 ? soeskende[index - 1] : undefined;
const naeste = index < soeskende.length - 1 ? soeskende[index + 1] : undefined;
---
<BaseLayout title={guide.data.title} description={guide.data.description}>
  <nav class="text-sm" aria-label="Brødkrumme">
    <a href={`/${guide.data.kategori}/`} class="text-fjord-600 hover:underline dark:text-fjord-200">
      ← {info.emoji} {info.titel}
    </a>
  </nav>
  {guide.data.kategori === 'regler' && (
    <div class="mt-4 rounded-xl border border-rav-500/40 bg-rav-100 p-4 text-sm dark:bg-slate-800">
      ⚠️ Denne side er en vejledning. Søfartsstyrelsens officielle regler gælder altid — tjek de gældende bestemmelser, før du sejler.
    </div>
  )}
  <article class="prose prose-slate mt-6 max-w-none dark:prose-invert">
    <h1>{guide.data.title}</h1>
    <Content />
  </article>
  <nav class="mt-10 flex justify-between gap-4 text-sm" aria-label="Næste og forrige guide">
    {forrige
      ? <a href={guideUrl(forrige)} class="text-fjord-600 hover:underline dark:text-fjord-200">← {forrige.data.title}</a>
      : <span />}
    {naeste
      ? <a href={guideUrl(naeste)} class="text-right text-fjord-600 hover:underline dark:text-fjord-200">{naeste.data.title} →</a>
      : <span />}
  </nav>
</BaseLayout>
```

- [ ] **Step 3: Verificér**

Kør: `npm run check` — Forventet: 0 errors.
Kør: `npm run build` — Forventet: uden fejl.
Kør: `ls dist/laer-at-sejle/kend-din-baad/index.html dist/laer-at-sejle/index.html dist/havnemanoevrer/index.html dist/regler/index.html` — Forventet: alle 4 filer findes.

- [ ] **Step 4: Commit**

```bash
git add src/
git commit -m "feat: tilfoej sektions- og guidesider med laeringssti-navigation"
```

---

### Task 5: Havneoversigt og havnesider

**Files:**
- Create: `src/pages/havne/index.astro`
- Create: `src/pages/havne/[id].astro`

**Interfaces:**
- Consumes: `BaseLayout` (Task 2); collection `havne` (Task 3).
- Produces: `/havne/` (oversigt sorteret vest→øst efter `position.lng`) og `/havne/{id}/`.

- [ ] **Step 1: Skriv `src/pages/havne/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

const havne = (await getCollection('havne'))
  .sort((a, b) => a.data.position.lng - b.data.position.lng);
---
<BaseLayout title="Havne" description="Havneguide til Limfjorden — dybder, faciliteter og indsejlingsforhold for gæstesejlere.">
  <h1 class="text-3xl font-extrabold">🏘️ Havne i Limfjorden</h1>
  <p class="mt-2 text-slate-600 dark:text-slate-300">Sorteret fra vest mod øst — fra Thyborøn til Aalborg.</p>
  <div class="mt-8 grid gap-4 sm:grid-cols-2">
    {havne.map((havn) => (
      <a href={`/havne/${havn.id}/`}
        class="rounded-2xl border border-fjord-100 p-5 transition hover:border-fjord-500 dark:border-slate-700 dark:hover:border-fjord-200">
        <h2 class="font-bold">{havn.data.navn}</h2>
        <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">Dybde: {havn.data.dybde}</p>
        <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">{havn.data.faciliteter.slice(0, 3).join(' · ')}</p>
      </a>
    ))}
  </div>
</BaseLayout>
```

- [ ] **Step 2: Skriv `src/pages/havne/[id].astro`**

```astro
---
import { getCollection, render } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

export async function getStaticPaths() {
  const havne = await getCollection('havne');
  return havne.map((havn) => ({ params: { id: havn.id }, props: { havn } }));
}

const { havn } = Astro.props;
const { Content } = await render(havn);
const { navn, position, dybde, vhf, faciliteter, indsejling } = havn.data;
const kortUrl = `https://www.openstreetmap.org/?mlat=${position.lat}&mlon=${position.lng}#map=15/${position.lat}/${position.lng}`;
---
<BaseLayout title={`${navn} Havn`} description={`Havneinfo for ${navn}: dybde, faciliteter og indsejlingsforhold.`}>
  <a href="/havne/" class="text-sm text-fjord-600 hover:underline dark:text-fjord-200">← Alle havne</a>
  <h1 class="mt-2 text-3xl font-extrabold">{navn}</h1>
  <div class="mt-6 grid gap-4 sm:grid-cols-2">
    <div class="rounded-xl bg-fjord-100 p-4 dark:bg-slate-800">
      <h2 class="font-bold">Fakta</h2>
      <dl class="mt-2 space-y-1 text-sm">
        <div><dt class="inline font-semibold">Dybde:</dt> <dd class="inline">{dybde}</dd></div>
        {vhf && <div><dt class="inline font-semibold">VHF:</dt> <dd class="inline">{vhf}</dd></div>}
        <div>
          <dt class="inline font-semibold">Position:</dt>
          <dd class="inline">{position.lat.toFixed(3)}° N, {position.lng.toFixed(3)}° Ø — <a class="underline" href={kortUrl} rel="noopener">se kort</a></dd>
        </div>
      </dl>
    </div>
    <div class="rounded-xl bg-fjord-100 p-4 dark:bg-slate-800">
      <h2 class="font-bold">Faciliteter</h2>
      <ul class="mt-2 list-inside list-disc text-sm">
        {faciliteter.map((f) => <li>{f}</li>)}
      </ul>
    </div>
  </div>
  <div class="mt-6 rounded-xl border border-fjord-200 p-4 dark:border-slate-700">
    <h2 class="font-bold">Indsejling</h2>
    <p class="mt-2 text-sm">{indsejling}</p>
  </div>
  <article class="prose prose-slate mt-8 max-w-none dark:prose-invert">
    <Content />
  </article>
</BaseLayout>
```

- [ ] **Step 3: Verificér**

Kør: `npm run check` — Forventet: 0 errors.
Kør: `npm run build` — Forventet: uden fejl.
Kør: `ls dist/havne/index.html dist/havne/thyboroen/index.html` — Forventet: begge findes.

- [ ] **Step 4: Commit**

```bash
git add src/
git commit -m "feat: tilfoej havneoversigt og havnesider med faktabokse"
```

---

### Task 6: Forside, Om-side og 404

**Files:**
- Modify: `src/pages/index.astro` (fuld erstatning)
- Create: `src/pages/om.astro`
- Create: `src/pages/404.astro`

**Interfaces:**
- Consumes: `BaseLayout` (Task 2); `KATEGORIER` (Task 3); `guideUrl` (Task 3); collection `guides`.
- Produces: færdig forside med hero, 4 områdekort og fremhævet guide; `/om/` med ansvarsfraskrivelse; 404-side.

- [ ] **Step 1: Erstat `src/pages/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';
import { KATEGORIER } from '../lib/kategorier';
import { guideUrl } from '../lib/guides';

const guides = await getCollection('guides');
const fremhaevet = guides.find((g) => g.id === 'havnemanoevrer/laegge-til-i-sidevind')
  ?? [...guides].sort((a, b) => a.data.raekkefoelge - b.data.raekkefoelge)[0];

const omraader = [
  ...Object.entries(KATEGORIER).map(([slug, info]) => ({ href: `/${slug}/`, ...info })),
  {
    href: '/havne/',
    titel: 'Havne',
    emoji: '🏘️',
    beskrivelse: 'Havneguide til Limfjorden — dybder, faciliteter og indsejling.',
  },
];
---
<BaseLayout title="Forside" description="Guides, havnemanøvrer, regler og havneinfo for nye motorbådssejlere i Limfjorden.">
  <section class="rounded-3xl bg-gradient-to-b from-fjord-100 to-fjord-50 px-6 py-14 text-center dark:from-slate-800 dark:to-slate-900">
    <h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl">Lær at sejle motorbåd — og kom sikkert til kaj 🌊</h1>
    <p class="mx-auto mt-4 max-w-xl text-slate-600 dark:text-slate-300">
      Guides, havnemanøvrer, regler og havneinfo for nye motorbådssejlere i Limfjorden.
    </p>
    <a href="/laer-at-sejle/" class="mt-6 inline-block rounded-full bg-fjord-600 px-6 py-2.5 font-semibold text-white hover:bg-fjord-700">
      Kom i gang →
    </a>
  </section>
  <section class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Indholdsområder">
    {omraader.map((omraade) => (
      <a href={omraade.href}
        class="rounded-2xl border border-fjord-100 p-5 transition hover:border-fjord-500 dark:border-slate-700 dark:hover:border-fjord-200">
        <span class="text-2xl">{omraade.emoji}</span>
        <h2 class="mt-2 font-bold">{omraade.titel}</h2>
        <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">{omraade.beskrivelse}</p>
      </a>
    ))}
  </section>
  {fremhaevet && (
    <section class="mt-10 rounded-2xl bg-rav-100 p-6 dark:bg-slate-800">
      <span class="text-xs font-bold uppercase tracking-wide text-rav-600">Fremhævet guide</span>
      <h2 class="mt-1 text-xl font-bold">
        <a href={guideUrl(fremhaevet)} class="hover:underline">{fremhaevet.data.title}</a>
      </h2>
      <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">{fremhaevet.data.description}</p>
    </section>
  )}
</BaseLayout>
```

- [ ] **Step 2: Skriv `src/pages/om.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="Om Til Kaj" description="Om Til Kaj — hvem sitet er til, og hvad du må bruge det til.">
  <article class="prose prose-slate max-w-none dark:prose-invert">
    <h1>Om Til Kaj</h1>
    <p>
      Til Kaj er et gratis opslagsværk for nye motorbådssejlere — med særligt fokus på Limfjorden.
      Vi samler det, man har brug for som begynder: hvordan man lærer at sejle, hvordan man lægger
      til uden sved på panden, hvilke regler der gælder, og hvad man kan forvente i fjordens havne.
    </p>
    <h2>Ansvarsfraskrivelse</h2>
    <p>
      Indholdet på Til Kaj er vejledende og kan indeholde fejl eller forældede oplysninger.
      Det erstatter ikke officielle kilder, søkort, sejladsudmeldinger eller undervisning.
      Du sejler altid på eget ansvar.
    </p>
    <ul>
      <li>Gældende regler: <a href="https://www.soefartsstyrelsen.dk" rel="noopener">Søfartsstyrelsen</a></li>
      <li>Vejret: <a href="https://www.dmi.dk" rel="noopener">DMI</a></li>
      <li>Havnedybder og forhold ændrer sig — kontakt altid havnen, hvis du er i tvivl.</li>
    </ul>
    <h2>Fandt du en fejl?</h2>
    <p>Sitet er under løbende udvikling. Ris, ros og rettelser er meget velkomne.</p>
  </article>
</BaseLayout>
```

- [ ] **Step 3: Skriv `src/pages/404.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="Siden findes ikke" description="Siden blev ikke fundet.">
  <div class="py-16 text-center">
    <p class="text-6xl">🧭</p>
    <h1 class="mt-4 text-3xl font-extrabold">Du er sejlet forkert</h1>
    <p class="mt-2 text-slate-600 dark:text-slate-300">Siden findes ikke — men kursen kan rettes op.</p>
    <a href="/" class="mt-6 inline-block rounded-full bg-fjord-600 px-6 py-2.5 font-semibold text-white hover:bg-fjord-700">
      Tilbage til forsiden
    </a>
  </div>
</BaseLayout>
```

- [ ] **Step 4: Verificér**

Kør: `npm run check` — Forventet: 0 errors.
Kør: `npm run build` — Forventet: uden fejl.
Kør: `ls dist/om/index.html dist/404.html` — Forventet: begge findes.
Kør: `grep -c "Fremhævet guide" dist/index.html` — Forventet: mindst 1.

- [ ] **Step 5: Commit**

```bash
git add src/
git commit -m "feat: tilfoej forside med hero, om-side med ansvarsfraskrivelse og 404"
```

---

### Task 7: SEO — sitemap, robots.txt og canonical

**Files:**
- Modify: `astro.config.mjs`
- Modify: `src/layouts/BaseLayout.astro`
- Create: `public/robots.txt`

**Interfaces:**
- Consumes: `astro.config.mjs` og `BaseLayout` fra tidligere tasks.
- Produces: `dist/sitemap-index.xml`, robots.txt, canonical-link og `og:url` på alle sider.

- [ ] **Step 1: Tilføj sitemap-integration i `astro.config.mjs`**

```js
// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://tilkaj.dk',
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});
```

- [ ] **Step 2: Tilføj canonical og og:url i `BaseLayout.astro`**

I `<head>`, lige efter `<meta name="description" ...>`-linjen, indsæt:

```astro
    <link rel="canonical" href={new URL(Astro.url.pathname, Astro.site)} />
    <meta property="og:url" content={new URL(Astro.url.pathname, Astro.site)} />
    <link rel="sitemap" href="/sitemap-index.xml" />
```

- [ ] **Step 3: Skriv `public/robots.txt`**

```
User-agent: *
Allow: /

Sitemap: https://tilkaj.dk/sitemap-index.xml
```

- [ ] **Step 4: Verificér**

Kør: `npm run build` — Forventet: uden fejl.
Kør: `ls dist/sitemap-index.xml dist/robots.txt` — Forventet: begge findes.
Kør: `grep -c "canonical" dist/index.html` — Forventet: mindst 1.

- [ ] **Step 5: Commit**

```bash
git add astro.config.mjs src/ public/
git commit -m "feat: tilfoej sitemap, robots.txt og canonical-links"
```

---

### Task 8: SVG-diagrambibliotek til havnemanøvrer

**Files:**
- Create: `src/assets/diagrammer/langs-kaj.svg`
- Create: `src/assets/diagrammer/sidevind-paa-kaj.svg`
- Create: `src/assets/diagrammer/bakke-i-baas.svg`
- Create: `src/assets/diagrammer/spring-fortoejning.svg`

**Interfaces:**
- Consumes: intet.
- Produces: 4 SVG-filer, der refereres fra markdown-guides i Task 10 med relative stier: `../../../assets/diagrammer/<navn>.svg`.

Fælles visuelt sprog (gælder alle 4): vand `#e8f6fa`, kaj `#94a3b8` med teksten "KAJ", båd som teal (`#0e7490`) top-view med lys prik i agterenden, kurs som stiplet teal-linje med rav-pil (`#f59e0b`), vind som rav-pile, tekstlabels `#0f3b4c` 14px fed. Båd-symbolets stævn peger mod +x; `rotate(0)` = stævn mod højre.

- [ ] **Step 1: Skriv `src/assets/diagrammer/langs-kaj.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" font-family="system-ui, sans-serif" role="img" aria-label="Anløb langs kaj i tre trin: skråt ind, sæt farten ned, ret op og glid ind">
  <defs>
    <g id="baad">
      <path d="M -35 -13 L 15 -13 Q 38 0 15 13 L -35 13 Q -42 0 -35 -13 Z" fill="#0e7490"/>
      <circle cx="-18" cy="0" r="4" fill="#e0f2f7"/>
    </g>
    <marker id="pil" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 Z" fill="#f59e0b"/>
    </marker>
  </defs>
  <rect width="600" height="400" fill="#e8f6fa"/>
  <rect y="330" width="600" height="70" fill="#94a3b8"/>
  <text x="16" y="372" fill="#334155" font-size="15" font-weight="700">KAJ</text>
  <path d="M 150 130 Q 300 210 430 296" fill="none" stroke="#0e7490" stroke-width="2.5" stroke-dasharray="7 7" marker-end="url(#pil)"/>
  <use href="#baad" transform="translate(120 112) rotate(33)" opacity="0.35"/>
  <use href="#baad" transform="translate(285 205) rotate(28)" opacity="0.6"/>
  <use href="#baad" transform="translate(470 302) rotate(2)"/>
  <g fill="#0f3b4c" font-size="14" font-weight="700">
    <text x="30" y="70">1. Styr mod kajen i ca. 30 grader</text>
    <text x="220" y="165">2. Sæt farten ned — kun styrefart</text>
    <text x="300" y="255">3. Ret op, og lad båden glide ind</text>
  </g>
</svg>
```

- [ ] **Step 2: Skriv `src/assets/diagrammer/sidevind-paa-kaj.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" font-family="system-ui, sans-serif" role="img" aria-label="Anløb med pålandsvind: stop parallelt med kajen og lad vinden skubbe båden ind">
  <defs>
    <g id="baad">
      <path d="M -35 -13 L 15 -13 Q 38 0 15 13 L -35 13 Q -42 0 -35 -13 Z" fill="#0e7490"/>
      <circle cx="-18" cy="0" r="4" fill="#e0f2f7"/>
    </g>
    <marker id="pil" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 Z" fill="#f59e0b"/>
    </marker>
  </defs>
  <rect width="600" height="400" fill="#e8f6fa"/>
  <rect y="330" width="600" height="70" fill="#94a3b8"/>
  <text x="16" y="372" fill="#334155" font-size="15" font-weight="700">KAJ</text>
  <g stroke="#f59e0b" stroke-width="3" marker-end="url(#pil)">
    <line x1="90" y1="30" x2="90" y2="85"/>
    <line x1="170" y1="30" x2="170" y2="85"/>
    <line x1="250" y1="30" x2="250" y2="85"/>
  </g>
  <text x="75" y="112" fill="#b45309" font-size="14" font-weight="700">VIND</text>
  <path d="M 430 190 L 430 270" fill="none" stroke="#0e7490" stroke-width="2.5" stroke-dasharray="7 7" marker-end="url(#pil)"/>
  <use href="#baad" transform="translate(430 165) rotate(0)" opacity="0.5"/>
  <use href="#baad" transform="translate(430 300) rotate(0)"/>
  <g fill="#0f3b4c" font-size="14" font-weight="700">
    <text x="330" y="140">1. Stop op parallelt, 1–2 meter fra kaj</text>
    <text x="130" y="240">2. Lad vinden skubbe båden blidt ind</text>
  </g>
</svg>
```

- [ ] **Step 3: Skriv `src/assets/diagrammer/bakke-i-baas.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" font-family="system-ui, sans-serif" role="img" aria-label="Bakke ind i bås i tre trin: kør forbi båsen, drej agterenden mod båsen, bak langsomt ind">
  <defs>
    <g id="baad">
      <path d="M -35 -13 L 15 -13 Q 38 0 15 13 L -35 13 Q -42 0 -35 -13 Z" fill="#0e7490"/>
      <circle cx="-18" cy="0" r="4" fill="#e0f2f7"/>
    </g>
    <marker id="pil" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 Z" fill="#f59e0b"/>
    </marker>
  </defs>
  <rect width="600" height="400" fill="#e8f6fa"/>
  <rect y="330" width="600" height="70" fill="#94a3b8"/>
  <text x="16" y="372" fill="#334155" font-size="15" font-weight="700">KAJ</text>
  <rect x="262" y="240" width="10" height="90" fill="#64748b"/>
  <rect x="368" y="240" width="10" height="90" fill="#64748b"/>
  <text x="268" y="230" fill="#475569" font-size="12" font-weight="700">Y-BOMME</text>
  <path d="M 200 120 Q 320 120 320 200 L 320 250" fill="none" stroke="#0e7490" stroke-width="2.5" stroke-dasharray="7 7" marker-end="url(#pil)"/>
  <use href="#baad" transform="translate(150 120) rotate(0)" opacity="0.35"/>
  <use href="#baad" transform="translate(320 175) rotate(-60)" opacity="0.6"/>
  <use href="#baad" transform="translate(320 285) rotate(-90)"/>
  <g fill="#0f3b4c" font-size="14" font-weight="700">
    <text x="60" y="80">1. Kør langsomt forbi båsen</text>
    <text x="370" y="150">2. Drej agterenden mod båsen</text>
    <text x="390" y="290">3. Bak i korte skub</text>
  </g>
</svg>
```

- [ ] **Step 4: Skriv `src/assets/diagrammer/spring-fortoejning.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" font-family="system-ui, sans-serif" role="img" aria-label="Fortøjning langs kaj med fire trosser: fortrosse, agtertrosse, forspring og agterspring">
  <defs>
    <g id="baad">
      <path d="M -70 -22 L 30 -22 Q 76 0 30 22 L -70 22 Q -84 0 -70 -22 Z" fill="#0e7490"/>
      <circle cx="-40" cy="0" r="6" fill="#e0f2f7"/>
    </g>
  </defs>
  <rect width="600" height="400" fill="#e8f6fa"/>
  <rect y="300" width="600" height="100" fill="#94a3b8"/>
  <text x="16" y="360" fill="#334155" font-size="15" font-weight="700">KAJ</text>
  <g fill="#334155">
    <circle cx="90" cy="308" r="7"/>
    <circle cx="230" cy="308" r="7"/>
    <circle cx="370" cy="308" r="7"/>
    <circle cx="510" cy="308" r="7"/>
  </g>
  <use href="#baad" transform="translate(300 240) rotate(0)"/>
  <g stroke="#0f3b4c" stroke-width="2.5" fill="none">
    <path d="M 372 236 L 510 306"/>
    <path d="M 228 236 L 90 306"/>
    <path d="M 360 250 L 230 306"/>
    <path d="M 240 250 L 370 306"/>
  </g>
  <g fill="#0f3b4c" font-size="13" font-weight="700">
    <text x="455" y="262">Fortrosse</text>
    <text x="95" y="262">Agtertrosse</text>
    <text x="255" y="292">Forspring</text>
    <text x="300" y="272">Agterspring</text>
  </g>
  <text x="150" y="60" fill="#0f3b4c" font-size="14" font-weight="700">Spring hindrer båden i at glide frem og tilbage</text>
</svg>
```

- [ ] **Step 5: Verificér**

Kør: `npm run build` — Forventet: uden fejl (SVG'erne bruges først i Task 10, men må ikke ødelægge buildet).
Åbn evt. filerne i browser og tjek visuelt, at kaj, båd og pile står rigtigt.

- [ ] **Step 6: Commit**

```bash
git add src/assets/
git commit -m "feat: tilfoej SVG-diagrammer for havnemanoevrer"
```

---

### Task 9: Indhold — Lær at sejle (7 guides)

**Files:**
- Modify: `src/content/guides/laer-at-sejle/kend-din-baad.md` (udbyg til fuld guide)
- Create: `src/content/guides/laer-at-sejle/foer-du-sejler-ud.md`
- Create: `src/content/guides/laer-at-sejle/motorlaere-for-begyndere.md`
- Create: `src/content/guides/laer-at-sejle/grundlaeggende-manoevrering.md`
- Create: `src/content/guides/laer-at-sejle/fart-trim-og-braendstof.md`
- Create: `src/content/guides/laer-at-sejle/vejr-vind-og-boelger.md`
- Create: `src/content/guides/laer-at-sejle/sikkerhed-om-bord.md`

**Interfaces:**
- Consumes: guides-skemaet fra Task 3 (`kategori: "laer-at-sejle"`, `raekkefoelge` 1–7).
- Produces: 7 komplette guides, der vises som læringssti på `/laer-at-sejle/`.

Alle guides følger Global Constraints (dansk, du-form, 700–1200 ord, afslut med `> **Husk:** …`). Brug markdown-overskrifter `##` og `###` (h1 kommer fra skabelonen). Frontmatter angivet pr. fil herunder; skriv brødteksten ud fra dispositionen.

- [ ] **Step 1: Udbyg `kend-din-baad.md`** (`raekkefoelge: 1` — behold eksisterende frontmatter)

Disposition: skrog og retninger (stævn, agter, bagbord/styrbord — husk huskereglen "styrbord har flest bogstaver, ligesom højre"); fribord, fender, klampe, pullert; styrepult (rat, gashåndtag, gear, dødemandsknap); motortyper kort (påhængsmotor vs. indenbords, benzin/diesel); propel og ror; det faste udstyr (anker, trosser, bådshage, lænsepumpe); lille ordliste til sidst som tabel.

- [ ] **Step 2: Skriv `foer-du-sejler-ud.md`** (`raekkefoelge: 2`)

```yaml
title: "Før du sejler ud — tjekliste og klargøring"
description: "Den faste rutine før hver tur: vejr, brændstof, sikkerhedsudstyr og en plan, der holder."
kategori: "laer-at-sejle"
raekkefoelge: 2
svaerhedsgrad: "begynder"
```

Disposition: tjek vejrudsigten (DMI, vindstyrke i m/s — hvad er for meget for en begynder: over 8 m/s = bliv hjemme); brændstof (tommelfingerregel: 1/3 ud, 1/3 hjem, 1/3 reserve); tjek motor (olie, kølevand, brændstofslange, primer); sikkerhedsudstyr om bord (veste til alle, lænsepumpe/øse, anker, årer/pagaj, ildslukker); fortæl nogen hvor du sejler hen og hvornår du er tilbage; mobil i vandtæt pose + evt. VHF; punktopstillet tjekliste til sidst, der kan skærmdumpes.

- [ ] **Step 3: Skriv `motorlaere-for-begyndere.md`** (`raekkefoelge: 3`)

```yaml
title: "Motorlære for begyndere"
description: "Start motoren rigtigt, hold øje med kølevandet, og undgå de klassiske motorfejl på vandet."
kategori: "laer-at-sejle"
raekkefoelge: 3
svaerhedsgrad: "begynder"
```

Disposition: før start (benzinhane, primer-bold, choker, dødemandssnor PÅ); startprocedure trin for trin; kontrolstrålen/kølevand — kig efter den MED DET SAMME; tomgang og opvarmning; gearskift (altid i tomgang over gear, bestemt bevægelse); hvis motoren dør: tjekliste (brændstof, luft, dødemandssnor, tilstoppet indtag); vinterens fjende: gammel benzin; hvornår du skal ringe efter hjælp.

- [ ] **Step 4: Skriv `grundlaeggende-manoevrering.md`** (`raekkefoelge: 4`)

```yaml
title: "Grundlæggende manøvrering"
description: "Gas, styring og propellens finurligheder — forstå hvordan båden faktisk flytter sig."
kategori: "laer-at-sejle"
raekkefoelge: 4
svaerhedsgrad: "begynder"
```

Disposition: en båd har ingen bremser — planlæg fremad; styring kræver fart gennem vandet (styrefart); ratudslag virker modsat i bak; propelvirkning/hjuleffekt (agterenden trækker til én side i bak — find ud af hvilken side DIN båd trækker); vindens effekt på fribord og bov; øvelser på åbent vand: sejl 8-taller, stop på et punkt, bak i lige linje; lav øvelserne FØR du skal bruge dem i havn.

- [ ] **Step 5: Skriv `fart-trim-og-braendstof.md`** (`raekkefoelge: 5`)

```yaml
title: "Fart, trim og brændstoføkonomi"
description: "Kom i plan, trim motoren rigtigt, og få flere sømil på tanken."
kategori: "laer-at-sejle"
raekkefoelge: 5
svaerhedsgrad: "begynder"
```

Disposition: deplacement vs. plan — hvad sker der ved "pukkelfarten"; trim af motor/trimklapper (næsen ned i acceleration, op i plan); hvordan forkert trim føles (pløjer eller hopper); brændstofforbrug: den dyre mellemfart, økonomisk marchfart; kølvand og hensyn (dit kølvand er andres bølger — fartgrænser og god stil); læs båden: lyt til motoren.

- [ ] **Step 6: Skriv `vejr-vind-og-boelger.md`** (`raekkefoelge: 6`)

```yaml
title: "Vejr, vind og bølger i Limfjorden"
description: "Sådan læser du vejrudsigten som sejler — og forstår hvorfor Limfjorden kan være krap."
kategori: "laer-at-sejle"
raekkefoelge: 6
svaerhedsgrad: "begynder"
```

Disposition: vindstyrker i m/s og hvad de betyder for en lille motorbåd (tabel: 0–5 fint, 5–8 øvet, 8+ bliv i havn); Limfjordens særpræg: lavvandet fjord giver korte, krappe bølger — værre end samme vind på dybt vand; frit stræk (fetch): vestenvind over Løgstør Bredning vs. læ bag Mors; bølger mod strøm/mod vind; hvor du finder varsler (DMI, farvandsudsigter); tommelfingerregel: kan du se hvide toppe, så tænk dig om; hvad du gør, hvis du bliver fanget i det (sæt farten ned, tag bølgerne skråt, søg læ).

- [ ] **Step 7: Skriv `sikkerhed-om-bord.md`** (`raekkefoelge: 7`)

```yaml
title: "Sikkerhed om bord"
description: "Redningsveste, mand-over-bord og kommunikation — det, der skal sidde på rygraden."
kategori: "laer-at-sejle"
raekkefoelge: 7
svaerhedsgrad: "begynder"
```

Disposition: redningsvest på ALLE, hele tiden (lovkrav om at veste er om bord; anbefaling: hav den PÅ); vesttyper kort; dødemandssnor når du sejler alene eller står ved rat; mand-over-bord trin for trin (råb, peg, kast, vend tilbage MOD vinden, motor i frigear ved bjærgning — propellen er livsfarlig); kulde i vandet: chokreaktion, hvor hurtigt kræfterne forsvinder; kommunikation: mobil i vandtæt pose, VHF kanal 16, 112-appen; alkohol og sejlads (promillegrænse 0,50 for hurtige både/vandscooter — verificér gældende regler); øv det i godt vejr.

- [ ] **Step 8: Verificér**

Kør: `npm run check` — Forventet: 0 errors.
Kør: `npm run build` — Forventet: uden fejl.
Kør: `ls dist/laer-at-sejle` — Forventet: mapper for alle 7 slugs.
Gennemlæs hver guide for ortografi (æ/ø/å intakt), du-form og at hver slutter med `> **Husk:**`.

- [ ] **Step 9: Commit**

```bash
git add src/content/guides/laer-at-sejle/
git commit -m "feat: tilfoej alle 7 laer-at-sejle-guides"
```

---

### Task 10: Indhold — Havnemanøvrer (7 guides med diagrammer)

**Files:**
- Create: `src/content/guides/havnemanoevrer/vind-og-stroem-i-havnen.md`
- Create: `src/content/guides/havnemanoevrer/laegge-til-langs-kaj.md`
- Create: `src/content/guides/havnemanoevrer/laegge-til-i-sidevind.md`
- Create: `src/content/guides/havnemanoevrer/bakke-ind-i-baas.md`
- Create: `src/content/guides/havnemanoevrer/paele-og-y-bomme.md`
- Create: `src/content/guides/havnemanoevrer/fortoejning-og-knob.md`
- Create: `src/content/guides/havnemanoevrer/afgang-fra-kaj.md`

**Interfaces:**
- Consumes: guides-skemaet (Task 3); SVG-diagrammer (Task 8) via relativ sti `../../../assets/diagrammer/<navn>.svg`.
- Produces: 7 guides på `/havnemanoevrer/`; `laegge-til-i-sidevind` er forsidens fremhævede guide (Task 6 slår den op på id `havnemanoevrer/laegge-til-i-sidevind` — filnavnet SKAL være præcis `laegge-til-i-sidevind.md`).

Samme indholdsregler som Task 9. Diagram indsættes i markdown sådan (eksempel):

```markdown
![Diagram: anløb langs kaj i tre trin](../../../assets/diagrammer/langs-kaj.svg)
```

- [ ] **Step 1: Skriv `vind-og-stroem-i-havnen.md`** (`raekkefoelge: 1`)

```yaml
title: "Vind og strøm i havnen"
description: "Lær at aflæse vind og strøm, før du lægger til — det er 80 % af en god havnemanøvre."
kategori: "havnemanoevrer"
raekkefoelge: 1
svaerhedsgrad: "begynder"
```

Disposition: reglen nummer ét: stop op UDEN FOR havnen og læg en plan; aflæs vinden (flag, vimpler, krusninger, andre bådes vindfang); pålandsvind/fralandsvind ved kajpladsen — hvad gør det ved DIN manøvre; strøm i Limfjorden (den skifter med vinden mere end med tidevand — især i Aalborg-snævringen og ved Oddesund, verificér); brug vinden som ven: læg altid til MOD vind/strøm når muligt; hellere en ekstra runde i havnebassinet end en flov mavelanding; lav en plan B før du starter manøvren.

- [ ] **Step 2: Skriv `laegge-til-langs-kaj.md`** (`raekkefoelge: 2`)

```yaml
title: "Lægge til langs kaj — trin for trin"
description: "Standardmanøvren enhver motorbådssejler skal kunne: roligt anløb i en flad vinkel."
kategori: "havnemanoevrer"
raekkefoelge: 2
svaerhedsgrad: "begynder"
```

Disposition: klargøring (fendere ud i kajhøjde, trosser klar for og agter, besætning briefet — INGEN arme/ben mellem båd og kaj); indsæt diagram `langs-kaj.svg`; trin 1: anløb i 20–40 grader med kun styrefart; trin 2: kort før kajen — ret op og tag farten helt af (evt. et kort skub bak); trin 3: stop båden ud for pladsen, fortøj midtskibs/agter først i vind; hvem gør hvad hvis I er to; de klassiske fejl (for meget fart, for stejl vinkel, panikgas); øvelse: gør det ved en fri kaj i stille vejr ti gange.

- [ ] **Step 3: Skriv `laegge-til-i-sidevind.md`** (`raekkefoelge: 3`)

```yaml
title: "Lægge til i sidevind og frisk vind"
description: "Pålandsvind, fralandsvind og det pludselige vindstød — sådan tæmmer du kajen, når det blæser."
kategori: "havnemanoevrer"
raekkefoelge: 3
svaerhedsgrad: "oevet"
```

Disposition: pålandsvind (vinden skubber dig mod kajen): stop parallelt 1–2 m ude og lad vinden gøre arbejdet — indsæt diagram `sidevind-paa-kaj.svg`; fralandsvind (vinden skubber dig væk): stejlere anløbsvinkel, fortøj forenden FØRST, brug motoren til at svinge agterenden ind; sidevind langs kajen: læg til mod vinden hvis muligt; hvornår vinden er for meget — kend din grænse og vælg en anden plads i læ; brug spring aktivt (motor frem mod forspring trækker agterenden ind); rolig kommunikation med gasten.

- [ ] **Step 4: Skriv `bakke-ind-i-baas.md`** (`raekkefoelge: 4`)

```yaml
title: "Bakke ind i bås"
description: "Bak i korte, kontrollerede skub — sådan rammer du båsen mellem Y-bommene hver gang."
kategori: "havnemanoevrer"
raekkefoelge: 4
svaerhedsgrad: "oevet"
```

Disposition: hvorfor bakke ind (nemmere at komme fra borde, nemmere afgang); husk propelvirkningen fra grundlæggende manøvrering — din agterende trækker til én side i bak, brug det; indsæt diagram `bakke-i-baas.svg`; trin: kør forbi båsen, drej agterenden mod båsen, bak i korte skub med pauser (i pauserne styrer båden bedre); styr med gaskontrol frem for ratutslag; fendere og fortøjning klar; hvis det går skævt: STOP, kør ud, prøv igen — ingen skam i tre forsøg.

- [ ] **Step 5: Skriv `paele-og-y-bomme.md`** (`raekkefoelge: 5`)

```yaml
title: "Pæle og Y-bomme"
description: "Fortøjning mellem pæle og ved Y-bomme — det mest almindelige gæsteplads-setup i Limfjorden."
kategori: "havnemanoevrer"
raekkefoelge: 5
svaerhedsgrad: "oevet"
```

Disposition: hvad er forskellen (agterpæle + kaj vs. Y-bomme); grøn/rød skilte på gæstepladser; anløb mellem pæle: sigt midt mellem pælene, trosse på pæl PÅ VEJ IND (øje over pælen, ikke knob), derefter forende til kaj; Y-bomme: fendere klar, gå ikke ud på bommen med fuld vægt; typiske fejl (rammer pælen med fribordet, glemmer agtertrossen og driver ind i kajen); solo-teknik: midtskibs spring først.

- [ ] **Step 6: Skriv `fortoejning-og-knob.md`** (`raekkefoelge: 6`)

```yaml
title: "Fortøjning — spring, fendere og de tre vigtigste knob"
description: "Fortøj så båden ligger stille i al slags vejr — med pælestik, klampestik og røringsknob."
kategori: "havnemanoevrer"
raekkefoelge: 6
svaerhedsgrad: "begynder"
```

Disposition: de fire trosser og hvad de gør — indsæt diagram `spring-fortoejning.svg`; fortrosse/agtertrosse holder båden ved kaj, spring hindrer langskibs bevægelse; fendere i rigtig højde; de tre knob du SKAL kunne: pælestik (bowline), klampestik (cleat hitch), rundtørn med to halvstik — beskriv trin for trin med ord (nummererede lister); elastik i fortøjningen (ryk-dæmpning); tjek fortøjningen før du forlader båden — og tænk på vandstandsændring; hvor tykke trosser til hvor stor båd (tabel med tommelfingerregler).

- [ ] **Step 7: Skriv `afgang-fra-kaj.md`** (`raekkefoelge: 7`)

```yaml
title: "Afgang fra kaj uden drama"
description: "Planlagt afgang i vind: spring, skub og rolig gas — så kommer du fri af kajen hver gang."
kategori: "havnemanoevrer"
raekkefoelge: 7
svaerhedsgrad: "begynder"
```

Disposition: afgang er en manøvre, ikke bare "kast los" — plan først; motor i gang og varm FØR du kaster los; rækkefølge på trosser (den vinden trykker på, slippes til sidst); fralandsvind: nem — vinden hjælper; pålandsvind: brug agterspring + ror mod kaj og motor frem, så svinger boven ud (beskriv trin for trin); vend propelstrøm og fenderplacering til din fordel; tjek for trafik i havnebassinet FØR afgang; fart ud af havnen (max 3 knob i de fleste havne — verificér lokalt).

- [ ] **Step 8: Verificér**

Kør: `npm run check` — Forventet: 0 errors.
Kør: `npm run build` — Forventet: uden fejl, og diagram-SVG'erne optræder i `dist/_astro/` (kør `ls dist/_astro | grep -i svg`).
Kør: `ls dist/havnemanoevrer` — Forventet: mapper for alle 7 slugs.
Kør: `grep -c "laegge-til-i-sidevind" dist/index.html` — Forventet: mindst 1 (fremhævet guide virker nu).

- [ ] **Step 9: Commit**

```bash
git add src/content/guides/havnemanoevrer/
git commit -m "feat: tilfoej alle 7 havnemanoevre-guides med diagrammer"
```

---

### Task 11: Indhold — Regler (6 guides, faktatjekkede)

**Files:**
- Create: `src/content/guides/regler/vigeregler-for-motorbaad.md`
- Create: `src/content/guides/regler/farvandsafmaerkning.md`
- Create: `src/content/guides/regler/fartgraenser-og-hensyn.md`
- Create: `src/content/guides/regler/broerne-i-limfjorden.md`
- Create: `src/content/guides/regler/beviser-og-krav.md`
- Create: `src/content/guides/regler/lanterner-og-sejlads-i-moerke.md`

**Interfaces:**
- Consumes: guides-skemaet (Task 3). Regel-advarselsboksen kommer automatisk fra skabelonen (Task 4).
- Produces: 6 guides på `/regler/`.

**KRITISK for denne task:** Alle konkrete regler, paragraffer, promillegrænser, aldersgrænser, VHF-kanaler og broåbningstider SKAL verificeres med websøgning mod officielle kilder (soefartsstyrelsen.dk, retsinformation.dk, forsvaret.dk/brovagt m.fl.), FØR de skrives ind. Hver guide afsluttes (før Husk-boksen) med afsnittet `## Kilder` med links til de anvendte officielle kilder. Er en oplysning umulig at verificere, udelades den eller formuleres som "tjek hos …".

- [ ] **Step 1: Skriv `vigeregler-for-motorbaad.md`** (`raekkefoelge: 1`)

```yaml
title: "Vigeregler for motorbåd"
description: "Hvem viger for hvem? De vigtigste søvejsregler oversat til hverdagssprog for motorbådssejlere."
kategori: "regler"
raekkefoelge: 1
svaerhedsgrad: "begynder"
```

Disposition: grundprincip: undgå kollision er vigtigere end at have ret; motorbåd viger for sejlbåd/robåd (med undtagelser); to motorbåde stævn mod stævn: begge drejer styrbord; krydsende kurs: den der har den anden om styrbord viger; overhalende viger ALTID; hold godt til styrbord i snævre løb (vigtigt i Limfjordens renders); erhvervstrafik og store skibe i sejlrenden — hold dig væk, de kan ikke stoppe; lydsignaler kort (1 kort = styrbord, 2 korte = bagbord, 5 korte = "hvad laver du?!"); praktiske Limfjords-eksempler.

- [ ] **Step 2: Skriv `farvandsafmaerkning.md`** (`raekkefoelge: 2`)

```yaml
title: "Farvandsafmærkning — bøjer og båker"
description: "Rød og grøn, kardinaler og specialafmærkning — lær at læse fjordens skilte."
kategori: "regler"
raekkefoelge: 2
svaerhedsgrad: "begynder"
```

Disposition: sideafmærkning IALA region A: rød om bagbord, grøn om styrbord NÅR du sejler MOD strømmens/afmærkningens retning (ind fra søen) — forklar hvad det betyder i Limfjorden konkret (retningen er fra Thyborøn mod Hals, verificér); huskeregler; kardinalafmærkning (nord/syd/øst/vest-kompasafmærkning omkring fare); isoleret fare, specialafmærkning (gul), badezoner; hvad gør du hvis du er i tvivl: sejl langsomt og tjek søkortet; apps og søkort (fx officielle danske søkortdata) — nævn uden at anbefale ét kommercielt produkt.

- [ ] **Step 3: Skriv `fartgraenser-og-hensyn.md`** (`raekkefoelge: 3`)

```yaml
title: "Fartgrænser og hensyn"
description: "Fartgrænser i havne og tæt på kysten — og hvorfor dit kølvand er dit ansvar."
kategori: "regler"
raekkefoelge: 3
svaerhedsgrad: "begynder"
```

Disposition: generelle regler for hastighed tæt på kyst/badende (verificér de konkrete afstands- og fartregler i bekendtgørelsen om vandscootere/hurtigfærgende fartøjer samt lokale bekendtgørelser); havnereglementer: typisk 3–5 knob i havn (verificér eksempler); dit kølvand er dit ansvar — også juridisk (skader på andre både/broer); zoner ved badestrande; lokale fartbegrænsninger i Limfjorden (verificér: fx omkring Aalborg havnefront); hvordan man finder lokale regler (havnereglement på havnens hjemmeside); bøder og ansvar.

- [ ] **Step 4: Skriv `broerne-i-limfjorden.md`** (`raekkefoelge: 4`)

```yaml
title: "Broerne i Limfjorden"
description: "Gennemsejling af Limfjordens broer: signaler, VHF-kanaler og hvordan du venter rigtigt."
kategori: "regler"
raekkefoelge: 4
svaerhedsgrad: "oevet"
```

Disposition: oversigt over broerne fra vest mod øst (Oddesundbroen, Vilsundbroen, Sallingsundbroen (fast — gennemsejlingshøjde), Aggersundbroen, Limfjordsbroen Aalborg, Jernbanebroen Aalborg — VERIFICÉR listen, højder, åbningstider og VHF-kanaler med websøgning); hvordan broåbning fungerer (signaler, VHF-opkald, faste åbningstider); ventepositioner og god stil (hold afstand, lad erhvervstrafik gå først); hvad hvis din båd kan gå UNDER broen — kend din højde inkl. antenner; gennemsejlingssignaler (rødt/grønt lys); planlæg efter broens åbningstider, ikke omvendt; link til officielle brovagt-sider under Kilder.

- [ ] **Step 5: Skriv `beviser-og-krav.md`** (`raekkefoelge: 5`)

```yaml
title: "Beviser og krav — må du overhovedet sejle den?"
description: "Speedbådskørekort, duelighedsbevis og udstyrskrav — hvad loven kræver af dig og din motorbåd."
kategori: "regler"
raekkefoelge: 5
svaerhedsgrad: "begynder"
```

Disposition: hvornår kræves speedbådskørekort (planende båd med visse motorkræfter/længdeforhold — VERIFICÉR den gældende definition og aldersgrænse hos Søfartsstyrelsen); duelighedsbevis — hvad det er, og hvornår det giver mening; vandscooterbevis (andet regelsæt); ansvarsforsikring (lovkrav for speedbåde/vandscootere — verificér) og kaskoforsikring; alkoholgrænser til søs (verificér promillegrænse og hvilke fartøjer den gælder for); udstyrskrav ombord; hvor du tager beviserne (kursusudbydere, prøver); hvad det koster cirka.

- [ ] **Step 6: Skriv `lanterner-og-sejlads-i-moerke.md`** (`raekkefoelge: 6`)

```yaml
title: "Lanterner og sejlads i mørke"
description: "Lanterneføring for små motorbåde, og hvordan du læser andres lys i mørket."
kategori: "regler"
raekkefoelge: 6
svaerhedsgrad: "oevet"
```

Disposition: hvornår skal lanterner tændes (solnedgang–solopgang og nedsat sigt); krav til motorbåd under 7 m / under 12 m (VERIFICÉR de præcise regler: sidelys, agterlys, topplys/rundtlysende hvidt); læs andre: rød+grøn mod dig = den kommer lige imod; erhvervstrafikkens lys; praktiske råd: sejl kun i mørke når du kender farvandet, skru ned for skærme (nattesyn), reflekser fra land forvirrer; medbring lygte; er din bådlanterne overhovedet godkendt.

- [ ] **Step 7: Verificér**

Kør: `npm run check` — Forventet: 0 errors.
Kør: `npm run build` — Forventet: uden fejl.
Kør: `ls dist/regler` — Forventet: mapper for alle 6 slugs.
Tjek at HVER guide har et `## Kilder`-afsnit med links: `grep -L "## Kilder" src/content/guides/regler/*.md` — Forventet: tom output.
Tjek at advarselsboksen vises: `grep -c "Søfartsstyrelsens officielle regler" dist/regler/vigeregler-for-motorbaad/index.html` — Forventet: mindst 1.

- [ ] **Step 8: Commit**

```bash
git add src/content/guides/regler/
git commit -m "feat: tilfoej alle 6 regelguides med kildehenvisninger"
```

---

### Task 12: Indhold — 10 havne (faktatjekkede)

**Files:**
- Modify: `src/content/havne/thyboroen.md` (udbyg)
- Create: `src/content/havne/lemvig.md`
- Create: `src/content/havne/struer.md`
- Create: `src/content/havne/skive.md`
- Create: `src/content/havne/glyngoere.md`
- Create: `src/content/havne/fur.md`
- Create: `src/content/havne/nykoebing-mors.md`
- Create: `src/content/havne/loegstoer.md`
- Create: `src/content/havne/nibe.md`
- Create: `src/content/havne/aalborg.md`

**Interfaces:**
- Consumes: havne-skemaet (Task 3).
- Produces: 10 komplette havnesider.

**KRITISK for denne task:** Dybder, VHF-kanaler, faciliteter og indsejlingsforhold SKAL verificeres med websøgning (havnens egen hjemmeside, kommunens havneside, sejlerguides som havneguide.dk) FØR de skrives ind. Koordinaterne herunder er cirkaværdier til at starte fra — verificér mod kort. Skriv i `indsejling`-feltet kun det væsentligste (1–3 sætninger); detaljer i brødteksten. Brødtekst pr. havn: 150–400 ord om havnen, byen, og hvad en gæstesejler skal vide (afregning/havnepenge-app, bedste pladser, indkøb, særlige forhold som strøm eller lavvande).

Cirka-positioner (verificér alle):

| Fil | navn | lat | lng |
|---|---|---|---|
| thyboroen.md | Thyborøn | 56.699 | 8.214 |
| lemvig.md | Lemvig | 56.553 | 8.311 |
| struer.md | Struer | 56.494 | 8.594 |
| skive.md | Skive | 56.573 | 9.033 |
| glyngoere.md | Glyngøre | 56.762 | 8.868 |
| fur.md | Fur | 56.805 | 8.990 |
| nykoebing-mors.md | Nykøbing Mors | 56.794 | 8.861 |
| loegstoer.md | Løgstør | 56.967 | 9.250 |
| nibe.md | Nibe | 56.982 | 9.633 |
| aalborg.md | Aalborg (Vestre Bådehavn) | 57.057 | 9.895 |

Frontmatter-skabelon (samme struktur for alle 10 — udfyld med verificerede data):

```markdown
---
navn: "Lemvig"
position: { lat: 56.553, lng: 8.311 }
dybde: "3,0 m i indsejlingen, 2,5 m ved gæstepladser"
vhf: "Kanal 12"
faciliteter: ["Gæstepladser", "Strøm og vand", "Toilet og bad", "Brændstof", "Slæbested", "Indkøb tæt på"]
indsejling: "Bred og velafmærket indsejling fra Lem Vig. Hold øje med..."
---

Lemvig Marina ligger i bunden af Lem Vig med kort gåafstand til byen...
```

- [ ] **Step 1: Research** — søg data for alle 10 havne (dybde, VHF, faciliteter, indsejling, havnepenge-betaling) og notér kilder.
- [ ] **Step 2: Skriv/udbyg de 5 vestlige havne** (thyboroen, lemvig, struer, skive, glyngoere) med verificerede data. Fjern "(verificér)"-markeringer fra thyboroen.md.
- [ ] **Step 3: Skriv de 5 østlige havne** (fur, nykoebing-mors, loegstoer, nibe, aalborg).
- [ ] **Step 4: Verificér**

Kør: `npm run check` — Forventet: 0 errors.
Kør: `npm run build` — Forventet: uden fejl.
Kør: `ls dist/havne` — Forventet: index.html + mapper for alle 10 havne.
Kør: `grep -rL "verificér" src/content/havne/*.md` — Forventet: ALLE 10 filer listes (dvs. ingen indeholder rå verificér-markeringer).

- [ ] **Step 5: Commit**

```bash
git add src/content/havne/
git commit -m "feat: tilfoej alle 10 havnesider med verificerede data"
```

---

### Task 13: Slut-QA og README

**Files:**
- Create: `README.md`

**Interfaces:**
- Consumes: hele sitet.
- Produces: dokumenteret, verificeret v1.

- [ ] **Step 1: Fuld kvalitetskontrol**

Kør: `npm run check` — Forventet: 0 errors, 0 warnings af betydning.
Kør: `npm run build` — Forventet: uden fejl.
Kør: `find dist -name "index.html" | wc -l` — Forventet: 36 (forside 1 + sektioner 3 + guides 20 + havneoversigt 1 + havne 10 + om 1). Dertil `dist/404.html`.
Kør: `grep -rl "lorem\|TODO\|TBD\|udbygges" src/content/ || echo "RENT"` — Forventet: `RENT`.

- [ ] **Step 2: Manuel stikprøve i browser**

Kør `npm run preview` og tjek: forside i lys+mørk tilstand; én guide pr. kategori (diagrammer vises, advarselsboks på regler-guide, næste/forrige-links virker); én havneside (kort-link virker); 404-siden; mobilbredde (DevTools, 390 px — ingen vandret scroll).

- [ ] **Step 3: Skriv `README.md`**

```markdown
# ⚓ Til Kaj

Dansk website for nye motorbådssejlere — guides, havnemanøvrer, søvejsregler og
havneguide med fokus på Limfjorden.

## Udvikling

​```bash
npm install
npm run dev      # dev-server på localhost:4321
npm run check    # typecheck + indholdsvalidering
npm run build    # statisk build til dist/
npm run preview  # se produktion-buildet lokalt
​```

## Struktur

- `src/content/guides/` — guides i markdown (kategorier: laer-at-sejle, havnemanoevrer, regler)
- `src/content/havne/` — havnesider med struktureret frontmatter
- `src/content.config.ts` — Zod-skemaer; buildet fejler ved ugyldig frontmatter
- `src/assets/diagrammer/` — SVG-diagrammer til manøvre-guides
- `docs/superpowers/specs/` — designdokument

## Deployment

`dist/` er 100 % statisk og kan hostes på GitHub Pages, Cloudflare Pages eller
Azure Static Web Apps. Husk at opdatere `site` i `astro.config.mjs`, hvis domænet
ændres.

## Indholdsprincipper

- Dansk, du-form, korrekt ortografi.
- Regelsider skal have `## Kilder` med links til officielle kilder.
- Fakta om havne og broer verificeres mod officielle kilder før publicering.
```

(Fjern `​`-tegnene før ```-blokkene — de er kun med her for at undgå nested fence-problemer.)

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "docs: tilfoej README med udviklings- og indholdsprincipper"
```
