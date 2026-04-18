export function initCursor() {
  const cursor = document.createElement('div')
  cursor.id = 'custom-cursor'
  cursor.style.cssText = `
    position: fixed;
    width: 14px;
    height: 14px;
    z-index: 9999;
    pointer-events: none;
    transform: translate(-50%, -50%);
    transition: transform 0.08s ease, opacity 0.2s;
  `
  cursor.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="7" y1="0" x2="7" y2="14" stroke="#33ff33" stroke-width="1.5"/>
      <line x1="0" y1="7" x2="14" y2="7" stroke="#33ff33" stroke-width="1.5"/>
      <rect x="5" y="5" width="4" height="4" fill="none" stroke="#33ff33" stroke-width="1"/>
    </svg>
  `
  document.body.appendChild(cursor)

  let mx = -100, my = -100

  document.addEventListener('mousemove', e => {
    mx = e.clientX
    my = e.clientY
    cursor.style.left = mx + 'px'
    cursor.style.top  = my + 'px'
  })

  document.addEventListener('mouseleave', () => { cursor.style.opacity = '0' })
  document.addEventListener('mouseenter', () => { cursor.style.opacity = '1' })

  // Scale up on hoverable elements
  const hoverSelectors = 'a, button, [class*="zone-dot"], .exp-card a, #term-close, #zone-wildcard, .social-link, [style*="cursor: pointer"]'

  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverSelectors)) {
      cursor.style.transform = 'translate(-50%, -50%) scale(1.6)'
    }
  })

  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverSelectors)) {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)'
    }
  })
}
