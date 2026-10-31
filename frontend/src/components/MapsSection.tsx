import { useEffect, useState } from "react";
import { Crown } from "lucide-react";
import MapCard from "./MapCard";
import { fetchMaps } from "../services/api";
import type { GameMap } from "../types/map";

type Status = "loading" | "error" | "ready";

export default function MapsSection() {
  const [maps, setMaps] = useState<GameMap[]>([]);
  const [status, setStatus] = useState<Status>("loading");

  // Roda uma vez, quando a seção aparece na tela
  useEffect(() => {
    let ignore = false;

    fetchMaps()
      .then((data) => {
        if (!ignore) {
          setMaps(data);
          setStatus("ready");
        }
      })
      .catch((error) => {
        console.error("Erro ao carregar mapas:", error);
        if (!ignore) setStatus("error");
      });

    // Se o componente sair da tela antes da resposta chegar, ignora o resultado
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section className="maps-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Escolha seu mapa</h2>

          <div className="maps-legend">
            <span className="maps-legend__item">
              <span className="maps-legend__dot" /> Gratuito
            </span>
            <span className="maps-legend__item">
              <Crown size={14} className="accent" /> Premium
            </span>
          </div>
        </div>

        {status === "error" ? (
          <p className="feedback">
            Não foi possível carregar os mapas. Tente novamente em instantes.
          </p>
        ) : (
          <div className="maps-grid">
            {status === "loading"
              ? // Cards "fantasma" enquanto carrega
                Array.from({ length: 8 }, (_, index) => (
                  <div key={index} className="map-card map-card--skeleton" />
                ))
              : maps.map((map) => <MapCard key={map.id} map={map} />)}
          </div>
        )}
      </div>
    </section>
  );
}