import { Crown, Layers, Lock } from "lucide-react";
import type { GameMap } from "../types/map";
import { Link } from "react-router";

interface MapCardProps {
  map: GameMap;
}

export default function MapCard({ map }: MapCardProps) {
  return (
    <Link to={`/mapas/${map.slug}`} className="map-card">
      {/* Imagem do mapa. Se o arquivo não existir, aparece só o fundo do card. */}
      <div
        className="map-card__image"
        style={{ backgroundImage: `url(${map.imageUrl})` }}
        aria-hidden="true"
      />

      {map.isFree ? (
        <span className="badge badge--free">Free</span>
      ) : (
        <span className="badge badge--premium">
          <Crown size={12} />
          Premium
        </span>
      )}

      <div className="map-card__info">
        <h3 className="map-card__name">{map.name}</h3>
        <p className="map-card__detail">
          {map.isFree ? (
            <>
              <Layers size={14} /> Todas as utilitárias disponíveis
            </>
          ) : (
            <>
              <Lock size={14} /> Apenas Premium
            </>
          )}
        </p>
      </div>
    </Link>
  );
}