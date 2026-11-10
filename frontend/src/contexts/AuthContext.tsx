import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  ApiError,
  fetchCurrentUser,
  loginRequest,
  registerRequest,
} from "../services/api";
import type { CurrentUser } from "../types/auth";

const TOKEN_KEY = "ezsmoke_token";

// O localStorage pode falhar (ex.: navegação anônima bloqueada),
// por isso cada acesso fica dentro de try/catch.
function readToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function saveToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Sem localStorage, o login vale só até recarregar a página
  }
}

type AuthStatus = "loading" | "ready";

interface AuthContextValue {
  token: string | null;
  user: CurrentUser | null;
  status: AuthStatus;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => readToken());
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>(() =>
    readToken() ? "loading" : "ready",
  );

  // Sempre que o token mudar, pergunta ao backend "quem sou eu?"
  useEffect(() => {
    if (!token) {
      setUser(null);
      setStatus("ready");
      return;
    }

    let ignore = false;
    setStatus("loading");

    fetchCurrentUser(token)
      .then((data) => {
        if (ignore) return;
        setUser(data);
        setStatus("ready");
      })
      .catch((error) => {
        if (ignore) return;

        // Token vencido ou inválido: descarta e segue como visitante
        if (error instanceof ApiError && error.status === 401) {
          saveToken(null);
          setToken(null);
        } else {
          console.error("Erro ao carregar usuário:", error);
        }

        setStatus("ready");
      });

    return () => {
      ignore = true;
    };
  }, [token]);

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginRequest(email, password);
    saveToken(result.token);
    setStatus("loading");
    setToken(result.token); // dispara o useEffect acima, que busca o /auth/me
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      await registerRequest(name, email, password);
      // Criou a conta? Já entra automaticamente.
      await login(email, password);
    },
    [login],
  );

  const logout = useCallback(() => {
    saveToken(null);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ token, user, status, login, register, logout }),
    [token, user, status, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Qualquer componente usa assim: const { user, login } = useAuth();
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth precisa ser usado dentro do AuthProvider");
  }

  return context;
}