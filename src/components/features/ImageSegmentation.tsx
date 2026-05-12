interface FeatureProps {
  onApply: (type: string) => void;
}

export default function ImageSegmentation({ onApply }: FeatureProps) {
  return (
    <div className="feature-group animate-fade-in">
      <div className="param-group">
        <label>Metode Segmentasi</label>
        {/* Menghubungkan pilihan metode segmentasi ke fungsi onApply */}
        <select 
          className="glass-select w-full segment-method-select"
          onChange={(e) => onApply(`segment-${e.target.value.toLowerCase().split('-')[0]}`)}
        >
          <option value="threshold-based">Threshold-based</option>
          <option value="edge-based">Edge-based</option>
          <option value="region-based">Region-based</option>
          <option value="clustering">K-Means Clustering</option>
        </select>
      </div>

      <div className="param-group mt-4">
        <label>Sensitivity / Cluster Count</label>
        <input 
          type="range" 
          className="slider seg-param-slider" 
          min="2" 
          max="10" 
          defaultValue="3" 
          onChange={(e) => onApply(`seg-param-${e.target.value}`)}
        />
        <div className="flex justify-between text-[10px] text-secondary mt-1">
          <span>Coarse</span>
          <span>Fine</span>
        </div>
      </div>

      {/* Tombol aksi untuk menjalankan ekstraksi objek (Requirement 7) */}
      <button 
        className="glass-button w-full mt-4 primary-border" 
        onClick={() => onApply('extract-object')}
      >
        Extract Object / Region
      </button>

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
        .primary-border { border-color: var(--accent-color); color: var(--accent-color); }
      `}</style>
    </div>
  );
}