# Aura Absolute ✦

A fragrance recommendation website — champagne & marble design, scent quiz with a personality reveal, and a recommendation engine that learns from your ratings.

**Design system:** cool grey + marble background · champagne gold & graphite accents · scent-family colors on cards and bottles · Bricolage Grotesque + Space Grotesk. Full spec in `Aura-Brand-Kit.html` (in the project workspace).

## Put this on the internet (no coding needed)

1. **GitHub** (the safety-deposit box for your code)
   - Create a free account at github.com → click **New repository** → name it `aura-app` → Create.
   - Click **uploading an existing file** → drag ALL the files/folders from this folder in → **Commit changes**.
2. **Vercel** (the thing that turns code into a website)
   - Create a free account at vercel.com (sign in *with GitHub* — easiest).
   - Click **Add New → Project** → pick your `aura-app` repo → **Deploy**.
   - ~1 minute later you get a live URL. Done.
3. From now on, any file you change in GitHub automatically updates the live site.

## Run it on your own computer (optional)

You need Node.js 18.18+ from nodejs.org. Then in this folder:

```bash
npm install   # one time
npm run dev   # start it
```

Open http://localhost:3000.

## What each file does

| Page | File | What it does |
|---|---|---|
| Discover | `app/page.tsx` | Hero, shop-by-family tiles, Scent of the Day, filters + results count, Popular + New |
| For You | `app/for-you/page.tsx` | Personalized matches with count-up match % |
| Scent Quiz | `app/quiz/page.tsx` | 4-step quiz → scent-personality reveal card |
| Fragrance Detail | `app/fragrance/[id]/page.tsx` | Family-tinted hero, scent pyramid, shop link, star rating |
| Profile | `app/profile/page.tsx` | Scent DNA with animated bars, favorites, rated history |

**The brain** is `lib/recommend.ts` (scoring engine that learns from ratings). `lib/data.ts` is the 16-fragrance sample catalog. `lib/store.tsx` remembers favorites/ratings in your browser (localStorage) — a real database replaces this later.

## Later steps (in order — see Aura-Hosting-Guide.md)

1. **Database:** Railway (railway.app) → New Project → add PostgreSQL.
2. **Real data:** Fragella API key → one bulk import into your `fragrances` table → nightly sync. (~74k fragrances)
3. **Real sign-in:** Clerk or Auth0 replaces the mock.
4. **Money:** affiliate tags on the `buyUrl` links; custom domain.

Schema, sync design, and recommendation logic: `Aura-Technical-Plan.md` §1.3, §2, §4, §5.

## Stack

Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS. Production build verified clean.
