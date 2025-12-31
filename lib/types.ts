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
  isDialed: boolean;
  drinkType?: DrinkType;
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

export interface ShotWithBean extends Shot {
  beanName: string;
  beanRoaster: string;
}
