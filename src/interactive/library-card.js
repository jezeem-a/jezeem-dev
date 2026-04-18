import gsap from 'gsap'

const BOOKS_2026 = 8

export function initLibraryCard() {
  const container = document.createElement('div')
  container.id = 'library-container'
  container.innerHTML = `
    <div class="book-icon">📚</div>
    <div class="reader-card">
      <div class="card-header">📖 READING</div>
      <div class="card-body">
        <div class="card-stat">
          <span class="stat-label">2026</span>
          <span class="stat-value">${BOOKS_2026}</span>
          <span class="stat-unit">books</span>
        </div>
        <div class="card-links">
          <a href="https://fable.co/fabler/jezeem-506406756877?tab=stats" target="_blank" rel="noopener">fable</a>
          <span class="divider">·</span>
          <a href="https://margins.app/u/6351ec44bf8346a9bd2da00cb5c2419a" target="_blank" rel="noopener">margins</a>
        </div>
      </div>
    </div>
  `
  
  Object.assign(container.style, {
    position: 'fixed',
    bottom: '25px',
    right: '25px',
    zIndex: '50',
    opacity: '0',
    transition: 'opacity 0.5s',
  })
  
  const style = document.createElement('style')
  style.textContent = `
    #library-container .book-icon {
      font-size: 28px;
      cursor: pointer;
      opacity: 0.75;
      transition: transform 0.3s, opacity 0.3s;
      filter: grayscale(0.3);
    }
    #library-container .book-icon:hover {
      transform: scale(1.15);
      opacity: 1;
    }
    #library-container .reader-card {
      position: absolute;
      bottom: 40px;
      right: 0;
      width: 130px;
      background: linear-gradient(135deg, #f8f4e8 0%, #e8e0d0 100%);
      border-radius: 6px;
      box-shadow: 3px 3px 12px rgba(0,0,0,0.4), inset 0 0 30px rgba(0,0,0,0.03);
      font-family: 'Courier New', monospace;
      font-size: 13px;
      color: #3a332a;
      opacity: 0;
      visibility: hidden;
      transform: translateY(10px) rotate(-2deg);
      transition: all 0.3s ease;
    }
    #library-container:hover .reader-card,
    #library-container .reader-card:hover {
      opacity: 1;
      visibility: visible;
      transform: translateY(0) rotate(0deg);
    }
    #library-container .reader-card .card-header {
      font-size: 11px;
      font-weight: bold;
      text-align: center;
      padding: 8px 10px;
      border-bottom: 1px dashed #c9bfa3;
      letter-spacing: 1px;
      color: #6b5f4a;
    }
    #library-container .reader-card .card-body {
      padding: 12px 10px;
    }
    #library-container .reader-card .card-stat {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      margin-bottom: 10px;
    }
    #library-container .reader-card .stat-label {
      color: #8b8070;
      font-size: 11px;
    }
    #library-container .reader-card .stat-value {
      font-weight: bold;
      font-size: 26px;
      color: #2a2a2a;
      margin-left: 4px;
    }
    #library-container .reader-card .stat-unit {
      font-size: 10px;
      color: #8b8070;
      margin-left: 2px;
    }
    #library-container .reader-card .card-links {
      display: flex;
      justify-content: center;
      gap: 6px;
      font-size: 10px;
    }
    #library-container .reader-card .card-links a {
      color: #8b7355;
      text-decoration: none;
      opacity: 0.8;
      transition: opacity 0.2s;
    }
    #library-container .reader-card .card-links a:hover {
      opacity: 1;
      text-decoration: underline;
    }
    #library-container .reader-card .divider {
      color: #c9bfa3;
    }
  `
  
  document.head.appendChild(style)
  document.body.appendChild(container)
  
  document.addEventListener('intro-complete', () => {
    setTimeout(() => {
      gsap.to(container, { opacity: 1, duration: 1, ease: 'power2.out' })
    }, 2500)
  })
}