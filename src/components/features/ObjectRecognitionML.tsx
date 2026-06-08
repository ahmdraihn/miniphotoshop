interface FeatureProps {
  onApply: (type: string) => void;
  cnnResult?: {
    class: string;
    confidence: number;
    category: string;
    top_predictions?: Array<{ class: string; confidence: number }>;
  } | null;
  cnnStatus?: string;
}

export default function ObjectRecognitionML({ onApply, cnnResult, cnnStatus }: FeatureProps) {
  return (
    <div className="feature-group animate-fade-in">
      <div className="param-group">
        <label>Target Objek (Metode CNN)</label>
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

      <button 
        className="glass-button w-full primary mt-4"
        onClick={() => onApply('run-cnn-inference')}
      >
        Run Recognition
      </button>

      <div className="mt-4 p-3 glass-panel-sub text-xs text-secondary text-center rounded-lg">
        <div className="font-semibold text-white mb-1">Status Sistem</div>
        <div className="italic">{cnnStatus || 'Menunggu eksekusi model CNN...'}</div>
      </div>

      {cnnResult && (
        <div className="mt-4 p-4 glass-panel-sub rounded-lg border border-accent/20 animate-fade-in">
          <h4 className="text-xs font-bold text-accent uppercase tracking-wider mb-2">Hasil Prediksi CNN</h4>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-secondary">Prediksi:</span>
            <span className="text-sm font-bold text-white">{cnnResult.class}</span>
          </div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs text-secondary">Confidence:</span>
            <span className="text-sm font-bold text-green-400">{cnnResult.confidence}%</span>
          </div>

          {cnnResult.top_predictions && cnnResult.top_predictions.length > 0 && (
            <div className="mt-3 border-t border-white/5 pt-3">
              <span className="text-[10px] uppercase tracking-wider text-secondary font-semibold">Top 3 Prediksi:</span>
              <div className="mt-1 space-y-1">
                {cnnResult.top_predictions.map((pred, i) => (
                  <div key={i} className="flex justify-between text-[11px]">
                    <span className="text-white/80">{i+1}. {pred.class}</span>
                    <span className="text-secondary">{pred.confidence.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        .feature-group {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .mt-4 { margin-top: 1rem; }
        .mt-3 { margin-top: 0.75rem; }
        .mt-1 { margin-top: 0.25rem; }
        .mb-1 { margin-bottom: 0.25rem; }
        .mb-2 { margin-bottom: 0.5rem; }
        .mb-3 { margin-bottom: 0.75rem; }
        .w-full { width: 100%; }
        .flex { display: flex; }
        .justify-between { justify-content: space-between; }
        .items-center { align-items: center; }
        .text-secondary { color: var(--text-secondary); }
        .text-accent { color: var(--accent-color); }
        .text-green-400 { color: #4ade80; }
        .text-white { color: #ffffff; }
        .text-white\/80 { color: rgba(255, 255, 255, 0.8); }
        .text-xs { font-size: 0.75rem; }
        .text-sm { font-size: 0.875rem; }
        .font-semibold { font-weight: 600; }
        .font-bold { font-weight: 700; }
        .uppercase { text-transform: uppercase; }
        .tracking-wider { letter-spacing: 0.05em; }
        .border-t { border-top: 1px solid rgba(255, 255, 255, 0.1); }
        .pt-3 { padding-top: 0.75rem; }
        .space-y-1 > * + * { margin-top: 0.25rem; }
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