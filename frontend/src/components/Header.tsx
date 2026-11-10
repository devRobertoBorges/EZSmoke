import { Link, NavLink } from "react-router";
import { Crown, Menu, Search, User } from "lucide-react";
import Logo from "./Logo";
import { useAuth } from "../contexts/AuthContext";

function navClass({ isActive }: { isActive: boolean }) {
  return isActive ? "header__link header__link--active" : "header__link";
}

export default function Header() {
  const { user, status } = useAuth();

  // Logado → "Minha conta"; visitante → tela de login
  const accountPath = user ? "/conta" : "/entrar";
  const firstName = user?.name.split(" ")[0];

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

          {/* Desktop: botão com texto. Some enquanto o login está sendo conferido. */}
          {status !== "loading" && (
            <Link
              to={accountPath}
              className={
                user
                  ? "button-secondary header__login"
                  : "button-primary header__login"
              }
            >
              {user?.isPremium ? (
                <Crown size={18} className="accent" />
              ) : (
                <User size={18} />
              )}
              {user ? firstName : "Entrar"}
            </Link>
          )}

          {/* Mobile: só o ícone */}
          <Link
            to={accountPath}
            className="icon-button header__account"
            aria-label={user ? "Minha conta" : "Entrar"}
          >
            {user?.isPremium ? (
              <Crown size={20} className="accent" />
            ) : (
              <User size={20} />
            )}
          </Link>

          <button className="icon-button header__menu" aria-label="Abrir menu">
            <Menu size={22} />
          </button>
        </div>
      </div>
    </header>
  );
}