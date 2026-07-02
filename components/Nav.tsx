"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAura } from "@/lib/store";

const links = [
  { href: "/", label: "Discover" },
  { href: "/for-you", label: "For You" },
  { href: "/quiz", label: "Scent Quiz" },
  { href: "/profile", label: "Profile" },
];

export default function Nav() {
  const path = usePathname();
  const { favs } = useAura();
  const active = (href: string) =>
    href === "/" ? path === "/" : path.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-line-deep bg-gradient-to-b from-[#f4f6f8] via-[#e3e7ea] to-[#eef1f3]">
      <div className="mx-auto flex h-16 max-w-[1080px] items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2.5 font-serif text-[24px] font-bold text-ink">
          <span className="spin-slow h-3 w-3 rounded-full bg-[conic-gradient(from_0deg,#fff,#9aa1ab,#fff,#a1804e,#fff)] shadow-[0_0_0_3px_rgba(176,141,87,.12)]" />
          Aura{" "}
          <span className="self-end pb-1 font-sans text-[11px] font-light uppercase tracking-[5px] text-muted">
            Absolute
          </span>
        </Link>
        <nav className="hidden gap-1 rounded-full border border-line-deep bg-gradient-to-b from-white to-[#e7ebee] p-1 shadow-[inset_0_1px_0_#fff] md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                active(l.href)
                  ? "bg-champagne text-white"
                  : "text-muted hover:text-ink"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/profile"
          className="flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-[13px] font-medium text-ink hover:border-champagne"
        >
          ♡ <span className="hidden sm:inline">Favorites</span> <b>{favs.length}</b>
        </Link>
      </div>
    </header>
  );
}
