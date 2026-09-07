import { fetchFontCSS, FontAsset } from './GoogleFont';
import { measureText } from './measure';
import { generateShakeValues } from './util';
import {
  CANVAS_PADDING_RATIO,
  DEFAULT_FONT_SIZE,
  SHAKE_AMPLITUDE,
  UserOptions,
} from './constants';

/** Everything the template needs to paint the SVG. */
export interface RenderData extends UserOptions {
  /** Embedded @font-face CSS (base64 data URIs). */
  fontCSS: string;
  /** Canvas width/height in px — sized so the shake never clips. */
  width: number;
  height: number;
  /** Actual px font size after smart fitting. */
  fontSize: number;
  /** Left edge x of the text block (px). */
  textX: number;
  /** Baseline y of the text (px, y-down). */
  textY: number;
  /** Deterministic glitch keyframes for the word. */
  animateValues: string;
}

const ampHalf = SHAKE_AMPLITUDE / 2;

/** Round a dimension up so fractional glyphs never clip the canvas edge. */
const ceil1 = (v: number): number => Math.ceil(v * 10) / 10;

/**
 * Smart layout:
 * - no w/h        → canvas auto-fits the text at the default (or explicit) fs
 * - w and/or h    → that axis is constrained; text is auto-fit (contain) unless
 *                   an explicit fontSize was supplied (user dominates)
 * - explicit fs   → the free axes expand to fit, constrained axes stay fixed
 */
async function prepare(options: UserOptions): Promise<RenderData> {
  const { word, font, fontWeight } = options;
  const asset: FontAsset = await fetchFontCSS(font, fontWeight, word);
  if (asset.fontBuffer.byteLength === 0) {
    throw new Error(`No glyph data returned for font "${font}".`);
  }

  const metrics = measureText(asset.fontBuffer, word);
  const upm = metrics.unitsPerEm;
  // text width / glyph-block height per 1px of font-size
  const perPx = {
    width: metrics.advanceUnits / upm,
    height: (metrics.maxY - metrics.minY) / upm,
  };

  const fitFor = {
    width: (givenW: number) => Math.max(1, (givenW - 2 * ampHalf) / (perPx.width + 2 * CANVAS_PADDING_RATIO)),
    height: (givenH: number) => Math.max(1, (givenH - 2 * ampHalf) / (perPx.height + 2 * CANVAS_PADDING_RATIO)),
  };

  const givenW = options.width;
  const givenH = options.height;

  // Decide the effective font size.
  let fontSize: number;
  if (options.fontSize === undefined) {
    const fsFit: number[] = [];
    if (givenW !== undefined) fsFit.push(fitFor.width(givenW));
    if (givenH !== undefined) fsFit.push(fitFor.height(givenH));
    // Constraints → true contain-fit (scale up or down to fill). No
    // constraints → default size and the canvas wraps the text instead.
    fontSize = fsFit.length === 0 ? DEFAULT_FONT_SIZE : Math.min(...fsFit);
  } else {
    // Explicit fs wins (user dominates).
    fontSize = Math.max(1, options.fontSize);
  }

  // px metrics at the final font size.
  const pad = ampHalf + fontSize * CANVAS_PADDING_RATIO;
  const textW = perPx.width * fontSize;
  const blockH = perPx.height * fontSize;

  const width = givenW !== undefined ? givenW : ceil1(textW + 2 * pad);
  const height = givenH !== undefined ? givenH : ceil1(blockH + 2 * pad);

  // Center the glyph block vertically. fontkit bbox is y-up: the top edge is
  // maxY units above the baseline, the bottom is minY below it. Converting to
  // y-down SVG coordinates gives the baseline's offset from the block center.
  const centerToBaseline = (((metrics.maxY + metrics.minY) / 2) / upm) * fontSize;
  const textY = height / 2 + centerToBaseline;
  const textX = (width - textW) / 2;

  return {
    ...options,
    width,
    height,
    fontSize: Math.round(fontSize * 100) / 100,
    textX: Math.round(textX * 10) / 10,
    textY: Math.round(textY * 10) / 10,
    fontCSS: asset.css,
    animateValues: generateShakeValues(word, SHAKE_AMPLITUDE, SHAKE_AMPLITUDE),
  };
}

export default prepare;