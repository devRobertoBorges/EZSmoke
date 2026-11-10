export type Side = "TR" | "CT";
export type Region = "A" | "B" | "MID";
export type UtilityType = "SMOKE" | "FLASH" | "MOLOTOV" | "HE";

export type ClickType = "LEFT" | "RIGHT" | "BOTH";
export type Movement = "STANDING" | "CROUCHING" | "WALKING" | "RUNNING";
export type ThrowTechnique = "NORMAL" | "JUMPTHROW";
export type MediaType = "MP4" | "WEBM" | "GIF";

// Formato de cada item de /api/lineups (só os dados do card)
export interface LineupSummary {
  id: number;
  slug: string;
  name: string;
  side: Side;
  region: Region;
  area: string | null;
  utilityType: UtilityType;
  description: string;
  resultImageUrl: string | null;
  requiresPremium: boolean;
  map: {
    id: number;
    name: string;
    slug: string;
  };
}

export interface LineupFilters {
  map?: string;
  side?: Side;
  region?: Region;
  type?: UtilityType;
  search?: string;
}

export interface LineupExecution {
  position: string | null;
  aim: string | null;
  clickType: ClickType;
  movement: Movement;
  throwTechnique: ThrowTechnique;
  mediaUrl: string | null;
  mediaType: MediaType | null;
}

// Resposta de /api/maps/:mapSlug/lineups/:slug
// Quando locked = true, execution vem como null.
export interface LineupDetail extends LineupSummary {
  locked: boolean;
  execution: LineupExecution | null;
}