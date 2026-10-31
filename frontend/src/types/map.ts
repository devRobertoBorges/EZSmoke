// Formato de um mapa, igual ao que a API devolve em /api/maps
export interface GameMap {
  id: number;
  name: string;
  slug: string;
  imageUrl: string;
  isFree: boolean;
}