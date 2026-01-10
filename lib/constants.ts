import type { TasteTag, DrinkType, BrewMethod, ShotCharacteristic } from "./types";
import type { ComponentProps } from "react";
import type { Ionicons } from "@expo/vector-icons";

export type IconName = ComponentProps<typeof Ionicons>["name"];

export const TASTE_TAGS: { value: TasteTag; label: string; icon: IconName }[] = [
  { value: "sour", label: "Sour", icon: "alert-circle-outline" },
  { value: "bitter", label: "Bitter", icon: "flame-outline" },
  { value: "weak", label: "Weak", icon: "water-outline" },
  { value: "strong", label: "Strong", icon: "fitness-outline" },
  { value: "balanced", label: "Balanced", icon: "checkmark-circle-outline" },
  { value: "astringent", label: "Astringent", icon: "warning-outline" },
  { value: "muddy", label: "Muddy", icon: "cloud-outline" },
];

export const DRINK_TYPES: { value: DrinkType; label: string }[] = [
  { value: "espresso", label: "Espresso" },
  { value: "latte", label: "Latte" },
  { value: "cappuccino", label: "Cappuccino" },
  { value: "other", label: "Other" },
];

export const BREW_METHODS: { value: BrewMethod; label: string; icon: IconName }[] = [
  { value: "espresso", label: "Espresso", icon: "cafe-outline" },
  { value: "pour_over", label: "Pour Over", icon: "beaker-outline" },
  { value: "french_press", label: "French Press", icon: "flask-outline" },
  { value: "aeropress", label: "AeroPress", icon: "push-outline" },
  { value: "moka_pot", label: "Moka Pot", icon: "flame-outline" },
  { value: "cold_brew", label: "Cold Brew", icon: "snow-outline" },
  { value: "other", label: "Other", icon: "ellipsis-horizontal-outline" },
];

export const SHOT_CHARACTERISTICS: { value: ShotCharacteristic; label: string; icon: IconName; description: string }[] = [
  { value: "full_body", label: "Full Body", icon: "fitness-outline", description: "Rich, heavy mouthfeel" },
  { value: "light_body", label: "Light Body", icon: "leaf-outline", description: "Thin, watery texture" },
  { value: "thick_crema", label: "Thick Crema", icon: "layers-outline", description: "Dense golden foam layer" },
  { value: "light_crema", label: "Light Crema", icon: "remove-outline", description: "Thin, pale foam layer" },
  { value: "no_crema", label: "No Crema", icon: "water-outline", description: "No foam layer present" },
  { value: "tiger_stripes", label: "Tiger Stripes", icon: "reorder-four-outline", description: "Streaky pattern during extraction" },
  { value: "blonde", label: "Blonde", icon: "sunny-outline", description: "Light-colored extraction" },
  { value: "channeling", label: "Channeling", icon: "git-branch-outline", description: "Uneven water flow through puck" },
  { value: "fast_flow", label: "Fast Flow", icon: "flash-outline", description: "Quick extraction rate" },
  { value: "slow_flow", label: "Slow Flow", icon: "hourglass-outline", description: "Slow extraction rate" },
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
