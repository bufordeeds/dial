import type { TasteTag } from "./types";

export interface DialSuggestion {
  issue: string;
  cause: string;
  suggestion: string;
}

export function getDialSuggestions(tasteTags: TasteTag[]): DialSuggestion[] {
  const suggestions: DialSuggestion[] = [];

  if (tasteTags.includes("sour")) {
    suggestions.push({
      issue: "Sour taste",
      cause: "Under-extraction",
      suggestion: "Try grinding finer, extending shot time, or increasing yield",
    });
  }

  if (tasteTags.includes("bitter")) {
    suggestions.push({
      issue: "Bitter taste",
      cause: "Over-extraction",
      suggestion: "Try grinding coarser, shortening shot time, or decreasing yield",
    });
  }

  if (tasteTags.includes("weak")) {
    suggestions.push({
      issue: "Weak/watery",
      cause: "Low extraction or wrong ratio",
      suggestion: "Check dose amount, try a finer grind, or decrease yield",
    });
  }

  if (tasteTags.includes("strong")) {
    suggestions.push({
      issue: "Too strong/intense",
      cause: "High concentration",
      suggestion: "Increase yield for a longer ratio (e.g., 1:2.5 instead of 1:2)",
    });
  }

  if (tasteTags.includes("astringent")) {
    suggestions.push({
      issue: "Astringent/dry",
      cause: "Channeling or over-extraction",
      suggestion: "Check puck prep, distribute grounds evenly, or try coarser grind",
    });
  }

  if (tasteTags.includes("muddy")) {
    suggestions.push({
      issue: "Muddy flavor",
      cause: "Uneven extraction or stale beans",
      suggestion: "Check bean freshness, improve distribution, or adjust grind",
    });
  }

  return suggestions;
}

export function getRatioDescription(ratio: number): string {
  if (ratio < 1.5) return "Ristretto";
  if (ratio < 2.2) return "Espresso";
  if (ratio < 3) return "Lungo";
  return "Very lungo";
}
