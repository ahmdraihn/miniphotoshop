interface FeatureProps {
  onApply: (type: string) => void;
}

export default function ImageEnhancement({ onApply }: FeatureProps) {
  return (
    <div className="feature-group animate-fade-in">
      {/* Parameter Brightness (Requirement 2: Enhancement) */}
      <div className="param-group">
        <label>Brightness</label>
        <input 
          type="range" 
          className="slider brightness-slider" 
          min="-100" 
          max="100" 
          defaultValue="0" 
          onChange={(e) => onApply(`brightness-${e.target.value}`)}
        />
      </div>

      {/* Parameter Contrast (Requirement 2: Enhancement) */}
      <div className="param-group">
        <label>Contrast</label>
        <input 
          type="range" 
          className="slider contrast-slider" 
          min="-100" 
          max="100" 
          defaultValue="0" 
          onChange={(e) => onApply(`contrast-${e.target.value}`)}
        />
      </div>

      {/* Histogram Equalization (Requirement 9: Histogram Analysis) */}
      <button 
        className="glass-button w-full mb-4" 
        onClick={() => onApply('hist-equalize')}
      >
        Histogram Equalization
      </button>

      {/* Operasi Spasial (Requirement 2: Spatial Filtering) */}
      <div className="action-grid">
        <button className="glass-button" onClick={() => onApply('sharpen')}>Sharpening</button>
        <button className="glass-button" onClick={() => onApply('blur')}>Smoothing (Blur)</button>
      </div>

      <style>{`
        .feature-group {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .mb-4 { margin-bottom: 1rem; }
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