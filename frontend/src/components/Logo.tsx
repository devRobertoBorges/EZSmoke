import { Link } from "react-router";

export default function Logo() {
  return (
    <Link to="/" className="logo" aria-label="EZSmoke - página inicial">
      {/* Mira (crosshair) desenhada em SVG */}
      <svg
        className="logo__icon"
        viewBox="0 0 40 40"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <circle cx="20" cy="20" r="11" />
        <path d="M20 2v8M20 30v8M2 20h8M30 20h8" />
        <circle cx="20" cy="20" r="2.5" fill="currentColor" stroke="none" />
      </svg>

      <span className="logo__text">
        <span className="logo__name">
          <span className="accent">EZ</span>Smoke
        </span>
        <span className="logo__tagline">Achou. Mirou. Jogou.</span>
      </span>
    </Link>
  );
}