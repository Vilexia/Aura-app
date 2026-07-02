"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getFragrance } from "@/lib/data";
import { similarTo } from "@/lib/recommend";
import { FAMILY_META, GENDER_GLOW, priceFor } from "@/lib/types";
import { useAura } from "@/lib/store";
import Bottle from "@/components/Bottle";
import FragranceCard from "@/components/FragranceCard";

export default function DetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const f = getFragrance(id);
  const { favs, ratings, toggleFav, rate } = useAura();
  const [hover, setHover] = useState(0);

  if (!f) {
    return (
      <div className="mx-auto max-w-[1080px] px-5 py-16 text-center text-muted">
        Fragrance not found. <Link href="/" className="text-champagne">Back to Discover</Link>
      </div>
    );
  }

  const fam = FAMILY_META[f.family];
  const glow = GENDER_GLOW[f.gender];
  const isFav = favs.includes(f.id);
  const current = ratings[f.id] || 0;
  const similar = similarTo(f, 4);

  const meta = [
    ["Gender", f.gender],
    ["Best season", f.season],
    ["Occasion", f.occasion],
    ["Rating", `${f.rating} ★`],
  ];
  const pyramid = [
    ["Top notes", f.top],
    ["Heart notes", f.heart],
    ["Base notes", f.base],
  ] as const;

  return (
    <div className="mx-auto max-w-[1080px] px-5 py-8">
      <Link href="/" className="text-sm font-semibold text-champagne">
        ← Back
      </Link>

      <div className="mt-4 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div
          className="relative flex items-center justify-center overflow-hidden rounded-[28px] border border-line p-10 shadow-aura"
          style={{ background: `linear-gradient(135deg, #fff 40%, ${fam.color}1f)` }}
        >
          <span
            aria-hidden
            className="glow-pulse absolute h-[240px] w-[240px] rounded-full blur-[60px]"
            style={{ background: glow, opacity: 0.5 }}
          />
          <div className="floaty relative z-[2] drop-shadow-[0_14px_26px_rgba(50,40,30,.25)]">
            <Bottle family={f.family} gender={f.gender} height={230} seed={f.id} />
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-[1.4px] text-muted">
            {f.brand}
          </div>
          <h1 className="mb-2.5 mt-1 font-serif text-4xl font-semibold text-ink">{f.name}</h1>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border border-current px-2.5 py-1 text-xs font-medium ${fam.cls}`}
          >
            {fam.emoji} {fam.label}
          </span>

          <div className="my-4 flex flex-wrap gap-2.5">
            {meta.map(([k, v]) => (
              <div key={k} className="min-w-[90px] flex-1 rounded-2xl border border-line bg-surface px-3.5 py-2.5">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">{k}</div>
                <div className="mt-0.5 text-sm font-semibold text-ink">{v}</div>
              </div>
            ))}
          </div>

          <h3 className="mt-1.5 font-serif text-base font-semibold text-ink">Scent pyramid</h3>
          <div className="my-3">
            {pyramid.map(([lvl, notes], i) => (
              <div
                key={lvl}
                className={`flex items-start gap-3.5 py-4 ${
                  i < 2 ? "border-b border-dashed border-line-deep" : ""
                }`}
              >
                <div
                  className="flex h-[46px] w-[46px] flex-shrink-0 items-center justify-center rounded-full border border-line bg-white text-lg"
                  style={{ color: fam.color }}
                >
                  {fam.emoji}
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[1.5px] text-champagne">{lvl}</div>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {notes.map((n) => (
                      <span key={n} className="rounded-full border border-line bg-white px-2.5 py-1 text-[12.5px] text-ink">
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2.5">
            <a
              href={f.buyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-gradient-to-r from-champagne to-champagne-soft px-6 py-3 text-sm font-semibold text-white shadow-glow"
            >
              Shop on {f.retailer} · ${priceFor(f)} ↗
            </a>
            <button
              onClick={() => toggleFav(f.id)}
              className="rounded-full border border-line-deep bg-surface px-6 py-3 text-sm font-semibold text-ink hover:border-champagne"
            >
              {isFav ? "♥ Saved" : "♡ Save"}
            </button>
          </div>

          {/* Rating widget */}
          <div className="mt-4 rounded-[18px] border border-line bg-surface p-5 shadow-aura">
            <div className="mb-2.5 flex justify-between text-sm font-semibold text-ink">
              <span>Rate this scent</span>
              <span className="text-xs font-normal text-muted">
                {current ? `You rated ${current}★` : ""}
              </span>
            </div>
            <div className="flex gap-1.5 text-3xl" onMouseLeave={() => setHover(0)}>
              {[1, 2, 3, 4, 5].map((v) => (
                <button
                  key={v}
                  onMouseEnter={() => setHover(v)}
                  onClick={() => rate(f.id, v)}
                  className={(hover || current) >= v ? "text-gold" : "text-line-deep"}
                  aria-label={`Rate ${v} stars`}
                >
                  ★
                </button>
              ))}
            </div>
            <div className="mt-2 text-xs text-muted">
              Your ratings retrain your matches — love woody scents and we&apos;ll
              surface more of them.
            </div>
          </div>
        </div>
      </div>

      <section className="py-10">
        <div className="mb-5 rounded-2xl border border-line border-l-4 border-l-champagne bg-surface px-5 py-4 shadow-aura">
          <h2 className="font-serif text-2xl font-semibold text-ink">You may also love</h2>
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-5">
          {similar.map((s, i) => (
            <FragranceCard key={s.id} f={s} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
