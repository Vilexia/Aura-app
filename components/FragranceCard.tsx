"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Fragrance, FAMILY_META, GENDER_GLOW, priceFor } from "@/lib/types";
import { useAura } from "@/lib/store";
import Bottle from "./Bottle";

function stars(r: number) {
  const full = Math.round(r);
  return "★★★★★".slice(0, full) + "☆☆☆☆☆".slice(0, 5 - full);
}

/** Blush/gold particle burst at a button's position (survives re-renders). */
function burst(btn: HTMLElement | null) {
  if (!btn) return;
  const r = btn.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  for (let i = 0; i < 7; i++) {
    const s = document.createElement("span");
    s.className = "hb";
    const a = Math.random() * 2 * Math.PI;
    const d = 16 + Math.random() * 15;
    s.style.left = `${cx}px`;
    s.style.top = `${cy}px`;
    s.style.setProperty("--dx", `${Math.cos(a) * d}px`);
    s.style.setProperty("--dy", `${Math.sin(a) * d}px`);
    s.style.background = ["#c97b93", "#b08d57", "#e0a9bd"][i % 3];
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 650);
  }
}

/** Count-up match % badge. */
function MatchBadge({ value, delay = 0 }: { value: number; delay?: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0;
    let start: number | null = null;
    const dur = 650;
    const tick = (ts: number) => {
      if (start === null) start = ts;
      const p = Math.min(1, (ts - start) / dur);
      setN(Math.round(value * p));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    const t = setTimeout(() => {
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => {
      clearTimeout(t);
      cancelAnimationFrame(raf);
    };
  }, [value, delay]);
  return (
    <span className="rounded-full bg-gradient-to-r from-champagne to-gold px-2.5 py-1 text-xs font-bold text-white">
      {n}% match
    </span>
  );
}

export default function FragranceCard({
  f,
  match,
  index = 0,
}: {
  f: Fragrance;
  match?: number;
  index?: number;
}) {
  const { favs, toggleFav } = useAura();
  const fam = FAMILY_META[f.family];
  const glow = GENDER_GLOW[f.gender];
  const isFav = favs.includes(f.id);
  const heartRef = useRef<HTMLButtonElement>(null);

  return (
    <Link
      href={`/fragrance/${f.id}`}
      style={{ animationDelay: `${index * 55}ms` }}
      className="fx-card group block overflow-hidden rounded-[20px] border border-line bg-surface shadow-aura"
    >
      {/* Bottle stage — tinted by scent family */}
      <div
        className="relative flex h-[178px] items-center justify-center overflow-hidden"
        style={{ background: `linear-gradient(160deg, ${fam.color}12, ${fam.color}2b)` }}
      >
        <span
          aria-hidden
          className="glow-pulse pointer-events-none absolute h-[140px] w-[140px] rounded-full blur-[36px]"
          style={{ background: glow, opacity: 0.55 }}
        />
        <span
          className={`absolute left-3 top-3 z-[4] rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
            f.isNew
              ? "bg-champagne text-white"
              : "border border-line bg-white text-ink"
          }`}
        >
          {f.isNew ? "New 2026" : f.retailer}
        </span>
        <span
          className="absolute bottom-2.5 left-3 z-[4] rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.5px] text-white"
          style={{ background: glow }}
        >
          {f.gender}
        </span>
        <span className="absolute bottom-2.5 right-3 z-[4] rounded-full border border-line bg-white/85 px-2.5 py-0.5 text-[11px] font-bold text-ink">
          ${priceFor(f)}
        </span>
        <button
          ref={heartRef}
          onClick={(e) => {
            e.preventDefault();
            if (!isFav) burst(heartRef.current);
            toggleFav(f.id);
          }}
          aria-label="Save to favorites"
          className={`absolute right-2.5 top-2.5 z-[7] flex h-[34px] w-[34px] items-center justify-center rounded-full border border-line bg-white text-base leading-none ${
            isFav ? "text-champagne" : "text-muted"
          }`}
        >
          {isFav ? "♥" : "♡"}
        </button>
        <div className="floaty relative z-[2] drop-shadow-[0_8px_16px_rgba(50,40,30,.25)]">
          <Bottle family={f.family} gender={f.gender} height={140} seed={f.id} />
        </div>
      </div>

      <div className="px-4 pb-[18px] pt-3.5">
        <div className="text-[11px] font-semibold uppercase tracking-[1.4px] text-muted">
          {f.brand}
        </div>
        <div className="mb-2 mt-0.5 font-serif text-lg font-semibold leading-tight text-ink">
          {f.name}
        </div>
        <span
          className={`mb-2 inline-flex items-center gap-1.5 rounded-full border border-current px-2.5 py-1 text-xs font-medium ${fam.cls}`}
        >
          {fam.emoji} {fam.label}
        </span>
        <div className="mb-3 text-[12.5px] leading-snug text-muted">
          <b className="text-ink">Notes:</b>{" "}
          {[...f.top, ...f.heart].slice(0, 3).join(", ")}
        </div>
        <div className="flex items-center justify-between border-t border-line pt-2.5">
          <span className="text-sm tracking-wide" style={{ color: fam.color }}>
            {stars(f.rating)} <span className="text-xs text-muted">{f.rating}</span>
          </span>
          {match ? (
            <MatchBadge value={match} delay={index * 60} />
          ) : (
            <span className="text-xs text-muted">{fam.label}</span>
          )}
        </div>
      </div>

      {/* Hover story — full pyramid + why line (desktop hover only) */}
      <div className="pointer-events-none absolute inset-0 z-[6] hidden translate-y-3.5 flex-col justify-end gap-1 bg-[linear-gradient(170deg,rgba(255,255,255,.5)_0%,rgba(252,251,249,.94)_45%)] p-4 text-ink backdrop-blur-[5px] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:flex">
        <div className="mb-0.5 font-serif text-[17px] font-bold text-ink">{f.name}</div>
        <div className="text-[11px] leading-normal text-muted">
          <b className="mr-1 inline-block min-w-[40px] text-ink">Top</b>
          {f.top.join(" · ")}
        </div>
        <div className="text-[11px] leading-normal text-muted">
          <b className="mr-1 inline-block min-w-[40px] text-ink">Heart</b>
          {f.heart.join(" · ")}
        </div>
        <div className="text-[11px] leading-normal text-muted">
          <b className="mr-1 inline-block min-w-[40px] text-ink">Base</b>
          {f.base.join(" · ")}
        </div>
        <div className="mt-1 text-[10.5px] font-semibold text-champagne">
          ✦ {f.season === "All" ? "All seasons" : f.season} · {f.occasion} · {fam.label}
        </div>
        <span className="mt-2 inline-block self-start rounded-full bg-ink px-3 py-1.5 text-[11px] font-bold text-white">
          View →
        </span>
      </div>
    </Link>
  );
}
