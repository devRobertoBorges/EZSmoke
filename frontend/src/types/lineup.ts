export type Side = "TR" | "CT";
export type Region = "A" | "B" | "MID";
export type UtilityType = "SMOKE" | "FLASH" | "MOLOTOV" | "HE";

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