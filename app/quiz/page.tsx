"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAura } from "@/lib/store";
import { Family, Occasion, Season, FAMILY_META } from "@/lib/types";

const FAMILIES: [Family, string, string][] = [
  ["floral", "Floral", "Romantic & pretty"],
  ["woody", "Woody", "Warm & grounded"],
  ["citrus", "Citrus", "Bright & zesty"],
  ["fresh", "Fresh", "Clean & airy"],
  ["oriental", "Oriental", "Spicy & sensual"],
  ["gourmand", "Gourmand", "Sweet & edible"],
];
const OCCASIONS: [Occasion, string, string, string][] = [
  ["Daily", "☀", "Everyday", "Signature, go-anywhere"],
  ["Office", "▣", "Work", "Subtle & polished"],
  ["Evening", "☾", "Evening", "Bold & memorable"],
];
const SEASONS: [Season, string, string, string][] = [
  ["Spring", "✿", "Spring", "Fresh florals"],
  ["Summer", "☀", "Summer", "Light & citrusy"],
  ["Fall", "❦", "Fall", "Warm & spicy"],
  ["Winter", "❄", "Winter", "Rich & cozy"],
];
const QCOLOR: Record<string, string> = {
  Daily: "#3f8c76", Office: "#5a616b", Evening: "#9b5a86",
  Spring: "#b85f8a", Summer: "#a8841a", Fall: "#a86a45", Winter: "#7d9db8",
};

const ADJ: Record<Family, string> = {
  floral: "Romantic", woody: "Grounded", citrus: "Radiant",
  fresh: "Crisp", oriental: "Magnetic", gourmand: "Indulgent",
};
const NOUN: Record<Occasion, string> = {
  Daily: "Essentialist", Office: "Modernist", Evening: "Icon",
};

const SPARKS: [number, number][] = [
  [8, 12], [88, 18], [14, 78], [80, 84], [50, 6], [6, 45], [92, 55],
];

export default function QuizPage() {
  const router = useRouter();
  const { setProfile } = useAura();
  const [step, setStep] = useState(0);
  const [families, setFamilies] = useState<Family[]>([]);
  const [occasion, setOccasion] = useState<Occasion | null>(null);
  const [season, setSeason] = useState<Season | null>(null);
  const [seeds, setSeeds] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [reveal, setReveal] = useState(false);

  const toggleFamily = (f: Family) =>
    setFamilies((cur) => (cur.includes(f) ? cur.filter((x) => x !== f) : [...cur, f]));

  const addSeed = (v: string) => {
    const t = v.trim();
    if (t) setSeeds((s) => [...s, t]);
    setInput("");
  };

  const next = () => {
    if (step < 3) setStep(step + 1);
    else {
      setProfile({ families, occasion, season, seeds });
      setReveal(true);
    }
  };

  const persona = `The ${families[0] ? ADJ[families[0]] : "Curious"} ${
    occasion ? NOUN[occasion] : "Explorer"
  }`;

  return (
    <div className="mx-auto max-w-[1080px] px-5">
      <div className="mx-auto my-8 max-w-[640px] rounded-[28px] border border-line bg-surface p-8 shadow-auralg md:p-9">
        <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full bg-champagne transition-all"
            style={{ width: `${((step + 1) / 4) * 100}%` }}
          />
        </div>

        <div className="text-xs font-semibold uppercase tracking-[2px] text-champagne">
          Step {step + 1} of 4
        </div>

        {step === 0 && (
          <Step title="Which scent families pull you in?">
            <Grid>
              {FAMILIES.map(([v, t, d]) => (
                <Opt
                  key={v}
                  selected={families.includes(v)}
                  onClick={() => toggleFamily(v)}
                  emoji={FAMILY_META[v].emoji}
                  color={FAMILY_META[v].color}
                  title={t}
                  desc={d}
                />
              ))}
            </Grid>
          </Step>
        )}

        {step === 1 && (
          <Step title="When will you wear it most?">
            <Grid>
              {OCCASIONS.map(([v, e, t, d]) => (
                <Opt
                  key={t}
                  selected={occasion === v}
                  onClick={() => setOccasion(v)}
                  emoji={e}
                  color={QCOLOR[v]}
                  title={t}
                  desc={d}
                />
              ))}
            </Grid>
          </Step>
        )}

        {step === 2 && (
          <Step title="What's your season?">
            <Grid>
              {SEASONS.map(([v, e, t, d]) => (
                <Opt
                  key={v}
                  selected={season === v}
                  onClick={() => setSeason(v)}
                  emoji={e}
                  color={QCOLOR[v]}
                  title={t}
                  desc={d}
                />
              ))}
            </Grid>
          </Step>
        )}

        {step === 3 && (
          <Step title="Fragrances you already love">
            <p className="mb-3.5 text-[13px] text-muted">
              Add a few by name or brand — these seed your scent profile.
            </p>
            <div className="flex flex-wrap gap-2 rounded-2xl border border-line bg-white p-3">
              {seeds.map((s, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1.5 rounded-full border border-champagne bg-[#f8f2e7] px-3 py-1.5 text-[13px] text-ink"
                >
                  {s}
                  <b
                    className="cursor-pointer text-champagne"
                    onClick={() => setSeeds(seeds.filter((_, j) => j !== i))}
                  >
                    ✕
                  </b>
                </span>
              ))}
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSeed(input);
                  }
                }}
                placeholder="e.g. Baccarat Rouge 540, Chanel…"
                className="min-w-[120px] flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-muted"
              />
            </div>
            <div className="mt-2.5 text-xs text-muted">
              Try:{" "}
              {["Baccarat Rouge 540", "Santal 33", "Black Opium"].map((s) => (
                <button key={s} onClick={() => addSeed(s)} className="mr-1 font-semibold text-champagne">
                  {s}
                </button>
              ))}
            </div>
          </Step>
        )}

        <div className="mt-7 flex justify-between">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            className={`rounded-full border border-line-deep bg-surface px-6 py-3 text-sm font-semibold text-ink ${
              step === 0 ? "invisible" : ""
            }`}
          >
            ← Back
          </button>
          <button
            onClick={next}
            className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-aura"
          >
            {step === 3 ? "See my matches ✨" : "Continue →"}
          </button>
        </div>
      </div>

      {/* Scent-personality reveal */}
      {reveal && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-[rgba(47,38,34,.45)] p-5 backdrop-blur-[6px]"
          onClick={(e) => {
            if (e.target === e.currentTarget) setReveal(false);
          }}
        >
          <div className="reveal-in relative w-full max-w-[430px] overflow-hidden rounded-[26px] border border-line bg-gradient-to-br from-white to-[#f6f3ee] px-8 pb-8 pt-10 text-center shadow-[0_30px_80px_rgba(30,24,20,.35)]">
            {SPARKS.map(([x, y], i) => (
              <span
                key={i}
                className="spark"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  animationDelay: `${i * 0.25}s`,
                  fontSize: `${12 + (i % 3) * 5}px`,
                }}
              >
                ✦
              </span>
            ))}
            <div className="text-[11px] font-bold uppercase tracking-[2.5px] text-champagne">
              ✦ Your scent DNA
            </div>
            <h3 className="gold-text my-2.5 font-serif text-3xl font-extrabold">{persona}</h3>
            <div className="mb-4 text-[13.5px] text-muted">
              {families.length
                ? families.map((f) => FAMILY_META[f].label).join(" · ")
                : "Open to everything"}
              {occasion ? ` · ${occasion} energy` : ""}
              {season ? ` · ${season} depth` : ""}
            </div>
            <div className="mb-5 flex flex-wrap justify-center gap-2">
              {families.map((f) => (
                <span
                  key={f}
                  className="rounded-full border border-current px-3 py-1 text-xs font-semibold"
                  style={{ color: FAMILY_META[f].color }}
                >
                  {FAMILY_META[f].label}
                </span>
              ))}
              {occasion && (
                <span
                  className="rounded-full border border-current px-3 py-1 text-xs font-semibold"
                  style={{ color: QCOLOR[occasion] }}
                >
                  {occasion}
                </span>
              )}
              {season && (
                <span
                  className="rounded-full border border-current px-3 py-1 text-xs font-semibold"
                  style={{ color: QCOLOR[season] }}
                >
                  {season}
                </span>
              )}
            </div>
            <button
              onClick={() => router.push("/for-you")}
              className="rounded-full bg-gradient-to-r from-champagne to-champagne-soft px-6 py-3 text-sm font-semibold text-white shadow-glow"
            >
              See my matches →
            </button>
            <div className="mt-3">
              <button
                onClick={() => {
                  setReveal(false);
                  setStep(0);
                }}
                className="text-[13px] font-semibold text-champagne"
              >
                Retake quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Step({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-6 mt-2 font-serif text-2xl font-semibold text-ink">{title}</h3>
      {children}
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{children}</div>;
}

function Opt({
  selected,
  onClick,
  emoji,
  color,
  title,
  desc,
}: {
  selected: boolean;
  onClick: () => void;
  emoji: string;
  color: string;
  title: string;
  desc: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 rounded-2xl border bg-white p-4 text-left transition"
      style={{
        borderColor: selected ? color : "#dde1e4",
        background: selected ? `${color}14` : "#fff",
      }}
    >
      <span className="text-xl" style={{ color }}>
        {emoji}
      </span>
      <span>
        <span className="block text-[15px] font-semibold text-ink">{title}</span>
        <span className="block text-xs text-muted">{desc}</span>
      </span>
    </button>
  );
}
