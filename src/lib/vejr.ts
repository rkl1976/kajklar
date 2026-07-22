/**
 * Delt klient-side vejrlogik for VindBoks og /vejr/-siderne.
 * Data kommer fra Open-Meteo (DMI's HARMONIE-model), som er gratis til
 * ikke-kommerciel brug, uden API-nøgle og CORS-åben — kildeangivelse påkrævet.
 */

/** Danske kompasretninger (Ø for øst). */
export const KOMPAS = ['N', 'NNØ', 'NØ', 'ØNØ', 'Ø', 'ØSØ', 'SØ', 'SSØ', 'S', 'SSV', 'SV', 'VSV', 'V', 'VNV', 'NV', 'NNV'];

/** Vindbetegnelser efter DMI's skala; grænsen er øvre (eksklusiv) i m/s. */
export const BETEGNELSER: Array<[number, string]> = [
  [0.3, 'Stille'], [1.6, 'Næsten stille'], [3.4, 'Svag vind'], [5.5, 'Let vind'],
  [8.0, 'Jævn vind'], [10.8, 'Frisk vind'], [13.9, 'Hård vind'], [17.2, 'Stiv kuling'],
  [20.8, 'Hård kuling'], [24.5, 'Stormende kuling'], [28.5, 'Storm'], [32.7, 'Stærk storm'],
  [Infinity, 'Orkan'],
];

export const BADGE_FARVER = {
  rolig: 'bg-fjord-200 text-fjord-900 dark:bg-fjord-700 dark:text-fjord-50',
  frisk: 'bg-rav-100 text-rav-600 dark:bg-rav-600/25 dark:text-rav-500',
  haard: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
} as const;

/** Pilens spids peger opad ved rotation 0°. */
export const PIL_PATH = 'M12 2 L17.5 13 H13.6 V22 H10.4 V13 H6.5 Z';

export const fmt = new Intl.NumberFormat('da-DK', { maximumFractionDigits: 1 });

export const retningTekst = (grader: number) => KOMPAS[Math.round(grader / 22.5) % 16];
export const betegnelse = (ms: number) => BETEGNELSER.find(([graense]) => ms < graense)![1];
export const niveau = (ms: number): keyof typeof BADGE_FARVER =>
  ms < 5.5 ? 'rolig' : ms < 10.8 ? 'frisk' : 'haard';

/** Pilen peger i vindens bevægelsesretning (meteorologisk retning er "fra"). */
export const pilRotation = (grader: number) => `rotate(${Math.round(grader) + 180}deg)`;

/** WMO-vejrkode til dansk tekst og symbol (grupperet, ikke udtømmende pr. kode). */
export function vejrSymbol(kode: number): { ikon: string; tekst: string } {
  if (kode === 0) return { ikon: '☀️', tekst: 'Klart vejr' };
  if (kode <= 2) return { ikon: '🌤️', tekst: 'Let skyet' };
  if (kode === 3) return { ikon: '☁️', tekst: 'Overskyet' };
  if (kode === 45 || kode === 48) return { ikon: '🌫️', tekst: 'Tåge' };
  if (kode <= 57) return { ikon: '🌦️', tekst: 'Finregn' };
  if (kode <= 67) return { ikon: '🌧️', tekst: 'Regn' };
  if (kode <= 77) return { ikon: '🌨️', tekst: 'Sne' };
  if (kode <= 82) return { ikon: '🌦️', tekst: 'Regnbyger' };
  if (kode <= 86) return { ikon: '🌨️', tekst: 'Snebyger' };
  return { ikon: '⛈️', tekst: 'Torden' };
}

/** Bygger et Open-Meteo forecast-URL med sitets faste enheder og tidszone. */
export function forecastUrl(params: Record<string, string>): URL {
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.search = new URLSearchParams({
    wind_speed_unit: 'ms',
    timezone: 'Europe/Copenhagen',
    ...params,
  }).toString();
  return url;
}
