/**
 * User-facing options, after the request layer merged defaults + query aliases.
 * `width`/`height`/`fontSize` are optional: when absent, prepare() computes them
 * via smart auto-fit. `word` is always resolved (path > ?t= > ?word= > default).
 */
export interface UserOptions {
  word: string;
  color1: string;
  color2: string;
  background: string;
  font: string;
  fontWeight: string;
  fontSize?: number;
  width?: number;
  height?: number;
}

/**
 * Static defaults merged underneath user-supplied values. `word`, `fontSize`,
 * `width` and `height` are deliberately absent — word comes from the request
 * chain and the rest are computed by the smart layout in prepare().
 */
export const DEFAULT_OPTIONS: Pick<UserOptions, 'color1' | 'color2' | 'background' | 'font' | 'fontWeight'> = {
  color1: 'red',
  color2: 'cyan',
  background: 'transparent',
  // https://fonts.google.com/?preview.text=Glitch%20Art
  font: 'Fira Code',
  fontWeight: '400',
} as const;

/** Fallback text when the user supplies none (bare `/` or legacy `/api/simple`). */
export const DEFAULT_WORD = 'Glitch Art';

/** Default font size when neither fs nor a constraining w/h is provided.
 * Kept moderate so zero-config images (logo, README, bare /{text}) render at
 * a compact, embed-friendly size.
 */
export const DEFAULT_FONT_SIZE = 40;

/**
 * Maximum characters accepted for the rendered text.
 * Guards the Google Fonts subsetting + SVG payload against runaway growth.
 */
export const MAX_WORD_LENGTH = 200;

/**
 * Characters appended to the Google Fonts `text=` subset request so the font
 * includes metrics for common punctuation (spaces, quotes, …). Keeps fontkit
 * measurement exact and prevents fallback-glyph jumps in the SVG.
 */
export const FONT_SUBSET_EXTRA = " \t'\"!?,.:;()[]{}&@#%*-_+=/\\<>~^|`$€£¥";

/** Horizontal/vertical shake amplitude (px) used by the glitch animation. */
export const SHAKE_AMPLITUDE = Math.PI / 1.5;

/** `Cache-Control` header for successful (200) SVG responses. */
export const CACHE_CONTROL = 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400';

/** `Cache-Control` for error responses — never cache a failure. */
export const ERROR_CACHE_CONTROL = 'no-store';

/**
 * Query keys that are intentionally ignored (and therefore must not appear in
 * `X-Warning`). Reserved for analytics noise (utm_*). `no-vary-search` can later
 * be derived from this same list on the CDN.
 */
export const IGNORED_QUERY_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const;

/** Font-size-relative padding applied around text on the smart auto-canvas. */
export const CANVAS_PADDING_RATIO = 0.15;