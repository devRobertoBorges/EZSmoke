import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="container page">
      <div className="feedback">
        <p>Página não encontrada.</p>
        <Link to="/" className="accent">
          Voltar para o início
        </Link>
      </div>
    </div>
  );
}