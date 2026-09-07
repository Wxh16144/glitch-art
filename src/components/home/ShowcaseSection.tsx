import { buildUrl, paletteFor, SHOWCASES } from './config';

/** Full-width gallery plate — "a few moods" the endpoint can hit. */
export default function ShowcaseSection() {
  return (
    <section className="section gallery" id="showcase">
      <div className="inner">
        <div className="section-head">
          <h2 className="section-title">A few moods</h2>
          <p className="section-desc">
            Fonts, weights and palettes via short query aliases — sizes fit the
            text automatically.
          </p>
        </div>
      </div>

      <div className="showcase">
        {SHOWCASES.map((item) => {
          const palette = paletteFor(item.palette);
          const src = buildUrl(item.word, {
            font: item.font,
            fw: item.fw,
            c1: palette.c1,
            c2: palette.c2,
            h: 96,
          });
          return (
            <figure className="showcase-item" key={item.caption}>
              <a
                className="showcase-open"
                href={src}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open “${item.word}” in a new tab`}
                title="Open in new tab"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  strokeLinejoin="round" aria-hidden="true">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <path d="M15 3h6v6" />
                  <path d="M10 14 21 3" />
                </svg>
              </a>
              <img src={src} alt={`“${item.word}” in ${item.font}`} />
              <figcaption className="showcase-caption mono">
                {item.caption}
              </figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
}
