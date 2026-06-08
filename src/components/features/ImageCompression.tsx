import { useState } from 'react';

interface FeatureProps {
  onApply: (type: string) => void;
}

export default function ImageCompression({ onApply }: FeatureProps) {
  // Menyimpan state lokal untuk mengetahui metode apa yang sedang dipilih
  const [selectedMethod, setSelectedMethod] = useState('jpeg');

  const handleMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const method = e.target.value;
    setSelectedMethod(method);
    onApply(`compress-method-${method}`);
  };

  return (
    <div className="feature-group animate-fade-in">
      <div className="param-group">
        <label>Metode Teknis</label>
        <select 
          className="glass-select w-full compress-method-select"
          value={selectedMethod}
          onChange={handleMethodChange}
        >
          <option value="jpeg">Metode Kuantisasi (JPEG / Lossy)</option>
          <option value="huffman">Huffman Coding (Lossless)</option>
          <option value="arithmetic">Arithmetic Coding (Lossless)</option>
          <option value="lzw">LZW (Lossless)</option>
          <option value="rle">Run-Length Encoding / RLE (Lossless)</option>
        </select>
      </div>

      {/* Jika yang dipilih bukan JPEG, buat slider menjadi transparan dan tidak bisa diklik */}
      <div className={`param-group mt-4 ${selectedMethod !== 'jpeg' ? 'opacity-50 pointer-events-none' : ''}`}>
        <label>Kualitas Output (1-100) {selectedMethod !== 'jpeg' && '- Nonaktif'}</label>
        <input 
          type="range" 
          className="slider quality-slider" 
          min="1" 
          max="100" 
          defaultValue="80" 
          onChange={(e) => onApply(`quality-${e.target.value}`)}
          disabled={selectedMethod !== 'jpeg'}
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
        .opacity-50 { opacity: 0.5; }
        .pointer-events-none { pointer-events: none; cursor: not-allowed; }
      `}</style>
    </div>
  );
}