import { 
  Settings
} from 'lucide-react'

interface SidebarProps {
  activeTool: string;
  setActiveTool: (tool: string) => void;
}

export default function Sidebar({ activeTool, setActiveTool }: SidebarProps) {
  // Daftar menu yang sepenuhnya mengikuti poin requirement 1-11
  const menuOptions = [
    { value: "ImageManagement", label: "Image Management" },
    { value: "ImageEnhancement", label: "Image Enhancement" },
    { value: "GeometricTransformation", label: "Geometric Transformation" },
    { value: "ImageRestoration", label: "Image Restoration" },
    { value: "BinaryEdgeProcessing", label: "Binary & Edge Processing" },
    { value: "ColorProcessing", label: "Color Processing" },
    { value: "ImageSegmentation", label: "Image Segmentation" },
    { value: "ImageCompression", label: "Image Compression" },
    { value: "ObjectRecognitionML", label: "ML Object Recognition" },
  ];

  return (
    <aside className="glass-panel sidebar animate-fade-in">
      <div className="mb-4">
        <label className={`text-[10px] uppercase text-secondary/50 block mb-3 tracking-[0.1em] px-2 ${activeTool === 'ObjectRecognitionML' ? 'font-black text-accent' : 'font-bold'}`}>
          {activeTool === 'ObjectRecognitionML' ? 'MENU TOOLBAR' : 'Menu Toolbar'}
        </label>
        
        <nav className="nav-menu">
          {menuOptions.map((option) => {
            const isMLActive = option.value === 'ObjectRecognitionML' && activeTool === 'ObjectRecognitionML';
            return (
              <button
                key={option.value}
                className={`nav-item ${activeTool === option.value ? 'active' : ''} ${isMLActive ? 'font-bold uppercase' : ''}`}
                onClick={() => setActiveTool(option.value)}
              >
                {isMLActive ? option.label.toUpperCase() : option.label}
              </button>
            );
          })}
        </nav>
      </div>

      <style>{`
        .sidebar {
          width: 260px;
          border-radius: 12px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          height: 100%;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .nav-menu {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
        }

        .nav-item {
          width: 100%;
          text-align: left;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          padding: 0.5rem 0.75rem;
          border-radius: 6px;
          font-size: 0.8125rem;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: var(--font-body);
          display: flex;
          align-items: center;
        }

        .nav-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-primary);
        }

        .nav-item.active {
          background: rgba(99, 102, 241, 0.12);
          color: var(--accent-color);
          font-weight: 500;
        }

        .version-indicator {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0.75rem;
          border-radius: 8px;
          background: rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.02);
          color: var(--text-secondary);
        }

        .version-indicator p {
          font-size: 0.65rem;
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 0.05em;
          margin: 0;
        }
      `}</style>
    </aside>
  )
}