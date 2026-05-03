import { createWindow } from '../os/window-manager.js'

export function openAbout() {
  const content = document.createElement('div')
  content.style.cssText = `
    padding: 24px;
    font-family: 'VT323', monospace;
    color: #e0e0e0;
    line-height: 1.65;
    font-size: 16px;
  `
  content.innerHTML = `
    <div style="color:#33ff33;font-size:22px;text-shadow:0 0 8px rgba(51,255,51,0.5);margin-bottom:16px;">&gt; whoami</div>
    <div style="font-size:20px;margin-bottom:4px;color:#e0e0e0;">jezeem</div>
    <div style="color:#888;font-size:15px;margin-bottom:16px;">builder &nbsp;·&nbsp; software engineer &nbsp;·&nbsp; ai buff</div>
    <div style="color:#2a2a2a;margin-bottom:16px;">────────────────────────────────────────</div>
    <div style="font-size:15px;color:#ccc;margin-bottom:8px;line-height:1.7;">
      I build apps, tools, and systems — mobile + web.<br>
      Currently at <span style="color:#33ff33;">Incredible Visibility</span> since 2021.
    </div>
    <div style="color:#2a2a2a;margin:16px 0;">────────────────────────────────────────</div>
    <div style="display:flex;gap:16px;flex-wrap:wrap;">
      <a href="https://github.com/jezeem-a" target="_blank" rel="noopener" style="color:#33ff33;text-decoration:none;font-size:16px;">[ GitHub \u2197 ]</a>
      <a href="https://linkedin.com/in/jezeem" target="_blank" rel="noopener" style="color:#33ff33;text-decoration:none;font-size:16px;">[ LinkedIn \u2197 ]</a>
      <a href="mailto:jezeem.dev@gmail.com" style="color:#33ff33;text-decoration:none;font-size:16px;">[ Email ]</a>
    </div>
  `

  document.dispatchEvent(new CustomEvent('window-opened', { detail: 'about' }))
  createWindow({ id: 'about', title: 'about.txt', width: 440, height: 360, x: 120, y: 80, content })
}
