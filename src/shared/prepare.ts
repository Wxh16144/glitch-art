import { DEFAULT_OPTIONS } from "./constants";
import GoogleFontConverter from "./GoogleFont";
import { generateShakeValues } from "./util";

async function prepare(options: typeof DEFAULT_OPTIONS) {
  const {
    font,
    fontWeight,
    word,
    amplitude,
  } = options;

  const fontCSS = await GoogleFontConverter.fetchFontCSS(font, fontWeight, word);

  return {
    ...options,
    fontCSS,
    animateValues: generateShakeValues(amplitude, amplitude),
    verticalCenter: true,
    horizontalCenter: true,
  }
}

export default prepare;