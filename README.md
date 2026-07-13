# ⚓ KajKlar

Dansk website for nye motorbådssejlere — guides, havnemanøvrer, søvejsregler og
havneguide med fokus på Limfjorden.

## Udvikling

```bash
npm install
npm run dev      # dev-server på localhost:4321
npm run check    # typecheck + indholdsvalidering
npm run build    # statisk build til dist/
npm run preview  # se produktion-buildet lokalt
```

## Struktur

- `src/content/guides/` — guides i markdown (kategorier: laer-at-sejle, havnemanoevrer, regler)
- `src/content/havne/` — havnesider med struktureret frontmatter
- `src/content.config.ts` — Zod-skemaer; buildet fejler ved ugyldig frontmatter
- `src/assets/diagrammer/` — SVG-diagrammer til manøvre-guides
- `docs/superpowers/specs/` — designdokument

## Deployment

`dist/` er 100 % statisk og kan hostes på GitHub Pages, Cloudflare Pages eller
Azure Static Web Apps. Husk at opdatere `site` i `astro.config.mjs` (og
`public/robots.txt`), hvis domænet ændres.

## Indholdsprincipper

- Dansk, du-form, korrekt ortografi.
- Regelsider skal have `## Kilder` med links til officielle kilder.
- Fakta om havne og broer verificeres mod officielle kilder før publicering.
