# jezeem.dev

Personal portfolio website for Jezeem — software engineer.

Built with a retro CRT terminal aesthetic. Single-viewport, non-scrollable. Loads like an old Mac booting up.

**Stack:** Vite · Three.js · GSAP · VT323 font

---

## Features

- **Mac intro sequence** — classic Mac SVG boots up, click to expand into the site
- **Three.js background** — 800-particle static field, floating code snippets, ghosted Tetris blocks
- **Five hover zones** — Identity (center), Experience (top-right), Skills (bottom-left), Socials (top-left), Wildcard terminal (bottom-right)
- **Fake terminal** — click `>_` to open, run commands: `whoami`, `ls projects`, `cat skills`, `cat contact`, `help`
- **Glitch click game** — catch flickering squares to reveal fun facts, score counter in corner
- **Custom cursor** — green crosshair that scales on hover
- **CRT overlay** — scanlines + subtle screen flicker
- **Responsive fallback** — mobile shows a clean static version

---

## Local Development

```bash
npm install
npm run dev
```

Runs at `http://localhost:5173`

---

## Build

```bash
npm run build
npm run preview
```

---

## Deploy (Vercel)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → sign in with GitHub
3. Click **Add New Project** → import this repo
4. Vercel auto-detects Vite — no config needed
5. Click **Deploy**

Live at `https://jezeem-dev.vercel.app` (or your custom domain)

---

## Project Structure

```
src/
  scene/        # Three.js background (particles, code snippets, Tetris blocks)
  intro/        # Mac SVG boot sequence
  zones/        # Five interactive hover zones
  interactive/  # Terminal easter egg + glitch click game
  utils/        # Custom cursor
```

---

## Contact

jezeem.dev@gmail.com
