import { useEffect } from "react";
import { useLocation } from "react-router";
import { Check, Crown } from "lucide-react";

export default function AboutPage() {
  const { hash } = useLocation();

  // Ao abrir /sobre#premium, rola até a seção Premium
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }

    document
      .getElementById(hash.slice(1))
      ?.scrollIntoView({ behavior: "smooth" });
  }, [hash]);

  return (
    <div className="container page about">
      <h1 className="page-title">Sobre o EZSmoke</h1>

      <section className="about__section">
        <p className="about__lead">
          O EZSmoke é uma biblioteca rápida de utilitárias para Counter-Strike 2,
          feita para consulta durante a partida.
        </p>
        <p>
          A proposta é simples: abriu, encontrou a utilitária, executou. Sem
          cursos, sem tutoriais longos e sem conteúdo desnecessário.
        </p>
      </section>

      <section className="about__section">
        <h2 className="about__title">Como usar</h2>
        <ul className="about__list">
          <li>
            <strong>Busca:</strong> digite o que procura, como "mirage jungle"
            ou "smoke ct".
          </li>
          <li>
            <strong>Mapas:</strong> escolha o mapa e filtre por lado, região e
            tipo.
          </li>
          <li>
            <strong>Execução:</strong> abra a utilitária para ver o vídeo, a
            posição e a mira.
          </li>
        </ul>
      </section>

      <section id="premium" className="about__section premium-info">
        <h2 className="about__title">
          <Crown size={20} className="accent" /> Premium
        </h2>
        <p>
          Dust II e Inferno são gratuitos e completos. O Premium libera:
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
        <p>
          É um <strong>pagamento único</strong>, sem mensalidade. A compra
          estará disponível em breve.
        </p>
      </section>

      <section className="about__section">
        <h2 className="about__title">Aviso legal</h2>
        <p>
          O EZSmoke não é afiliado, patrocinado ou endossado pela Valve
          Corporation. Counter-Strike 2 é marca registrada da Valve Corporation.
        </p>
      </section>
    </div>
  );
}