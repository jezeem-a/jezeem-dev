import gsap from 'gsap'

const BOOKS_2026 = 8

export function initLibraryCard() {
  const card = document.createElement('div')
  card.id = 'library-card'
  card.innerHTML = `
    <div class="card-hole"></div>
    <div class="card-content">
      <div class="card-header">📚 READER</div>
      <div class="card-body">
        <div class="card-stat">
          <span class="stat-label">2026</span>
          <span class="stat-value">${BOOKS_2026}</span>
        </div>
        <div class="card-links">
          <a href="https://fable.co/fabler/jezeem-506406756877?tab=stats" target="_blank" rel="noopener">fable</a>
          <span class="divider">·</span>
          <a href="https://margins.app/u/6351ec44bf8346a9bd2da00cb5c2419a" target="_blank" rel="noopener">margins</a>
        </div>
      </div>
    </div>
  `
  
  Object.assign(card.style, {
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    width: '120px',
    background: 'linear-gradient(135deg, #f8f4e8 0%, #e8e0d0 100%)',
    borderRadius: '6px',
    boxShadow: '3px 3px 12px rgba(0,0,0,0.4), inset 0 0 30px rgba(0,0,0,0.03)',
    fontFamily: "'Courier New', monospace",
    fontSize: '13px',
    color: '#3a332a',
    zIndex: '50',
    cursor: 'pointer',
    opacity: '0',
    transform: 'rotate(-3deg)',
    transition: 'transform 0.3s, opacity 0.5s',
  })
  
const style = document.createElement('style')
  style.textContent = `
    #library-card {
      background: linear-gradient(135deg, #f8f4e8 0%, #e8e0d0 100%);
    }
    #library-card .card-hole {
      width: 14px;
      height: 14px;
      background: #2a2a2a;
      border-radius: 50%;
      margin: 10px auto 8px;
      box-shadow: inset 2px 2px 4px rgba(0,0,0,0.5);
    }
    #library-card .card-header {
      font-size: 11px;
      font-weight: bold;
      text-align: center;
      padding: 4px 8px;
      border-bottom: 1px dashed #c9bfa3;
      letter-spacing: 1px;
      color: #6b5f4a;
    }
    #library-card .card-body {
      padding: 12px 10px;
    }
    #library-card .card-stat {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 10px;
    }
    #library-card .stat-label {
      color: #8b8070;
      font-size: 11px;
    }
    #library-card .stat-value {
      font-weight: bold;
      font-size: 22px;
      color: #2a2a2a;
    }
    #library-card .card-links {
      display: flex;
      justify-content: center;
      gap: 6px;
      font-size: 10px;
    }
    #library-card .card-links a {
      color: #8b7355;
      text-decoration: none;
      opacity: 0.8;
      transition: opacity 0.2s;
    }
    #library-card .card-links a:hover {
      opacity: 1;
      text-decoration: underline;
    }
    #library-card .divider {
      color: #c9bfa3;
    }
    #library-card:hover {
      transform: rotate(0deg) scale(1.1);
    }
  `
  
  document.head.appendChild(style)
  document.body.appendChild(card)
  
  document.addEventListener('intro-complete', () => {
    setTimeout(() => {
      gsap.to(card, { opacity: 1, duration: 1, ease: 'power2.out' })
    }, 2500)
  })
}