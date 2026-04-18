import gsap from 'gsap'

let expanded = false

export function initMac() {
  const mac = buildMac()
  document.body.appendChild(mac)

  const screenEl   = mac.querySelector('.mac-screen')
  const casingEl   = mac.querySelector('.mac-casing')

  runBootSequence(screenEl, () => {
    // boot done — attach click + keydown
    mac.addEventListener('click', () => triggerExpand(mac, screenEl, casingEl))
    document.addEventListener('keydown', onSkip)
  })

  function onSkip() {
    document.removeEventListener('keydown', onSkip)
    triggerExpand(mac, screenEl, casingEl)
  }
}

// ─── Expand ───────────────────────────────────────────────────────────────────

function triggerExpand(mac, screenEl, casingEl) {
  if (expanded) return
  expanded = true

  const rect = screenEl.getBoundingClientRect()

  // Create a fixed overlay that starts at the screen's position
  const overlay = document.createElement('div')
  overlay.style.cssText = `
    position: fixed;
    z-index: 999;
    background: #0a0a0a;
    top:    ${rect.top}px;
    left:   ${rect.left}px;
    width:  ${rect.width}px;
    height: ${rect.height}px;
    border-radius: 4px;
  `
  document.body.appendChild(overlay)

  const tl = gsap.timeline({
    onComplete() {
      overlay.remove()
      mac.remove()
      document.getElementById('main-content').style.visibility = 'visible'
      document.dispatchEvent(new CustomEvent('intro-complete'))
    }
  })

  // Expand overlay to fill viewport
  tl.to(overlay, {
    top: 0, left: 0,
    width: '100vw', height: '100vh',
    borderRadius: 0,
    duration: 1.2,
    ease: 'power2.inOut'
  })

  // Fade out the casing early
  tl.to(casingEl, { opacity: 0, duration: 0.4, ease: 'power2.in' }, 0)

  // Fade out overlay at the end to reveal the canvas
  tl.to(overlay, { opacity: 0, duration: 0.3, ease: 'power2.out' }, 1.1)
}

// ─── Boot Sequence ────────────────────────────────────────────────────────────

function runBootSequence(screenEl, onDone) {
  const tl = gsap.timeline({ delay: 0.5 })

  // Loading bar
  const barWrap = screenEl.querySelector('.boot-bar-wrap')
  const bar     = screenEl.querySelector('.boot-bar')
  const cursor  = screenEl.querySelector('.boot-cursor')
  const textEl  = screenEl.querySelector('.boot-text')

  tl.set(barWrap, { autoAlpha: 1 })
  tl.to(bar, { width: '100%', duration: 1.5, ease: 'power1.inOut' })
  tl.to(barWrap, { autoAlpha: 0, duration: 0.2 })

  // Blinking cursor appears
  tl.set(cursor, { autoAlpha: 1 })
  tl.to({}, { duration: 0.5 }) // small pause

  // Type "jezeem.dev"
  const line1 = 'jezeem.dev'
  let text1 = ''
  tl.to({}, {
    duration: line1.length * 0.04,
    onUpdate() {
      const progress = this.progress()
      const chars = Math.floor(progress * line1.length)
      if (chars !== text1.length) {
        text1 = line1.slice(0, chars)
        textEl.innerHTML = text1 + '<span class="inline-cursor">█</span>'
      }
    }
  })

  tl.to({}, { duration: 0.8 })

  // Type "click to enter"
  const line2 = '\nclick to enter'
  let text2 = ''
  tl.to({}, {
    duration: line2.length * 0.04,
    onUpdate() {
      const progress = this.progress()
      const chars = Math.floor(progress * line2.length)
      if (chars !== text2.length) {
        text2 = line2.slice(0, chars)
        const display = (text1 + text2).replace('\n', '<br>')
        textEl.innerHTML = display + '<span class="inline-cursor blink">█</span>'
      }
    },
    onComplete() {
      onDone()
    }
  })
}

// ─── Mac DOM ──────────────────────────────────────────────────────────────────

function buildMac() {
  const wrap = document.createElement('div')
  wrap.id = 'mac-intro'
  wrap.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 500;
    cursor: pointer;
    width: 280px;
  `

  wrap.innerHTML = `
    <div class="mac-casing">
      <!-- Body -->
      <div class="mac-body">
        <!-- Vent lines -->
        <div class="mac-vents">
          <div class="vent"></div><div class="vent"></div><div class="vent"></div>
          <div class="vent"></div><div class="vent"></div>
        </div>

        <!-- Screen bezel -->
        <div class="mac-screen-bezel">
          <div class="mac-screen">
            <!-- Boot bar -->
            <div class="boot-bar-wrap">
              <div class="boot-bar"></div>
            </div>
            <!-- Blinking cursor (pre-typing) -->
            <div class="boot-cursor">█</div>
            <!-- Typed text -->
            <div class="boot-text"></div>
          </div>
        </div>

        <!-- Apple logo -->
        <div class="mac-logo">✦</div>

        <!-- Disk drive -->
        <div class="mac-drive">
          <div class="mac-drive-slot"></div>
        </div>

        <!-- Base -->
        <div class="mac-base"></div>
      </div>
    </div>

    <style>
      #mac-intro * { box-sizing: border-box; }

      .mac-casing { display: flex; flex-direction: column; align-items: center; }

      .mac-body {
        width: 280px;
        background: #1c1c1c;
        border: 2px solid #2a2a2a;
        border-radius: 16px 16px 6px 6px;
        padding: 14px 20px 10px;
        box-shadow:
          inset 0 2px 4px rgba(255,255,255,0.04),
          0 8px 32px rgba(0,0,0,0.8),
          0 0 0 1px #111;
      }

      .mac-vents {
        display: flex;
        gap: 5px;
        justify-content: flex-end;
        margin-bottom: 10px;
        padding-right: 4px;
      }
      .vent {
        width: 18px;
        height: 3px;
        background: #0f0f0f;
        border-radius: 2px;
        box-shadow: inset 0 1px 1px rgba(0,0,0,0.8);
      }

      .mac-screen-bezel {
        background: #0d0d0d;
        border: 3px solid #111;
        border-radius: 6px;
        padding: 8px;
        box-shadow: inset 0 0 12px rgba(0,0,0,0.9);
      }

      .mac-screen {
        width: 100%;
        height: 150px;
        background: #050f05;
        border-radius: 3px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
        box-shadow: inset 0 0 20px rgba(51,255,51,0.06);
      }

      /* Subtle scanline on the screen itself */
      .mac-screen::after {
        content: '';
        position: absolute;
        inset: 0;
        background: repeating-linear-gradient(
          0deg, transparent, transparent 2px,
          rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px
        );
        pointer-events: none;
        z-index: 2;
      }

      .boot-bar-wrap {
        width: 80%;
        height: 4px;
        background: #0a1a0a;
        border: 1px solid #1a3a1a;
        border-radius: 2px;
        visibility: hidden;
        position: relative;
        z-index: 1;
      }
      .boot-bar {
        height: 100%;
        width: 0%;
        background: #33ff33;
        border-radius: 2px;
        box-shadow: 0 0 6px #33ff33;
      }

      .boot-cursor {
        color: #33ff33;
        font-family: 'VT323', monospace;
        font-size: 18px;
        visibility: hidden;
        animation: blink 0.8s step-end infinite;
        position: relative;
        z-index: 1;
      }

      .boot-text {
        color: #33ff33;
        font-family: 'VT323', monospace;
        font-size: 18px;
        text-align: center;
        line-height: 1.4;
        position: relative;
        z-index: 1;
        text-shadow: 0 0 8px rgba(51,255,51,0.8);
      }

      .inline-cursor {
        color: #33ff33;
        font-family: 'VT323', monospace;
      }
      .inline-cursor.blink { animation: blink 0.8s step-end infinite; }

      @keyframes blink {
        0%, 100% { opacity: 1; }
        50%       { opacity: 0; }
      }

      .mac-logo {
        text-align: center;
        color: #2a2a2a;
        font-size: 13px;
        margin: 8px 0 6px;
        letter-spacing: 1px;
      }

      .mac-drive {
        display: flex;
        justify-content: center;
        margin-bottom: 6px;
      }
      .mac-drive-slot {
        width: 60px;
        height: 5px;
        background: #0a0a0a;
        border: 1px solid #1a1a1a;
        border-radius: 2px;
        box-shadow: inset 0 1px 2px rgba(0,0,0,0.9);
      }

      .mac-base {
        height: 10px;
        background: #161616;
        border: 2px solid #2a2a2a;
        border-top: none;
        border-radius: 0 0 6px 6px;
        margin: 0 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.6);
      }

      /* Glow pulse on the whole mac while idle */
      #mac-intro:hover .mac-body {
        box-shadow:
          inset 0 2px 4px rgba(255,255,255,0.04),
          0 8px 32px rgba(0,0,0,0.8),
          0 0 20px rgba(51,255,51,0.08),
          0 0 0 1px #111;
      }
    </style>
  `

  return wrap
}
