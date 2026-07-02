import { Fragrance, Family, ScentProfile } from "./types";
import { FRAGRANCES, getFragrance } from "./data";

/**
 * CONTENT-BASED recommendation engine (+ live rating feedback).
 *
 * This is the v1 brain described in Aura-Technical-Plan.md §4.1. It works on
 * day one with zero other users. Collaborative filtering (§4.2/§4.3) is layered
 * on post-launch once real ratings exist; the hybrid blend would combine the
 * score below with a collaborative score.
 */

const EMPTY_WEIGHTS: Record<Family, number> = {
  floral: 0, woody: 0, citrus: 0, fresh: 0, oriental: 0, gourmand: 0,
};

/** How strongly the user leans toward each scent family. */
export function familyWeights(
  profile: ScentProfile,
  ratings: Record<number, number>
): Record<Family, number> {
  const w = { ...EMPTY_WEIGHTS };

  // 1. quiz-selected families
  profile.families.forEach((f) => (w[f] += 2));

  // 2. seed fragrances the user typed in
  profile.seeds.forEach((s) => {
    const q = s.toLowerCase();
    const m = FRAGRANCES.find(
      (x) =>
        x.name.toLowerCase().includes(q) ||
        q.includes(x.name.toLowerCase()) ||
        x.brand.toLowerCase().includes(q)
    );
    if (m) w[m.family] += 2;
  });

  // 3. ratings: 4-5★ boost the family, 1-2★ penalize it
  Object.entries(ratings).forEach(([id, r]) => {
    const f = getFragrance(Number(id));
    if (f) w[f.family] += r - 3;
  });

  return w;
}

/** Score a single fragrance for this user. Higher = better match. */
export function scoreFor(
  f: Fragrance,
  profile: ScentProfile,
  ratings: Record<number, number>
): number {
  const w = familyWeights(profile, ratings);
  let s = 0;

  s += (w[f.family] || 0) * 10; // family affinity
  if (profile.occasion && f.occasion === profile.occasion) s += 8;
  if (profile.season && (f.season === profile.season || f.season === "All")) s += 6;

  // note overlap with loved (4-5★) fragrances
  const loved = Object.entries(ratings)
    .filter(([, r]) => r >= 4)
    .map(([id]) => getFragrance(Number(id)))
    .filter((x): x is Fragrance => Boolean(x));
  const fNotes = new Set(
    [...f.top, ...f.heart, ...f.base].map((n) => n.toLowerCase())
  );
  loved.forEach((l) => {
    [...l.top, ...l.heart, ...l.base].forEach((n) => {
      if (fNotes.has(n.toLowerCase())) s += 3;
    });
  });

  s += f.rating * 2 + f.popularity * 0.05; // quality / popularity prior
  if (ratings[f.id]) s -= 40; // de-prioritize already rated
  return s;
}

export interface RankedFragrance extends Fragrance {
  match: number;
}

/** Ranked recommendations with a friendly match %. */
export function recommend(
  profile: ScentProfile,
  ratings: Record<number, number>,
  opts: { familyFilter?: Family | "all"; limit?: number } = {}
): RankedFragrance[] {
  let list = [...FRAGRANCES];
  if (opts.familyFilter && opts.familyFilter !== "all") {
    list = list.filter((f) => f.family === opts.familyFilter);
  }
  const ranked = list
    .map((f) => ({ f, score: scoreFor(f, profile, ratings) }))
    .sort((a, b) => b.score - a.score)
    .map((x, i) => ({
      ...x.f,
      match: Math.max(72, Math.min(99, Math.round(99 - i * 2))),
    }));
  return opts.limit ? ranked.slice(0, opts.limit) : ranked;
}

/** "You may also love" — pure content similarity to one fragrance. */
export function similarTo(f: Fragrance, limit = 4): Fragrance[] {
  const fNotes = new Set([...f.top, ...f.heart, ...f.base]);
  return FRAGRANCES.filter((x) => x.id !== f.id)
    .map((x) => {
      let s = 0;
      if (x.family === f.family) s += 10;
      [...x.top, ...x.heart, ...x.base].forEach((n) => {
        if (fNotes.has(n)) s += 2;
      });
      if (x.season === f.season) s += 2;
      if (x.occasion === f.occasion) s += 2;
      return { x, s };
    })
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map((o) => o.x);
}
