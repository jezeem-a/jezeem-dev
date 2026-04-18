import gsap from 'gsap'

const COMMANDS = {
  whoami: () => ['jezeem — builder. flutter. react. ai buff.'],
  'ls projects': () => ['incredible-visibility/  side-projects/  open-source/'],
  'cat skills': () => [
    '> JS', '> TypeScript', '> React', '> Flutter', '> Dart',
    '> Expo', '> Git', '> Node.js', '> Firebase', '> REST API',
    '> React Native', '> VSCode'
  ],
  'cat contact': () => ['email: jezeem.dev@gmail.com'],
  help: () => [
    'available commands:',
    '  whoami       — who is this person',
    '  ls projects  — list projects',
    '  cat skills   — list all skills',
    '  cat contact  — get in touch',
    '  clear        — clear terminal',
    '  exit         — close terminal',
    '  secret      — ?',
  ],
  secret: () => [
    '┌─────────────────────────────────────┐',
    '│  hint: ↑↑↓↓←→←→ba ( Konami Code )  │',
    '└─────────────────────────────────────┘',
    '  press keys in order on your keyboard...',
  ],
  clear: () => null,
  exit: () => null,
}

let termEl = null
let isOpen = false
let history = []
let historyIndex = -1

export function initTerminal() {
  document.addEventListener('open-terminal', openTerminal)
}

function buildTerminal() {
  const el = document.createElement('div')
  el.id = 'terminal-overlay'
  el.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.95);
    width: 600px;
    max-width: 92vw;
    height: 360px;
    background: #0d0d0d;
    border: 1px solid #33ff33;
    box-shadow: 0 0 30px rgba(51,255,51,0.2), 0 0 60px rgba(51,255,51,0.05);
    z-index: 200;
    display: flex;
    flex-direction: column;
    font-family: 'VT323', monospace;
    font-size: 16px;
    opacity: 0;
  `

  el.innerHTML = `
    <div id="term-titlebar" style="
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 6px 14px;
      border-bottom: 1px solid #1a3a1a;
      background: #0a0a0a;
      flex-shrink: 0;
    ">
      <span style="color:#33ff33;text-shadow:0 0 6px rgba(51,255,51,0.6);">jezeem@portfolio:~$</span>
      <span id="term-close" style="color:#666;cursor:pointer;font-size:18px;padding:0 4px;" title="close">[x]</span>
    </div>

    <div id="term-output" style="
      flex: 1;
      overflow-y: auto;
      padding: 10px 14px;
      color: #e0e0e0;
      line-height: 1.5;
      scrollbar-width: thin;
      scrollbar-color: #1a3a1a transparent;
    "></div>

    <div id="term-input-row" style="
      display: flex;
      align-items: center;
      padding: 6px 14px 10px;
      border-top: 1px solid #111;
      flex-shrink: 0;
      gap: 8px;
    ">
      <span style="color:#33ff33;">$</span>
      <input id="term-input" type="text" autocomplete="off" spellcheck="false" style="
        flex: 1;
        background: transparent;
        border: none;
        outline: none;
        color: #e0e0e0;
        font-family: 'VT323', monospace;
        font-size: 16px;
        caret-color: #33ff33;
      " />
    </div>
  `

  return el
}

function openTerminal() {
  if (isOpen) return
  isOpen = true

  termEl = buildTerminal()
  document.getElementById('main-content').appendChild(termEl)

  // Open animation
  gsap.to(termEl, {
    opacity: 1,
    scale: 1,
    duration: 0.25,
    ease: 'power2.out',
    transformOrigin: 'center center',
    onComplete() {
      document.getElementById('term-input').focus()
    }
  })

  // Boot message
  printLines([
    'jezeem.dev terminal v1.0.0',
    "type 'help' to see available commands",
    ''
  ])

  // Wire up events
  document.getElementById('term-close').addEventListener('click', closeTerminal)
  document.getElementById('term-input').addEventListener('keydown', onKeyDown)
  document.addEventListener('keydown', onEsc)
}

function closeTerminal() {
  if (!isOpen) return
  document.removeEventListener('keydown', onEsc)

  gsap.to(termEl, {
    opacity: 0,
    scale: 0.95,
    duration: 0.2,
    ease: 'power2.in',
    onComplete() {
      termEl?.remove()
      termEl = null
      isOpen = false
    }
  })
}

function onEsc(e) {
  if (e.key === 'Escape') closeTerminal()
}

function onKeyDown(e) {
  const input = document.getElementById('term-input')

  if (e.key === 'Enter') {
    const raw = input.value.trim()
    input.value = ''
    historyIndex = -1

    if (!raw) return

    history.unshift(raw)
    if (history.length > 50) history.pop()

    // Echo the command
    printLine(`$ ${raw}`, '#33ff33')

    // Handle command
    const cmd = raw.toLowerCase()

    if (cmd === 'exit') { closeTerminal(); return }

    if (cmd === 'clear') {
      document.getElementById('term-output').innerHTML = ''
      return
    }

    const handler = COMMANDS[cmd]
    if (handler) {
      printLines(handler())
    } else {
      printLine(`command not found: ${raw}. type 'help' for available commands.`, '#666')
    }

    scrollToBottom()
    return
  }

  if (e.key === 'ArrowUp') {
    e.preventDefault()
    if (historyIndex < history.length - 1) {
      historyIndex++
      input.value = history[historyIndex]
    }
    return
  }

  if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (historyIndex > 0) {
      historyIndex--
      input.value = history[historyIndex]
    } else {
      historyIndex = -1
      input.value = ''
    }
  }
}

function printLine(text, color = '#e0e0e0') {
  const out = document.getElementById('term-output')
  const line = document.createElement('div')
  line.style.color = color
  line.textContent = text
  out.appendChild(line)
}

function printLines(lines) {
  if (!lines) return
  for (const l of lines) printLine(l)
}

function scrollToBottom() {
  const out = document.getElementById('term-output')
  out.scrollTop = out.scrollHeight
}
