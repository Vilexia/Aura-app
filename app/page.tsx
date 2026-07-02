"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FRAGRANCES } from "@/lib/data";
import { Fragrance, Family, FAMILY_META } from "@/lib/types";
import FragranceCard from "@/components/FragranceCard";
import Bottle from "@/components/Bottle";
import Filters, { FilterState } from "@/components/Filters";

const initial: FilterState = { type: "all", gender: "all", occasion: "all", season: "all" };

function pass(f: Fragrance, fl: FilterState) {
  if (fl.type !== "all" && f.family !== fl.type) return false;
  if (fl.gender !== "all" && f.gender !== fl.gender && f.gender !== "Unisex") return false;
  if (fl.occasion !== "all" && f.occasion !== fl.occasion) return false;
  if (fl.season !== "all" && f.season !== fl.season && f.season !== "All") return false;
  return true;
}

export default function DiscoverPage() {
  const [filters, setFilters] = useState<FilterState>(initial);

  const matching = useMemo(() => FRAGRANCES.filter((f) => pass(f, filters)), [filters]);
  const popular = useMemo(
    () => matching.filter((f) => !f.isNew).sort((a, b) => b.popularity - a.popularity),
    [matching]
  );
  const fresh = useMemo(
    () => matching.filter((f) => f.isNew).sort((a, b) => b.rating - a.rating),
    [matching]
  );

  const sod = FRAGRANCES[new Date().getDate() % FRAGRANCES.length];
  const activeCount = Object.values(filters).filter((v) => v !== "all").length;

  return (
    <div className="mx-auto max-w-[1080px] px-5">
      {/* Hero — contained white card */}
      <section className="mt-6 flex flex-wrap items-center gap-8 rounded-[20px] border border-line bg-white px-9 py-9 shadow-[0_12px_30px_rgba(50,40,30,.08)]">
        <div className="min-w-[280px] flex-1">
          <div className="text-xs font-semibold uppercase tracking-[3px] text-champagne">
            Your signature, perfected
          </div>
          <h1 className="my-3.5 font-serif text-4xl font-semibold leading-[1.04] text-ink md:text-5xl">
            Find the scent that
            <br />
            <em className="italic text-gold">feels like you</em>.
          </h1>
          <p className="mb-6 max-w-[480px] text-base leading-relaxed text-muted">
            Tell Aura Absolute what you already love and we&apos;ll match you to fragrances by
            note, family, mood, and season — then learn from every rating you give.
          </p>
          <div className="flex flex-wrap items-center gap-3.5">
            <Link
              href="/quiz"
              className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-aura"
            >
              Build my scent profile →
            </Link>
            <Link
              href="/for-you"
              className="rounded-full border border-line bg-white px-5 py-3 text-sm font-semibold text-champagne shadow-[0_4px_12px_rgba(50,40,30,.06)] transition hover:border-champagne"
            >
              See recommendations
            </Link>
          </div>
          <div className="mt-4 text-[12.5px] text-muted">
            ✦ Sample catalog now · Fragella / FragDB live data ready · 74k+ fragrances
          </div>
        </div>
        <div className="relative mx-auto flex h-[230px] w-[190px] flex-shrink-0 items-center justify-center">
          <span className="absolute h-[190px] w-[190px] rounded-full bg-gold opacity-40 blur-[52px]" />
          <div className="floaty relative z-[2] drop-shadow-[0_14px_26px_rgba(50,40,30,.25)]">
            <Bottle family="woody" gender="Unisex" height={210} seed={1} />
          </div>
        </div>
      </section>

      {/* Shop by family */}
      <section className="mt-5 grid grid-cols-3 gap-2 md:grid-cols-6 md:gap-3">
        {(Object.keys(FAMILY_META) as Family[]).map((k) => {
          const m = FAMILY_META[k];
          const on = filters.type === k;
          return (
            <button
              key={k}
              onClick={() => setFilters({ ...filters, type: on ? "all" : k })}
              className={`rounded-2xl border border-line bg-white px-1.5 py-3.5 text-center shadow-aura transition hover:-translate-y-0.5 ${
                on ? "shadow-[0_0_0_2px_currentColor]" : ""
              }`}
              style={{ color: m.color }}
            >
              <span
                className="mx-auto mb-1.5 flex h-9 w-9 items-center justify-center rounded-full text-base"
                style={{ background: `${m.color}1a`, color: m.color }}
              >
                {m.emoji}
              </span>
              <span className="block text-[12.5px] font-semibold text-ink">{m.label}</span>
            </button>
          );
        })}
      </section>

      {/* Scent of the day */}
      <section className="mt-5 flex flex-wrap items-center gap-5 rounded-[20px] border border-line border-l-4 border-l-gold bg-gradient-to-r from-white to-[#f4ede4] px-5 py-4 shadow-aura">
        <div className="relative flex h-[120px] w-[100px] flex-shrink-0 items-center justify-center">
          <span
            className="absolute h-[110px] w-[110px] rounded-full blur-[38px] opacity-50"
            style={{ background: FAMILY_META[sod.family].color }}
          />
          <div className="relative z-[2]">
            <Bottle family={sod.family} gender={sod.gender} height={110} seed={sod.id} />
          </div>
        </div>
        <div className="min-w-[200px] flex-1">
          <div className="text-[11px] font-bold uppercase tracking-[1.5px] text-gold">
            ✦ Scent of the day
          </div>
          <div className="font-serif text-2xl font-bold text-ink">{sod.name}</div>
          <div className="text-[13px] text-muted">
            {sod.brand} · {FAMILY_META[sod.family].label} ·{" "}
            {[...sod.top, ...sod.heart].slice(0, 3).join(", ")}
          </div>
        </div>
        <Link
          href={`/fragrance/${sod.id}`}
          className="rounded-full bg-gradient-to-r from-champagne to-champagne-soft px-5 py-2.5 text-[13px] font-semibold text-white shadow-glow"
        >
          View fragrance →
        </Link>
      </section>

      <section className="pt-8">
        <Filters value={filters} onChange={setFilters} />
        <div className="flex flex-wrap items-center gap-2 text-[13px] text-muted">
          <span>
            Showing <b className="text-ink">{matching.length}</b> fragrance
            {matching.length === 1 ? "" : "s"}
          </span>
          {activeCount > 0 && (
            <button
              onClick={() => setFilters(initial)}
              className="font-bold text-champagne"
            >
              Clear all
            </button>
          )}
        </div>
      </section>

      <Section title="New releases" sub="Freshly launched in 2026" items={fresh} />
      <Section title="Popular right now" sub="Most-loved across the Aura Absolute community" items={popular} />
    </div>
  );
}

function Section({
  title,
  sub,
  items,
}: {
  title: string;
  sub: string;
  items: Fragrance[];
}) {
  return (
    <section className="py-8">
      <div className="mb-5 rounded-2xl border border-line border-l-4 border-l-champagne bg-surface px-5 py-4 shadow-aura">
        <h2 className="font-serif text-2xl font-semibold text-ink">{title}</h2>
        <div className="mt-1 text-sm text-muted">{sub}</div>
      </div>
      {items.length ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-5">
          {items.map((f, i) => (
            <FragranceCard key={f.id} f={f} index={i} />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-muted">
          🫧 No matches here — try removing a filter.
        </div>
      )}
    </section>
  );
}
