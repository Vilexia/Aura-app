"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Family, Occasion, Season, ScentProfile } from "./types";

/**
 * Client-side store for the prototype: favorites, ratings, and scent profile,
 * persisted to localStorage. In production these live in PostgreSQL behind the
 * API (tables: ratings, favorites, scent_profiles) — see the plan doc.
 */

interface AuraState {
  favs: number[];
  ratings: Record<number, number>;
  profile: ScentProfile;
  hasProfile: boolean;
  toggleFav: (id: number) => void;
  rate: (id: number, stars: number) => void;
  setProfile: (p: ScentProfile) => void;
}

const defaultProfile: ScentProfile = {
  families: [],
  occasion: null,
  season: null,
  seeds: [],
};

const Ctx = createContext<AuraState | null>(null);

export function AuraProvider({ children }: { children: React.ReactNode }) {
  const [favs, setFavs] = useState<number[]>([]);
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [profile, setProfileState] = useState<ScentProfile>(defaultProfile);
  const [hasProfile, setHasProfile] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("aura-state");
      if (raw) {
        const s = JSON.parse(raw);
        setFavs(s.favs ?? []);
        setRatings(s.ratings ?? {});
        setProfileState(s.profile ?? defaultProfile);
        setHasProfile(s.hasProfile ?? false);
      }
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(
      "aura-state",
      JSON.stringify({ favs, ratings, profile, hasProfile })
    );
  }, [favs, ratings, profile, hasProfile, loaded]);

  const toggleFav = (id: number) =>
    setFavs((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));

  const rate = (id: number, stars: number) =>
    setRatings((r) => ({ ...r, [id]: stars }));

  const setProfile = (p: ScentProfile) => {
    setProfileState(p);
    setHasProfile(true);
  };

  return (
    <Ctx.Provider
      value={{ favs, ratings, profile, hasProfile, toggleFav, rate, setProfile }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAura() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAura must be used inside <AuraProvider>");
  return c;
}

export type { Family, Occasion, Season, ScentProfile };
