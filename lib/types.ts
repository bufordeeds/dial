export interface Bean {
  id: string;
  name: string;
  roaster: string;
  roastDate?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Shot {
  id: string;
  beanId: string;
  grindSetting: number;
  doseGrams: number;
  yieldGrams: number;
  timeSeconds: number;
  tasteTags: TasteTag[];
  shotCharacteristics?: ShotCharacteristic[];
  isDialed: boolean;
  drinkType?: DrinkType;
  brewMethod?: BrewMethod;
  notes?: string;
  createdAt: string;
}

export type TasteTag =
  | "sour"
  | "bitter"
  | "weak"
  | "strong"
  | "balanced"
  | "astringent"
  | "muddy";

export type DrinkType = "espresso" | "latte" | "cappuccino" | "other";

export type BrewMethod =
  | "espresso"
  | "pour_over"
  | "french_press"
  | "aeropress"
  | "moka_pot"
  | "cold_brew"
  | "other";

export type ShotCharacteristic =
  | "full_body"
  | "light_body"
  | "thick_crema"
  | "light_crema"
  | "no_crema"
  | "tiger_stripes"
  | "blonde"
  | "channeling"
  | "fast_flow"
  | "slow_flow";

export interface ShotWithBean extends Shot {
  beanName: string;
  beanRoaster: string;
}
