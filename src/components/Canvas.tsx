import { useState } from 'react'

interface CanvasProps {
  sourceImage: string | null;
  processedImage: string | null;
}

export default function Canvas({ sourceImage, processedImage }: CanvasProps) {
  const [zoom, setZoom] = useState(1);

  // Fungsi Zoom (Poin 10: Tombol aksi cepat)
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2.5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));

  return (
    <section className="glass-panel canvas-area animate-fade-in">
      <div className="canvas-header">
        <h2 className="canvas-title">Workspace Preview</h2>
        <div className="zoom-controls">
          <button className="glass-button" onClick={handleZoomOut}>-</button>
          <span className="zoom-value">{Math.round(zoom * 100)}%</span>
          <button className="glass-button" onClick={handleZoomIn}>+</button>
        </div>
      </div>
      
      <div className="canvas-viewport">
        {sourceImage ? (
          <div className="compare-container" style={{ transform: `scale(${zoom})` }}>
            {/* Panel Kiri: SEBELUM */}
            <div className="view-pane">
              <div className="pane-label">SEBELUM (ASLI)</div>
              <div className="img-wrapper">
                <img src={sourceImage} alt="Sebelum" className="canvas-image" />
              </div>
            </div>

            {/* Panel Kanan: SESUDAH */}
            <div className="view-pane">
              <div className="pane-label">SESUDAH (HASIL)</div>
              <div className="img-wrapper">
                {/* Menggunakan processedImage jika ada, jika tidak fallback ke sourceImage */}
                <img 
                  src={processedImage || sourceImage} 
                  alt="Sesudah" 
                  className="canvas-image" 
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-canvas">
             <p>Silahkan Impor Gambar (JPG/PNG/BMP) untuk memulai pengolahan citra</p>
          </div>
        )}
      </div>

      <style>{`
        .canvas-area {
          flex: 1;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: rgba(15, 17, 26, 0.5);
        }

        .canvas-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(0, 0, 0, 0.2);
        }

        .canvas-title {
          font-size: 0.75rem;
          color: var(--accent-color);
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .zoom-controls {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .zoom-value {
          font-size: 0.8rem;
          color: var(--text-secondary);
          min-width: 45px;
          text-align: center;
          font-variant-numeric: tabular-nums;
        }

        .canvas-viewport {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          background: repeating-conic-gradient(rgba(255,255,255,0.03) 0% 25%, transparent 0% 50%) 50% / 20px 20px;
          overflow: auto;
          scrollbar-width: thin;
          scrollbar-color: var(--accent-color) transparent;
        }

        .compare-container {
          display: flex;
          gap: 3rem;
          transition: transform 0.2s ease-out;
          transform-origin: center;
        }

        .view-pane {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.25rem;
        }

        .pane-label {
          background: rgba(0, 240, 255, 0.1);
          color: var(--accent-color);
          padding: 6px 16px;
          border-radius: 4px;
          font-size: 0.65rem;
          font-weight: 800;
          border: 1px solid rgba(0, 240, 255, 0.2);
          letter-spacing: 0.15em;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
        }

        .img-wrapper {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
          background: #000;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .canvas-image {
          display: block;
          max-width: 450px;
          max-height: 60vh;
          object-fit: contain;
          pointer-events: none;
        }

        .empty-canvas {
          color: var(--text-secondary);
          font-style: italic;
          font-size: 0.9rem;
          opacity: 0.6;
        }
      `}</style>
    </section>
  )
}