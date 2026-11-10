import { Navigate, useNavigate } from "react-router";
import { Crown } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function AccountPage() {
  const { user, status, logout } = useAuth();
  const navigate = useNavigate();

  if (status === "loading") {
    return (
      <div className="container page">
        <p className="feedback">Carregando...</p>
      </div>
    );
  }

  // Sem login: manda para a tela de entrar e volta para cá depois
  if (!user) {
    return <Navigate to="/entrar" replace state={{ from: "/conta" }} />;
  }

  return (
    <div className="container page">
      <div className="auth-card">
        <h1 className="auth-title">Minha conta</h1>

        <dl className="details account-details">
          <div className="detail">
            <dt>Nome</dt>
            <dd>{user.name}</dd>
          </div>
          <div className="detail">
            <dt>E-mail</dt>
            <dd>{user.email}</dd>
          </div>
          <div className="detail">
            <dt>Plano</dt>
            <dd>
              {user.isPremium ? (
                <span className="badge badge--premium badge--inline">
                  <Crown size={12} />
                  Premium
                </span>
              ) : (
                "Free"
              )}
            </dd>
          </div>
        </dl>

        <button
          type="button"
          className="button-secondary auth-submit"
          onClick={() => {
            logout();
            navigate("/");
          }}
        >
          Sair
        </button>
      </div>
    </div>
  );
}