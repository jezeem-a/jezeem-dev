export function initMenubar() {
  const bar = document.createElement('div')
  bar.id = 'os-menubar'
  bar.style.cssText = `
    position: fixed;
    top: 0; left: 0; right: 0;
    height: 32px;
    background: rgba(10,10,10,0.92);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid #1a1a1a;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    z-index: 9000;
    font-family: 'VT323', monospace;
    font-size: 14px;
    color: #888;
    user-select: none;
  `

  bar.innerHTML = `
    <div style="display:flex;align-items:center;gap:20px;">
      <span id="mb-apple" style="color:#33ff33;cursor:pointer;font-size:18px;text-shadow:0 0 8px rgba(51,255,51,0.5);" title="jezeem.dev">✦</span>
      <span id="mb-appname" style="color:#e0e0e0;font-size:14px;letter-spacing:0.5px;">Finder</span>
    </div>
    <div style="display:flex;align-items:center;gap:20px;">
      <span id="mb-battery" style="font-size:13px;color:#555;" title="battery">▓▓▓░ 75%</span>
      <span id="mb-clock" style="color:#e0e0e0;font-size:14px;min-width:72px;text-align:right;"></span>
    </div>
  `

  document.body.appendChild(bar)

  function updateClock() {
    const now = new Date()
    const h = String(now.getHours()).padStart(2, '0')
    const m = String(now.getMinutes()).padStart(2, '0')
    const s = String(now.getSeconds()).padStart(2, '0')
    document.getElementById('mb-clock').textContent = `${h}:${m}:${s}`
  }
  updateClock()
  setInterval(updateClock, 1000)

  // Apple logo dropdown
  document.getElementById('mb-apple').addEventListener('click', e => {
    e.stopPropagation()
    let dd = document.getElementById('mb-apple-dd')
    if (dd) { dd.remove(); return }

    dd = document.createElement('div')
    dd.id = 'mb-apple-dd'
    dd.style.cssText = `
      position: fixed;
      top: 32px; left: 8px;
      background: #111;
      border: 1px solid #2a2a2a;
      font-family: 'VT323', monospace;
      font-size: 14px;
      color: #e0e0e0;
      z-index: 9100;
      min-width: 200px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.7);
      border-radius: 4px;
      overflow: hidden;
    `

    const items = [
      { label: 'About jezeem.dev', action: () => document.dispatchEvent(new CustomEvent('open-app', { detail: 'about' })) },
      { label: '─────────────────────', action: null },
      { label: 'GitHub \u2197', action: () => window.open('https://github.com/jezeem-a', '_blank', 'noopener') },
      { label: 'LinkedIn \u2197', action: () => window.open('https://linkedin.com/in/jezeem', '_blank', 'noopener') },
      { label: '─────────────────────', action: null },
      { label: 'Restart intro', action: () => location.reload() },
    ]

    dd.innerHTML = items.map((item, i) => `
      <div class="mb-item" data-i="${i}" style="
        padding: 7px 14px;
        cursor: ${item.action ? 'pointer' : 'default'};
        color: ${item.label.startsWith('─') ? '#2a2a2a' : '#e0e0e0'};
        border-bottom: ${item.label.startsWith('─') ? '0' : '0'};
      ">${item.label}</div>
    `).join('')

    document.body.appendChild(dd)

    dd.querySelectorAll('.mb-item').forEach((el, i) => {
      if (!items[i].action) return
      el.addEventListener('mouseenter', () => { el.style.background = '#1a1a1a' })
      el.addEventListener('mouseleave', () => { el.style.background = '' })
      el.addEventListener('click', () => { items[i].action(); dd.remove() })
    })

    setTimeout(() => {
      document.addEventListener('click', () => dd?.remove(), { once: true })
    }, 0)
  })

  // Window focus updates app name in menubar
  document.addEventListener('window-focused', e => {
    const el = document.getElementById('mb-appname')
    if (el) el.textContent = e.detail.title
  })
}
