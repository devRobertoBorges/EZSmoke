import type { GameMap } from "../types/map";
import type { LineupFilters, LineupSummary } from "../types/lineup";
// Endereço do backend. No deploy, vem de uma variável de ambiente.
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3333/api";

// Formato padrão das respostas do nosso backend
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`);
  const body = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !body.success) {
    throw new Error(body.message ?? "Erro ao comunicar com o servidor.");
  }

  return body.data;
}

export function fetchMaps() {
  return request<GameMap[]>("/maps");
}

export function fetchLineups(filters: LineupFilters = {}) {
  // Monta a parte "?map=dust2&side=TR..." só com os filtros preenchidos
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(filters)) {
    if (value) params.set(key, value);
  }

  const query = params.toString();
  return request<LineupSummary[]>(`/lineups${query ? `?${query}` : ""}`);
}