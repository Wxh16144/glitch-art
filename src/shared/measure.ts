import { create } from 'fontkit';
import { LRUCache } from 'lru-cache';

export interface TextMetrics {
  /** Advance width in font units (sum of glyph advances). */
  advanceUnits: number;
  /** Tightest glyph bbox over the measured string, font units, y-up. */
  minY: number;
  maxY: number;
  /** Font coordinate grid size, for scaling units → px at a given font-size. */
  unitsPerEm: number;
}

interface GlyphRun {
  positions: Array<{ xAdvance: number }>;
  bbox: { minY: number; maxY: number };
}

/** Structural subset of what measureText uses (avoids @types/fontkit coupling). */
interface MeasurableFont {
  layout(word: string, features?: Record<string, boolean>): GlyphRun;
  unitsPerEm: number;
  hasGlyphForCodePoint(codePoint: number): boolean;
}

/** Keyed by the ArrayBuffer (stable across requests thanks to the font cache). */
const fontCache = new LRUCache<ArrayBuffer, MeasurableFont>({ max: 200 });

const openFont = (buffer: ArrayBuffer): MeasurableFont => {
  const hit = fontCache.get(buffer);
  if (hit) return hit;
  // Google Fonts (no UA) returns a single TTF; collections are rejected below.
  const font = create(Buffer.from(buffer)) as unknown as MeasurableFont;
  if (typeof (font as { layout?: unknown }).layout !== 'function') {
    throw new Error('Unsupported font container (expected a single TTF face).');
  }
  fontCache.set(buffer, font);
  return font;
};

/**
 * Measure a word in font units using fontkit. The passed buffer is the Google
 * Fonts subset for exactly this word, so advances match the embedded glyphs.
 * Kerning + standard ligatures are enabled to mirror browser <text> shaping.
 */
export const measureText = (fontBuffer: ArrayBuffer, word: string): TextMetrics => {
  const font = openFont(fontBuffer);
  const run = font.layout(word, { kerning: true, ligatures: true });

  let advanceUnits = 0;
  for (const position of run.positions) {
    advanceUnits += position.xAdvance;
  }
  // fontkit bbox is y-up (maxY = top edge).
  return {
    advanceUnits,
    minY: run.bbox.minY,
    maxY: run.bbox.maxY,
    unitsPerEm: font.unitsPerEm,
  };
};

/**
 * List the distinct characters of `word` that the (subsetted) font cannot
 * render. If any come back, the browser would silently fall back to a system
 * font for them — making server-side measurement diverge from real rendering
 * (the CJK-in-Fira-Code problem). Callers should reject such requests.
 */
export const findMissingGlyphs = (fontBuffer: ArrayBuffer, word: string): string[] => {
  const font = openFont(fontBuffer);
  const missing = new Set<string>();
  for (const char of word) {
    const codePoint = char.codePointAt(0)!;
    if (!font.hasGlyphForCodePoint(codePoint)) missing.add(char);
  }
  return [...missing];
};
