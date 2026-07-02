"use client";

import Link from "next/link";
import { useAura } from "@/lib/store";
import { familyWeights } from "@/lib/recommend";
import { getFragrance } from "@/lib/data";
import { Family, FAMILY_META } from "@/lib/types";
import FragranceCard from "@/components/FragranceCard";

export default function ProfilePage() {
  const { favs, ratings, profile, hasProfile } = useAura();

  const weights = familyWeights(profile, ratings);
  const positive = (Object.entries(weights) as [Family, number][])
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1]);
  const total = positive.reduce((sum, [, v]) => sum + v, 0) || 1;
  const max = Math.max(1, ...positive.map(([, v]) => v));

  const favFrags = favs.map((id) => getFragrance(id)).filter(Boolean);
  const ratedFrags = Object.keys(ratings)
    .map((id) => getFragrance(Number(id)))
    .filter(Boolean);

  const summary = hasProfile
    ? `${profile.families.map((f) => FAMILY_META[f].label).join(" · ") || "Building profile"} · ${
        Object.keys(ratings).length
      } rated · ${favs.length} saved`
    : "No profile yet — take the scent quiz.";

  return (
    <div className="mx-auto max-w-[1080px] px-5 py-8">
      <div className="flex flex-wrap items-center gap-5 rounded-[28px] border border-line bg-gradient-to-br from-white to-base p-7 shadow-aura">
        <div className="flex h-[74px] w-[74px] items-center justify-center rounded-full bg-gradient-to-br from-champagne to-gold font-serif text-3xl font-bold text-white">
          L
        </div>
        <div className="flex-1">
          <h2 className="font-serif text-2xl font-semibold text-ink">Lex</h2>
          <div className="mt-0.5 text-sm text-muted">vilexiajacks@gmail.com · Aura Absolute member</div>
          <div className="mt-1.5 text-sm text-muted">{summary}</div>
        </div>
        <Link
          href="/quiz"
          className="rounded-full border border-line-deep bg-surface px-4 py-2 text-[13px] font-semibold text-ink hover:border-champagne"
        >
          Retake quiz
        </Link>
      </div>

      {/* Scent DNA */}
      <section className="py-8">
        <div className="mb-5 rounded-2xl border border-line border-l-4 border-l-champagne bg-surface px-5 py-4 shadow-aura">
          <h2 className="font-serif text-xl font-semibold text-ink">Your scent DNA</h2>
          <div className="mt-1 text-sm text-muted">Built from your quiz + every rating</div>
        </div>
        {positive.length ? (
          <div className="flex flex-wrap gap-4">
            {positive.slice(0, 4).map(([k, v], i) => {
              const pct = Math.round((v / total) * 100);
              return (
                <div key={k} className="min-w-[150px] flex-1 rounded-[18px] border border-line bg-surface p-4">
                  <div
                    className="flex items-center gap-1.5 text-[13px] font-semibold"
                    style={{ color: FAMILY_META[k].color }}
                  >
                    {FAMILY_META[k].emoji} {FAMILY_META[k].label}
                  </div>
                  <div className="font-serif text-3xl font-bold text-ink">{pct}%</div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-line">
                    <div
                      className="grow-bar h-full rounded-full"
                      style={{
                        width: `${Math.round((v / max) * 100)}%`,
                        animationDelay: `${i * 130}ms`,
                        background: `linear-gradient(90deg, ${FAMILY_META[k].color}, #b08d57)`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-[18px] border border-line bg-surface p-10 text-center text-muted">
            🧬 Take the scent quiz to reveal your DNA.
          </div>
        )}
      </section>

      <Grid title="Saved favorites" items={favFrags} empty="No favorites yet — tap the heart on any fragrance." />
      <Grid title="Recently rated" items={ratedFrags} empty="You haven't rated anything yet." />
    </div>
  );
}

function Grid({
  title,
  items,
  empty,
}: {
  title: string;
  items: ReturnType<typeof getFragrance>[];
  empty: string;
}) {
  return (
    <section className="py-4">
      <div className="mb-5 rounded-2xl border border-line border-l-4 border-l-champagne bg-surface px-5 py-4 shadow-aura">
        <h2 className="font-serif text-xl font-semibold text-ink">{title}</h2>
      </div>
      {items.length ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-5">
          {items.map((f, i) => f && <FragranceCard key={f.id} f={f} index={i} />)}
        </div>
      ) : (
        <div className="py-8 text-center text-muted">{empty}</div>
      )}
    </section>
  );
}
