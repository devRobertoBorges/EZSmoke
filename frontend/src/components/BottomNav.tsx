import { NavLink } from "react-router";
import { House, Info, Map as MapIcon } from "lucide-react";

const ITEMS = [
  { to: "/", label: "Início", icon: House, end: true },
  { to: "/mapas", label: "Mapas", icon: MapIcon, end: false },
  { to: "/sobre", label: "Sobre", icon: Info, end: false },
];

// Só aparece no celular (o CSS esconde no desktop)
export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Navegação principal">
      {ITEMS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            isActive
              ? "bottom-nav__item bottom-nav__item--active"
              : "bottom-nav__item"
          }
        >
          <Icon size={22} aria-hidden="true" />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}