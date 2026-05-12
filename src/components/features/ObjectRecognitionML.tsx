interface FeatureProps {
  onApply: (type: string) => void;
}

export default function ObjectRecognitionML({ onApply }: FeatureProps) {
  return (
    <div className="feature-group animate-fade-in">
      <div className="param-group">
        <label>Target Objek (Metode CNN)</label>
        {/* Menghubungkan pemilihan target objek ke fungsi onApply */}
        <select 
          className="glass-select w-full target-select"
          onChange={(e) => onApply(`set-target-${e.target.value}`)}
        >
          <option value="human">Manusia (Human)</option>
          <option value="animals">Hewan (Animals)</option>
          <option value="vehicle">Kendaraan (Vehicles)</option>
          <option value="others">Objek Lainnya</option>
        </select>
      </div>

      <div className="param-group mt-4">
        <label>Confidence Threshold</label>
        <input 
          type="range" 
          className="slider confidence-slider" 
          min="50" 
          max="99" 
          defaultValue="75" 
          onChange={(e) => onApply(`confidence-${e.target.value}`)}
        />
        <div className="flex justify-between text-[10px] text-secondary mt-1">
          <span>Fast</span>
          <span>Accurate</span>
        </div>
      </div>

      {/* Tombol eksekusi model (Requirement 8) */}
      <button 
        className="glass-button w-full primary mt-4"
        onClick={() => onApply('run-cnn-inference')}
      >
        Run Recognition
      </button>

      <div className="mt-4 p-3 glass-panel-sub text-xs italic text-secondary text-center">
        Status: Menunggu eksekusi model CNN...
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
        .glass-panel-sub {
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
}