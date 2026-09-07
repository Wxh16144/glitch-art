'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Header from './Header';
import LivePreview from './LivePreview';
import ShowcaseSection from './ShowcaseSection';
import UsageSection from './UsageSection';
import {
  buildUrl,
  enc,
  FALLBACK_WORD,
  FONTS,
  IS_DEV,
  paletteFor,
  PALETTES,
  PROD_SITE,
  UI_DEFAULTS,
} from './config';

/** Home controller: form state, URL mirroring, and page composition. */
export default function HomePage() {
  const [text, setText] = useState<string>(UI_DEFAULTS.text);
  const [font, setFont] = useState<string>(UI_DEFAULTS.font);
  const [palette, setPalette] = useState<string>(UI_DEFAULTS.palette);
  const [copied, setCopied] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  // Copy/open target — client-only (window is undefined during SSR).
  const [origin, setOrigin] = useState<string>('');

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
    setOrigin(IS_DEV ? window.location.origin : `https://${PROD_SITE}`);
  }, []);

  // Mirror the form state back into the URL so it can be shared.
  useEffect(() => {
    const sp = new URLSearchParams();
    const trimmed = text.trim();
    if (trimmed && trimmed !== UI_DEFAULTS.text) sp.set('t', trimmed);
    if (font !== UI_DEFAULTS.font) sp.set('f', font);
    if (palette !== UI_DEFAULTS.palette) sp.set('palette', palette);
    const qs = sp.toString();
    window.history.replaceState(null, '', qs ? `/?${qs}` : '/');
  }, [text, font, palette]);

  const word = text.trim() || FALLBACK_WORD;
  const paletteEntry = paletteFor(palette);

  const liveSrc = useMemo(
    () => buildUrl(word, { font, c1: paletteEntry.c1, c2: paletteEntry.c2 }),
    [word, font, paletteEntry]
  );

  // Clear the error state whenever the image source changes.
  useEffect(() => {
    setPreviewError(false);
  }, [liveSrc]);

  const fullUrl = `${origin}${liveSrc}`;
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
      <Header />

      <main className="main" id="main">
        <div className="inner">
          {/* Hero — the first viewport states what the product is. */}
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

          <LivePreview
            text={text}
            font={font}
            palette={palette}
            setText={setText}
            setFont={setFont}
            setPalette={setPalette}
            word={word}
            liveSrc={liveSrc}
            fullUrl={fullUrl}
            fontPreviewUrl={fontPreviewUrl}
            previewError={previewError}
            onPreviewError={() => setPreviewError(true)}
            copied={copied}
            onCopy={onCopy}
          />
        </div>

        <ShowcaseSection />

        <div className="inner">
          <UsageSection fontPreviewUrl={fontPreviewUrl} />
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
