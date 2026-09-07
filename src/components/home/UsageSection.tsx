import { PROD_SITE } from './config';

interface UsageSectionProps {
  /** Google Fonts preview URL seeded with the current tool text. */
  fontPreviewUrl: string;
}

/** Parameter rows — plain data; the `f` row gets a live link below. */
const PARAM_ROWS: Array<[string, string, string]> = [
  ['— path', 'word', 'The text to render'],
  ['t', 'word', 'Text as a query param fallback'],
  ['f', 'font', 'Google Fonts family (readable alias: font)'],
  ['fs', 'fontSize', 'Font size in px (auto when omitted)'],
  ['fw', 'fontWeight', 'Font weight, e.g. 400 / 500 / 700'],
  ['w', 'width', 'Canvas width in px (auto when omitted)'],
  ['h', 'height', 'Canvas height in px (auto when omitted)'],
  ['c1', 'color1', 'First (base) text color'],
  ['c2', 'color2', 'Second (glitch) text color'],
  ['bg', 'background', 'Background color'],
];

/** "One URL, any surface" — live code samples + the parameters table. */
export default function UsageSection({ fontPreviewUrl }: UsageSectionProps) {
  return (
    <section className="section" id="usage">
      <div className="inner">
        <div className="section-head">
          <h2 className="section-title">One URL, any surface</h2>
          <p className="section-desc">
            Each example renders live — the image on the left <em>is</em> the
            URL on the right. No account, no build step.
          </p>
        </div>

        <div className="usage-cases">
          {/* Markdown / README */}
          <div className="usage-case">
            <div className="usage-art">
              <img src="/Passion?font=Sour%20Gummy&fw=500" alt="Passion in Sour Gummy" />
            </div>
            <div className="usage-body">
              <h3 className="usage-name">Markdown — README badges</h3>
              <p className="usage-desc">
                Paste into <code>.md</code> files: a repo header, a status
                line, a footer. One image, no HTML.
              </p>
              <pre className="usage-code"><code>{`![Passion](https://${PROD_SITE}/Passion?font=Sour%20Gummy&fw=500)`}</code></pre>
            </div>
          </div>

          {/* HTML */}
          <div className="usage-case">
            <div className="usage-art">
              <img src="/Hello%20World?font=Sour%20Gummy" alt="Hello World in Sour Gummy" />
            </div>
            <div className="usage-body">
              <h3 className="usage-name">HTML — anywhere</h3>
              <p className="usage-desc">
                Any <code>&lt;img&gt;</code> slot: dashboards, docs, email,
                slides. The URL is the whole API.
              </p>
              <pre className="usage-code"><code>{`<img src="https://${PROD_SITE}/Hello%20World" alt="Hello World" />`}</code></pre>
            </div>
          </div>

          {/* Smart sizing */}
          <div className="usage-case">
            <div className="usage-art">
              <div className="usage-stack">
                <img src="/Passion" alt="Passion, canvas auto-fit to the text" />
                <img src="/Passion?w=460&h=64" alt="Passion, fixed canvas at 460×64 with auto font-size" />
                <img src="/Passion?fs=64&w=460&h=64&font=Sour%20Gummy&fw=500" alt="Passion, fully controlled 460×64 at 64px Sour Gummy 500" />
              </div>
            </div>
            <div className="usage-body">
              <h3 className="usage-name">Smart sizing — three ways</h3>
              <p className="usage-desc">
                Omit <code>w</code>/<code>h</code> and the canvas fits the text;
                fix the canvas and the font size adapts; pin everything and it
                obeys.
              </p>
              <pre className="usage-code"><code>{`/Passion                    // auto canvas
/Passion?w=460&h=64         // fixed box, auto font
/Passion?fs=64&w=460&h=64   // fully controlled`}</code></pre>
            </div>
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
            {PARAM_ROWS.map(([alias, legacy, desc]) => (
              <tr key={alias}>
                <td className="alias">{alias}</td>
                <td className="code">{legacy}</td>
                <td className="desc">
                  {alias === 'f' ? (
                    <span>
                      Google Fonts family (readable alias:{' '}
                      <code>font</code>) —{' '}
                      <a href={fontPreviewUrl} target="_blank" rel="noreferrer">
                        find here ↗
                      </a>
                    </span>
                  ) : (
                    desc
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
