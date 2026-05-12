import ImageManagement from './features/ImageManagement'
import ImageEnhancement from './features/ImageEnhancement'
import GeometricTransformation from './features/GeometricTransformation'
import ImageRestoration from './features/ImageRestoration'
import BinaryEdgeProcessing from './features/BinaryEdgeProcessing'
import ColorProcessing from './features/ColorProcessing'
import ImageSegmentation from './features/ImageSegmentation'
import ImageCompression from './features/ImageCompression'
import ObjectRecognitionML from './features/ObjectRecognitionML'

interface RightPanelProps {
  activeTool: string;
  onApply: (type: string) => void; 
  hasImage: boolean;
  sourceImage: string | null;
  processedImage: string | null;
  histBefore: number[];
  histAfter: number[];
}

export default function RightPanel({ activeTool, onApply, hasImage, histBefore, histAfter }: RightPanelProps) {
  
  // Fungsi untuk merender modul parameter berdasarkan tool yang dipilih di sidebar
  const renderParameters = () => {
    switch(activeTool) {
      case 'ImageManagement':
        return <ImageManagement onApply={onApply} />;
      case 'ImageEnhancement':
      case 'enhance':
        return <ImageEnhancement onApply={onApply} />;
      case 'GeometricTransformation':
      case 'transform':
        return <GeometricTransformation onApply={onApply} />;
      case 'ImageRestoration':
      case 'restore':
        return <ImageRestoration onApply={onApply} />;
      case 'BinaryEdgeProcessing':
      case 'edge':
        return <BinaryEdgeProcessing onApply={onApply} />;
      case 'ColorProcessing':
      case 'color':
        return <ColorProcessing onApply={onApply} />;
      case 'ImageSegmentation':
      case 'segment':
        return <ImageSegmentation onApply={onApply} />;
      case 'ImageCompression':
      case 'compress':
        return <ImageCompression onApply={onApply} />;
      case 'ObjectRecognitionML':
        return <ObjectRecognitionML onApply={onApply} />;
      default:
        return <div className="placeholder-text">Pilih fitur untuk memulai</div>;
    }
  }

  return (
    <aside className="glass-panel right-panel animate-fade-in">
      
      {/* Fitur 9: Histogram Analysis */}
      <div className="panel-section">
        <h3 className="section-title">9. Histogram Analysis</h3>
        <div className="histogram-stack">
          {(['before', 'after'] as const).map((type) => {
            const values = type === 'before' ? histBefore : histAfter;
            const bucketSize = Math.ceil((values.length || 1) / 40);
            const buckets: number[] = values.length
              ? Array.from({ length: 40 }, (_, i) => values.slice(i * bucketSize, i * bucketSize + bucketSize).reduce((sum, v) => sum + v, 0))
              : Array.from<number>({ length: 40 }).fill(0);
            const maxValue = Math.max(...buckets, 1);
            return (
              <div key={type} className="histogram-mockup histogram-chart">
                <div className="histogram-title">{type === 'before' ? 'Before' : 'After'}</div>
                <div className="bars">
                  {buckets.map((value, i) => (
                    <div
                      key={`${type}-${i}`}
                      className="bar"
                      style={{
                        height: `${(value / maxValue) * 100}%`,
                        opacity: 0.7,
                        background: type === 'before' ? '#00f0ff' : '#ff7d00'
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Kontrol Parameter Fitur */}
      <div className="panel-section flex-1">
        <h3 className="section-title">Spesifikasi Parameter</h3>
        <div className="properties-content">
          {!hasImage ? (
            <p className="placeholder-text danger">
              Impor gambar terlebih dahulu untuk mengaktifkan fitur
            </p>
          ) : (
            renderParameters()
          )}
        </div>
      </div>
      
      {/* Tombol Aksi Global (Requirement 10) */}
      <div className="panel-section actions-section">
        {/* Tombol "Proses Gambar" dihapus karena perubahan slider 
          sudah bersifat Real-Time/Otomatis. 
        */}
        <button 
          className="glass-button w-full" 
          disabled={!hasImage}
          onClick={() => onApply('reset')}
        >
          Kembali ke Asli (Reset)
        </button>
      </div>

      <style>{`
        .right-panel {
          width: 320px;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          flex-shrink: 0;
          background: rgba(15, 17, 26, 0.95);
          border-left: 1px solid rgba(255, 255, 255, 0.05);
        }

        .panel-section {
          padding: 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .panel-section.flex-1 {
          flex: 1;
          border-bottom: none;
          overflow-y: auto;
        }

        .actions-section {
          background: rgba(0, 0, 0, 0.4);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding: 1.25rem;
        }

        .section-title {
          font-size: 0.7rem;
          color: #00f0ff;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          margin-bottom: 1.25rem;
          font-weight: 800;
        }

        .histogram-mockup {
          width: 100%;
          height: 80px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          padding: 0.5rem;
          display: flex;
          flex-direction: column;
        }

        .histogram-labels {
          display: flex;
          justify-content: space-between;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.75rem;
        }

        .histogram-stack {
          display: grid;
          gap: 0.75rem;
        }

        .histogram-chart {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          height: 90px;
        }

        .histogram-title {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.75);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .bars {
          flex: 1;
          display: flex;
          align-items: flex-end;
          gap: 1px;
        }

        .bar {
          flex: 1;
          background: #00f0ff;
          border-radius: 1px 1px 0 0;
        }

        .placeholder-text {
          color: rgba(255, 255, 255, 0.3);
          font-size: 0.8rem;
          font-style: italic;
          text-align: center;
          padding: 1rem 0;
        }

        .placeholder-text.danger {
          color: #ff4d4d;
        }

        .w-full { width: 100%; }

        .glass-button {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
          padding: 0.6rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .glass-button:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.1);
          border-color: #00f0ff;
        }

        button:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
      `}</style>
    </aside>
  );
}