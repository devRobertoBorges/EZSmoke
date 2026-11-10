import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { ApiError } from "../services/api";

export default function RegisterPage() {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: string } | null)?.from ?? "/";

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Navigate to={from} replace />;
  }

  return (
    <div className="container page">
      <div className="auth-card">
        <h1 className="auth-title">Criar conta</h1>
        <p className="auth-subtitle">
          A conta é necessária para comprar o Premium. O conteúdo gratuito
          continua disponível sem cadastro.
        </p>

        <form
          className="auth-form"
          onSubmit={async (event) => {
            event.preventDefault();

            const form = new FormData(event.currentTarget);
            const name = String(form.get("name") ?? "").trim();
            const email = String(form.get("email") ?? "").trim();
            const password = String(form.get("password") ?? "");

            setError(null);
            setSubmitting(true);

            try {
              await register(name, email, password);
              navigate(from, { replace: true });
            } catch (err) {
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
            <span className="field__label">Nome</span>
            <input
              className="field__input"
              type="text"
              name="name"
              autoComplete="name"
              minLength={2}
              maxLength={100}
              required
            />
          </label>

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
              autoComplete="new-password"
              minLength={8}
              maxLength={72}
              required
            />
            <span className="field__hint">Mínimo de 8 caracteres.</span>
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
            {submitting ? "Criando conta..." : "Criar conta"}
          </button>
        </form>

        <p className="auth-switch">
          Já tem conta?{" "}
          <Link to="/entrar" state={{ from }} className="accent">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}