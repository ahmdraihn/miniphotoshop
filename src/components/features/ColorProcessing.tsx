interface FeatureProps {
  onApply: (type: string) => void;
}

export default function ColorProcessing({ onApply }: FeatureProps) {
  return (
    <div className="feature-group animate-fade-in">
      {/* 2. Hubungkan tombol utama ke fungsi onApply */}
      <button 
        className="glass-button w-full mb-4" 
        onClick={() => onApply('grayscale')}
      >
        RGB → Grayscale
      </button>

      <div className="param-group">
        <label>Channel Splitting</label>
        <div className="action-grid mt-2">
          {/* 3. Hubungkan pemecahan channel (Red, Green, Blue) */}
          <button className="glass-button" onClick={() => onApply('split-red')}>Red</button>
          <button className="glass-button" onClick={() => onApply('split-green')}>Green</button>
          <button className="glass-button" onClick={() => onApply('split-blue')}>Blue</button>
        </div>
      </div>

      <div className="param-group mt-4">
        <label>Hue/Saturation Adjustment</label>
        {/* Slider ini bisa memicu preview perubahan secara real-time */}
        <input 
          type="range" 
          className="slider hue-slider" 
          min="-180" 
          max="180" 
          defaultValue="0" 
          onChange={(e) => onApply(`hue-${e.target.value}`)}
        />
      </div>

      <style>{`
        .feature-group {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .mb-4 { margin-bottom: 1rem; }
        .mt-2 { margin-top: 0.5rem; }
        .mt-4 { margin-top: 1rem; }
        .w-full { width: 100%; }
        .action-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
        }
      `}</style>
    </div>
  );
}