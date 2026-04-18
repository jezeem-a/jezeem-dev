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
    bottom: '60px',
    right: '20px',
    width: '90px',
    background: '#f5f0e6',
    borderRadius: '4px',
    boxShadow: '2px 2px 8px rgba(0,0,0,0.3), inset 0 0 20px rgba(0,0,0,0.05)',
    fontFamily: "'Courier New', monospace",
    fontSize: '10px',
    color: '#4a4339',
    zIndex: '50',
    cursor: 'pointer',
    opacity: '0',
    transform: 'rotate(-2deg)',
    transition: 'transform 0.3s, opacity 0.5s',
  })
  
const style = document.createElement('style')
  style.textContent = `
    #library-card {
      background: linear-gradient(135deg, #f5f0e6 0%, #ebe4d4 100%);
    }
    #library-card .card-hole {
      width: 12px;
      height: 12px;
      background: #2a2a2a;
      border-radius: 50%;
      margin: 8px auto 6px;
      box-shadow: inset 2px 2px 4px rgba(0,0,0,0.5);
    }
    #library-card .card-header {
      font-size: 9px;
      font-weight: bold;
      text-align: center;
      padding: 2px 6px;
      border-bottom: 1px dashed #c9bfa3;
      letter-spacing: 1px;
      color: #6b5f4a;
    }
    #library-card .card-body {
      padding: 8px 6px;
    }
    #library-card .card-stat {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    #library-card .stat-label {
      color: #8b8070;
    }
    #library-card .stat-value {
      font-weight: bold;
      font-size: 14px;
      color: #2a2a2a;
    }
    #library-card .card-links {
      display: flex;
      justify-content: center;
      gap: 4px;
      font-size: 8px;
    }
    #library-card .card-links a {
      color: #8b7355;
      text-decoration: none;
      opacity: 0.7;
      transition: opacity 0.2s;
    }
    #library-card .card-links a:hover {
      opacity: 1;
    }
    #library-card .divider {
      color: #c9bfa3;
    }
    #library-card:hover {
      transform: rotate(0deg) scale(1.05);
    }
  `
  
  document.head.appendChild(style)
  document.body.appendChild(card)
  
  document.addEventListener('intro-complete', () => {
    setTimeout(() => {
      gsap.to(card, { opacity: 0.85, duration: 1, ease: 'power2.out' })
    }, 3000)
  })
}