import gsap from 'gsap'
import { createWindow } from '../os/window-manager.js'

const SKILLS = [
  'JavaScript', 'TypeScript', 'React', 'Flutter', 'Dart',
  'Expo', 'Git', 'Node.js', 'Firebase', 'REST API',
  'React Native', 'VSCode',
]

export function openSkills() {
  const content = document.createElement('div')
  content.style.cssText = `
    padding: 24px;
    font-family: 'VT323', monospace;
    color: #e0e0e0;
  `

  const tagsHtml = SKILLS.map(s => `
    <span class="skill-tag" style="
      display: inline-block;
      background: #1a1a1a;
      border: 1px solid #2a2a2a;
      color: #33ff33;
      font-size: 16px;
      padding: 3px 12px;
      border-radius: 3px;
      margin: 4px;
      opacity: 0;
      transform: translateY(8px);
      text-shadow: 0 0 4px rgba(51,255,51,0.3);
    ">${s}</span>
  `).join('')

  content.innerHTML = `
    <div style="color:#33ff33;font-size:20px;margin-bottom:16px;">&gt; cat skills.sh</div>
    <div style="color:#2a2a2a;margin-bottom:14px;">────────────────────────────────────────</div>
    <div id="skills-tag-container">${tagsHtml}</div>
  `

  document.dispatchEvent(new CustomEvent('window-opened', { detail: 'skills' }))
  createWindow({ id: 'skills', title: 'skills.sh', width: 420, height: 340, x: 220, y: 120, content })

  // Animate tags after window opens
  requestAnimationFrame(() => {
    const tags = content.querySelectorAll('.skill-tag')
    gsap.to([...tags], {
      opacity: 1,
      y: 0,
      duration: 0.3,
      stagger: 0.04,
      ease: 'power2.out',
      delay: 0.1,
    })
  })
}
