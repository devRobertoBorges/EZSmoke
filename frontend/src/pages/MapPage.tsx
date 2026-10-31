import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router";
import { ArrowLeft, Crown, Search, X } from "lucide-react";
import FilterGroup from "../components/FilterGroup";
import LineupCard from "../components/LineupCard";
import { fetchLineups, fetchMaps } from "../services/api";
import type { GameMap } from "../types/map";
import type { LineupSummary, Region, Side, UtilityType } from "../types/lineup";
import { utilityLabels } from "../utils/labels";

type Status = "loading" | "error" | "ready";

// Valores oficiais (README)
const SIDES = ["TR", "CT"] as const;
const REGIONS = ["A", "B", "MID"] as const;
const TYPES = ["SMOKE", "FLASH", "MOLOTOV", "HE"] as const;

const sideOptions = SIDES.map((value) => ({ value, label: value }));
const regionOptions = REGIONS.map((value) => ({
  value,
  label: value === "MID" ? "Mid" : value,
}));
const typeOptions = TYPES.map((value) => ({
  value,
  label: utilityLabels[value],
}));

// Lê um valor da URL e só aceita se for um dos valores permitidos.
// Ex.: "?side=XYZ" é ignorado em vez de quebrar a página.
function pick<T extends string>(
  value: string | null,
  allowed: readonly T[],
): T | undefined {
  return allowed.includes(value as T) ? (value as T) : undefined;
}

export default function MapPage() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filtros atuais, lidos da URL
  const side = pick<Side>(searchParams.get("side"), SIDES);
  const region = pick<Region>(searchParams.get("region"), REGIONS);
  const type = pick<UtilityType>(searchParams.get("type"), TYPES);
  const search = searchParams.get("q")?.trim() || undefined;

  const hasFilters = Boolean(side || region || type || search);

  const [maps, setMaps] = useState<GameMap[]>([]);
  const [mapsStatus, setMapsStatus] = useState<Status>("loading");

  const [lineups, setLineups] = useState<LineupSummary[]>([]);
  const [lineupsStatus, setLineupsStatus] = useState<Status>("loading");

  // 1) Mapas: busca uma vez só
  useEffect(() => {
    let ignore = false;

    fetchMaps()
      .then((data) => {
        if (ignore) return;
        setMaps(data);
        setMapsStatus("ready");
      })
      .catch((error) => {
        console.error("Erro ao carregar mapas:", error);
        if (!ignore) setMapsStatus("error");
      });

    return () => {
      ignore = true;
    };
  }, []);

  // 2) Lineups: busca de novo sempre que o mapa ou algum filtro mudar
  useEffect(() => {
    if (!slug) return;

    let ignore = false;
    setLineupsStatus("loading");

    fetchLineups({ map: slug, side, region, type, search })
      .then((data) => {
        if (ignore) return;
        setLineups(data);
        setLineupsStatus("ready");
      })
      .catch((error) => {
        console.error("Erro ao carregar lineups:", error);
        if (!ignore) setLineupsStatus("error");
      });

    return () => {
      ignore = true;
    };
  }, [slug, side, region, type, search]);

  // Liga, troca ou remove um filtro na URL
  function updateFilter(key: string, value: string | undefined) {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true }, // não enche o histórico do "voltar" a cada clique
    );
  }

  function clearFilters() {
    setSearchParams({}, { replace: true });
  }

  const currentMap = maps.find((map) => map.slug === slug);

  if (mapsStatus === "loading") {
    return (
      <div className="container page">
        <p className="feedback">Carregando...</p>
      </div>
    );
  }

  if (mapsStatus === "error") {
    return (
      <div className="container page">
        <p className="feedback">
          Não foi possível carregar este mapa. Tente novamente em instantes.
        </p>
      </div>
    );
  }

  if (!currentMap) {
    return (
      <div className="container page">
        <div className="feedback">
          <p>Mapa não encontrado.</p>
          <Link to="/" className="accent">
            Voltar para o início
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container page">
      <div className="map-header">
        <Link to="/" className="icon-button" aria-label="Voltar para o início">
          <ArrowLeft size={20} />
        </Link>

        <h1 className="map-title">{currentMap.name}</h1>

        {currentMap.isFree ? (
          <span className="badge badge--free badge--inline">Free</span>
        ) : (
          <span className="badge badge--premium badge--inline">
            <Crown size={12} />
            Premium
          </span>
        )}
      </div>

      {/* Troca rápida de mapa */}
      <nav className="chips" aria-label="Trocar de mapa">
        {maps.map((map) => (
          <Link
            key={map.id}
            to={`/mapas/${map.slug}`}
            className={map.slug === slug ? "chip chip--active" : "chip"}
          >
            {map.name}
          </Link>
        ))}
      </nav>

      {/* Filtros combináveis */}
      <div className="filters">
        <FilterGroup
          label="Lado"
          options={sideOptions}
          selected={side}
          onChange={(value) => updateFilter("side", value)}
        />
        <FilterGroup
          label="Região"
          options={regionOptions}
          selected={region}
          onChange={(value) => updateFilter("region", value)}
        />
        <FilterGroup
          label="Tipo"
          options={typeOptions}
          selected={type}
          onChange={(value) => updateFilter("type", value)}
        />
      </div>

      {/* Busca dentro do mapa.
          O "key" faz o campo reiniciar quando a busca na URL muda
          (ex.: ao limpar os filtros ou trocar de mapa). */}
      <form
        key={search ?? ""}
        className="search search--compact"
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          const value = String(
            new FormData(event.currentTarget).get("q") ?? "",
          ).trim();
          updateFilter("q", value || undefined);
        }}
      >
        <input
          className="search__input search__input--no-icon"
          type="search"
          name="q"
          defaultValue={search ?? ""}
          placeholder={`Buscar em ${currentMap.name}...`}
          aria-label={`Buscar utilitária em ${currentMap.name}`}
        />
        <button className="search__button" type="submit" aria-label="Buscar">
          <Search size={20} />
        </button>
      </form>

      <div className="results-bar">
        <p className="results-count">
          {lineupsStatus === "ready" &&
            `${lineups.length} ${lineups.length === 1 ? "utilitária" : "utilitárias"}`}
        </p>

        {hasFilters && (
          <button type="button" className="clear-filters" onClick={clearFilters}>
            <X size={14} />
            Limpar filtros
          </button>
        )}
      </div>

      {lineupsStatus === "error" ? (
        <p className="feedback">
          Não foi possível carregar as utilitárias. Tente novamente em instantes.
        </p>
      ) : lineupsStatus === "loading" && lineups.length === 0 ? (
        <p className="feedback">Carregando utilitárias...</p>
      ) : lineups.length === 0 ? (
        <p className="feedback">
          {hasFilters
            ? "Nenhuma utilitária encontrada com esses filtros."
            : "Ainda não há utilitárias publicadas neste mapa."}
        </p>
      ) : (
        <div
          className={
            lineupsStatus === "loading"
              ? "lineups-grid is-loading"
              : "lineups-grid"
          }
        >
          {lineups.map((lineup) => (
            <LineupCard key={lineup.id} lineup={lineup} />
          ))}
        </div>
      )}
    </div>
  );
}