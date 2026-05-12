interface FeatureProps {
  onApply: (type: string) => void;
}

export default function ImageManagement({ onApply }: FeatureProps) {
  return (
    <div className="feature-group animate-fade-in">
      <div className="param-group">
        <label>Input File Lokal</label>
        {/* Memicu fungsi impor yang sama dengan tombol di Header */}
        <button 
          className="glass-button w-full" 
          onClick={() => onApply('trigger-import')}
        >
          Pilih Gambar (JPG, PNG, BMP)
        </button>
      </div>
      
      <div className="param-group">
        <label>Nama File Output</label>
        <input 
          type="text" 
          className="glass-input w-full" 
          placeholder="hasil-edit" 
        />
      </div>

      <div className="param-group">
        <label>Format Simpan</label>
        <select className="glass-select w-full">
          <option>PNG</option>
          <option>JPG</option>
          <option>BMP</option>
        </select>
      </div>

      <div className="action-grid mt-4">
        {/* Tombol Simpan Gambar (Trigger Export) */}
        <button 
          className="glass-button primary w-full" 
          onClick={() => onApply('trigger-export')}
        >
          Save Image
        </button>
        
        {/* Tombol Reset */}
        <button 
          className="glass-button w-full" 
          onClick={() => onApply('reset')}
        >
          Reset ke Awal
        </button>
      </div>

      <style>{`
        .feature-group {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .param-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .param-group label {
          font-size: 0.7rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          font-weight: 600;
        }
        .glass-input {
          background: rgba(0,0,0,0.2);
          border: 1px solid var(--panel-border);
          padding: 0.6rem;
          border-radius: 6px;
          color: white;
          font-size: 0.85rem;
        }
        .mt-4 { margin-top: 1rem; }
        .w-full { width: 100%; }
        .action-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.75rem;
        }
      `}</style>
    </div>
  );
}