import { NextRequest } from 'next/server';
import { DEFAULT_WORD, IGNORED_QUERY_KEYS } from '@/shared/constants';

/**
 * `/api/simple` — legacy URL, kept so historical links keep working.
 * Translates the old full-name query parameters to the new short aliases and
 * 301-redirects to the canonical `/{text}?aliases` form (word → path segment).
 *
 * Removed params (`amplitude`, `horizontalCenter`, `verticalCenter`, …) are
 * dropped silently. Unknown keys produce an X-Warning on the 301.
 */
const LEGACY_TO_ALIAS: Record<string, string> = {
  word: 't', // moved into the path, kept as a fallback below
  fontSize: 'fs',
  fontWeight: 'fw',
  width: 'w',
  height: 'h',
  color1: 'c1',
  color2: 'c2',
  background: 'bg',
  font: 'font',
};

/** Params that were removed from the product; drop on migration. */
const REMOVED_LEGACY_KEYS = new Set(['amplitude', 'horizontalCenter', 'verticalCenter']);

const isIgnored = (key: string) =>
  key.startsWith('utm_') || (IGNORED_QUERY_KEYS as readonly string[]).includes(key);

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;

  // Word → path segment (legacy `word=` or bare default).
  let word = params.get('word') ?? '';
  word = word.trim();

  const canonical = new URLSearchParams();
  const unknown: string[] = [];

  for (const [key, value] of params.entries()) {
    if (key === 'word') continue; // handled above
    if (REMOVED_LEGACY_KEYS.has(key) || isIgnored(key)) continue;

    const alias = LEGACY_TO_ALIAS[key];
    if (alias) {
      canonical.set(alias, value);
    } else {
      unknown.push(key);
    }
  }

  const target = new URL(`/${encodeURIComponent(word || DEFAULT_WORD)}`, req.nextUrl.origin);
  if ([...canonical].length > 0) {
    target.search = canonical.toString();
  }

  const headers: Record<string, string> = {
    Location: target.toString(),
  };
  if (unknown.length > 0) {
    headers['X-Warning'] = `unknown parameter: ${unknown.join('; ')}`;
  }

  return new Response(null, { status: 301, headers });
}
