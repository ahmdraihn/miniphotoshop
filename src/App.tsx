import { useState } from 'react'
import './index.css'
import Sidebar from './components/Sidebar'
import Canvas from './components/Canvas'
import RightPanel from './components/RightPanel'

function App() {
  const [activeTool, setActiveTool] = useState('enhance')

  return (
    <div className="app-container">
      <header className="glass-panel app-header">
        <div className="logo-area">
          <div className="logo-icon"></div>
          <h1>Mini Photoshop</h1>
        </div>
        <div className="header-actions">
          <button className="glass-button">Impor Gambar</button>
          <button className="glass-button primary">Ekspor</button>
        </div>
      </header>

      <main className="app-content">
        <Sidebar activeTool={activeTool} setActiveTool={setActiveTool} />
        <Canvas />
        <RightPanel activeTool={activeTool} />
      </main>
      
      <style>{`
        .app-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          width: 100vw;
          padding: 1rem;
          gap: 1rem;
        }
        
        .app-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          height: 64px;
        }
        
        .logo-area {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .logo-icon {
          width: 24px;
          height: 24px;
          border-radius: 6px;
          background: linear-gradient(135deg, var(--accent-color), var(--danger-color));
          box-shadow: 0 0 15px rgba(0, 240, 255, 0.4);
        }
        
        .logo-area h1 {
          font-size: 1.25rem;
          margin: 0;
          background: linear-gradient(to right, #fff, var(--text-secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .header-actions {
          display: flex;
          gap: 0.75rem;
        }
        
        .glass-button.primary {
          background: rgba(0, 240, 255, 0.1);
          color: var(--accent-color);
          border-color: rgba(0, 240, 255, 0.3);
        }
        
        .glass-button.primary:hover {
          background: rgba(0, 240, 255, 0.2);
          box-shadow: 0 0 15px rgba(0, 240, 255, 0.3);
        }

        .app-content {
          display: flex;
          flex: 1;
          gap: 1rem;
          min-height: 0; /* Important for scrollable children */
        }
      `}</style>
    </div>
  )
}

export default App
