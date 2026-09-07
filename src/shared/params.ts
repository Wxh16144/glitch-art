import { DEFAULT_OPTIONS, DEFAULT_WORD, IGNORED_QUERY_KEYS, UserOptions } from './constants';
import { validateColor, validateFont, validateWord } from './validator';

/**
 * Short aliases for query parameters (hard-switch: legacy long names are NOT
 * accepted anymore — they surface as X-Warning). `word` is resolved separately
 * via the priority chain path > `?t=` > `?word=` > default.
 */
const ALIAS_MAP: Record<string, keyof UserOptions> = {
  t: 'word',
  word: 'word', // legacy query form, kept working (documented in README)
  f: 'font', // short alias
  font: 'font', // readable alias (kept — demo/docs use this form)
  fs: 'fontSize',
  fw: 'fontWeight',
  w: 'width',
  h: 'height',
  c1: 'color1',
  c2: 'color2',
  bg: 'background',
};

const NUMERIC_KEYS: ReadonlySet<string> = new Set(['fontSize', 'fontWeight', 'width', 'height']);

const parseNumber = (raw: string, key: string, warnings: string[]): number | undefined => {
  const value = Number(raw);
  if (raw.trim() === '' || Number.isNaN(value) || value <= 0) {
    warnings.push(`ignored invalid ${key}: ${JSON.stringify(raw)}`);
    return undefined;
  }
  return value;
};

export interface ParsedRequest {
  options: UserOptions;
  warnings: string[];
}

/** Resolve a single word source following path > t > word > default. */
export const resolveWord = (pathText: string | undefined, params: URLSearchParams): string => {
  if (pathText != null && pathText !== '') return pathText;
  const t = params.get('t');
  if (t != null && t !== '') return t;
  const word = params.get('word');
  if (word != null && word !== '') return word;
  return DEFAULT_WORD;
};

/**
 * Merge short-alias query params onto defaults. Unknown keys produce an
 * X-Warning (unless in the ignored utm_* list) but never a hard failure.
 */
export const parseQuery = (searchParams: URLSearchParams, pathText?: string): ParsedRequest => {
  const warnings: string[] = [];
  const raw: Record<string, string> = {};

  for (const [key, value] of searchParams.entries()) {
    const canonical = ALIAS_MAP[key];
    if (canonical) {
      if (!(canonical in raw)) raw[canonical] = value;
    } else if (key.startsWith('utm_') || (IGNORED_QUERY_KEYS as readonly string[]).includes(key)) {
      // silently ignored analytics / reserved noise
    } else if (key !== 't' && key !== 'word') {
      warnings.push(`unknown parameter: ${key}`);
    }
  }

  const options: UserOptions = {
    ...DEFAULT_OPTIONS,
    word: validateWord(resolveWord(pathText, searchParams)),
  };

  for (const key of Object.keys(ALIAS_MAP)) {
    // skip duplicates already resolved via chain (t/word handle word)
    if (key === 't' || key === 'word') continue;
    const canonical = ALIAS_MAP[key]!;
    const value = raw[canonical];
    if (value === undefined) continue;

    if (NUMERIC_KEYS.has(canonical)) {
      const num = parseNumber(value, canonical, warnings);
      if (num !== undefined) (options as unknown as Record<string, unknown>)[canonical] = num;
      continue;
    }

    switch (canonical) {
      case 'font':
        options.font = validateFont(value);
        break;
      case 'color1':
        options.color1 = validateColor(value, 'c1');
        break;
      case 'color2':
        options.color2 = validateColor(value, 'c2');
        break;
      case 'background':
        options.background = validateColor(value, 'bg');
        break;
      default:
        break;
    }
  }

  return { options, warnings };
};
