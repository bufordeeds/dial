import type { TasteTag, DrinkType } from "./types";

export const TASTE_TAGS: { value: TasteTag; label: string; emoji: string }[] = [
  { value: "sour", label: "Sour", emoji: "🍋" },
  { value: "bitter", label: "Bitter", emoji: "☕" },
  { value: "weak", label: "Weak", emoji: "💧" },
  { value: "strong", label: "Strong", emoji: "💪" },
  { value: "balanced", label: "Balanced", emoji: "✨" },
  { value: "astringent", label: "Astringent", emoji: "😬" },
  { value: "muddy", label: "Muddy", emoji: "🌫️" },
];

export const DRINK_TYPES: { value: DrinkType; label: string }[] = [
  { value: "espresso", label: "Espresso" },
  { value: "latte", label: "Latte" },
  { value: "cappuccino", label: "Cappuccino" },
  { value: "other", label: "Other" },
];

export const DEFAULT_SHOT_VALUES = {
  grindSetting: 15,
  doseGrams: 18,
  yieldGrams: 36,
  timeSeconds: 28,
};

export const GRIND_RANGE = {
  min: 1,
  max: 30,
};
