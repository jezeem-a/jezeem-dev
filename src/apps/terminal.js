import { createWindow, closeWindow } from '../os/window-manager.js'

const COMMANDS = {
  whoami: () => ['jezeem \u2014 builder. software engineer. ai buff.'],
  'ls projects': () => ['incredible-visibility/  mobile-apps/  open-source/'],
  'cat skills': () => [
    '> JavaScript', '> TypeScript', '> React', '> Flutter', '> Dart',
    '> Expo', '> Git', '> Node.js', '> Firebase', '> REST API',
    '> React Native', '> VSCode',
  ],
  'cat contact': () => ['email: jezeem.dev@gmail.com'],
  help: () => [
    'available commands:',
    '  whoami         \u2014 who is this person',
    '  ls projects    \u2014 list projects',
    '  cat skills     \u2014 list all skills',
    '  cat contact    \u2014 contact info',
    '  open <app>     \u2014 open an app (about|projects|experience|skills|contact)',
    '  clear          \u2014 clear terminal',
    '  exit           \u2014 close terminal',
    '  secret         \u2014 ?',
  ],
  secret: () => [
    '\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510',
    '\u2502  hint: \u2191\u2191\u2193\u2193\u2190\u2192\u2190\u2192ba ( Konami Code )  \u2502',
    '\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518',
    '  press keys in order on your keyboard...',
  ],
  clear: () => null,
  exit: () => null,
}

const OPENABLE_APPS = ['about', 'projects', 'experience', 'skills', 'contact', 'glitch']

let history = []
let historyIndex = -1

export function openTerminalApp() {
  document.dispatchEvent(new CustomEvent('window-opened', { detail: 'terminal' }))

  const body = document.createElement('div')
  body.style.cssText = `
    display: flex;
    flex-direction: column;
    height: 100%;
    font-family: 'VT323', monospace;
    font-size: 15px;
    background: #0d0d0d;
  `
  body.innerHTML = `
    <div class="term-output" style="
      flex: 1;
      overflow-y: auto;
      padding: 10px 14px;
      color: #e0e0e0;
      line-height: 1.55;
      scrollbar-width: thin;
      scrollbar-color: #1a3a1a transparent;
    "></div>
    <div style="
      display: flex;
      align-items: center;
      padding: 6px 14px 10px;
      border-top: 1px solid #111;
      gap: 8px;
      flex-shrink: 0;
    ">
      <span style="color:#33ff33;">jezeem@os:~$</span>
      <input class="term-input" type="text" autocomplete="off" spellcheck="false" style="
        flex: 1;
        background: transparent;
        border: none;
        outline: none;
        color: #e0e0e0;
        font-family: 'VT323', monospace;
        font-size: 15px;
        caret-color: #33ff33;
      " />
    </div>
  `

  createWindow({ id: 'terminal', title: 'terminal', width: 580, height: 380, x: 180, y: 110, content: body })

  const output = body.querySelector('.term-output')
  const input = body.querySelector('.term-input')

  printLines(['jezeem.dev terminal v2.0.0', "type 'help' to see available commands", ''], output)
  setTimeout(() => input?.focus(), 150)

  input.addEventListener('keydown', e => handleKey(e, input, output))
}

function handleKey(e, input, output) {
  if (e.key === 'Enter') {
    const raw = input.value.trim()
    input.value = ''
    historyIndex = -1
    if (!raw) return

    history.unshift(raw)
    if (history.length > 50) history.pop()

    printLine(`$ ${raw}`, '#33ff33', output)

    const cmd = raw.toLowerCase()

    if (cmd === 'exit') { closeWindow('terminal'); return }
    if (cmd === 'clear') { output.innerHTML = ''; return }

    if (cmd.startsWith('open ')) {
      const appId = cmd.slice(5).trim()
      if (OPENABLE_APPS.includes(appId)) {
        document.dispatchEvent(new CustomEvent('open-app', { detail: appId }))
        printLine(`> opening ${appId}...`, '#33ff33', output)
      } else {
        printLine(`no app '${appId}'. available: ${OPENABLE_APPS.join(', ')}`, '#666', output)
      }
      output.scrollTop = output.scrollHeight
      return
    }

    const handler = COMMANDS[cmd]
    if (handler) {
      printLines(handler(), output)
    } else {
      printLine(`command not found: ${raw}. type 'help' for available commands.`, '#555', output)
    }
    output.scrollTop = output.scrollHeight
    return
  }

  if (e.key === 'ArrowUp') {
    e.preventDefault()
    if (historyIndex < history.length - 1) input.value = history[++historyIndex]
  }
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    historyIndex > 0 ? (input.value = history[--historyIndex]) : (historyIndex = -1, input.value = '')
  }
}

function printLine(text, color = '#e0e0e0', output) {
  const line = document.createElement('div')
  line.style.color = color
  line.textContent = text
  output.appendChild(line)
}

function printLines(lines, output) {
  if (!lines) return
  for (const l of lines) printLine(l, '#e0e0e0', output)
}
