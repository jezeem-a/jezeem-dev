import gsap from 'gsap'

export function initWildcard() {
  const el = document.createElement('div')
  el.id = 'zone-wildcard'
  el.style.cssText = `
    position: fixed;
    top: 80%;
    left: 85%;
    z-index: 20;
    cursor: pointer;
  `

  el.innerHTML = `
    <div class="wildcard-prompt" style="
      font-family:'VT323',monospace;
      font-size:24px;
      color:#33ff33;
      text-shadow:0 0 10px rgba(51,255,51,0.7);
      animation:wc-pulse 2.5s ease-in-out infinite;
      user-select:none;
    ">&#62;_</div>
    <div class="wildcard-tooltip" style="
      font-family:'VT323',monospace;
      font-size:14px;
      color:#666;
      margin-top:4px;
      opacity:0;
      white-space:nowrap;
    ">[ open terminal ]</div>
  `

  document.getElementById('main-content').appendChild(el)

  const tooltip = el.querySelector('.wildcard-tooltip')

  el.addEventListener('mouseenter', () => {
    gsap.to(tooltip, { opacity: 1, duration: 0.2 })
  })

  el.addEventListener('mouseleave', () => {
    gsap.to(tooltip, { opacity: 0, duration: 0.2 })
  })

  el.addEventListener('click', () => {
    document.dispatchEvent(new CustomEvent('open-terminal'))
  })

  // Inject pulse keyframe
  const style = document.createElement('style')
  style.textContent = `
    @keyframes wc-pulse {
      0%,100% { text-shadow: 0 0 8px rgba(51,255,51,0.6); }
      50%      { text-shadow: 0 0 18px rgba(51,255,51,1), 0 0 30px rgba(51,255,51,0.4); }
    }
    @keyframes dot-pulse {
      0%,100% { box-shadow: 0 0 4px #33ff33; }
      50%      { box-shadow: 0 0 10px #33ff33, 0 0 18px rgba(51,255,51,0.4); }
    }
  `
  document.head.appendChild(style)
}
