'use client';

import { FONTS, IS_DEV, PALETTES } from './config';

interface LivePreviewProps {
  text: string;
  font: string;
  palette: string;
  setText: (value: string) => void;
  setFont: (value: string) => void;
  setPalette: (value: string) => void;
  /** The effective word (non-empty fallback). */
  word: string;
  /** Relative src of the generated SVG. */
  liveSrc: string;
  /** Absolute URL shown/copied/opened. */
  fullUrl: string;
  /** Google Fonts preview URL seeded with the word. */
  fontPreviewUrl: string;
  /** The last image failed to load (font missing glyphs, …). */
  previewError: boolean;
  onPreviewError: () => void;
  copied: boolean;
  onCopy: () => void;
}

/** The interactive text→SVG tool: form, preview, and copy/open bar. */
export default function LivePreview(props: LivePreviewProps) {
  const {
    text, font, palette,
    setText, setFont, setPalette,
    word, liveSrc, fullUrl, fontPreviewUrl,
    previewError, onPreviewError, copied, onCopy,
  } = props;

  return (
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
            <a className="field-link mono" href={fontPreviewUrl} target="_blank" rel="noreferrer">
              Google Fonts ↗
            </a>
          </div>
          <select id="font" className="select" value={font} onChange={(e) => setFont(e.target.value)}>
            {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        <div className="field">
          <label className="field-label" htmlFor="palette">palette</label>
          <select id="palette" className="select" value={palette} onChange={(e) => setPalette(e.target.value)}>
            {PALETTES.map((p) => <option key={p.name} value={p.name}>{p.name}</option>)}
          </select>
        </div>
      </div>

      <div className="tool-preview">
        {previewError ? (
          <p className="preview-error" role="alert">
            That font can’t render “{word}”. Pick one that covers those
            characters — <code>Noto Sans JP</code> covers CJK.
          </p>
        ) : (
          <img src={liveSrc} onError={onPreviewError} alt={`Live preview: “${word}” glitched (${font})`} />
        )}
      </div>

      <div className="tool-url">
        {IS_DEV && <span className="env-badge">dev</span>}
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
  );
}
