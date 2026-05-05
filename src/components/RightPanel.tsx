interface RightPanelProps {
  activeTool: string;
}

export default function RightPanel({ activeTool }: RightPanelProps) {
  
  const renderParameters = () => {
    switch(activeTool) {
      case 'enhance':
        return (
          <>
            <div className="param-group">
              <label>Brightness</label>
              <input type="range" className="slider" min="-100" max="100" defaultValue="10" />
            </div>
            <div className="param-group">
              <label>Contrast</label>
              <input type="range" className="slider" min="-100" max="100" defaultValue="20" />
            </div>
            <div className="param-group">
              <label>Saturation</label>
              <input type="range" className="slider" min="0" max="200" defaultValue="150" />
            </div>
            <button className="glass-button w-full mt-4">Apply Equalization</button>
          </>
        )
      case 'transform':
        return (
          <>
            <div className="param-group">
              <label>Rotate (Degrees)</label>
              <input type="range" className="slider" min="0" max="360" defaultValue="0" />
            </div>
            <div className="action-grid mt-4">
              <button className="glass-button">Flip H</button>
              <button className="glass-button">Flip V</button>
              <button className="glass-button">Crop</button>
              <button className="glass-button">Resize</button>
            </div>
          </>
        )
      case 'edge':
        return (
          <>
            <div className="param-group">
              <label>Method</label>
              <select className="glass-select">
                <option>Canny</option>
                <option>Sobel</option>
                <option>Prewitt</option>
                <option>Laplacian</option>
              </select>
            </div>
            <div className="param-group mt-4">
              <label>Threshold</label>
              <input type="range" className="slider" min="0" max="255" defaultValue="128" />
            </div>
          </>
        )
      default:
        return (
          <div className="placeholder-text">
            Parameters for {activeTool} will appear here.
          </div>
        )
    }
  }

  return (
    <aside className="glass-panel right-panel animate-fade-in">
      
      <div className="panel-section">
        <h3 className="section-title">Histogram</h3>
        <div className="histogram-mockup">
          {/* Mockup Histogram with CSS bars */}
          <div className="bars">
            {Array.from({ length: 40 }).map((_, i) => (
              <div 
                key={i} 
                className="bar" 
                style={{ 
                  height: `${20 + Math.random() * 80}%`,
                  opacity: 0.5 + (i/80)
                }} 
              />
            ))}
          </div>
          <div className="hist-labels">
            <span>0</span>
            <span>255</span>
          </div>
        </div>
      </div>

      <div className="panel-section flex-1">
        <h3 className="section-title">Properties</h3>
        <div className="properties-content">
          {renderParameters()}
        </div>
      </div>
      
      <div className="panel-section actions-section">
        <button className="glass-button w-full primary mb-2">Process Image</button>
        <button className="glass-button w-full">Reset to Original</button>
      </div>

      <style>{`
        .right-panel {
          width: 300px;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .panel-section {
          padding: 1.5rem;
          border-bottom: 1px solid var(--panel-border);
        }

        .panel-section.flex-1 {
          flex: 1;
          border-bottom: none;
          overflow-y: auto;
        }

        .actions-section {
          background: rgba(0,0,0,0.2);
          border-top: 1px solid var(--panel-border);
          border-bottom: none;
        }

        .section-title {
          font-size: 0.875rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 1rem;
        }

        .histogram-mockup {
          width: 100%;
          height: 120px;
          background: rgba(0,0,0,0.3);
          border-radius: 8px;
          padding: 0.5rem;
          display: flex;
          flex-direction: column;
        }

        .bars {
          flex: 1;
          display: flex;
          align-items: flex-end;
          gap: 1px;
        }

        .bar {
          flex: 1;
          background: var(--accent-color);
          border-radius: 1px 1px 0 0;
        }

        .hist-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.65rem;
          color: var(--text-secondary);
          margin-top: 4px;
        }

        .param-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
        }

        .param-group label {
          font-size: 0.875rem;
          font-weight: 500;
        }

        .slider {
          -webkit-appearance: none;
          width: 100%;
          height: 4px;
          border-radius: 2px;
          background: rgba(255,255,255,0.1);
          outline: none;
        }

        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--accent-color);
          cursor: pointer;
          box-shadow: 0 0 10px rgba(0, 240, 255, 0.5);
        }

        .glass-select {
          background: rgba(0,0,0,0.2);
          border: 1px solid var(--panel-border);
          color: var(--text-primary);
          padding: 0.5rem;
          border-radius: 6px;
          font-family: var(--font-body);
          outline: none;
        }
        
        .glass-select option {
          background: var(--bg-color);
        }

        .w-full {
          width: 100%;
        }

        .mt-4 {
          margin-top: 1rem;
        }

        .mb-2 {
          margin-bottom: 0.5rem;
        }

        .action-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
        }

        .placeholder-text {
          color: var(--text-secondary);
          font-size: 0.875rem;
          font-style: italic;
          text-align: center;
          padding: 2rem 0;
        }
      `}</style>
    </aside>
  )
}
