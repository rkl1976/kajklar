# Til Kaj — designdokument for website (v1)

**Dato:** 2026-07-13
**Status:** Godkendt i brainstorm-session

## Formål og målgruppe

"Til Kaj" er et offentligt, dansksproget website, der hjælper nye motorbådssejlere med at lære at sejle, manøvrere i havn og kende reglerne — med særligt fokus på Limfjorden. Målgruppen er begyndere og let øvede motorbådssejlere i Danmark.

Succeskriterium for v1: et komplet, læsbart og hurtigt indholdssite med de fire indholdsområder udfyldt, klar til publicering på valgfri statisk hosting.

## Scope for v1

- **Rent indholdssite** — ingen login, ingen brugerdata, ingen backend.
- Indhold skrives som markdown; Claude leverer første udkast på dansk, ejeren redigerer direkte i filerne.
- Deployment-beslutning er bevidst udskudt; output er statisk HTML, der kan hostes hvor som helst.

**Uden for scope i v1** (mulige senere udvidelser): interaktivt havnekort (Leaflet), vigeregel-quiz, tjeklister, brugerkonti, community-indhold.

## Teknisk arkitektur

- **Astro** (nyeste stabile version) + **Tailwind CSS** + **TypeScript (strict)**.
- Alt indhold i **content collections** med Zod-frontmatter-skemaer — build fejler ved manglende/ugyldige felter.
- 100 % statisk output i `dist/`.

### Content collections

1. **`guides`** — artikler med frontmatter: `title`, `description`, `kategori` (`laer-at-sejle` | `havnemanoevrer` | `regler`), `raekkefoelge` (nummer i læringsstien), `svaerhedsgrad` (`begynder` | `oevet`). Hver sektion viser sine guides som en ordnet læringssti.
2. **`havne`** — én side pr. havn med frontmatter: `navn`, `position` (lat/lng), `dybde`, `vhf`, `faciliteter` (liste), `indsejling` (fritekst om forhold) + brødtekst om særlige forhold.

### Sitestruktur

```
/                  Forside: hero, indgange til de fire områder, fremhævet guide
/laer-at-sejle/    Læringssti med 7 guides
/havnemanoevrer/   Læringssti med 7 guides
/regler/           6 guides om regler
/havne/            Oversigt + 10 havnesider
/om/               Om sitet + ansvarsfraskrivelse
404                Venlig "Du er sejlet forkert"-side
```

## Indholdsplan v1

**Lær at sejle (7):** Kend din båd · Før du sejler ud (tjekliste) · Motorlære for begyndere · Grundlæggende manøvrering · Fart, trim og brændstof · Vejr, vind og bølger i Limfjorden · Sikkerhed om bord.

**Havnemanøvrer (7):** Vind og strøm i havnen · Lægge til langs kaj · Lægge til i sidevind · Bakke ind i bås · Pæle og Y-bomme · Fortøjning og knob · Afgang fra kaj.

**Regler (6):** Vigeregler for motorbåd · Farvandsafmærkning · Fartgrænser og hensyn · Broerne i Limfjorden (gennemsejling, signaler, VHF) · Beviser og krav (speedbådskørekort, duelighedsbevis, udstyr) · Lanterner og sejlads i mørke.

**Havne (10):** Thyborøn, Lemvig, Struer, Skive, Glyngøre, Fur, Nykøbing Mors, Løgstør, Nibe, Aalborg.

Manøvre-guides illustreres med **SVG-diagrammer** (fugleperspektiv: båd, kaj, vind-/strømpile), som versionsstyres i repoet.

## Visuelt design: "Frisk fjord"

- Lys, luftig og venlig; moderne sans-serif.
- Primærfarve teal (~`#0e7490`), lyse himmelblå flader (~`#e0f2f7`), varme accentfarver (rav ~`#f59e0b`) til kategorier.
- Bløde hjørner, pill-formede knapper.
- Både lys og mørk tilstand understøttes fra start.
- Skal fungere godt på mobil i dagslys (havnesituationen).

## Kvalitet og fejlhåndtering

- **Build-tidsvalidering:** Zod-skemaer fanger indholdsfejl; `astro build` + `astro check` er kvalitetsporten.
- **SEO-basics:** `sitemap.xml`, meta-beskrivelser, OG-tags, `lang="da"`.
- **Tilgængelighed:** semantisk HTML, tilstrækkelig kontrast, fungerende tastaturnavigation.
- **Ansvarsfraskrivelse** på /om/ og synligt på regelsider: sitet vejleder; Søfartsstyrelsens officielle regler og opdaterede kilder gælder altid. Faktuelt indhold om regler/broer/havne skal verificeres mod officielle kilder, inden det publiceres.
- Ingen automatiseret testpakke i v1; tilføjes (Playwright-smoketests) når interaktive features kommer til.

## Repo

- Git initialiseres i `C:\Dev\Private\boat`.
- `.gitignore`: `node_modules/`, `dist/`, `.astro/`, `.superpowers/`.
