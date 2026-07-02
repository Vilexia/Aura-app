"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useAura } from "@/lib/store";
import { recommend } from "@/lib/recommend";
import { Family, FAMILY_META } from "@/lib/types";
import FragranceCard from "@/components/FragranceCard";
import Filters, { FilterState } from "@/components/Filters";

export default function ForYouPage() {
  const { profile, ratings, hasProfile } = useAura();
  const [filters, setFilters] = useState<FilterState>({
    type: "all", gender: "all", occasion: "all", season: "all",
  });

  const recs = useMemo(
    () =>
      recommend(profile, ratings, {
        familyFilter: filters.type as Family | "all",
        limit: 12,
      }),
    [profile, ratings, filters.type]
  );

  const families = profile.families.map((f) => FAMILY_META[f].label).join(", ");
  const ratedCount = Object.keys(ratings).length;

  return (
    <div className="mx-auto max-w-[1080px] px-5 py-8">
      <div className="mb-5 rounded-2xl border border-line border-l-4 border-l-champagne bg-surface px-5 py-4 shadow-aura">
        <h2 className="font-serif text-2xl font-semibold text-ink">
          {hasProfile ? "Matched to your scent profile" : "Recommended for you"}
        </h2>
        <div className="mt-1 text-sm text-muted">
          {hasProfile
            ? `Based on ${families || "your taste"}${
                profile.season ? ` · ${profile.season}` : ""
              } — refined by ${ratedCount} rating(s)`
            : "Build your profile to personalize these matches"}
        </div>
      </div>

      {!hasProfile && (
        <Link
          href="/quiz"
          className="mb-6 inline-block rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-aura"
        >
          Take the scent quiz →
        </Link>
      )}

      <div className="mb-4">
        <Filters value={filters} onChange={setFilters} only={["type"]} />
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-5">
        {recs.map((f, i) => (
          <FragranceCard key={f.id} f={f} match={f.match} index={i} />
        ))}
      </div>
    </div>
  );
}
