import { Link } from "react-router";
import Logo from "./Logo";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <Logo />

          <nav className="footer__nav" aria-label="Links do rodapé">
            <Link to="/">Início</Link>
            <Link to="/mapas">Mapas</Link>
            <Link to="/sobre">Sobre</Link>
          </nav>
        </div>

        {/* README → Aviso legal */}
        <p className="footer__legal">
          O EZSmoke não é afiliado, patrocinado ou endossado pela Valve
          Corporation. Counter-Strike 2 é marca registrada da Valve Corporation.
        </p>
        <p className="footer__copy">© {year} EZSmoke</p>
      </div>
    </footer>
  );
}