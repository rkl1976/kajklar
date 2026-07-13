# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Om projektet

KajKlar (kajklar.dk) er et dansk, statisk website for nye motorbådssejlere med
guides, havnemanøvrer, søvejsregler og en havneguide med fokus på Limfjorden.
Bygget med **Astro 5** (content collections), **Tailwind CSS 4** og TypeScript.
Sitet er 100 % statisk (SSG) — ingen server-runtime.

## Kommandoer

```bash
npm run dev      # dev-server på localhost:4321
npm run check    # astro check: typecheck + validering af frontmatter mod Zod-skema
npm run build    # statisk build til dist/
npm run preview  # se produktion-buildet lokalt
```

Kør altid `npm run check` efter ændringer i indhold eller skemaer — buildet
**fejler** ved frontmatter, der ikke matcher Zod-skemaet i `src/content.config.ts`.
Der er ingen test-suite; `astro check` er den primære valideringsgate.

## Arkitektur

Indhold og præsentation er adskilt: alt fagligt indhold ligger som markdown i
content collections, og `.astro`-siderne er tynde skabeloner, der henter og
renderer collections.

**To content collections** (defineret med Zod i `src/content.config.ts`):
- `guides` — `src/content/guides/<kategori>/*.md`. Frontmatter styrer alt:
  `kategori` (enum: `laer-at-sejle` | `havnemanoevrer` | `regler`) bestemmer URL
  og gruppering, `raekkefoelge` (positivt heltal) bestemmer sortering og
  forrige/næste-navigation, `svaerhedsgrad` (`begynder` | `oevet`).
- `havne` — `src/content/havne/*.md`. Struktureret frontmatter (`position`,
  `dybde`, `vhf?`, `faciliteter[]`, `indsejling`) renderes som fakta-boks.

**Routing** (alle sider statisk genereret via `getStaticPaths`):
- `/[kategori]/` — liste over guides i kategorien, sorteret på `raekkefoelge`.
- `/[kategori]/[slug]/` — enkelt guide. Slug er sidste del af guide-`id`
  (se `guideSlug`/`guideUrl` i `src/lib/guides.ts` — brug altid disse helpers
  til at bygge guide-URL'er). `regler`-guides får automatisk en ansvarsfraskrivelse.
- `/havne/` og `/havne/[id]/` — havneoversigt og -detaljer.

**Kategori-metadata** ligger centralt i `src/lib/kategorier.ts` (titel, emoji,
beskrivelse) og `src/lib/kategoriFotos.ts` (herofotos). En ny kategori kræver
ændring begge steder plus i enum'et i `content.config.ts` og i nav-arrayet i
`BaseLayout.astro`.

**Diagrammer**: SVG i `src/assets/diagrammer/`, refereret som relative
markdown-billeder fra guides (Astro optimerer dem gennem assets-pipelinen).
Fotos ligger i `src/assets/fotos/`.

**Styling**: Tailwind 4 konfigureres i CSS via `@theme` i `src/styles/global.css`
— ikke i en JS-config. Custom farvepaletter `fjord-*` og `rav-*`, display-font
Fraunces (`font-display`) og brødtekst Instrument Sans. Dark mode via `.dark`-klasse
sat af inline-script i `BaseLayout.astro` (localStorage + `prefers-color-scheme`).

## Indholdsprincipper

- Dansk, du-form, korrekt ortografi (æ/ø/å).
- Regelsider (`kategori: regler`) skal have et `## Kilder`-afsnit med links til
  officielle kilder (Søfartsstyrelsen, politikredse m.fl.).
- Fakta om havne og broer verificeres mod officielle kilder før publicering.

## Deployment

`dist/` er statisk og kan hostes på GitHub Pages, Cloudflare Pages eller Azure
Static Web Apps. Ved domæneskift skal `site` opdateres i `astro.config.mjs`
(driver canonical-URL'er og sitemap) samt i `public/robots.txt`.
