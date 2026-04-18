import gsap from 'gsap'

const SKILLS = ['JS', 'TypeScript', 'React', 'Flutter', 'Dart', 'Expo',
                'Git', 'Node.js', 'Firebase', 'REST API', 'React Native', 'VSCode']

export function initSkills() {
  const el = document.createElement('div')
  el.id = 'zone-skills'
  el.style.cssText = `
    position: fixed;
    top: 70%;
    left: 20%;
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
      <span style="font-family:'VT323',monospace;font-size:14px;color:#666;">skills & tools</span>
    </div>
    <div class="skills-tags"></div>
  `

  document.getElementById('main-content').appendChild(el)

  // Build tag elements
  const container = el.querySelector('.skills-tags')
  const tags = SKILLS.map(skill => {
    const tag = document.createElement('div')
    tag.textContent = skill
    tag.style.cssText = `
      position: absolute;
      background: #1a1a1a;
      border: 1px solid #33ff33;
      color: #33ff33;
      font-family: 'VT323', monospace;
      font-size: 15px;
      padding: 2px 10px;
      border-radius: 3px;
      white-space: nowrap;
      opacity: 0;
      transform: translate(0,0);
      pointer-events: none;
      text-shadow: 0 0 4px rgba(51,255,51,0.4);
    `
    container.appendChild(tag)
    return tag
  })

  // Pre-compute random scatter destinations
  const dests = tags.map(() => {
    const angle = Math.random() * Math.PI * 2
    const dist  = 60 + Math.random() * 100
    return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist }
  })

  let floatTweens = []

  el.addEventListener('mouseenter', () => {
    tags.forEach((tag, i) => {
      gsap.killTweensOf(tag)
      gsap.set(tag, { x: 0, y: 0, opacity: 0 })
      gsap.to(tag, {
        x: dests[i].x, y: dests[i].y,
        opacity: 1,
        duration: 0.4,
        delay: i * 0.03,
        ease: 'power2.out',
        onComplete() {
          const t = gsap.to(tag, {
            y: `+=${4 + Math.random() * 4}`,
            duration: 1.2 + Math.random() * 0.6,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1
          })
          floatTweens.push(t)
        }
      })
    })
  })

  el.addEventListener('mouseleave', () => {
    floatTweens.forEach(t => t.kill())
    floatTweens = []
    tags.forEach((tag, i) => {
      gsap.killTweensOf(tag)
      gsap.to(tag, {
        x: 0, y: 0, opacity: 0,
        duration: 0.3,
        delay: i * 0.02,
        ease: 'power2.in'
      })
    })
  })
}
