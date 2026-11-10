import type { GameMap } from "../types/map";
import type {
  LineupDetail,
  LineupFilters,
  LineupSummary,
} from "../types/lineup";
import type { CurrentUser, LoginResult, User } from "../types/auth";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3333/api";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Erro que também carrega o código HTTP (404, 401, 500...).
// Status 0 = não conseguiu nem falar com o servidor.
export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

interface RequestOptions {
  method?: "GET" | "POST";
  body?: unknown;
  token?: string | null;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {};

  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  // Envia o token no formato que o backend espera: "Bearer <token>"
  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      method: options.method ?? "GET",
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    throw new ApiError("Não foi possível conectar ao servidor.", 0);
  }

  const body = (await response.json().catch(() => null)) as ApiResponse<T> | null;

  if (!response.ok || !body?.success) {
    throw new ApiError(
      body?.message ?? "Erro ao comunicar com o servidor.",
      response.status,
    );
  }

  return body.data;
}

// ===== Mapas e lineups =====

export function fetchMaps() {
  return request<GameMap[]>("/maps");
}

export function fetchLineups(filters: LineupFilters = {}) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(filters)) {
    if (value) params.set(key, value);
  }

  const query = params.toString();
  return request<LineupSummary[]>(`/lineups${query ? `?${query}` : ""}`);
}

export function fetchLineupDetail(
  mapSlug: string,
  lineupSlug: string,
  token?: string | null,
) {
  return request<LineupDetail>(`/maps/${mapSlug}/lineups/${lineupSlug}`, {
    token,
  });
}

// ===== Autenticação =====

export function loginRequest(email: string, password: string) {
  return request<LoginResult>("/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

export function registerRequest(name: string, email: string, password: string) {
  return request<User>("/auth/register", {
    method: "POST",
    body: { name, email, password },
  });
}

export function fetchCurrentUser(token: string) {
  return request<CurrentUser>("/auth/me", { token });
}