"use client";

export interface FilterState {
  type: string;
  gender: string;
  occasion: string;
  season: string;
}

const SETS: Record<keyof FilterState, [string, string][]> = {
  type: [
    ["all", "All"], ["floral", "✿ Floral"], ["woody", "◎ Woody"],
    ["citrus", "☀ Citrus"], ["fresh", "❄ Fresh"], ["oriental", "☾ Oriental"],
    ["gourmand", "◆ Gourmand"],
  ],
  gender: [["all", "Everyone"], ["Women", "Women"], ["Men", "Men"], ["Unisex", "Unisex"]],
  occasion: [["all", "Any"], ["Daily", "Daily"], ["Office", "Office"], ["Evening", "Evening"]],
  season: [["all", "Any"], ["Spring", "Spring"], ["Summer", "Summer"], ["Fall", "Fall"], ["Winter", "Winter"]],
};

const LABELS: Record<keyof FilterState, string> = {
  type: "Scent type",
  gender: "Gender",
  occasion: "Occasion",
  season: "Season",
};

export default function Filters({
  value,
  onChange,
  only,
}: {
  value: FilterState;
  onChange: (next: FilterState) => void;
  only?: (keyof FilterState)[];
}) {
  const keys = only ?? (Object.keys(SETS) as (keyof FilterState)[]);
  return (
    <div className="space-y-1.5">
      {keys.map((key) => (
        <div key={key}>
          {!only && (
            <div className="mb-2 mt-0.5 text-[11px] font-semibold uppercase tracking-[1.5px] text-muted">
              {LABELS[key]}
            </div>
          )}
          <div className="no-scrollbar mb-3.5 inline-flex max-w-full gap-1 overflow-x-auto rounded-full border border-line-deep bg-gradient-to-b from-white to-[#e7ebee] p-1 shadow-[inset_0_1px_0_#fff]">
            {SETS[key].map(([v, label]) => (
              <button
                key={v}
                onClick={() => onChange({ ...value, [key]: v })}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-medium transition ${
                  value[key] === v
                    ? "bg-white text-champagne shadow-[0_0_0_1px_#a1804e,0_0_14px_rgba(176,141,87,.42)]"
                    : "text-muted hover:text-ink"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
