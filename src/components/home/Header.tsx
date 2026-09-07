/** Header — brand logo (API-generated) + anchor links. */
export default function Header() {
  return (
    <header className="header">
      <a className="brand" href="/" aria-label="glitch-art — home">
        <img className="brand-logo" src="/Glitch%20Art" alt="" aria-hidden />
        <span className="visually-hidden">glitch-art</span>
      </a>
      <div className="header-links">
        <a className="header-link" href="#showcase">Showcases</a>
        <a className="header-link" href="#usage">Usage</a>
        <a className="header-link" href="https://github.com/Wxh16144/glitch-art">GitHub ↗</a>
      </div>
    </header>
  );
}
