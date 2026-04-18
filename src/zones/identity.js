import gsap from 'gsap'

export function initIdentity() {
  const el = document.createElement('div')
  el.id = 'zone-identity'
  el.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 20;
    text-align: center;
    pointer-events: none;
  `
  el.innerHTML = `
    <div id="identity-typewriter" style="
      font-family: 'VT323', monospace;
      font-size: 26px;
      color: #e0e0e0;
      letter-spacing: 1px;
      min-height: 32px;
    "></div>
    <div id="identity-status" style="
      font-family: 'VT323', monospace;
      font-size: 16px;
      color: #33ff33;
      text-shadow: 0 0 8px #33ff33;
      margin-top: 10px;
      opacity: 0;
      letter-spacing: 1px;
    "></div>
  `
  document.getElementById('main-content').appendChild(el)

  document.addEventListener('intro-complete', () => {
    startTypewriter()
  })
}

function startTypewriter() {
  const typer  = document.getElementById('identity-typewriter')
  const status = document.getElementById('identity-status')

  const line = '> software engineer. flutter. react. builder.'
  let typed = ''
  let charIndex = 0

  const interval = setInterval(() => {
    typed += line[charIndex]
    charIndex++
    typer.innerHTML = typed + '<span style="animation:id-blink 1s step-end infinite;display:inline-block">█</span>'

    if (charIndex >= line.length) {
      clearInterval(interval)
      startStatusLine(status)
    }
  }, 40)
}

function startStatusLine(status) {
  setTimeout(() => {
    gsap.to(status, { opacity: 1, duration: 0.8, ease: 'power2.out' })
    updateStatus(status)
    setInterval(() => updateStatus(status), 1000)
  }, 800)
}

function updateStatus(el) {
  const now = new Date()
  const time = now.toLocaleTimeString('en-US', { hour12: false })
  el.textContent = `SYSTEM: ONLINE  ·  USER: JEZEEM  ·  ${time}  ·  AVAILABLE`
}

// Inject blink keyframe once
const styleTag = document.createElement('style')
styleTag.textContent = `
  @keyframes id-blink { 0%,100%{opacity:1} 50%{opacity:0} }
`
document.head.appendChild(styleTag)
