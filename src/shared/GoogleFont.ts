class GoogleFontConverter {
  /**
   * Fetch CSS from Google Fonts
   */
  static async fetchFontCSS(font: string, weight: string, text: string) {
    const url = new URL('https://fonts.googleapis.com/css2');
    url.searchParams.append('family', `${font}:wght@${weight}`);
    url.searchParams.append('text', text);
    url.searchParams.append('display', 'fallback');

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch Google Font from API.');
      }
      const css = await response.text();
      return this.encodeFonts(css);
    } catch (error) {
      console.error(error);
      return '';
    }
  }

  /**
   * Encode font urls in string as base 64
   */
  static async encodeFonts(css: string) {
    const urlRegex = /\((https:\/\/fonts\.gstatic\.com.+?)\) format\('(.+?)'\)/g;
    let match;
    const urls = [];

    while ((match = urlRegex.exec(css)) !== null) {
      urls.push({ url: match[1], fontType: match[2] });
    }

    for (const { url, fontType } of urls) {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch font file.');
      }
      const buffer = await response.arrayBuffer();
      const base64 = btoa(new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
      const dataURI = `data:font/${fontType};base64,${base64}`;
      css = css.replace(url, dataURI);
    }

    return css;
  }
}

export default GoogleFontConverter;