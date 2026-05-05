import { 
  Wand2, 
  Move, 
  Sparkles, 
  BoxSelect, 
  Palette, 
  Minimize, 
  Maximize, 
  ScanLine 
} from 'lucide-react'

interface SidebarProps {
  activeTool: string;
  setActiveTool: (tool: string) => void;
}

export default function Sidebar({ activeTool, setActiveTool }: SidebarProps) {
  const tools = [
    { id: 'enhance', icon: <Wand2 size={20} />, label: 'Peningkatan (Enhance)' },
    { id: 'transform', icon: <Move size={20} />, label: 'Transformasi' },
    { id: 'restore', icon: <Sparkles size={20} />, label: 'Restorasi (Noise)' },
    { id: 'edge', icon: <BoxSelect size={20} />, label: 'Tepi & Biner' },
    { id: 'color', icon: <Palette size={20} />, label: 'Pengolahan Warna' },
    { id: 'segment', icon: <ScanLine size={20} />, label: 'Segmentasi' },
    { id: 'compress', icon: <Minimize size={20} />, label: 'Kompresi' },
  ]

  return (
    <aside className="glass-panel sidebar animate-fade-in">
      <div className="tools-grid">
        {tools.map(tool => (
          <button 
            key={tool.id}
            className={`tool-button ${activeTool === tool.id ? 'active' : ''}`}
            onClick={() => setActiveTool(tool.id)}
            title={tool.label}
          >
            {tool.icon}
            <span className="tool-label">{tool.label}</span>
          </button>
        ))}
      </div>

      <style>{`
        .sidebar {
          width: 80px;
          border-radius: 12px;
          padding: 1rem 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: width 0.3s ease;
          overflow-y: auto;
          overflow-x: hidden;
        }

        .sidebar:hover {
          width: 200px;
        }

        .tools-grid {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          width: 100%;
          padding: 0 0.5rem;
        }

        .tool-button {
          background: transparent;
          border: 1px solid transparent;
          color: var(--text-secondary);
          height: 48px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding: 0 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          gap: 1rem;
          overflow: hidden;
          white-space: nowrap;
        }

        .tool-button:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.05);
        }

        .tool-button.active {
          color: var(--accent-color);
          background: rgba(0, 240, 255, 0.1);
          border-color: rgba(0, 240, 255, 0.2);
          box-shadow: inset 2px 0 0 var(--accent-color);
        }

        .tool-label {
          font-family: var(--font-body);
          font-weight: 500;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .sidebar:hover .tool-label {
          opacity: 1;
        }
      `}</style>
    </aside>
  )
}
