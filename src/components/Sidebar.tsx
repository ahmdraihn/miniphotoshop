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
    { value: "ImageManagement", label: "1. Image Management" },
    { value: "ImageEnhancement", label: "2. Image Enhancement" },
    { value: "GeometricTransformation", label: "3. Geometric Transformation" },
    { value: "ImageRestoration", label: "4. Image Restoration" },
    { value: "BinaryEdgeProcessing", label: "5. Binary & Edge Processing" },
    { value: "ColorProcessing", label: "6. Color Processing" },
    { value: "ImageSegmentation", label: "7. Image Segmentation" },
    { value: "ImageCompression", label: "8. Image Compression" },
    { value: "ObjectRecognitionML", label: "11. ML Object Recognition" },
  ];

  return (
    <aside className="glass-panel sidebar animate-fade-in">
      <div className="px-4 mb-6">
        <label className="text-xs uppercase text-secondary block mb-2 font-semibold tracking-wider">
          Menu Toolbar
        </label>
        {/* Dropdown untuk memilih fitur sesuai requirement nomor 10 */}
        <select 
          className="glass-select w-full cursor-pointer"
          onChange={(e) => setActiveTool(e.target.value)}
          value={activeTool}
        >
          {menuOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Footer Sidebar untuk indikator versi */}
      <div className="mt-auto px-4 pb-4">
        <div className="text-center p-3 rounded-lg bg-black/20 opacity-40">
          <Settings size={20} className="mx-auto mb-1" />
          <p className="text-[10px] uppercase font-bold">Engine V1.0</p>
        </div>
      </div>

      <style>{`
        .sidebar {
          width: 260px; /* Diperlebar agar teks menu tidak terpotong */
          border-radius: 12px;
          padding: 1.5rem 0;
          display: flex;
          flex-direction: column;
          height: 100%;
          transition: all 0.3s ease;
        }

        .glass-select {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #f0f0f5;
          padding: 0.75rem;
          border-radius: 8px;
          font-size: 0.85rem;
          outline: none;
          appearance: none; /* Menghapus arrow default browser */
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23a0a4b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.75rem center;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .glass-select:focus {
          border-color: var(--accent-color);
          box-shadow: 0 0 0 2px rgba(0, 240, 255, 0.2);
        }

        .glass-select option {
          background: #1a1c26; /* Warna latar solid agar opsi terbaca jelas */
          color: white;
          padding: 10px;
        }
      `}</style>
    </aside>
  )
}