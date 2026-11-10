import { useEffect, useState, type ReactNode } from "react";
import { Link, useParams } from "react-router";
import {
  ArrowLeft,
  Crosshair,
  Footprints,
  Lock,
  MapPin,
  MousePointerClick,
  Rocket,
} from "lucide-react";
import ExecutionMedia from "../components/ExecutionMedia";
import PremiumLock from "../components/PremiumLock";
import { ApiError, fetchLineupDetail } from "../services/api";
import type { LineupDetail } from "../types/lineup";
import {
  clickLabels,
  movementLabels,
  throwLabels,
  utilityLabels,
} from "../utils/labels";

type Status = "loading" | "error" | "not-found" | "ready";

interface DetailItem {
  icon: ReactNode;
  label: string;
  value: string;
}

export default function LineupPage() {
  // Ex.: /mapas/dust2/smoke-xbox → mapSlug = "dust2", lineupSlug = "smoke-xbox"
  const { mapSlug, lineupSlug } = useParams();

  const [lineup, setLineup] = useState<LineupDetail | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    if (!mapSlug || !lineupSlug) return;

    let ignore = false;
    setStatus("loading");
    window.scrollTo(0, 0); // abre a página no topo

    fetchLineupDetail(mapSlug, lineupSlug)
      .then((data) => {
        if (ignore) return;
        setLineup(data);
        setStatus("ready");
      })
      .catch((error) => {
        if (ignore) return;

        if (error instanceof ApiError && error.status === 404) {
          setStatus("not-found");
        } else {
          console.error("Erro ao carregar lineup:", error);
          setStatus("error");
        }
      });

    return () => {
      ignore = true;
    };
  }, [mapSlug, lineupSlug]);

  if (status === "loading") {
    return (
      <div className="container page">
        <p className="feedback">Carregando...</p>
      </div>
    );
  }

  if (status === "not-found") {
    return (
      <div className="container page">
        <div className="feedback">
          <p>Lineup não encontrada.</p>
          <Link to={`/mapas/${mapSlug}`} className="accent">
            Ver as utilitárias deste mapa
          </Link>
        </div>
      </div>
    );
  }

  if (status === "error" || !lineup) {
    return (
      <div className="container page">
        <p className="feedback">
          Não foi possível carregar esta lineup. Tente novamente em instantes.
        </p>
      </div>
    );
  }

  const execution = lineup.execution;

  // Só monta a lista quando há acesso (execution não é null)
  const details: DetailItem[] = execution
    ? [
        {
          icon: <MapPin size={16} />,
          label: "Posição",
          value: execution.position ?? "—",
        },
        {
          icon: <Crosshair size={16} />,
          label: "Mira",
          value: execution.aim ?? "—",
        },
        {
          icon: <MousePointerClick size={16} />,
          label: "Clique",
          value: clickLabels[execution.clickType],
        },
        {
          icon: <Footprints size={16} />,
          label: "Movimento",
          value: movementLabels[execution.movement],
        },
        {
          icon: <Rocket size={16} />,
          label: "Arremesso",
          value: throwLabels[execution.throwTechnique],
        },
      ]
    : [];

  return (
    <div className="container page">
      <Link to={`/mapas/${lineup.map.slug}`} className="back-link">
        <ArrowLeft size={18} />
        {lineup.map.name}
      </Link>

      <header className="lineup-header">
        <h1 className="lineup-title">
          {lineup.locked && <Lock size={24} aria-label="Bloqueada" />}
          {lineup.name}
        </h1>

        <p className="lineup-card__meta">
          {lineup.map.name} · {lineup.side} · {lineup.region} ·{" "}
          {utilityLabels[lineup.utilityType]}
        </p>

        <p className="lineup-description">{lineup.description}</p>
      </header>

      <div className="lineup-layout">
        <ExecutionMedia
          mediaUrl={execution?.mediaUrl ?? null}
          mediaType={execution?.mediaType ?? null}
          previewUrl={lineup.resultImageUrl}
          locked={lineup.locked}
        />

        {lineup.locked || !execution ? (
          <PremiumLock />
        ) : (
          <dl className="details">
            {details.map((item) => (
              <div key={item.label} className="detail">
                <dt>
                  {item.icon}
                  {item.label}
                </dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </div>
  );
}