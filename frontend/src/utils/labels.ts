import type {
  ClickType,
  Movement,
  ThrowTechnique,
  UtilityType,
} from "../types/lineup";

export const utilityLabels: Record<UtilityType, string> = {
  SMOKE: "Smoke",
  FLASH: "Flash",
  MOLOTOV: "Molotov",
  HE: "HE",
};

export const clickLabels: Record<ClickType, string> = {
  LEFT: "Esquerdo",
  RIGHT: "Direito",
  BOTH: "Esquerdo + direito",
};

export const movementLabels: Record<Movement, string> = {
  STANDING: "Parado",
  CROUCHING: "Agachado",
  WALKING: "Andando",
  RUNNING: "Correndo",
};

export const throwLabels: Record<ThrowTechnique, string> = {
  NORMAL: "Normal",
  JUMPTHROW: "Jumpthrow",
};