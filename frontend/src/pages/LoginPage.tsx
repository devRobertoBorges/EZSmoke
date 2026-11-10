import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { ApiError } from "../services/api";

export default function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Para onde voltar depois do login (ex.: a lineup que a pessoa tentou abrir)
  const from = (location.state as { from?: string } | null)?.from ?? "/";

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Já está logado? Não faz sentido ver esta tela.
  if (user) {
    return <Navigate to={from} replace />;
  }

  return (
    <div className="container page">
      <div className="auth-card">
        <h1 className="auth-title">Entrar</h1>
        <p className="auth-subtitle">Acesse sua conta EZSmoke.</p>

        <form
          className="auth-form"
          onSubmit={async (event) => {
            event.preventDefault();

            const form = new FormData(event.currentTarget);
            const email = String(form.get("email") ?? "").trim();
            const password = String(form.get("password") ?? "");

            setError(null);
            setSubmitting(true);

            try {
              await login(email, password);
              navigate(from, { replace: true });
            } catch (err) {
              // A mensagem vem do backend (ex.: "E-mail ou senha inválidos.")
              setError(
                err instanceof ApiError
                  ? err.message
                  : "Erro inesperado. Tente novamente.",
              );
              setSubmitting(false);
            }
          }}
        >
          <label className="field">
            <span className="field__label">E-mail</span>
            <input
              className="field__input"
              type="email"
              name="email"
              autoComplete="email"
              required
            />
          </label>

          <label className="field">
            <span className="field__label">Senha</span>
            <input
              className="field__input"
              type="password"
              name="password"
              autoComplete="current-password"
              required
            />
          </label>

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="button-primary auth-submit"
            disabled={submitting}
          >
            {submitting ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="auth-switch">
          Ainda não tem conta?{" "}
          <Link to="/cadastro" state={{ from }} className="accent">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}