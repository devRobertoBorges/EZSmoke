import { Link } from "react-router";
import { ArrowRight, Crown } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function PremiumBanner() {
  const { user } = useAuth();

  // Quem já é Premium não precisa ver o convite
  if (user?.isPremium) {
    return null;
  }

  return (
    <section className="premium-banner-section">
      <div className="container">
        <div className="premium-banner">
          <div className="premium-banner__icon">
            <Crown size={28} />
          </div>

          <div className="premium-banner__text">
            <h2 className="premium-banner__title">Desbloqueie todos os mapas</h2>
            <p className="premium-banner__subtitle">
              Tenha acesso a todos os mapas e navegue sem anúncios. Pagamento
              único.
            </p>
          </div>

          <Link to="/sobre#premium" className="button-primary premium-banner__cta">
            Desbloquear Premium
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}