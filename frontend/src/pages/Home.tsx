import SearchBar from "../components/SearchBar";
import MapsSection from "../components/MapsSection";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero__content">
          <p className="hero__eyebrow">Utilitárias CS2</p>

          <h1 className="hero__title">
            Achou. Mirou. <span className="accent">Jogou.</span>
          </h1>

          <p className="hero__subtitle">
            <strong>Encontre sua utilitária em poucos segundos.</strong>
            <span className="hero__subtitle-extra">
              <br />
              Uma biblioteca rápida de utilitárias para CS2, feita para consulta
              durante a partida.
            </span>
          </p>

          <SearchBar />
        </div>
      </section>

      <MapsSection />
    </>
  );
}