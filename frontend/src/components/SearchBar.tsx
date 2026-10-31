import { useState } from "react";
import { ArrowRight, Search } from "lucide-react";

export default function SearchBar() {
  // Guarda o que o usuário está digitando
  const [query, setQuery] = useState("");

  return (
    <form
      className="search"
      role="search"
      onSubmit={(event) => {
        event.preventDefault(); // impede a página de recarregar

        const term = query.trim();
        if (!term) return;

        // Por enquanto só mostra no console (F12).
        // Mais adiante, isso vai abrir a página de resultados.
        console.log("Buscar:", term);
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
      />

      <button className="search__button" type="submit" aria-label="Buscar">
        <ArrowRight size={22} />
      </button>
    </form>
  );
}