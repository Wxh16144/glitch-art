export const merge = <T,>(a: T, ...args: Partial<T>[]): T => {
  const result = { ...a };

  for (const arg of args) {
    for (const key in arg) {
      if (arg[key] != null /* null or undefined */) {
        result[key] = arg[key];
      }
    }
  }

  return result;
}

/** xmur3 string hash → uint32 seed (deterministic across platforms/requests). */
export const hashSeed = (str: string): number => {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  return (h ^= h >>> 16) >>> 0;
};

/** mulberry32 PRNG — tiny, fast, deterministic for a given 32-bit seed. */
export const mulberry32 = (seed: number): (() => number) => {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/**
 * Deterministic shake keyframes derived from a string seed (the rendered text).
 * Same text → same glitch trajectory across requests, instances and cache hits.
 */
export const generateShakeValues = (
  seed: string,
  xAmplitude = Math.PI / 1.8,
  yAmplitude = Math.PI / 1.8,
  count = 8
) => {
  const random = mulberry32(hashSeed(seed));
  const values = [];
  for (let i = 0; i < count; i++) {
    const x = (random() - 0.5) * xAmplitude;
    const y = (random() - 0.5) * yAmplitude;
    values.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return [...values, values[0]].join('; ');
}