export type Family =
  | "floral"
  | "woody"
  | "citrus"
  | "fresh"
  | "oriental"
  | "gourmand";

export type Gender = "Women" | "Men" | "Unisex";
export type Season = "Spring" | "Summer" | "Fall" | "Winter" | "All";
export type Occasion = "Daily" | "Office" | "Evening";

export interface Fragrance {
  id: number;
  name: string;
  brand: string;
  family: Family;
  gender: Gender;
  season: Season;
  occasion: Occasion;
  rating: number;
  isNew: boolean;
  popularity: number;
  top: string[];
  heart: string[];
  base: string[];
  retailer: string;
  buyUrl: string;
}

export interface ScentProfile {
  families: Family[];
  occasion: Occasion | null;
  season: Season | null;
  seeds: string[];
}

/** Scent-family meta — light "champagne & graphite" theme colors. */
export const FAMILY_META: Record<
  Family,
  { label: string; cls: string; emoji: string; color: string }
> = {
  floral: { label: "Floral", cls: "t-floral", emoji: "✿", color: "#b85f8a" },
  woody: { label: "Woody", cls: "t-woody", emoji: "◎", color: "#8a6a3b" },
  citrus: { label: "Citrus", cls: "t-citrus", emoji: "☀", color: "#a8841a" },
  fresh: { label: "Fresh", cls: "t-fresh", emoji: "❄", color: "#3f8c76" },
  oriental: { label: "Oriental", cls: "t-oriental", emoji: "☾", color: "#9b5a86" },
  gourmand: { label: "Gourmand", cls: "t-gourmand", emoji: "◆", color: "#a86a45" },
};

/** Gender → bottle glow color (Women rose · Men powder blue · Unisex green). */
export const GENDER_GLOW: Record<Gender, string> = {
  Women: "#e0a9bd",
  Men: "#8fb0cf",
  Unisex: "#5f9e6e",
};

/** Sample pricing used by the prototype (mirrors aura-fragrance-prototype.html). */
export function priceFor(f: Fragrance): number {
  return Math.round(95 + f.rating * 22 + (f.id % 5) * 6);
}
