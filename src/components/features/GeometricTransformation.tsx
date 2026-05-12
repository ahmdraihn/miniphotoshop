interface FeatureProps {
  onApply: (type: string) => void;
}

export default function GeometricTransformation({ onApply }: FeatureProps) {
  return (
    <div className="feature-group animate-fade-in">
      <div className="param-group">
        <label>Rotate (0°–360°)</label>
        <input 
          type="range" 
          className="slider rotate-slider" 
          min="0" 
          max="360" 
          defaultValue="0" 
          onChange={(e) => onApply(`rotate-${e.target.value}`)}
        />
      </div>

      <div className="param-group">
        <label>Metode Interpolasi</label>
        <select className="glass-select w-full interpolation-select">
          <option>Nearest Neighbor</option>
          <option>Bilinear</option>
        </select>
      </div>

      <div className="param-group">
        <label>Crop Area (%)</label>
        <input
          type="range"
          className="slider crop-slider"
          min="40"
          max="100"
          defaultValue="80"
          onChange={() => onApply('crop')}
        />
      </div>

      <div className="param-group">
        <label>Resize Scale</label>
        <input
          type="range"
          className="slider scale-slider"
          min="0.2"
          max="2"
          step="0.1"
          defaultValue="1"
          onChange={() => onApply('resize')}
        />
      </div>

      <div className="param-group">
        <label>Translation X / Y</label>
        <input
          type="range"
          className="slider translate-x-slider"
          min="-200"
          max="200"
          defaultValue="0"
          onChange={() => onApply('translate')}
        />
        <input
          type="range"
          className="slider translate-y-slider"
          min="-200"
          max="200"
          defaultValue="0"
          onChange={() => onApply('translate')}
        />
      </div>

      <div className="action-grid mt-2">
        {/* Menghubungkan tombol flip dan transformasi lainnya */}
        <button className="glass-button" onClick={() => onApply('flip-h')}>Flip H</button>
        <button className="glass-button" onClick={() => onApply('flip-v')}>Flip V</button>
        <button className="glass-button" onClick={() => onApply('crop')}>Crop Area</button>
        <button className="glass-button" onClick={() => onApply('translate')}>Translation</button>
      </div>
      
      <button 
        className="glass-button w-full mt-2" 
        onClick={() => onApply('resize')}
      >
        Resize (Scaling)
      </button>

      <style>{`
        .feature-group {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .mt-2 { margin-top: 0.5rem; }
        .w-full { width: 100%; }
        .action-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
        }
      `}</style>
    </div>
  );
}