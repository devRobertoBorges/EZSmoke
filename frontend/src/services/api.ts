import type { GameMap } from "../types/map";
import type {
  LineupDetail,
  LineupFilters,
  LineupSummary,
} from "../types/lineup";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3333/api";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Erro que também carrega o código HTTP (404, 401, 500...)
export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`);
  const body = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !body.success) {
    throw new ApiError(
      body.message ?? "Erro ao comunicar com o servidor.",
      response.status,
    );
  }

  return body.data;
}

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

export function fetchLineupDetail(mapSlug: string, lineupSlug: string) {
  return request<LineupDetail>(`/maps/${mapSlug}/lineups/${lineupSlug}`);
}