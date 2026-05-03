import { createWindow } from '../os/window-manager.js'

export function openContact() {
  const content = document.createElement('div')
  content.style.cssText = `
    padding: 24px;
    font-family: 'VT323', monospace;
    color: #e0e0e0;
    line-height: 1.8;
    font-size: 15px;
  `
  content.innerHTML = `
    <div style="color:#33ff33;font-size:20px;margin-bottom:16px;">&gt; cat contact.md</div>
    <div style="color:#2a2a2a;margin-bottom:16px;">────────────────────────────────────────</div>

    <div style="font-size:16px;">
      <div style="margin-bottom:10px;display:flex;gap:12px;">
        <span style="color:#555;min-width:70px;">email</span>
        <a href="mailto:jezeem.dev@gmail.com" style="color:#33ff33;text-decoration:none;text-shadow:0 0 4px rgba(51,255,51,0.3);">jezeem.dev@gmail.com</a>
      </div>
      <div style="margin-bottom:10px;display:flex;gap:12px;">
        <span style="color:#555;min-width:70px;">github</span>
        <a href="https://github.com/jezeem-a" target="_blank" rel="noopener" style="color:#33ff33;text-decoration:none;">github.com/jezeem-a \u2197</a>
      </div>
      <div style="margin-bottom:10px;display:flex;gap:12px;">
        <span style="color:#555;min-width:70px;">linkedin</span>
        <a href="https://linkedin.com/in/jezeem" target="_blank" rel="noopener" style="color:#33ff33;text-decoration:none;">linkedin.com/in/jezeem \u2197</a>
      </div>
    </div>

    <div style="color:#2a2a2a;margin-top:18px;margin-bottom:12px;">────────────────────────────────────────</div>
    <div style="color:#555;font-size:14px;font-style:normal;">open to new opportunities.</div>
  `

  document.dispatchEvent(new CustomEvent('window-opened', { detail: 'contact' }))
  createWindow({ id: 'contact', title: 'contact.md', width: 400, height: 320, x: 250, y: 140, content })
}
