# Noor Quran — Learn Quran from Basics to Complete Quran

Free fullstack web app: Noorani Qaida alphabet with real vocal MP3 audio, Harakat drills,
Tajweed masterclass, vocabulary flashcards, full 114-Surah reader with translation +
transliteration + multi-Qari audio, quizzes, certificates, bookmarks, and an
Android / Google Play publishing hub.

Built with **Next.js (App Router) + Tailwind + Drizzle ORM + PostgreSQL**.

---

## 🌐 Live URLs

- **Temporary sandbox preview** (expires when sandbox stops):
  `https://3000-i54aluc0p3dgby03xmzc9.e2b.app`
- **Free lifetime URL (after you deploy below)**: e.g.
  `https://noor-quran.vercel.app` or `https://noor-quran.netlify.app` — works for lifetime
  as long as your Vercel/Netlify + GitHub accounts exist.

---

## 🚀 1-Click Free Deploy

### Option-A — Vercel (recommended, best for Next.js API routes)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FYOUR_USERNAME%2Fnoor-quran&env=DATABASE_URL&project-name=noor-quran&repository-name=noor-quran)

1. Push this folder to GitHub (see below).
2. Go to https://vercel.com → **Add New Project** → Import `noor-quran`.
3. Add env var `DATABASE_URL` (free Postgres from https://neon.tech or https://supabase.com).
   The app also runs fine **without** a DB (guest fallback).
4. Click **Deploy**. You get `https://noor-quran.vercel.app` with free HTTPS + CDN.

### Option-B — Netlify (free lifetime alternative)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/YOUR_USERNAME/noor-quran)

1. Push this folder to GitHub.
2. Go to https://app.netlify.com → **Add new site** → **Import an existing project** → GitHub → `noor-quran`.
3. Build command: `npm run build`, Publish: `.next` (already set in `netlify.toml`).
4. Add env var `DATABASE_URL` in **Site settings → Environment variables** (optional).
5. Click **Deploy**. You get `https://noor-quran.netlify.app` with free HTTPS + CDN.

> This repo already includes `vercel.json` (Option-A) and `netlify.toml` (Option-B),
> plus `.gitignore`, `.env.example`, and bundled MP3s under `public/audio/`.

---

## 💻 Run locally

```bash
npm install
npm run dev
# open http://localhost:3000
```

With Postgres (optional):

```bash
# set DATABASE_URL in .env, then:
npx drizzle-kit push
npm run dev
```

---

## 📤 Push to GitHub (2 minutes)

```bash
git init
git add .
git commit -m "Noor Quran app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/noor-quran.git
git push -u origin main
```

> Replace `YOUR_USERNAME` with your GitHub username. Create the empty repo
> `noor-quran` on https://github.com/new first (no README/license needed).

If you use a Personal Access Token (classic) instead of password:

```bash
git remote set-url origin https://YOUR_USERNAME:YOUR_TOKEN@github.com/YOUR_USERNAME/noor-quran.git
git push -u origin main
```

---

## 🔊 How audio works (no beeps)

- **Alphabet (28 letters)**: real vocal MP3s in `public/audio/alphabet/*.mp3`
  (e.g. `/audio/alphabet/alif.mp3`). Played via `playLetterPronunciation(id, char)`.
- **Harakat drills**: vocal samples in `public/audio/harakat/*.mp3` + dynamic TTS.
- **Any other Arabic word**: server TTS proxy at `/api/audio/tts?text=...&lang=ar`
  (streams MP3 with long cache headers, falls back to SpeechSynthesis).
- **Quran recitation**: EveryAyah CDN + Verses CDN with automatic fallback,
  5 Qaris, speed / repeat / volume controls in `AudioPlayerBar`.

---

## 📱 Android / Google Play

Open the **Android & Play Store** tab inside the app for:
capacitor.config, AndroidManifest.xml, keystore commands, build-android.sh,
Play Store ASO title/description, graphics sizes, and privacy policy template.

---

## 🗄️ Database tables (Drizzle)

- `user_profiles` — XP, level, streak, badges, preferences
- `bookmarks` — saved ayahs + notes
- `quiz_history` — quiz attempts + XP earned
- `daily_reflections` — daily ayah notes

All API routes degrade gracefully when `DATABASE_URL` is missing.
