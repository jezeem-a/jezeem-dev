import gsap from 'gsap'

const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
const KEY_SEQUENCE = []

export function initKonami() {
  document.addEventListener('keydown', e => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key
    KEY_SEQUENCE.push(key)
    if (KEY_SEQUENCE.length > 10) KEY_SEQUENCE.shift()
    if (KEY_SEQUENCE.join(' ').endsWith(KONAMI_CODE.join(' '))) {
      KEY_SEQUENCE.length = 0
      startBSOD()
    }
  })
}

function startBSOD() {
  // Shake entire page first
  gsap.to(document.body, {
    x: () => (Math.random() - 0.5) * 20,
    y: () => (Math.random() - 0.5) * 12,
    duration: 0.06,
    repeat: 8,
    yoyo: true,
    ease: 'none',
    onComplete() { gsap.set(document.body, { x: 0, y: 0 }) }
  })

  const overlay = document.createElement('div')
  overlay.id = 'konami-bsod'
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: #0000aa;
    z-index: 99999;
    font-family: 'VT323', monospace;
    color: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
    opacity: 0;
    overflow: hidden;
  `

  const WARNINGS = [
    'KERNEL_PANIC: unauthorized_konami_access',
    'MEMORY_FAULT: 0xDEADBEEF at address 0x00000000',
    'STACK_OVERFLOW: portfolio.exe terminated',
    'SECURITY_BREACH: identity verified — jezeem',
    'CRITICAL: too many vibes detected',
    'WARNING: developer awareness level — MAX',
    'SYSTEM_ERROR: cannot contain this much coolness',
    'ACCESS_GRANTED: welcome to the inner sanctum',
  ]

  const style = document.createElement('style')
  style.textContent = `
    @keyframes bsod-flicker {
      0%, 100% { opacity: 1; }
      92% { opacity: 1; }
      93% { opacity: 0.85; }
      94% { opacity: 1; }
    }
    @keyframes bsod-scan {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(100vh); }
    }
    @keyframes bsod-shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-3px); }
      75% { transform: translateX(3px); }
    }
    #konami-bsod .bsod-warning {
      color: #ffff55;
      animation: bsod-shake 0.15s infinite;
    }
    #konami-bsod .bsod-scanline {
      position: absolute;
      left: 0; right: 0;
      height: 3px;
      background: rgba(255,255,255,0.08);
      animation: bsod-scan 2.5s linear infinite;
      pointer-events: none;
    }
    #konami-bsod {
      animation: bsod-flicker 3s infinite;
    }
  `
  document.head.appendChild(style)

  overlay.innerHTML = `
    <div class="bsod-scanline"></div>
    <div style="text-align:center;max-width:640px;width:100%;">
      <div style="font-size:72px;margin-bottom:16px;text-shadow:4px 4px 0 rgba(0,0,0,0.3);">:(</div>
      <div style="font-size:28px;letter-spacing:2px;margin-bottom:24px;">jezeem.dev OS</div>
      <div style="font-size:18px;margin-bottom:32px;opacity:0.9;line-height:1.5;">
        Your OS ran into a problem and needs to restart.<br>
        We're collecting some info, and then we'll reboot.
      </div>
      <div id="bsod-progress" style="font-size:20px;margin-bottom:28px;color:#aaaaff;">0% complete</div>
      <div style="text-align:left;background:rgba(255,255,255,0.08);padding:16px;border-radius:2px;margin-bottom:24px;">
        <div style="color:#aaaaff;font-size:14px;margin-bottom:8px;">// system log</div>
        <div id="bsod-log" style="font-size:14px;line-height:1.8;max-height:160px;overflow:hidden;"></div>
      </div>
      <div style="font-size:14px;opacity:0.6;line-height:1.6;">
        For more information about this error, visit:<br>
        <span style="color:#aaaaff;">jezeem.dev/bsod?code=KONAMI_UNLOCK</span>
      </div>
      <div id="bsod-reboot-msg" style="margin-top:24px;font-size:16px;opacity:0;color:#ffff55;">
        rebooting in <span id="bsod-countdown">5</span>...
      </div>
    </div>
  `

  document.body.appendChild(overlay)

  // Fade in
  gsap.to(overlay, { opacity: 1, duration: 0.08, ease: 'none' })

  const logEl = overlay.querySelector('#bsod-log')
  const progressEl = overlay.querySelector('#bsod-progress')
  const rebootMsg = overlay.querySelector('#bsod-reboot-msg')
  const countdown = overlay.querySelector('#bsod-countdown')

  // Add log lines with stagger
  WARNINGS.forEach((warn, i) => {
    setTimeout(() => {
      const line = document.createElement('div')
      line.className = i % 3 === 0 ? 'bsod-warning' : ''
      line.textContent = warn
      logEl.appendChild(line)
      logEl.scrollTop = logEl.scrollHeight
    }, 400 + i * 300)
  })

  // Progress counter
  let pct = 0
  const progressInterval = setInterval(() => {
    pct = Math.min(100, pct + Math.floor(Math.random() * 8) + 2)
    progressEl.textContent = `${pct}% complete`
    if (pct >= 100) {
      clearInterval(progressInterval)
      progressEl.textContent = '100% complete'
      showReboot()
    }
  }, 180)

  function showReboot() {
    gsap.to(rebootMsg, { opacity: 1, duration: 0.3 })
    let n = 5
    const countdownInterval = setInterval(() => {
      n--
      countdown.textContent = n
      if (n <= 0) {
        clearInterval(countdownInterval)
        // White flash then remove
        gsap.to(overlay, {
          backgroundColor: '#ffffff',
          duration: 0.12,
          ease: 'none',
          onComplete() {
            gsap.to(overlay, {
              opacity: 0,
              duration: 0.3,
              delay: 0.05,
              ease: 'power2.out',
              onComplete() {
                overlay.remove()
                style.remove()
              }
            })
          }
        })
      }
    }, 1000)

    // Allow escape to skip countdown
    const onEsc = e => {
      if (e.key === 'Escape') {
        clearInterval(countdownInterval)
        document.removeEventListener('keydown', onEsc)
        gsap.to(overlay, {
          opacity: 0, duration: 0.2,
          onComplete() { overlay.remove(); style.remove() }
        })
      }
    }
    document.addEventListener('keydown', onEsc)
  }
}
