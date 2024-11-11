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

export const generateShakeValues = (
  xAmplitude = Math.PI / 1.8,
  yAmplitude = Math.PI / 1.8,
  count = 8
) => {
  const values = [];
  for (let i = 0; i < count; i++) {
    const x = (Math.random() - 0.5) * xAmplitude;
    const y = (Math.random() - 0.5) * yAmplitude;
    values.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return [...values, values[0]].join('; ');
}