# jezeem.dev — Portfolio Build Guide
> Complete phase-by-phase guide for Claude Code / opencode

---

## 🧠 Project Overview

A single-viewport, non-scrollable portfolio website for Jezeem — a software engineer. The experience is inspired by an old Mac computer booting up. The aesthetic is retro CRT terminal — dark, atmospheric, alive. Built with Vite + Three.js + GSAP.

**Live domain (future):** `jezeem.dev`  
**Dev URL:** `http://localhost:5173`  
**Deploy:** Vercel (`jezeem.vercel.app` until domain is purchased)

---

## 🎨 Design Language

### Colors
```css
--bg-primary:     #0a0a0a;   /* deepest black */
--bg-secondary:   #111111;   /* card/overlay backgrounds */
--bg-tertiary:    #1a1a1a;   /* subtle surfaces */
--bg-elevated:    #2a2a2a;   /* hover surfaces */
--gray-dark:      #444444;
--gray-mid:       #666666;
--gray-light:     #888888;
--accent-green:   #33ff33;   /* phosphor green — use sparingly */
--accent-glow:    rgba(51, 255, 51, 0.15); /* for glow effects */
--text-primary:   #e0e0e0;
--text-secondary: #888888;
--text-accent:    #33ff33;
```

### Typography
- **Primary font:** `VT323` (Google Fonts) — all UI text
- **Fallback:** `Press Start 2P` (Google Fonts) — for headings if needed
- **Fallback stack:** `monospace`
- All text feels like it belongs on a terminal screen

### Mood
> Like you found an old developer's computer still running. Alive, eerie, cool. Restrained and atmospheric. Interactivity rewards curious visitors.

---

## 📁 Final Folder Structure

```
jezeem-dev/
├── index.html
├── main.js                  # entry point — initializes everything
├── style.css                # global styles, CRT overlay, fonts
├── package.json
├── vite.config.js
│
├── src/
│   ├── scene/
│   │   └── background.js    # Three.js canvas, particles, floating code
│   │
│   ├── intro/
│   │   └── mac.js           # Mac SVG intro + GSAP expand animation
│   │
│   ├── zones/
│   │   ├── identity.js      # center typewriter + system clock
│   │   ├── experience.js    # work experience hover zone
│   │   ├── skills.js        # floating skill tags on hover
│   │   ├── socials.js       # social links hover zone
│   │   └── wildcard.js      # >_ terminal Easter egg entry
│   │
│   ├── interactive/
│   │   ├── terminal.js      # fake terminal overlay + commands
│   │   └── glitch-game.js   # glitch click game
│   │
│   └── utils/
│       ├── cursor.js        # custom cursor
│       └── sounds.js        # optional retro sounds (keyclick etc.)
│
└── public/
    └── fonts/               # self-hosted fonts if needed
```

---

## ⚙️ Initial Setup (Already Done)

```bash
npm create vite@latest jezeem-dev -- --template vanilla
cd jezeem-dev
npm install three gsap
npm install --save-dev vite
npm run dev
```

---

## 🔧 Git Setup

Run once after project creation:

```bash
git init
git add .
git commit -m "init: project setup with Vite + Three.js + GSAP"
```

Create a new repo on GitHub named `jezeem-dev`, then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/jezeem-dev.git
git branch -M main
git push -u origin main
```

---

---

# PHASES

---

## Phase 1 — Base Canvas + CRT Atmosphere

### Goal
Get the fullscreen Three.js canvas running with the CRT aesthetic. No content yet — just the vibe.

### What to build
- Fullscreen `<canvas>` using Three.js
- CRT scanline overlay (CSS pseudo-element)
- Screen flicker animation (subtle, CSS keyframes)
- VT323 font loaded from Google Fonts
- CSS variables set up for the full color palette
- Black background, phosphor green cursor blink in corner

### Prompt for Claude Code
```
I am building a portfolio site called jezeem.dev using Vite + Three.js + GSAP.

Set up the base project structure:

1. index.html — load Google Fonts (VT323, Press Start 2P), link style.css, import main.js as module
2. style.css — set all CSS variables (colors below), apply global reset, add CRT scanline overlay using a ::after pseudo-element on body with repeating-linear-gradient, add a subtle screen flicker keyframe animation, set cursor to a custom crosshair or block cursor style
3. main.js — initialize a fullscreen Three.js WebGL renderer attached to a canvas that covers the entire viewport. Set background color to #0a0a0a. Add a basic perspective camera.
4. src/scene/background.js — export an initBackground(scene) function (empty for now, we will fill it next phase)

CSS variables to use:
--bg-primary: #0a0a0a
--bg-secondary: #111111
--bg-tertiary: #1a1a1a
--bg-elevated: #2a2a2a
--gray-dark: #444444
--gray-mid: #666666
--gray-light: #888888
--accent-green: #33ff33
--accent-glow: rgba(51, 255, 51, 0.15)
--text-primary: #e0e0e0
--text-secondary: #888888
--text-accent: #33ff33

Use VT323 as the default font family everywhere.

Do not build any content yet. Just the base canvas and CRT atmosphere.
```

### Git commit after phase
```bash
git add .
git commit -m "phase-1: base canvas, CRT overlay, fonts, CSS variables"
git push
```

---

## Phase 2 — Background Particle System

### Goal
The canvas comes alive — floating code snippets, ghosted Tetris blocks, particle static field.

### What to build
- Dense slow-moving particle field (Three.js Points) simulating CRT static
- Floating code snippets drifting across screen (`const`, `</>`, `=>`, `git commit`, `npm run`, `flutter pub get`, etc.)
- Ghosted Tetris-like block shapes drifting slowly in background (faint, low opacity)
- All elements loop infinitely, reset position when they exit screen
- Everything rendered on the Three.js canvas

### Prompt for Claude Code
```
Fill in src/scene/background.js with the following Three.js particle system. The initBackground(scene) function should create:

1. PARTICLE FIELD
- 800 small particles (THREE.Points) scattered across the viewport
- Color: #33ff33 at opacity 0.3
- Each particle drifts slowly downward and resets to top when it exits
- Slight random horizontal drift per particle

2. FLOATING CODE SNIPPETS
- 20 text sprites drifting slowly across the screen
- Text values (cycle through): "const", "</>", "=>", "git commit", "npm run dev", "flutter pub get", ":wq", "sudo", "yarn build", "import", "export default", "async/await", "useEffect", "setState", ".map()", "null"
- Color: #444444 (very subtle, ghost-like)
- Font: VT323, size varies between 12px and 20px
- Each drifts in a random direction, slow speed, wraps around edges

3. TETRIS BLOCKS
- 8 simple geometric shapes (THREE.BoxGeometry or groups of boxes forming L, T, S shapes)
- Color: #1a1a1a to #2a2a2a (extremely faint)
- Wireframe style
- Drift slowly downward and rotate slightly
- Reset to top when they exit the bottom

Export a tick() function from background.js that updates all animations — call it inside the main.js animation loop.

All motion should be extremely slow and subtle. This is a background atmosphere, not the focus.
```

### Git commit after phase
```bash
git add .
git commit -m "phase-2: particle system, floating code, Tetris blocks"
git push
```

---

## Phase 3 — Mac Intro Sequence

### Goal
When the page loads, a retro Mac SVG appears in the center. It boots up, then the visitor clicks it and the screen expands to fill the viewport, revealing the full website.

### What to build
- SVG illustration of a classic Mac (compact, centered, detailed enough to be recognizable)
- Mac screen shows a boot sequence: loading bar → blinking cursor → `jezeem.dev — click to enter`
- On click: GSAP animation scales and expands the Mac screen to fill the entire viewport
- Mac casing fades out, screen becomes the website background
- The Three.js canvas (already running behind) becomes visible
- Transition feels smooth and cinematic — duration ~1.2s

### Prompt for Claude Code
```
Create src/intro/mac.js that handles the intro sequence.

1. BUILD THE MAC SVG
Create an inline SVG element in the DOM representing a classic compact Mac (like a Macintosh 128k or Mac Plus). Include:
- Outer casing: rounded rectangle, color #1a1a1a with #2a2a2a border
- Vent lines at the top
- A small screen area (inner rectangle) — this is where the boot animation plays
- A disk drive slot below the screen
- Small Apple logo or decorative detail
- The whole thing should be about 280px wide, centered on screen
- Position: fixed, centered via transform: translate(-50%, -50%) from top: 50%, left: 50%
- z-index above the Three.js canvas

2. BOOT SEQUENCE (plays automatically on load)
Inside the Mac screen area, show these steps using GSAP timeline with delays:
- Step 1 (0.5s delay): Show a small loading bar filling up over 1.5s, color #33ff33
- Step 2: Loading bar disappears, blinking cursor appears
- Step 3 (0.5s later): Type out text character by character: "jezeem.dev"
- Step 4 (0.8s later): New line types out: "click to enter_" with blinking cursor

3. CLICK TO EXPAND
When the Mac is clicked:
- GSAP animation expands the Mac screen (inner rectangle) using clip-path or scale to fill the entire viewport
- Duration: 1.2s, ease: power2.inOut
- Mac casing elements fade out as the screen expands (opacity to 0)
- After expansion completes: remove the Mac element from DOM, reveal the main portfolio content (set visibility on #main-content to visible)
- Dispatch a custom event "intro-complete" when done

4. MAIN CONTENT
In index.html, wrap everything except the Mac intro in a div id="main-content" with visibility: hidden. Set to visible after intro completes.

Make the intro skippable — pressing any key or clicking anywhere outside the Mac also triggers the expand.
```

### Git commit after phase
```bash
git add .
git commit -m "phase-3: Mac intro sequence, boot animation, expand transition"
git push
```

---

## Phase 4 — Hover Zones

### Goal
Five interactive zones scattered asymmetrically across the screen. Each zone reveals content on hover.

### Layout positions (approximate, adjust visually)
```
[SOCIALS]                          [EXPERIENCE]
       
              [IDENTITY - CENTER]
       
[SKILLS]                           [WILDCARD >_]
```

### What to build

#### 4a — Identity Zone (center)
```
Build src/zones/identity.js

Create a centered zone in the middle of the screen:

1. TYPEWRITER LINE
- On intro-complete event, start typing: "> software engineer. flutter. react. builder."
- Color: #e0e0e0, font: VT323 24px
- Typing speed: 40ms per character
- Blinking cursor after typing finishes

2. SYSTEM STATUS LINE
- Fades in 0.8s after typewriter finishes
- Shows: "SYSTEM: ONLINE  ·  USER: JEZEEM  ·  [LIVE TIME]  ·  AVAILABLE"
- Color: #33ff33, font: VT323 14px
- Time updates every second using setInterval
- Subtle glow: text-shadow 0 0 8px #33ff33

Position this block at center of screen, no hover interaction needed — always visible.
```

#### 4b — Experience Zone
```
Build src/zones/experience.js

Position: top-right area of screen (roughly 70% from left, 25% from top)

DEFAULT STATE:
- Show a small glowing dot (4px, #33ff33) with label "experience" in gray VT323 12px

HOVER STATE (GSAP fadeIn, 0.3s):
- Show a terminal-style card:

  > WORK EXPERIENCE
  ─────────────────────────────
  Incredible Visibility
  Software Engineer
  2021 → Present
  ─────────────────────────────
  [ visit company ↗ ]

- Card background: #111111, border: 1px solid #2a2a2a
- Green accent on the label and arrow
- "visit company" is clickable — opens https://incrediblevisibility.com in new tab

HOVER OUT: card fades out, dot returns
```

#### 4c — Skills Zone
```
Build src/zones/skills.js

Position: bottom-left area (roughly 20% from left, 70% from top)

DEFAULT STATE:
- Small glowing dot + label "skills & tools" in gray

HOVER STATE:
- 12 skill tags scatter outward from the dot like particles exploding slowly
- Tags: "JS", "TypeScript", "React", "Flutter", "Dart", "Expo", "Git", "Node.js", "Firebase", "REST API", "React Native", "VSCode"
- Each tag is a small pill: background #1a1a1a, border 1px solid #33ff33, text #33ff33, VT323 14px
- GSAP staggered animation: each tag moves to a random nearby position (within 150px radius) with 0.4s ease
- Tags gently float/breathe with a subtle GSAP yoyo animation while hovered

HOVER OUT: tags animate back to origin and disappear
```

#### 4d — Socials Zone
```
Build src/zones/socials.js

Position: top-left area (roughly 15% from left, 20% from top)

DEFAULT STATE:
- Small glowing dot + label "socials" in gray

HOVER STATE (GSAP stagger fadeIn from left):
- Show social links vertically stacked:

  > GitHub      ↗
  > LinkedIn    ↗

- Font: VT323 18px, color #e0e0e0
- Hover individual link: color changes to #33ff33
- Links open in new tab (URLs to be filled by Jezeem)

HOVER OUT: links fade out
```

#### 4e — Wildcard Zone
```
Build src/zones/wildcard.js

Position: bottom-right corner (roughly 85% from left, 80% from top)

DEFAULT STATE:
- Always visible: blinking ">_" in #33ff33, VT323 20px
- Subtle pulse glow animation

HOVER STATE:
- Small tooltip appears: "[ open terminal ]" in gray

CLICK: dispatch custom event "open-terminal"
(Terminal itself is built in Phase 5)
```

### Git commit after phase
```bash
git add .
git commit -m "phase-4: all five hover zones — identity, experience, skills, socials, wildcard"
git push
```

---

## Phase 5 — Fake Terminal Easter Egg

### Goal
Clicking `>_` opens a terminal overlay. Visitor can type commands and get responses.

### What to build
```
Build src/interactive/terminal.js

On "open-terminal" event, show a terminal overlay:

DESIGN:
- Fixed overlay, centered, ~600px wide, ~360px tall
- Background: #0d0d0d, border: 1px solid #33ff33
- Box shadow: 0 0 30px rgba(51, 255, 51, 0.2)
- Title bar: "jezeem@portfolio:~$" in green, with a small [x] close button top right
- Input line at bottom with blinking cursor
- Output area scrollable above input
- Font: VT323 16px throughout

COMMANDS TO HANDLE:
whoami        → "jezeem — software engineer. builder. problem solver."
ls projects   → "incredible-visibility/  side-projects/  open-source/"
cat skills    → lists all skills one per line with a small > prefix
cat contact   → shows email or preferred contact method (fill in)
help          → lists all available commands
clear         → clears the terminal output
exit          → closes the terminal overlay
[unknown]     → "command not found: [input]. type 'help' for available commands."

BEHAVIOR:
- Focus input automatically when terminal opens
- Press Enter to submit command
- Command history: up/down arrow keys cycle through previous commands
- ESC key closes terminal
- Add a small boot message when terminal first opens:
  "jezeem.dev terminal v1.0.0"
  "type 'help' to see available commands"
  blank line

OPEN/CLOSE:
- Opening: GSAP fadeIn + slight scale from 0.95 to 1, duration 0.25s
- Closing: reverse animation
```

### Git commit after phase
```bash
git add .
git commit -m "phase-5: fake terminal Easter egg with command handling"
git push
```

---

## Phase 6 — Glitch Click Game

### Goal
Random glitchy squares flicker across the screen. Click them to reveal fun facts about Jezeem.

### What to build
```
Build src/interactive/glitch-game.js

Start this after intro-complete event fires.

GLITCH SQUARES:
- Every 3–5 seconds (random interval), spawn a glitchy square somewhere random on screen
- Size: 20–40px random
- Color: flickers between #33ff33, #ffffff, #ff0000 (glitch colors) using rapid GSAP flicker
- Appears for 1.5–2.5 seconds then disappears if not clicked
- Max 3 active on screen at once
- Do not spawn on top of the center identity zone

ON CLICK:
- Square explodes into small particles (GSAP scatter)
- A small popup appears near the click position showing a fun fact
- Fun facts (cycle through randomly, no repeats until all shown):
  1. "built first app in 2021"
  2. "flutter dev since day one"
  3. "ships side projects for fun"
  4. "terminal > GUI. always."
  5. "once fixed a bug at 3am. worth it."
  6. "git commit -m 'it works, don't touch it'"
  7. "prefers dark mode. obviously."
  8. "currently: available for work"
- Popup style: small dark card, green border, VT323 14px
- Popup fades out after 2.5s automatically
- Add a subtle click sound (optional — only if Web Audio API is used)

SCORE (optional fun addition):
- Small counter in a corner: "GLITCHES CAUGHT: 0"
- Increments each time player clicks a square
- Hidden by default, fades in after first catch
```

### Git commit after phase
```bash
git add .
git commit -m "phase-6: glitch click game with fun facts"
git push
```

---

## Phase 7 — Polish & Details

### What to refine
```
Polish pass — go through this checklist:

1. CUSTOM CURSOR
- Hide default cursor: cursor: none on body
- Create a small green crosshair or block cursor that follows mouse
- Cursor changes shape on hoverable elements (scale up slightly)
- Implemented in src/utils/cursor.js

2. ZONE POSITIONING PASS
- Visually check all 5 hover zones — they should feel scattered, not grid-aligned
- Nudge positions until it feels organic and asymmetric
- Make sure no zones overlap on 1920x1080, 1440x900, and 1280x800

3. CRT FLICKER TUNING
- Scanlines should be barely visible — opacity 0.03 to 0.05 max
- Screen flicker keyframe: very subtle brightness variation, 0.97 to 1.0, every 4–8 seconds random

4. PERFORMANCE CHECK
- Three.js renderer: set antialias: false for performance
- Particle count: reduce if frame rate drops below 60fps
- Use requestAnimationFrame correctly in main animation loop

5. RESPONSIVE FALLBACK
- On screens below 768px width:
  - Hide Three.js canvas
  - Show a simple static version: black background, centered name, tagline, links listed
  - Message: "[ best viewed on desktop ]" in small green text

6. FAVICON
- Create a simple favicon: green ">" character on black background
- 32x32 PNG, place in public/

7. META TAGS (index.html)
- title: "jezeem.dev"
- description: "software engineer. flutter. react. builder."
- og:title, og:description for social sharing
- theme-color: #0a0a0a
```

### Git commit after phase
```bash
git add .
git commit -m "phase-7: polish — cursor, CRT tuning, responsive fallback, meta tags"
git push
```

---

## Phase 8 — Deploy to Vercel

### Steps

**1. Final build test**
```bash
npm run build
npm run preview
```
Check `http://localhost:4173` — make sure everything works in production build.

**2. Push final code**
```bash
git add .
git commit -m "phase-8: production build ready"
git push
```

**3. Deploy on Vercel**
- Go to [vercel.com](https://vercel.com)
- Sign in with GitHub
- Click "Add New Project"
- Import `jezeem-dev` repository
- Framework preset: **Vite** (auto-detected)
- Build command: `npm run build`
- Output directory: `dist`
- Click Deploy

**4. Your site is live at:**
```
https://jezeem-dev.vercel.app
```
(or a custom name you set in Vercel settings)

---

## Buying & Connecting jezeem.dev (Later)

1. Buy `jezeem.dev` at [Cloudflare Registrar](https://www.cloudflare.com/products/registrar/) (~$10/yr, no markup)
2. In Vercel dashboard → your project → Settings → Domains
3. Add `jezeem.dev`
4. Vercel gives you DNS records — add them in Cloudflare DNS
5. Done — live at `jezeem.dev` within minutes

---

## 📋 Master Commit History Reference

```
init: project setup with Vite + Three.js + GSAP
phase-1: base canvas, CRT overlay, fonts, CSS variables
phase-2: particle system, floating code, Tetris blocks
phase-3: Mac intro sequence, boot animation, expand transition
phase-4: all five hover zones — identity, experience, skills, socials, wildcard
phase-5: fake terminal Easter egg with command handling
phase-6: glitch click game with fun facts
phase-7: polish — cursor, CRT tuning, responsive fallback, meta tags
phase-8: production build ready
```

---

## 🔑 Content To Fill In (Jezeem's personal details)

Replace these placeholders as you build:

| Placeholder | Value |
|---|---|
| Company URL | `https://incrediblevisibility.com` |
| GitHub URL | your GitHub profile URL |
| LinkedIn URL | your LinkedIn profile URL |
| Email | your preferred contact email |
| Fun facts | personalize the 8 glitch game facts |
| Skills list | add/remove from the skills zone |

---

*Last updated: April 2026*