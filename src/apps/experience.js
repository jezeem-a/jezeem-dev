import { createWindow } from '../os/window-manager.js'

export function openExperience() {
  const content = document.createElement('div')
  content.style.cssText = `
    padding: 24px;
    font-family: 'VT323', monospace;
    color: #e0e0e0;
    line-height: 1.65;
    font-size: 15px;
  `
  content.innerHTML = `
    <div style="color:#33ff33;font-size:20px;margin-bottom:16px;">&gt; cat work.log</div>
    <div style="color:#2a2a2a;margin-bottom:16px;">────────────────────────────────────────</div>

    <div style="margin-bottom:20px;">
      <div style="font-size:19px;color:#e0e0e0;margin-bottom:2px;">Incredible Visibility</div>
      <div style="color:#33ff33;font-size:14px;">Builder</div>
      <div style="color:#666;font-size:13px;margin-bottom:10px;">2021 \u2192 Present</div>
      <div style="color:#2a2a2a;margin-bottom:12px;">────────────────────────────────────────</div>
      <div style="color:#999;font-size:14px;line-height:1.7;">
        Full-stack development for a marketing &amp; analytics SaaS platform.<br>
        Mobile apps in Flutter/Expo, web dashboards in React.<br>
        Working closely with product and design across the full lifecycle.
      </div>
      <div style="margin-top:14px;">
        <a href="https://incrediblevisibility.com" target="_blank" rel="noopener" style="
          color:#33ff33;text-decoration:none;font-size:15px;
          text-shadow:0 0 6px rgba(51,255,51,0.4);
        ">[ visit company \u2197 ]</a>
      </div>
    </div>
  `

  document.dispatchEvent(new CustomEvent('window-opened', { detail: 'experience' }))
  createWindow({ id: 'experience', title: 'work.log', width: 440, height: 380, x: 200, y: 100, content })
}
