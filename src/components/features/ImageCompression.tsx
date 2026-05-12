interface FeatureProps {
  onApply: (type: string) => void;
}

export default function ImageCompression({ onApply }: FeatureProps) {
  return (
    <div className="feature-group animate-fade-in">
      <div className="param-group">
        <label>Metode Teknis</label>
        {/* Menghubungkan pilihan metode kompresi ke fungsi onApply */}
        <select 
          className="glass-select w-full compress-method-select"
          onChange={(e) => onApply(`compress-method-${e.target.value}`)}
        >
          <option value="jpeg">Simulasi JPEG (Kuantisasi)</option>
          <option value="huffman">Huffman Coding</option>
          <option value="rle">Run-Length (RLE)</option>
          <option value="lzw">LZW / Aritmatik</option>
        </select>
      </div>

      <div className="param-group mt-4">
        <label>Kualitas Output (1-100)</label>
        {/* Slider untuk mengatur rasio kompresi secara real-time */}
        <input 
          type="range" 
          className="slider quality-slider" 
          min="1" 
          max="100" 
          defaultValue="80" 
          onChange={(e) => onApply(`quality-${e.target.value}`)}
        />
        <div className="flex justify-between text-[10px] text-secondary mt-1">
          <span>High Compression</span>
          <span>High Quality</span>
        </div>
      </div>

      <div className="action-grid mt-4">
        <button 
          className="glass-button w-full" 
          onClick={() => onApply('simulate-compression')}
        >
          Hitung Estimasi Size
        </button>
      </div>

      <style>{`
        .feature-group {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .mt-1 { margin-top: 0.25rem; }
        .mt-4 { margin-top: 1rem; }
        .w-full { width: 100%; }
        .flex { display: flex; }
        .justify-between { justify-content: space-between; }
        .text-secondary { color: var(--text-secondary); }
      `}</style>
    </div>
  );
}