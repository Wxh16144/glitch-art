/** Path segment-safe text: spaces, slashes, CJK, etc. percent-encoded. */
export const enc = (text: string) => encodeURIComponent(text);

export const DEFAULT_FONT = 'Fira Code';

/**
 * Canonical host baked into the copy-paste embed examples.
 *
 * Only NEXT_PUBLIC_SITE_URL (a custom domain) can override it. Vercel's
 * deployment-specific URLs (VERCEL_URL, e.g. <name>-<hash>.vercel.app)
 * are intentionally never used: they change on every redeploy. The
 * `<project>.vercel.app` alias always points at the latest production build.
 */
export const PROD_SITE = (
  process.env.NEXT_PUBLIC_SITE_URL || 'glitch-art.vercel.app'
).replace(/^https?:\/\//, '');

/** True when running the Next dev server (client-safe, build-time inlined). */
export const IS_DEV = process.env.NODE_ENV === 'development';

/** Fallback text used when the user clears the input. */
export const FALLBACK_WORD = 'Glitch Art';

/** Home-page URL query keys + their fallback values. */
export const UI_DEFAULTS = {
  text: 'Glitch Art',
  font: 'Sour Gummy',
  palette: 'classic',
} as const;

export const FONTS = [
  'Sour Gummy',
  'Fira Code',
  'Space Grotesk',
  'Caveat',
  'Bungee',
  'Noto Sans JP',
];

export interface Palette {
  name: string;
  c1: string;
  c2: string;
}

export const PALETTES: Palette[] = [
  { name: 'classic', c1: 'red', c2: 'cyan' },
  { name: 'ultraviolet', c1: '#7c3aed', c2: '#06b6d4' },
  { name: 'neon', c1: '#ff2e88', c2: '#00e5ff' },
  { name: 'graphite', c1: '#171717', c2: '#9ca3af' },
];

export const paletteFor = (name: string): Palette =>
  PALETTES.find((p) => p.name === name) ?? PALETTES[0];

export interface ShowcaseItem {
  word: string;
  font: string;
  fw?: string;
  palette: string;
  caption: string;
}

export const SHOWCASES: ShowcaseItem[] = [
  { word: 'Passion', font: 'Sour Gummy', fw: '500', palette: 'classic', caption: 'Passion?font=Sour Gummy&fw=500' },
  { word: 'GL1TCH', font: 'Fira Code', fw: '700', palette: 'ultraviolet', caption: 'GL1TCH?font=Fira Code&fw=700&c1=%237c3aed&c2=%2306b6d4' },
  { word: '故障', font: 'Noto Sans JP', palette: 'neon', caption: '故障?font=Noto Sans JP&c1=%23ff2e88&c2=%2300e5ff' },
  { word: 'Void', font: 'Space Grotesk', palette: 'graphite', caption: 'Void?font=Space Grotesk&c1=%23171717&c2=%239ca3af' },
  { word: 'dreamwave', font: 'Caveat', fw: '500', palette: 'neon', caption: 'dreamwave?font=Caveat&fw=500&c1=%23ff2e88&c2=%2300e5ff' },
  { word: 'BOOM', font: 'Bungee', palette: 'classic', caption: 'BOOM?font=Bungee' },
  { word: 'SYNTH', font: 'Space Grotesk', fw: '700', palette: 'ultraviolet', caption: 'SYNTH?font=Space Grotesk&fw=700&c1=%237c3aed&c2=%2306b6d4' },
  { word: '反転', font: 'Noto Sans JP', fw: '500', palette: 'graphite', caption: '反転?font=Noto Sans JP&fw=500&c1=%23171717&c2=%239ca3af' },
  // NOTE: never use word "404" (or "500") here — Next.js hardcodes those
  // literal paths to its own not-found/error boundary in production, so
  // they can never reach the [text] route and would render broken.
  { word: 'ERROR', font: 'Fira Code', fw: '400', palette: 'neon', caption: 'ERROR?font=Fira Code&c1=%23ff2e88&c2=%2300e5ff' },
  { word: 'café', font: 'Caveat', palette: 'classic', caption: 'café?font=Caveat' },
  { word: 'HYPE', font: 'Bungee', palette: 'graphite', caption: 'HYPE?font=Bungee&c1=%23171717&c2=%239ca3af' },
  { word: 'lofi', font: 'Sour Gummy', palette: 'ultraviolet', caption: 'lofi?font=Sour Gummy&c1=%237c3aed&c2=%2306b6d4' },
];

/** Build the canonical /{text}?… URL for a word + option overrides. */
export const buildUrl = (
  word: string,
  opts: { font?: string; fw?: string; c1?: string; c2?: string; h?: number }
): string => {
  const params: string[] = [];
  if (opts.font && opts.font !== DEFAULT_FONT) params.push(`font=${enc(opts.font)}`);
  if (opts.fw) params.push(`fw=${opts.fw}`);
  if (opts.c1 && opts.c1 !== 'red') params.push(`c1=${enc(opts.c1)}`);
  if (opts.c2 && opts.c2 !== 'cyan') params.push(`c2=${enc(opts.c2)}`);
  if (opts.h) params.push(`h=${opts.h}`);
  const qs = params.length > 0 ? `?${params.join('&')}` : '';
  return `/${enc(word)}${qs}`;
};
