# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server
npm run build     # Production build
npm run preview   # Preview production build locally
```

No test suite or linter is configured.

## Architecture

This is a **personal portfolio site** (`jezeem.dev`) — a single-page, purely client-side vanilla JS app bundled with Vite. There is no framework, no routing, and no backend.

### Entry points

- `index.html` — shell with `#bg-canvas` (Three.js), `#main-content` (hidden until intro), `#mobile-fallback`
- `src/main.js` — orchestrator: sets up Three.js renderer, imports and calls all `init*` functions, runs the animation loop

### Rendering pipeline

Three.js renders into a `WebGLRenderTarget`, then `src/scene/crt-shader.js` applies a custom GLSL post-process pass (barrel distortion, chromatic aberration, vignette, film grain, scanlines) before outputting to the canvas. The `tick()` from `background.js` and `crt.render(clock)` are called every frame.

### Module structure

| Path | Role |
|---|---|
| `src/scene/background.js` | Three.js animated background: falling particles, floating code-snippet sprites, drifting wireframe Tetris blocks |
| `src/scene/crt-shader.js` | CRT post-processing composer (custom, no Three.js addons) |
| `src/intro/mac.js` | Retro Mac boot animation shown on first load; dispatches `intro-complete` custom event when done |
| `src/zones/` | Content panels (identity, experience, skills, socials, wildcard) — each appends DOM to `#main-content` and listens for `intro-complete` before animating in |
| `src/interactive/terminal.js` | Interactive terminal easter egg |
| `src/interactive/glitch-game.js` | Glitch game easter egg |
| `src/interactive/konami.js` | Konami code (↑↑↓↓←→←→ba) triggers a fake system diagnostic overlay with Web Audio beeps |
| `src/interactive/library-card.js` | Bottom-right reading stats widget (hover to reveal); `BOOKS_2026` constant tracks the year's book count |
| `src/utils/cursor.js` | Custom cursor logic |

### Key patterns

- **`intro-complete` event**: All zones and the Three.js canvas listen for this `CustomEvent` dispatched by `mac.js` after the user clicks through the boot intro. Nothing in `#main-content` is visible until then.
- **Styles in JS**: Each module injects its own `<style>` tag. There is no CSS preprocessor or module system for styles.
- **Fonts**: `VT323` (monospace retro) and `Press Start 2P` are loaded from Google Fonts in `index.html`. Use `VT323` for all terminal/retro UI text.
- **Color palette**: Primary green `#33ff33`, dark background `#0a0a0a`, dim text `#e0e0e0`.
- **GSAP**: Used for all animations (timelines, tweens). Three.js handles only the canvas background.
- **Vercel**: Deployed on Vercel with `@vercel/analytics` and `@vercel/speed-insights` injected in `main.js`.

---

## Design Language (from PLAN.md)

### Color palette
```css
--bg-primary:     #0a0a0a;   /* deepest black */
--bg-secondary:   #111111;   /* card/overlay backgrounds */
--bg-tertiary:    #1a1a1a;   /* subtle surfaces */
--bg-elevated:    #2a2a2a;   /* hover surfaces */
--gray-dark:      #444444;
--gray-mid:       #666666;
--gray-light:     #888888;
--accent-green:   #33ff33;   /* phosphor green — use sparingly */
--accent-glow:    rgba(51, 255, 51, 0.15);
--text-primary:   #e0e0e0;
--text-secondary: #888888;
--text-accent:    #33ff33;
```

### Tone
> Like you found an old developer's computer still running. Alive, eerie, cool. Restrained and atmospheric. Interactivity rewards curious visitors.

- All text belongs on a terminal screen — `VT323` everywhere, `Press Start 2P` as fallback for headings
- Animations are subtle and slow; nothing should feel flashy or jarring
- New UI elements should inject their own `<style>` tag (pattern used throughout)

---

## Plan Status (PLAN.md phases)

All 8 original phases are **complete and deployed**:

| Phase | Description | Status |
|---|---|---|
| 1 | Base canvas + CRT atmosphere | Done |
| 2 | Background particle system | Done |
| 3 | Mac intro sequence | Done |
| 4 | Five hover zones (identity, experience, skills, socials, wildcard) | Done |
| 5 | Fake terminal easter egg | Done |
| 6 | Glitch click game | Done |
| 7 | Polish (cursor, CRT tuning, responsive fallback, meta tags) | Done |
| 8 | Deploy to Vercel | Done |

### Features added beyond original plan
- **Konami code** (`↑↑↓↓←→←→ba`) — triggers a fake system diagnostic overlay with animated CPU/memory bars and Web Audio beeps
- **Library card widget** (`src/interactive/library-card.js`) — bottom-right 📚 icon, hover to reveal reading stats (Fable + Margins links); update `BOOKS_2026` constant each year
- **CRT post-processing in Three.js** — replaced CSS scanline overlay with a proper GLSL shader pass (barrel distortion, chromatic aberration, vignette, film grain)

### Zone screen positions
```
[SOCIALS ~15%L 20%T]              [EXPERIENCE ~70%L 25%T]

                  [IDENTITY — center]

[SKILLS ~20%L 70%T]               [WILDCARD >_ ~85%L 80%T]

                                   [LIBRARY CARD — bottom-right fixed]
```
