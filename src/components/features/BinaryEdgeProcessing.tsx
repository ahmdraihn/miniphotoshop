interface FeatureProps {
  onApply: (type: string) => void;
}

export default function BinaryEdgeProcessing({ onApply }: FeatureProps) {
  return (
    <div className="feature-group animate-fade-in">
      <div className="param-group">
        <label>Thresholding (Binary)</label>
        {/* Tombol aksi cepat untuk ambang batas */}
        <div className="action-grid mt-2">
           <button className="glass-button" onClick={() => onApply('threshold')}>Terapkan Biner</button>
        </div>
        <input type="range" className="slider threshold-slider" min="0" max="255" defaultValue="128" />
      </div>

      <div className="param-group">
        <label>Edge Detection Operator</label>
        <select 
          className="glass-select w-full edge-operator-select" 
          onChange={(e) => onApply(e.target.value.toLowerCase())}
        >
          <option value="">Pilih Operator...</option>
          <option value="canny">Canny</option>
          <option value="sobel">Sobel</option>
          <option value="prewitt">Prewitt</option>
          <option value="robert">Robert</option>
          <option value="laplacian">Laplacian</option>
          <option value="log">Laplacian of Gaussian</option>
        </select>
      </div>

      <div className="action-grid mt-4">
        {/* Menghubungkan tombol morfologi ke fungsi onApply */}
        <button className="glass-button" onClick={() => onApply('erosion')}>Erosion</button>
        <button className="glass-button" onClick={() => onApply('dilation')}>Dilation</button>
      </div>

      <style>{`
        .feature-group {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .mt-2 { margin-top: 0.5rem; }
        .mt-4 { margin-top: 1rem; }
        .w-full { width: 100%; }
      `}</style>
    </div>
  );
}