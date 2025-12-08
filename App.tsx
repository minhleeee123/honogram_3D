import React, { useState, useCallback } from 'react';
import HologramCanvas from './components/HologramCanvas';
import ControlPanel from './components/ControlPanel';
import AIChat from './components/AIChat';
import GestureController from './components/GestureController';
import { HologramState, ChatMessage } from './types';
import { interpretCommand } from './services/geminiService';
import { Settings, Maximize2 } from 'lucide-react';

const INITIAL_STATE: HologramState = {
  rotationSpeed: 1.0,
  particleSize: 0.05,
  particleCount: 5000,
  color: '#00f0ff',
  hoverEffect: true,
  glitchIntensity: 0.1,
  shape: 'torus',
  zoomLevel: 1.0
};

function App() {
  const [hologramConfig, setHologramConfig] = useState<HologramState>(INITIAL_STATE);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [showMobileControls, setShowMobileControls] = useState(false);

  const handleConfigChange = (key: keyof HologramState, value: any) => {
    setHologramConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleGestureZoom = useCallback((targetZoom: number) => {
     setHologramConfig(prev => {
         // Threshold to prevent jitter
         if (Math.abs(prev.zoomLevel - targetZoom) < 0.05) return prev;
         return { ...prev, zoomLevel: targetZoom };
     });
  }, []);

  const handleSendMessage = useCallback(async (text: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsProcessingAI(true);

    try {
      const response = await interpretCommand(text, hologramConfig);

      if (response.action === 'update_settings' && response.settings) {
        setHologramConfig(prev => ({ ...prev, ...response.settings }));
        
        const aiMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'ai',
            text: response.message || "Hệ thống đã cập nhật tham số hologram.",
            timestamp: Date.now()
        };
        setMessages(prev => [...prev, aiMsg]);
      } else {
        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'ai',
          text: response.message || "Tôi không hiểu lệnh này.",
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, aiMsg]);
      }
    } catch (error) {
      console.error("Failed to process command", error);
    } finally {
      setIsProcessingAI(false);
    }
  }, [hologramConfig]);

  return (
    <div className="flex h-screen w-full bg-black overflow-hidden relative font-sans selection:bg-cyan-500/30 selection:text-cyan-100">
      
      {/* Sidebar Controls (Desktop) */}
      <div className="hidden md:block h-full z-20 relative">
        <ControlPanel config={hologramConfig} onChange={handleConfigChange} />
      </div>

      {/* Mobile Control Toggle */}
      <div className="md:hidden absolute top-4 left-4 z-40">
          <button 
            onClick={() => setShowMobileControls(!showMobileControls)}
            className="p-2 bg-slate-800/80 backdrop-blur rounded border border-cyan-500/50 text-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.2)]"
          >
              <Settings size={20} />
          </button>
      </div>

       {/* Sidebar Controls (Mobile Overlay) */}
       {showMobileControls && (
        <div className="absolute inset-0 z-40 bg-black/80 md:hidden flex flex-col">
            <div className="flex justify-end p-4">
                <button onClick={() => setShowMobileControls(false)} className="text-white">
                    <Maximize2 size={24} />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto">
                 <ControlPanel config={hologramConfig} onChange={handleConfigChange} />
            </div>
        </div>
       )}

      {/* Gesture Controller (High Z-Index) */}
      <GestureController 
        onZoomChange={handleGestureZoom} 
        currentZoom={hologramConfig.zoomLevel}
      />

      {/* 3D Canvas Area */}
      <div className="flex-1 relative h-full z-0">
        {/* Top Info Bar */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between pointer-events-none z-10">
            <div className="hidden md:block text-xs font-mono text-slate-500 pl-4">
                SYS.RDY // {new Date().toLocaleDateString()}
            </div>
            {/* Right side is occupied by GestureController, so we keep this minimal */}
        </div>

        <HologramCanvas config={hologramConfig} />
      </div>

      {/* AI Chat Interface */}
      <AIChat 
        messages={messages} 
        onSendMessage={handleSendMessage}
        isProcessing={isProcessingAI}
      />
    </div>
  );
}

export default App;