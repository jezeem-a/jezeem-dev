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
  const vw = window.innerWidth
  const vh = window.innerHeight

  // Fixed clone sitting exactly over the Mac screen — we scale THIS, not layout props
  const clone = document.createElement('div')
  clone.style.cssText = `
    position: fixed;
    left: ${rect.left}px;
    top: ${rect.top}px;
    width: ${rect.width}px;
    height: ${rect.height}px;
    background: #050f05;
    z-index: 998;
    border-radius: 3px;
    will-change: transform, opacity;
  `
  document.body.appendChild(clone)

  // Scale factor needed to cover the full viewport from the screen's size
  const targetScale = Math.max(vw / rect.width, vh / rect.height) * 1.15

  const tl = gsap.timeline({
    onComplete() {
      clone.remove()
      mac.remove()
      document.dispatchEvent(new CustomEvent('intro-complete'))
    }
  })

  // Mac casing recedes — shrinks back as if you're passing through the screen
  tl.to(mac, {
    scale: 0.85,
    opacity: 0,
    duration: 0.5,
    ease: 'power2.in'
  }, 0)

  // Screen clone blasts toward the viewer (expo.in = slow start, dramatic rush)
  tl.to(clone, {
    scale: targetScale,
    borderRadius: 0,
    duration: 0.72,
    ease: 'expo.in'
  }, 0.08)

  // Phosphor green flash at peak zoom
  tl.to(clone, {
    backgroundColor: '#33ff33',
    duration: 0.07,
    ease: 'none'
  }, 0.68)

  // Reveal site the moment the flash hits
  tl.call(() => {
    document.getElementById('main-content').style.visibility = 'visible'
  }, [], 0.75)

  // Flash bleaches out, site is underneath
  tl.to(clone, {
    opacity: 0,
    duration: 0.45,
    ease: 'power2.out'
  }, 0.75)
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

  tl.to({}, { duration: 0.6 })

  // OS boot log lines
  const bootLines = [
    'jezeem.dev [Version 1.0.0]',
    'loading kernel....... OK',
    'loading desktop...... OK',
    'welcome back, jezeem',
  ]
  let bootText = text1
  for (const bootLine of bootLines) {
    let accumulated = ''
    tl.to({}, {
      duration: bootLine.length * 0.025,
      onUpdate() {
        const chars = Math.floor(this.progress() * bootLine.length)
        if (chars !== accumulated.length) {
          accumulated = bootLine.slice(0, chars)
          const display = (bootText + '\n' + accumulated).replace(/\n/g, '<br>')
          textEl.innerHTML = display + '<span class="inline-cursor">█</span>'
        }
      },
      onComplete() {
        bootText = bootText + '\n' + bootLine
      }
    })
    tl.to({}, { duration: 0.12 })
  }

  tl.to({}, { duration: 0.5 })

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
        const display = (bootText + text2).replace(/\n/g, '<br>')
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
