import { LRUCache } from 'lru-cache';
import { FONT_SUBSET_EXTRA } from './constants';

export interface FontAsset {
  /** CSS with gstatic URLs replaced by base64 data URIs (ready for <style>). */
  css: string;
  /** Raw decoded font bytes — used by fontkit for text measurement. */
  fontBuffer: ArrayBuffer;
  fontType: string;
}

const { max, ttl } = { max: 200, ttl: 1000 * 60 * 60 * 24 };

/**
 * Key = (font, weight, text). Google Fonts subsets by `text=`, so two words
 * that only differ in characters never share a cache entry — bounded by LRU.
 */
const cache = new LRUCache<string, Promise<FontAsset>>({ max, ttl });

/** Text sent to Google Fonts: the word plus common punctuation/metrics chars. */
const subsetText = (word: string): string => `${word}${FONT_SUBSET_EXTRA}`;

const cacheKey = (font: string, weight: string, word: string): string =>
  `${font}::${weight}::${subsetText(word)}`;

/**
 * Fetch (and cache) the subsetted font CSS + raw font bytes for a word.
 * In-flight requests share the same promise so concurrent identical requests
 * only hit Google Fonts once.
 */
export const fetchFontCSS = async (font: string, fontWeight: string, word: string): Promise<FontAsset> => {
  const key = cacheKey(font, fontWeight, word);
  const hit = cache.get(key);
  if (hit) return hit;

  const task = load(font, fontWeight, subsetText(word));
  cache.set(key, task);
  try {
    return await task;
  } catch (error) {
    // don't keep a poisoned promise cached
    cache.delete(key);
    throw error;
  }
};

/** Translate an ArrayBuffer into a base64 data URI (chunked to avoid arg limits). */
const toDataURI = (buffer: ArrayBuffer, fontType: string): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return `data:font/${fontType};base64,${btoa(binary)}`;
};

const load = async (font: string, weight: string, text: string): Promise<FontAsset> => {
  const url = new URL('https://fonts.googleapis.com/css2');
  url.searchParams.append('family', `${font}:wght@${weight}`);
  url.searchParams.append('text', text);
  url.searchParams.append('display', 'fallback');

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch Google Font from API.');
  }
  const css = await response.text();

  const urlRegex = /\((https:\/\/fonts\.gstatic\.com.+?)\) format\('(.+?)'\)/g;
  const entries: Array<{ url: string; fontType: string }> = [];
  let match: RegExpExecArray | null;
  while ((match = urlRegex.exec(css)) !== null) {
    entries.push({ url: match[1], fontType: match[2] });
  }

  if (entries.length === 0) {
    // e.g. unsupported font name: css2 responds without @font-face
    return { css, fontBuffer: new ArrayBuffer(0), fontType: 'truetype' };
  }

  // First (regular/normal) face is used for measurement; embed all for rendering.
  const fontBuffer = await fetchFontBytes(entries[0].url);
  let out = css;
  for (const { url: fileUrl, fontType } of entries) {
    const buffer = await fetchFontBytes(fileUrl);
    out = out.replace(fileUrl, toDataURI(buffer, fontType));
  }

  return { css: out, fontBuffer, fontType: entries[0].fontType };
};

/** Tiny per-URL dedupe for font-file fetches (rarely hit twice in one load). */
const byteFetches = new Map<string, Promise<ArrayBuffer>>();
const fetchFontBytes = (url: string): Promise<ArrayBuffer> => {
  const existing = byteFetches.get(url);
  if (existing) return existing;
  const task = fetch(url).then((response) => {
    if (!response.ok) throw new Error('Failed to fetch font file.');
    return response.arrayBuffer();
  });
  byteFetches.set(url, task);
  return task.finally(() => byteFetches.delete(url));
};