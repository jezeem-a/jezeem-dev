import { createWindow } from '../os/window-manager.js'

const PROJECTS = [
  {
    name: 'incredible-visibility',
    desc: 'Marketing & analytics SaaS platform',
    url: 'https://incrediblevisibility.com',
    tech: ['React', 'Firebase', 'Node.js', 'REST API'],
  },
  {
    name: 'mobile-apps/',
    desc: 'Flutter & Expo cross-platform apps',
    url: null,
    tech: ['Flutter', 'Dart', 'Expo', 'React Native'],
  },
  {
    name: 'open-source/',
    desc: 'Contributions & utilities on GitHub',
    url: 'https://github.com/jezeem-a',
    tech: ['TypeScript', 'Git'],
  },
]

export function openProjects() {
  const content = document.createElement('div')
  content.style.cssText = `
    padding: 20px 24px;
    font-family: 'VT323', monospace;
    color: #e0e0e0;
    font-size: 15px;
  `
  content.innerHTML = `
    <div style="color:#33ff33;font-size:20px;margin-bottom:16px;">&gt; ls -la projects/</div>
    ${PROJECTS.map(p => `
      <div style="margin-bottom:16px;padding:12px 14px;background:#1a1a1a;border:1px solid #252525;border-radius:4px;">
        <div style="color:#33ff33;font-size:17px;margin-bottom:4px;">
          ${p.url
            ? `<a href="${p.url}" target="_blank" rel="noopener" style="color:#33ff33;text-decoration:none;">${p.name} \u2197</a>`
            : `<span>${p.name}</span>`
          }
        </div>
        <div style="color:#888;font-size:14px;margin-bottom:8px;">${p.desc}</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;">
          ${p.tech.map(t => `<span style="background:#111;border:1px solid #2a2a2a;color:#666;font-size:12px;padding:1px 7px;border-radius:2px;">${t}</span>`).join('')}
        </div>
      </div>
    `).join('')}
  `

  document.dispatchEvent(new CustomEvent('window-opened', { detail: 'projects' }))
  createWindow({ id: 'projects', title: 'projects/', width: 480, height: 420, x: 160, y: 90, content })
}
