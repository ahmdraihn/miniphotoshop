import { useState } from 'react'

export default function Canvas() {
  const [splitPosition, setSplitPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseDown = () => setIsDragging(true)
  const handleMouseUp = () => setIsDragging(false)
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
    const percent = (x / rect.width) * 100
    setSplitPosition(percent)
  }

  // Gunakan gambar kucing asli dari direktori sebelumnya sebagai dummy
  const dummyImage = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/800px-Cat03.jpg'
  // Gambar yang sama tapi diberikan filter css hitam putih sebagai "after" effect dummy
  
  return (
    <section className="glass-panel canvas-area animate-fade-in">
      <div className="canvas-header">
        <h2 className="canvas-title">Ruang Kerja (Sebelum / Sesudah)</h2>
        <div className="zoom-controls">
          <button className="glass-button">-</button>
          <span>100%</span>
          <button className="glass-button">+</button>
        </div>
      </div>
      
      <div 
        className="canvas-viewport"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Placeholder jika belum ada gambar */}
        <div className="image-container">
          
          {/* Gambar After (bawah) */}
          <img src={dummyImage} alt="Sesudah" className="canvas-image img-after" />
          
          {/* Gambar Before (atas, di-clip) */}
          <div 
            className="img-before-wrapper" 
            style={{ width: `${splitPosition}%` }}
          >
            <img src={dummyImage} alt="Sebelum" className="canvas-image img-before" />
          </div>

          {/* Slider line */}
          <div 
            className="slider-line"
            style={{ left: `${splitPosition}%` }}
            onMouseDown={handleMouseDown}
          >
            <div className="slider-handle">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotate(180deg)' }}><path d="m9 18 6-6-6-6"/></svg>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .canvas-area {
          flex: 1;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .canvas-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--panel-border);
          background: rgba(0, 0, 0, 0.2);
        }

        .canvas-title {
          font-size: 1rem;
          color: var(--text-secondary);
        }

        .zoom-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
          color: var(--text-secondary);
          font-size: 0.875rem;
        }

        .zoom-controls .glass-button {
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
        }

        .canvas-viewport {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: repeating-conic-gradient(rgba(255,255,255,0.03) 0% 25%, transparent 0% 50%) 50% / 20px 20px;
          overflow: hidden;
        }

        .image-container {
          position: relative;
          max-width: 100%;
          max-height: 100%;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0,0,0,0.5);
          user-select: none;
        }

        .canvas-image {
          display: block;
          max-width: 100%;
          max-height: 60vh;
          object-fit: contain;
          pointer-events: none;
        }

        .img-after {
          filter: contrast(120%) brightness(110%) saturate(150%);
        }

        .img-before-wrapper {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          overflow: hidden;
        }

        .slider-line {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 2px;
          background: var(--accent-color);
          transform: translateX(-50%);
          cursor: ew-resize;
          z-index: 10;
          box-shadow: 0 0 10px rgba(0, 240, 255, 0.8);
        }

        .slider-handle {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 32px;
          height: 32px;
          background: var(--accent-color);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000;
          box-shadow: 0 0 15px rgba(0, 240, 255, 0.5);
        }

        .slider-handle svg {
          width: 16px;
          height: 16px;
          margin: -2px;
        }
      `}</style>
    </section>
  )
}
