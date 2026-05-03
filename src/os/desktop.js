import gsap from 'gsap'
import { initMenubar } from './menubar.js'
import { initDock } from './dock.js'
import { showNotification } from './notifications.js'
import { openAbout } from '../apps/about.js'
import { openProjects } from '../apps/projects.js'
import { openExperience } from '../apps/experience.js'
import { openSkills } from '../apps/skills.js'
import { openContact } from '../apps/contact.js'
import { openTerminalApp } from '../apps/terminal.js'
import { openGlitchGame } from '../apps/glitch-game.js'

const APP_HANDLERS = {
  about:      openAbout,
  projects:   openProjects,
  experience: openExperience,
  skills:     openSkills,
  contact:    openContact,
  terminal:   openTerminalApp,
  glitch:     openGlitchGame,
}

const DESKTOP_ICONS = [
  { id: 'about',      label: 'about.txt',  icon: '\u25c8' },
  { id: 'projects',   label: 'projects/',   icon: '\u2b21' },
  { id: 'experience', label: 'work.log',    icon: '\u29c9' },
  { id: 'skills',     label: 'skills.sh',   icon: '\u27e1' },
  { id: 'contact',    label: 'contact.md',  icon: '\u25c9' },
]

export function initOS() {
  initMenubar()
  initDock()

  // Dispatch open-app events from anywhere
  document.addEventListener('open-app', e => {
    const handler = APP_HANDLERS[e.detail]
    if (handler) handler()
  })

  // Keep legacy open-terminal event working
  document.addEventListener('open-terminal', () => openTerminalApp())

  buildDesktopIcons()

  // Auto-open About + welcome notification after a short delay
  setTimeout(() => {
    openAbout()
    setTimeout(() => {
      showNotification({
        title: 'jezeem.dev OS',
        message: 'Double-click icons or use the dock to explore.',
      })
    }, 800)
  }, 500)
}

function buildDesktopIcons() {
  const style = document.createElement('style')
  style.textContent = `
    .desktop-icon {
      position: fixed;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      cursor: pointer;
      padding: 8px 4px 4px;
      border-radius: 6px;
      border: 1px solid transparent;
      user-select: none;
      width: 72px;
      text-align: center;
      transition: background 0.15s, border-color 0.15s;
    }
    .desktop-icon:hover {
      background: rgba(51,255,51,0.04);
      border-color: rgba(51,255,51,0.12);
    }
    .desktop-icon.selected {
      background: rgba(51,255,51,0.08);
      border-color: rgba(51,255,51,0.22);
    }
    .desktop-icon .di-icon {
      font-family: 'VT323', monospace;
      font-size: 28px;
      color: #33ff33;
      text-shadow: 0 0 8px rgba(51,255,51,0.35);
      line-height: 1;
    }
    .desktop-icon .di-label {
      font-family: 'VT323', monospace;
      font-size: 12px;
      color: #888;
      line-height: 1.2;
      word-break: break-all;
    }
  `
  document.head.appendChild(style)

  const desktop = document.getElementById('main-content')

  DESKTOP_ICONS.forEach(({ id, label, icon }, idx) => {
    const el = document.createElement('div')
    el.className = 'desktop-icon'
    el.dataset.appId = id
    el.style.left = '20px'
    el.style.top = (48 + idx * 90) + 'px'
    el.innerHTML = `
      <span class="di-icon">${icon}</span>
      <span class="di-label">${label}</span>
    `

    let clickTimer = null
    el.addEventListener('click', e => {
      e.stopPropagation()
      // Deselect all, select this
      document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'))
      el.classList.add('selected')

      if (clickTimer) {
        clearTimeout(clickTimer)
        clickTimer = null
        APP_HANDLERS[id]?.()
      } else {
        clickTimer = setTimeout(() => { clickTimer = null }, 380)
      }
    })

    gsap.set(el, { opacity: 0, x: -8 })
    gsap.to(el, { opacity: 1, x: 0, duration: 0.3, delay: idx * 0.06, ease: 'power2.out' })

    desktop.appendChild(el)
  })

  // Click desktop to deselect
  desktop.addEventListener('click', e => {
    if (!e.target.closest('.desktop-icon')) {
      document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'))
    }
  })
}
