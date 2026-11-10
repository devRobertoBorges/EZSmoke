import { Check, Crown } from "lucide-react";

// Conteúdo do README → "Conteúdo Premium como marketing"
export default function PremiumLock() {
  return (
    <div className="premium-lock">
      <div className="premium-lock__icon">
        <Crown size={26} />
      </div>

      <h2 className="premium-lock__title">Desbloqueie esta lineup</h2>
      <p className="premium-lock__text">
        Esta utilitária faz parte do conteúdo Premium.
      </p>

      <ul className="premium-lock__benefits">
        <li>
          <Check size={16} className="accent" /> Todos os mapas
        </li>
        <li>
          <Check size={16} className="accent" /> Todas as utilitárias
        </li>
        <li>
          <Check size={16} className="accent" /> Sem anúncios
        </li>
      </ul>

      <p className="premium-lock__price">R$ XX,XX — pagamento único</p>

      {/* Desativado até implementarmos o pagamento */}
      <button type="button" className="button-primary" disabled>
        Desbloquear Premium
      </button>
    </div>
  );
}