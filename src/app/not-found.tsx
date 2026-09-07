import Link from 'next/link';

/** 404 — dogfoods the API: the visual IS a glitch-art SVG of "404". */
export default function NotFound() {
  return (
    <div className="nf">
      <img
        className="nf-art"
        src="/404?fw=700"
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
