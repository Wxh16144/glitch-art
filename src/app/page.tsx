/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';

/** Path segment-safe text: spaces, slashes, CJK, etc. percent-encoded. */
const enc = (text: string) => encodeURIComponent(text);

const DEFAULT_FONT = 'Fira Code';
const SITE = 'https://glitch-art.vercel.app';

/** Home-page URL query keys + their fallback values. */
const UI_DEFAULTS = {
  text: 'Glitch Art',
  font: 'Sour Gummy',
  palette: 'classic',
} as const;

const FONTS = [
  'Sour Gummy',
  'Fira Code',
  'Space Grotesk',
  'Caveat',
  'Bungee',
  'Noto Sans JP',
];

/** Rows of the parameters reference table. `f` links to the GF preview. */
const PARAM_ROWS = (fontPreviewUrl: string): Array<[string, string, React.ReactNode]> => [
  ['— path', 'word', 'The text to render'],
  ['t', 'word', 'Text as a query param fallback'],
  ['f', 'font', <span key="font-link">Google Fonts family (readable alias: <code>font</code>) — <a href={fontPreviewUrl} target="_blank" rel="noreferrer">find here ↗</a></span>],
  ['fs', 'fontSize', 'Font size in px (auto when omitted)'],
  ['fw', 'fontWeight', 'Font weight, e.g. 400 / 500 / 700'],
  ['w', 'width', 'Canvas width in px (auto when omitted)'],
  ['h', 'height', 'Canvas height in px (auto when omitted)'],
  ['c1', 'color1', 'First (base) text color'],
  ['c2', 'color2', 'Second (glitch) text color'],
  ['bg', 'background', 'Background color'],
];

const PALETTES = [
  { name: 'classic', c1: 'red', c2: 'cyan' },
  { name: 'ultraviolet', c1: '#7c3aed', c2: '#06b6d4' },
  { name: 'neon', c1: '#ff2e88', c2: '#00e5ff' },
  { name: 'graphite', c1: '#171717', c2: '#9ca3af' },
];

const SHOWCASES: Array<{ word: string; font: string; fw?: string; palette: string; caption: string }> = [
  { word: 'Passion', font: 'Sour Gummy', fw: '500', palette: 'classic', caption: 'Passion?font=Sour Gummy&fw=500' },
  { word: 'GL1TCH', font: 'Fira Code', fw: '700', palette: 'ultraviolet', caption: 'GL1TCH?font=Fira Code&fw=700&c1=%237c3aed&c2=%2306b6d4' },
  { word: '故障', font: 'Noto Sans JP', palette: 'neon', caption: '故障?font=Noto Sans JP&c1=%23ff2e88&c2=%2300e5ff' },
  { word: 'Void', font: 'Space Grotesk', palette: 'graphite', caption: 'Void?font=Space Grotesk&c1=%23171717&c2=%239ca3af' },
  { word: 'dreamwave', font: 'Caveat', fw: '500', palette: 'neon', caption: 'dreamwave?font=Caveat&fw=500&c1=%23ff2e88&c2=%2300e5ff' },
  { word: 'BOOM', font: 'Bungee', palette: 'classic', caption: 'BOOM?font=Bungee' },
  { word: 'SYNTH', font: 'Space Grotesk', fw: '700', palette: 'ultraviolet', caption: 'SYNTH?font=Space Grotesk&fw=700&c1=%237c3aed&c2=%2306b6d4' },
  { word: '反転', font: 'Noto Sans JP', fw: '500', palette: 'graphite', caption: '反転?font=Noto Sans JP&fw=500&c1=%23171717&c2=%239ca3af' },
  { word: '404', font: 'Fira Code', fw: '400', palette: 'neon', caption: '404?font=Fira Code&c1=%23ff2e88&c2=%2300e5ff' },
  { word: 'café', font: 'Caveat', palette: 'classic', caption: 'café?font=Caveat' },
  { word: 'HYPE', font: 'Bungee', palette: 'graphite', caption: 'HYPE?font=Bungee&c1=%23171717&c2=%239ca3af' },
  { word: 'lofi', font: 'Sour Gummy', palette: 'ultraviolet', caption: 'lofi?font=Sour Gummy&c1=%237c3aed&c2=%2306b6d4' },
];

/** Build the canonical /{text}?… URL for a word + option overrides. */
const buildUrl = (word: string, opts: { font?: string; fw?: string; c1?: string; c2?: string; h?: number }) => {
  const params: string[] = [];
  if (opts.font && opts.font !== DEFAULT_FONT) params.push(`font=${enc(opts.font)}`);
  if (opts.fw) params.push(`fw=${opts.fw}`);
  if (opts.c1 && opts.c1 !== 'red') params.push(`c1=${enc(opts.c1)}`);
  if (opts.c2 && opts.c2 !== 'cyan') params.push(`c2=${enc(opts.c2)}`);
  if (opts.h) params.push(`h=${opts.h}`);
  const qs = params.length > 0 ? `?${params.join('&')}` : '';
  return `/${enc(word)}${qs}`;
};

export default function Home() {
  const [text, setText] = useState<string>(UI_DEFAULTS.text);
  const [font, setFont] = useState<string>(UI_DEFAULTS.font);
  const [palette, setPalette] = useState<string>(UI_DEFAULTS.palette);
  const [copied, setCopied] = useState(false);

  // Read the shareable state out of the address bar (?t=&f=&palette=) once.
  const hydrated = useRef(false);
  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    const sp = new URLSearchParams(window.location.search);
    const t = sp.get('t');
    const f = sp.get('f');
    const p = sp.get('palette');
    if (t) setText(t);
    if (f && FONTS.includes(f)) setFont(f);
    if (p && PALETTES.some((x) => x.name === p)) setPalette(p);
  }, []);

  // Mirror the form state back into the URL so it can be copied/shared.
  useEffect(() => {
    const sp = new URLSearchParams();
    const trimmed = text.trim();
    if (trimmed && trimmed !== UI_DEFAULTS.text) sp.set('t', trimmed);
    if (font !== UI_DEFAULTS.font) sp.set('f', font);
    if (palette !== UI_DEFAULTS.palette) sp.set('palette', palette);
    const qs = sp.toString();
    window.history.replaceState(null, '', qs ? `/?${qs}` : '/');
  }, [text, font, palette]);

  const paletteEntry = PALETTES.find((p) => p.name === palette) ?? PALETTES[0];
  const trimmed = text.trim();
  const word = trimmed === '' ? 'Glitch Art' : trimmed;

  const liveSrc = useMemo(
    () => buildUrl(word, { font, c1: paletteEntry.c1, c2: paletteEntry.c2 }),
    [word, font, paletteEntry]
  );

  const fullUrl = `${SITE}${liveSrc}`;

  /** Google Fonts preview page seeded with the text the user typed. */
  const fontPreviewUrl = `https://fonts.google.com/?preview.text=${enc(word)}`;

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable — no-op */
    }
  };

  return (
    <div className="page">
      <header className="header">
        <a className="brand" href="/" aria-label="glitch-art — home">
          <img
            className="brand-logo"
            src="/Glitch%20Art"
            alt=""
            aria-hidden
          />
          <span className="visually-hidden">glitch-art</span>
        </a>
        <div className="header-links">
          <a className="header-link" href="#showcase">Showcases</a>
          <a className="header-link" href="#usage">Usage</a>
          <a className="header-link" href="https://github.com/Wxh16144/glitch-art">GitHub ↗</a>
        </div>
      </header>

      <main className="main" id="main">
        <div className="inner">
          {/* Hero + live tool — the first viewport is the product itself */}
          <section className="hero">
            <span className="hero-label">
              <span className="hero-label-dot" aria-hidden />
              <span className="mono">image/svg+xml · GET /{'{text}'}</span>
            </span>
            <h1 className="hero-title">Your text, glitched.</h1>
            <p className="hero-lede">
              Type a word and get a self-contained SVG — fonts embedded, colors
              doubled, motion included. Paste the URL into any markdown or HTML.
            </p>
          </section>

          <section className="tool" aria-label="Live preview">
            <div className="tool-controls">
              <div className="field field-text">
                <div className="field-label-row">
                  <label className="field-label" htmlFor="word">text</label>
                </div>
                <input
                  id="word"
                  className="input"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type something…"
                  maxLength={80}
                  spellCheck={false}
                />
              </div>
              <div className="field">
                <div className="field-label-row">
                  <label className="field-label" htmlFor="font">font</label>
                  <a
                    className="field-link mono"
                    href={fontPreviewUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Google Fonts ↗
                  </a>
                </div>
                <select
                  id="font"
                  className="select"
                  value={font}
                  onChange={(e) => setFont(e.target.value)}
                >
                  {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div className="field">
                <label className="field-label" htmlFor="palette">palette</label>
                <select
                  id="palette"
                  className="select"
                  value={palette}
                  onChange={(e) => setPalette(e.target.value)}
                >
                  {PALETTES.map((p) => <option key={p.name} value={p.name}>{p.name}</option>)}
                </select>
              </div>
            </div>

            <div className="tool-preview">
              <img src={liveSrc} alt={`Glitch art of “${word}”`} />
            </div>

            <div className="tool-url">
              <code>{fullUrl}</code>
              <div className="tool-url-actions">
                <a
                  className="copy-btn"
                  href={fullUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Open the SVG in a new tab"
                  title="Open in new tab"
                >
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                    strokeLinejoin="round" aria-hidden="true">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <path d="M15 3h6v6" />
                    <path d="M10 14 21 3" />
                  </svg>
                  Open
                </a>
                <button className="copy-btn" type="button" onClick={onCopy}>
                  {copied ? 'Copied' : 'Copy URL'}
                </button>
              </div>
            </div>
          </section>

          {/* Showcases — full-width plate, many moods the endpoint can hit */}
          <section className="section gallery" id="showcase">
            <div className="inner">
              <div className="section-head">
                <h2 className="section-title">A few moods</h2>
                <p className="section-desc">
                  Fonts, weights and palettes via short query aliases — sizes fit
                  the text automatically.
                </p>
              </div>
            </div>
            <div className="showcase">
              {SHOWCASES.map((item) => (
                <figure className="showcase-item" key={item.caption}>
                  <img
                    src={buildUrl(item.word, {
                      font: item.font,
                      fw: item.fw,
                      c1: PALETTES.find((p) => p.name === item.palette)?.c1,
                      c2: PALETTES.find((p) => p.name === item.palette)?.c2,
                      h: 96,
                    })}
                    alt={`“${item.word}” in ${item.font}`}
                  />
                  <figcaption className="showcase-caption mono">
                    {item.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>

          {/* Usage — code + parameters */}
          <section className="section" id="usage">
            <div className="inner">
              <div className="section-head">
                <h2 className="section-title">One URL, any surface</h2>
                <p className="section-desc">
                  The text lives in the path; everything else is optional.
                </p>
              </div>

              <div className="usage-grid">
                <div className="usage-block">
                  <pre><code>{`![Glitch Art](${SITE}/Passion)\n\n<img src="${SITE}/Passion?font=Sour+Gummy&fw=500"\n     alt="Passion" />`}</code></pre>
                </div>
                <div className="usage-block">
                  <pre><code>{`// smart sizing: no w/h → canvas fits the text
${SITE}/Hello%20World

// fixed canvas, auto font size
${SITE}/Passion?w=380&h=64

// fully controlled
${SITE}/Passion?fs=64&w=380&h=64&font=Sour%20Gummy&fw=500`}</code></pre>
                </div>
              </div>

              <table className="params-table">
                <caption className="visually-hidden">Query parameters</caption>
                <thead>
                  <tr>
                    <th scope="col">Alias</th>
                    <th scope="col">Legacy</th>
                    <th scope="col">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {(PARAM_ROWS(fontPreviewUrl)).map(([alias, legacy, desc]) => (
                    <tr key={alias}>
                      <td className="alias">{alias}</td>
                      <td className="code">{legacy}</td>
                      <td className="desc">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      <footer className="footer">
        <span>
          Built with <a href="https://nextjs.org">Next.js</a> on{' '}
          <a href="https://vercel.com">▲ Vercel</a>
        </span>
        <span>
          <a href="https://github.com/Wxh16144/glitch-art">Wxh16144 / glitch-art</a>
        </span>
      </footer>
    </div>
  );
}
