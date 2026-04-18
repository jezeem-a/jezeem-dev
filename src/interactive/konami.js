import gsap from 'gsap'

const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
const KEY_SEQUENCE = []

let audioCtx = null

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioCtx
}

function playBeep(freq = 800, duration = 0.05, type = 'square') {
  const ctx = initAudio()
  if (ctx.state === 'suspended') ctx.resume()
  
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  
  osc.type = type
  osc.frequency.setValueAtTime(freq, ctx.currentTime)
  
  gain.gain.setValueAtTime(0.08, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
  
  osc.connect(gain)
  gain.connect(ctx.destination)
  
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + duration)
}

function playStatic(duration = 0.3) {
  const ctx = initAudio()
  if (ctx.state === 'suspended') ctx.resume()
  
  const bufferSize = ctx.sampleRate * duration
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1
  }
  
  const source = ctx.createBufferSource()
  const gain = ctx.createGain()
  const filter = ctx.createBiquadFilter()
  
  source.buffer = buffer
  filter.type = 'highpass'
  filter.frequency.value = 1000
  
  gain.gain.setValueAtTime(0.05, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
  
  source.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)
  
  source.start()
}

function playAlert() {
  playBeep(1200, 0.1)
  setTimeout(() => playBeep(800, 0.15), 100)
}

function playSuccess() {
  playBeep(523, 0.1)
  setTimeout(() => playBeep(659, 0.1), 100)
  setTimeout(() => playBeep(784, 0.2), 200)
}

function generateHexAddr() {
  return '0x' + Array.from({length: 8}, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase()).join('')
}

function generateHexDump() {
  return Array.from({length: 8}, () => Math.floor(Math.random() * 256).toString(16).toUpperCase().padStart(2, '0')).join(' ')
}

const PROCESSES = [
  { name: 'init', pid: 1, user: 'root' },
  { name: 'kernel_task', pid: 2, user: 'root' },
  { name: 'window_server', pid: 156, user: 'root' },
  { name: 'loginwindow', pid: 189, user: 'jezeem' },
  { name: 'Dock', pid: 234, user: 'jezeem' },
  { name: 'Finder', pid: 267, user: 'jezeem' },
  { name: 'Terminal', pid: 312, user: 'jezeem' },
  { name: 'Safari', pid: 389, user: 'jezeem' },
  { name: 'Code', pid: 421, user: 'jezeem' },
  { name: 'node', pid: 503, user: 'jezeem' },
  { name: 'nginx', pid: 567, user: 'root' },
  { name: 'postgres', pid: 612, user: '_postgres' },
]

const WARNINGS = [
  'KERNEL: unauthorized access detected',
  'FIREWALL: breach attempt blocked',
  'SYSTEM: security alert triggered',
  'MEMORY: overwrite request pending',
  'PORT: 1337 scan detected',
  'SSH: brute force attempt from 192.168.1.47',
  'KERNEL: privilege escalation detected',
  'FIREWALL: dropping packet from suspicious source',
]

export function initKonami() {
  document.addEventListener('keydown', handleKey)
}

function handleKey(e) {
  const key = e.key.length === 1 ? e.key.toLowerCase() : e.key
  
  KEY_SEQUENCE.push(key)
  if (KEY_SEQUENCE.length > 10) KEY_SEQUENCE.shift()
  
  if (KEY_SEQUENCE.join(' ').endsWith(KONAMI_CODE.join(' '))) {
    KEY_SEQUENCE.length = 0
    startDiagnostic()
  }
}

function startDiagnostic() {
  playStatic(0.4)
  
  const overlay = document.createElement('div')
  overlay.id = 'konami-overlay'
  overlay.innerHTML = `
    <div class="scanlines"></div>
    <div class="konami-content">
      <div class="konami-header">
        <span>SYSTEM DIAGNOSTIC UTILITY v3.7.2</span>
        <span id="konami-time">00:00:00</span>
      </div>
      <div class="konami-output"></div>
    </div>
  `
  
  Object.assign(overlay.style, {
    position: 'fixed',
    inset: 0,
    background: '#000',
    zIndex: 9999,
    fontFamily: "'VT323', monospace",
    fontSize: '14px',
    color: '#33ff33',
    overflow: 'hidden',
  })
  
  const style = document.createElement('style')
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
    
    #konami-overlay .scanlines {
      position: absolute;
      inset: 0;
      background: repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(0, 0, 0, 0.15) 2px,
        rgba(0, 0, 0, 0.15) 4px
      );
      pointer-events: none;
      z-index: 1;
    }
    
    #konami-overlay .konami-content {
      position: relative;
      height: 100%;
      padding: 20px;
      overflow-y: auto;
      z-index: 2;
    }
    
    #konami-overlay .konami-header {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #33ff33;
      padding-bottom: 10px;
      margin-bottom: 15px;
      text-shadow: 0 0 10px rgba(51, 255, 51, 0.7);
    }
    
    #konami-overlay .konami-line {
      margin: 2px 0;
      white-space: pre;
    }
    
    #konami-overlay .konami-line.glitch {
      animation: glitch-text 0.1s infinite;
      text-shadow: 
        2px 0 #ff0066,
        -2px 0 #00ffff;
    }
    
    @keyframes glitch-text {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-2px); }
      75% { transform: translateX(2px); }
    }
    
    #konami-overlay .konami-bar-container {
      display: inline-block;
      width: 120px;
    }
    
    #konami-overlay .konami-bar {
      display: inline-block;
      background: #33ff33;
      color: #000;
      transition: width 0.3s;
    }
    
    #konami-overlay .konami-warning {
      color: #ff3333;
      text-shadow: 0 0 10px rgba(255, 51, 51, 0.7);
      animation: blink 0.3s infinite;
    }
    
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    
    #konami-overlay .konami-success {
      font-size: 28px;
      text-shadow: 
        0 0 20px rgba(51, 255, 51, 0.9),
        0 0 40px rgba(51, 255, 51, 0.5);
      animation: pulse 0.5s infinite;
    }
    
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    
    #konami-overlay .konami-welcome {
      font-size: 20px;
      margin-top: 20px;
    }
  `
  
  document.head.appendChild(style)
  document.body.appendChild(overlay)
  
  const output = overlay.querySelector('.konami-output')
  const timeEl = overlay.querySelector('#konami-time')
  
  // Allow escape to exit
  const handleEsc = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      clearInterval(timeInterval)
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.3,
        onComplete() {
          overlay.remove()
          style.remove()
        }
      })
    }
  }
  document.addEventListener('keydown', handleEsc)
  
  let startTime = Date.now()
  let timeInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000)
    const hrs = String(Math.floor(elapsed / 3600)).padStart(2, '0')
    const mins = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0')
    const secs = String(elapsed % 60).padStart(2, '0')
    timeEl.textContent = `${hrs}:${mins}:${secs}`
  }, 1000)
  
  function addLine(text, className = '', delay = 0) {
    return new Promise(resolve => {
      setTimeout(() => {
        const line = document.createElement('div')
        line.className = 'konami-line' + (className ? ' ' + className : '')
        line.textContent = text
        output.appendChild(line)
        output.scrollTop = output.scrollHeight
        resolve()
      }, delay)
    })
  }
  
  async function runDiagnostic() {
    await addLine('[SYSTEM] Initializing diagnostic utility...', '', 0)
    await addLine('[SYSTEM] Verifying kernel access...', '', 300)
    await addLine('[OK] Kernel verified', '', 500)
    await addLine('[SYSTEM] Scanning memory addresses...', '', 700)
    
    playBeep(400, 0.02)
    
    for (let i = 0; i < 12; i++) {
      const addr = generateHexAddr()
      const dump = generateHexDump()
      await addLine(`${addr}:  ${dump}`, '', 50)
    }
    
    await addLine('[SYSTEM] Building process tree...', '', 800)
    await addLine('[OK] Process tree constructed', '', 1000)
    
    await addLine('', '', 200)
    await addLine('USER       PID    COMMAND', '', 400)
    await addLine('----        ---    -------', '', 450)
    
    for (const proc of PROCESSES) {
      await addLine(`${proc.user.padEnd(10)} ${String(proc.pid).padStart(5)} ${proc.name}`, '', 200)
    }
    
    await addLine('', '', 500)
    await addLine('[SYSTEM] Analyzing system resources...', '', 600)
    
    await addLine('', '', 500)
    output.innerHTML += '<div class="konami-line">CPU:    [                    ] 0%</div>'
    output.innerHTML += '<div class="konami-line">MEMORY: [                    ] 0%</div>'
    output.scrollTop = output.scrollHeight
    const lines = output.querySelectorAll('.konami-line')
    const cpuLine = lines[lines.length - 2]
    const memLine = lines[lines.length - 1]
    
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(r => setTimeout(r, 80))
      const bar = '█'.repeat(i / 5 * 2) + ' '.repeat(20 - i / 5 * 2)
      if (cpuLine) cpuLine.textContent = `CPU:    [${bar}] ${i}%`
      if (memLine) memLine.textContent = `MEMORY: [${bar}] ${i}%`
      output.scrollTop = output.scrollHeight
      
      if (i > 70) playBeep(300 + i * 10, 0.02)
    }
    
    await addLine('[OK] Resources at maximum capacity', '', 400)
    await addLine('[WARNING] Anomalous activity detected', '', 600)
    
    playAlert()
    
    await addLine('', '', 300)
    
    for (const warn of WARNINGS) {
      await addLine(warn, 'konami-warning', 350)
      playBeep(200 + Math.random() * 400, 0.03, 'sawtooth')
    }
    
    await addLine('', '', 500)
    await addLine('[SYSTEM] Initiating override protocol...', '', 600)
    await addLine('[SYSTEM] Bypassing security layers...', '', 800)
    await addLine('[SYSTEM] Accessing user database...', '', 1000)
    await addLine('[OK] User verified: jezeem', '', 1200)
    
    await addLine('', '', 500)
    
    const successLine = await addLine('ACCESS GRANTED', 'konami-success', 0)
    playSuccess()
    
    await new Promise(r => setTimeout(r, 1200))
    
    await addLine('', '', 0)
    await addLine('═══════════════════════════════════════', '', 200)
    await addLine('', '', 250)
    await addLine('          — welcome, jezeem', 'konami-welcome', 300)
    await addLine('', '', 350)
    await addLine('═══════════════════════════════════════', '', 400)
    
    await new Promise(r => setTimeout(r, 2000))
    
    clearInterval(timeInterval)
    document.removeEventListener('keydown', handleEsc)
    
    gsap.to(overlay, {
      opacity: 0,
      duration: 1,
      ease: 'power2.inOut',
      onComplete() {
        document.removeEventListener('keydown', handleEsc)
        overlay.remove()
        style.remove()
      }
    })
  }
  
  runDiagnostic()
}