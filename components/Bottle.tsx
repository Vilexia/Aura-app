import { Family, Gender, FAMILY_META, GENDER_GLOW } from "@/lib/types";

/**
 * Glass bottle with tinted "juice" — the liquid takes the scent family's
 * color, the outline takes the gender glow, and the fill level varies by
 * seed for a collection-shelf feel. Mirrors the prototype's bottle().
 */
export default function Bottle({
  family,
  gender = "Unisex",
  height = 120,
  seed = 0,
}: {
  family: Family;
  gender?: Gender;
  height?: number;
  seed?: number;
}) {
  const juice = FAMILY_META[family].color;
  const glow = GENDER_GLOW[gender];
  const lv = [58, 76, 94][seed % 3];
  const uid = `${family}-${gender}-${seed}`;

  return (
    <svg viewBox="0 0 120 170" style={{ height }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`b-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#bfc5cc" />
          <stop offset="0.5" stopColor="#ffffff" />
          <stop offset="1" stopColor="#83898d" />
        </linearGradient>
        <linearGradient id={`j-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={juice} stopOpacity="0.3" />
          <stop offset="1" stopColor={juice} stopOpacity="0.85" />
        </linearGradient>
      </defs>
      <polygon points="50,3 70,3 74,17 46,17" fill="#2f2622" />
      <rect x="51" y="16" width="18" height="10" fill={`url(#b-${uid})`} />
      <polygon
        points="30,42 60,30 90,42 90,148 60,165 30,148"
        fill="#f2f4f6"
        stroke={glow}
        strokeWidth="1.5"
      />
      <polygon points={`33,${lv} 87,${lv} 87,146 60,162 33,146`} fill={`url(#j-${uid})`} />
      <polyline points="30,42 60,30 90,42" fill="none" stroke="#fff" strokeWidth="1" opacity="0.7" />
      <rect x="44" y="48" width="4" height="96" fill="#fff" opacity="0.5" />
    </svg>
  );
}
