import gsap from 'gsap'

export function initExperience() {
  const el = document.createElement('div')
  el.id = 'zone-experience'
  el.style.cssText = `
    position: fixed;
    top: 25%;
    left: 70%;
    z-index: 20;
    cursor: pointer;
  `
  el.innerHTML = `
    <div class="zone-dot-wrap" style="display:flex;align-items:center;gap:8px;">
      <div class="zone-dot" style="
        width:6px;height:6px;border-radius:50%;
        background:#33ff33;
        box-shadow:0 0 6px #33ff33;
        animation:dot-pulse 2s ease-in-out infinite;
      "></div>
      <span style="font-family:'VT323',monospace;font-size:14px;color:#666;">experience</span>
    </div>
    <div class="exp-card" style="
      display:none;
      margin-top:10px;
      background:#111;
      border:1px solid #2a2a2a;
      padding:16px 20px;
      font-family:'VT323',monospace;
      color:#e0e0e0;
      font-size:16px;
      line-height:1.6;
      min-width:240px;
      opacity:0;
    ">
      <div style="color:#33ff33;margin-bottom:6px;">&gt; WORK EXPERIENCE</div>
      <div style="color:#444;margin-bottom:8px;">─────────────────────────</div>
      <div>Incredible Visibility</div>
      <div style="color:#888;font-size:14px;">Builder</div>
      <div style="color:#888;font-size:14px;">2021 → Present</div>
      <div style="color:#444;margin:8px 0;">─────────────────────────</div>
      <a href="https://incrediblevisibility.com" target="_blank" rel="noopener" style="
        color:#33ff33;text-decoration:none;font-size:15px;
        text-shadow:0 0 6px rgba(51,255,51,0.5);
      ">[ visit company ↗ ]</a>
    </div>
  `

  document.getElementById('main-content').appendChild(el)
  wireHover(el)
}

function wireHover(el) {
  const card   = el.querySelector('.exp-card')
  let isHovered = false

  el.addEventListener('mouseenter', () => {
    isHovered = true
    card.style.display = 'block'
    gsap.to(card, { opacity: 1, duration: 0.3, ease: 'power2.out' })
  })

  el.addEventListener('mouseleave', () => {
    isHovered = false
    gsap.to(card, {
      opacity: 0, duration: 0.25, ease: 'power2.in',
      onComplete: () => { if (!isHovered) card.style.display = 'none' }
    })
  })
}
