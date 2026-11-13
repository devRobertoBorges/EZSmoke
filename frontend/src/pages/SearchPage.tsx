import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import LineupCard from "../components/LineupCard";
import SearchBar from "../components/SearchBar";
import { fetchLineups } from "../services/api";
import type { LineupSummary } from "../types/lineup";

type Status = "idle" | "loading" | "error" | "ready";

// Exemplos do README → Busca
const EXAMPLES = [
  "mirage jungle",
  "dust xbox",
  "inferno banana",
  "flash b",
  "mirage smoke a",
];

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q")?.trim() ?? "";

  const [lineups, setLineups] = useState<LineupSummary[]>([]);
  const [status, setStatus] = useState<Status>("idle");

  // Busca de novo sempre que o termo na URL mudar
  useEffect(() => {
    if (!q) {
      setLineups([]);
      setStatus("idle");
      return;
    }

    let ignore = false;
    setStatus("loading");

    fetchLineups({ search: q })
      .then((data) => {
        if (ignore) return;
        setLineups(data);
        setStatus("ready");
      })
      .catch((error) => {
        console.error("Erro na busca:", error);
        if (!ignore) setStatus("error");
      });

    return () => {
      ignore = true;
    };
  }, [q]);

  return (
    <div className="container page">
      <h1 className="page-title">Buscar utilitárias</h1>

      {/* key={q}: o campo se atualiza ao usar o voltar/avançar do navegador */}
      <div className="search-page__form">
        <SearchBar key={q} initialQuery={q} autoFocus={!q} />
      </div>

      {status === "idle" && (
        <div className="search-tips">
          <p>Experimente buscar por mapa, tipo, lado, região ou local:</p>
          <div className="search-tips__list">
            {EXAMPLES.map((example) => (
              <Link
                key={example}
                to={`/busca?q=${encodeURIComponent(example)}`}
                className="chip"
              >
                {example}
              </Link>
            ))}
          </div>
        </div>
      )}

      {status === "loading" && <p className="feedback">Buscando...</p>}

      {status === "error" && (
        <p className="feedback">
          Não foi possível fazer a busca. Tente novamente em instantes.
        </p>
      )}

      {status === "ready" && (
        <>
          <p className="results-count">
            {lineups.length}{" "}
            {lineups.length === 1 ? "resultado" : "resultados"} para "{q}"
          </p>

          {lineups.length === 0 ? (
            <p className="feedback">
              Nenhuma utilitária encontrada. Tente usar o nome do mapa, o tipo
              (smoke, flash, molotov, HE) ou o local (jungle, banana, long...).
            </p>
          ) : (
            <div className="lineups-grid">
              {lineups.map((lineup) => (
                <LineupCard key={lineup.id} lineup={lineup} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}