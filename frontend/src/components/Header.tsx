import { NavLink } from "react-router";
import { Menu, Search, User } from "lucide-react";
import Logo from "./Logo";


// Marca o link da página atual com o sublinhado laranja
function navClass({ isActive }: { isActive: boolean }) {
  return isActive ? "header__link header__link--active" : "header__link";
}

export default function Header() {
  return (
    <header className="header">
      <div className="container header__inner">
        <Logo />

                <nav className="header__nav" aria-label="Navegação principal">
          <NavLink to="/" end className={navClass}>
            Início
          </NavLink>
          <NavLink to="/mapas" className={navClass}>
            Mapas
          </NavLink>
          <NavLink to="/sobre" className={navClass}>
            Sobre
          </NavLink>
        </nav>

        <div className="header__actions">
          <button className="icon-button header__search" aria-label="Buscar">
            <Search size={20} />
          </button>

          <button className="button-primary header__login">
            <User size={18} />
            Entrar
          </button>

          <button className="icon-button header__menu" aria-label="Abrir menu">
            <Menu size={22} />
          </button>
        </div>
      </div>
    </header>
  );
}