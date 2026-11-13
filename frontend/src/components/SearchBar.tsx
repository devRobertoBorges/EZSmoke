import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowRight, Search } from "lucide-react";

interface SearchBarProps {
  initialQuery?: string;
  autoFocus?: boolean;
}

export default function SearchBar({
  initialQuery = "",
  autoFocus = false,
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const navigate = useNavigate();

  return (
    <form
      className="search"
      role="search"
      onSubmit={(event) => {
        event.preventDefault(); // impede a página de recarregar

        const term = query.trim();
        if (!term) return;

        // encodeURIComponent protege caracteres especiais na URL (espaço, &, ?...)
        navigate(`/busca?q=${encodeURIComponent(term)}`);
      }}
    >
      <Search className="search__icon" size={20} aria-hidden="true" />

      <input
        className="search__input"
        type="search"
        placeholder="Buscar smoke, flash, mapa, posição..."
        aria-label="Buscar utilitária"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        autoFocus={autoFocus}
      />

      <button className="search__button" type="submit" aria-label="Buscar">
        <ArrowRight size={22} />
      </button>
    </form>
  );
}