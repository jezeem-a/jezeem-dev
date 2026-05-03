import gsap from 'gsap'

const stack = []

export function showNotification({ title, message, duration = 4000 }) {
  const topOffset = 44 + stack.length * 82

  const el = document.createElement('div')
  el.className = 'os-notification'
  el.style.cssText = `
    position: fixed;
    top: ${topOffset}px;
    right: 16px;
    width: 280px;
    background: #111;
    border: 1px solid #2a2a2a;
    border-radius: 8px;
    padding: 10px 14px;
    font-family: 'VT323', monospace;
    z-index: 9500;
    box-shadow: 0 8px 24px rgba(0,0,0,0.7);
    opacity: 0;
    transform: translateX(20px);
  `
  el.innerHTML = `
    <div style="color:#33ff33;font-size:14px;margin-bottom:3px;text-shadow:0 0 6px rgba(51,255,51,0.4);">${title}</div>
    <div style="color:#888;font-size:13px;line-height:1.3;">${message}</div>
  `

  document.body.appendChild(el)
  stack.push(el)

  gsap.to(el, { opacity: 1, x: 0, duration: 0.22, ease: 'power2.out' })

  setTimeout(() => {
    gsap.to(el, {
      opacity: 0,
      x: 20,
      duration: 0.2,
      ease: 'power2.in',
      onComplete() {
        el.remove()
        const idx = stack.indexOf(el)
        if (idx !== -1) stack.splice(idx, 1)
        stack.forEach((n, i) => {
          gsap.to(n, { top: 44 + i * 82, duration: 0.2, ease: 'power2.out' })
        })
      }
    })
  }, duration)
}
