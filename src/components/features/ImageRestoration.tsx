interface FeatureProps {
  onApply: (type: string) => void;
}

export default function ImageRestoration({ onApply }: FeatureProps) {
  return (
    <div className="feature-group animate-fade-in">
      <div className="param-group">
        <label>Spatial Filtering (Restoration)</label>
        {/* Menghubungkan pemilihan filter ke fungsi onApply */}
        <select 
          className="glass-select w-full restore-method-select"
          onChange={(e) => onApply(e.target.value)}
        >
          <option value="">Pilih Filter...</option>
          <option value="gaussian">Gaussian Blur</option>
          <option value="median">Median Filter</option>
          <option value="mean">Arithmetic Mean Filter</option>
        </select>
      </div>

      <div className="param-group mt-4">
        <label>Kernel Size (N x N)</label>
        {/* Slider untuk ukuran matriks konvolusi */}
        <input 
          type="range" 
          className="slider kernel-slider" 
          min="3" 
          max="15" 
          step="2" 
          defaultValue="3" 
          onChange={(e) => onApply(`kernel-${e.target.value}`)}
        />
        <div className="flex justify-between text-[10px] text-secondary mt-1">
          <span>3x3</span>
          <span>15x15</span>
        </div>
      </div>

      <style>{`
        .feature-group {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .mt-4 { margin-top: 1rem; }
        .mt-1 { margin-top: 0.25rem; }
        .w-full { width: 100%; }
        .flex { display: flex; }
        .justify-between { justify-content: space-between; }
        .text-secondary { color: var(--text-secondary); }
      `}</style>
    </div>
  );
}