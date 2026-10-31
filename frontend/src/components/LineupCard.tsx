import { Link } from "react-router";
import { Crown, Lock } from "lucide-react";
import type { LineupSummary } from "../types/lineup";
import { utilityLabels } from "../utils/labels";

interface LineupCardProps {
  lineup: LineupSummary;
}

// README: Card = "É essa que eu quero?"
export default function LineupCard({ lineup }: LineupCardProps) {
  return (
    <Link
      to={`/mapas/${lineup.map.slug}/${lineup.slug}`}
      className="lineup-card"
    >
      <div
        className="lineup-card__media"
        style={
          lineup.resultImageUrl
            ? { backgroundImage: `url(${lineup.resultImageUrl})` }
            : undefined
        }
      >
        {lineup.requiresPremium && (
          <span className="badge badge--premium">
            <Crown size={12} />
            Premium
          </span>
        )}
      </div>

      <div className="lineup-card__body">
        <h3 className="lineup-card__name">
          {lineup.requiresPremium && <Lock size={14} aria-label="Bloqueada" />}
          {lineup.name}
        </h3>

        <p className="lineup-card__meta">
          {lineup.map.name} · {lineup.side} · {lineup.region} ·{" "}
          {utilityLabels[lineup.utilityType]}
        </p>

        <p className="lineup-card__description">{lineup.description}</p>
      </div>
    </Link>
  );
}