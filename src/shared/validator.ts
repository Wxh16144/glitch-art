import { MAX_WORD_LENGTH } from './constants';

/** Thrown for request-shape violations → mapped to a 400 response. */
export class RequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RequestError';
  }
}

/** Restrictive CSS-context-safe charset for font names. */
const FONT_RE = /^[\p{L}\p{N} .'_-]+$/u;

/** Colors appear inside CSS (`fill`, `background-color`) → forbid CSS metachars. */
const COLOR_RE = /^[\w#().,%\s-]+$/i;

export const validateWord = (word: string): string => {
  const trimmed = word.trim();
  if (!trimmed) {
    throw new RequestError('text must not be empty');
  }
  if (trimmed.length > MAX_WORD_LENGTH) {
    throw new RequestError(`text exceeds ${MAX_WORD_LENGTH} characters`);
  }
  return trimmed;
};

export const validateFont = (font: string): string => {
  const trimmed = font.trim();
  if (!trimmed || !FONT_RE.test(trimmed)) {
    throw new RequestError(`invalid font name: ${JSON.stringify(font)}`);
  }
  return trimmed;
};

export const validateColor = (color: string, name: string): string => {
  const trimmed = color.trim();
  if (!trimmed || !COLOR_RE.test(trimmed)) {
    throw new RequestError(`invalid ${name}: ${JSON.stringify(color)}`);
  }
  return trimmed;
};