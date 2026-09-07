import Link from 'next/link';

/**
 * 404 — dogfoods the API: the visual IS a glitch-art SVG.
 *
 * Cannot use the word "404" itself: Next.js hardcodes `/404` (and `/500`) to
 * always resolve to this same not-found/error boundary in production,
 * regardless of app-defined routes — so `/404` can never reach `/[text]`.
 */
export default function NotFound() {
  return (
    <div className="nf">
      <img
        className="nf-art"
        src="/ERROR?fw=700"
        alt=""
        aria-hidden
        width={254}
        height={96}
      />
      <h1 className="nf-title">This page glitched out of existence.</h1>
      <p className="nf-desc">
        The text you’re looking for doesn’t render here — try another word.
      </p>
      <Link className="nf-link" href="/">
        ← Back to the maker
      </Link>
    </div>
  );
}
