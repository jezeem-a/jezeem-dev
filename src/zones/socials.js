import gsap from 'gsap'

const LINKS = [
  { label: 'GitHub',   url: 'https://github.com/jezeem-a' },
  { label: 'LinkedIn', url: 'https://linkedin.com/in/jezeem' },
]

export function initSocials() {
  const el = document.createElement('div')
  el.id = 'zone-socials'
  el.style.cssText = `
    position: fixed;
    top: 20%;
    left: 15%;
    z-index: 20;
    cursor: pointer;
  `

  const linksHtml = LINKS.map(l => `
    <a href="${l.url}" target="_blank" rel="noopener" class="social-link" style="
      display:block;
      font-family:'VT323',monospace;
      font-size:20px;
      color:#e0e0e0;
      text-decoration:none;
      padding: 2px 0;
      opacity:0;
      transform:translateX(-12px);
      transition:color 0.15s;
    ">&gt; ${l.label} &nbsp;<span style="color:#33ff33;">↗</span></a>
  `).join('')

  el.innerHTML = `
    <div class="zone-dot-wrap" style="display:flex;align-items:center;gap:8px;">
      <div class="zone-dot" style="
        width:6px;height:6px;border-radius:50%;
        background:#33ff33;
        box-shadow:0 0 6px #33ff33;
        animation:dot-pulse 2s ease-in-out infinite;
      "></div>
      <span style="font-family:'VT323',monospace;font-size:14px;color:#666;">socials</span>
    </div>
    <div class="social-links" style="margin-top:10px;">${linksHtml}</div>
  `

  document.getElementById('main-content').appendChild(el)

  const links = el.querySelectorAll('.social-link')

  links.forEach(a => {
    a.addEventListener('mouseenter', () => gsap.to(a, { color: '#33ff33', duration: 0.15 }))
    a.addEventListener('mouseleave', () => gsap.to(a, { color: '#e0e0e0', duration: 0.15 }))
  })

  el.addEventListener('mouseenter', () => {
    gsap.to([...links], {
      opacity: 1, x: 0,
      duration: 0.3,
      stagger: 0.08,
      ease: 'power2.out'
    })
  })

  el.addEventListener('mouseleave', () => {
    gsap.to([...links], {
      opacity: 0, x: -12,
      duration: 0.2,
      stagger: 0.04,
      ease: 'power2.in'
    })
  })
}
