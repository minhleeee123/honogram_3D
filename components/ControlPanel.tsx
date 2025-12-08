import React from 'react';
import { HologramState } from '../types';

interface ControlPanelProps {
  config: HologramState;
  onChange: (key: keyof HologramState, value: any) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ config, onChange }) => {
  const shapes = [
    { id: 'torus', label: 'Torus' },
    { id: 'sphere', label: 'Sphere' },
    { id: 'box', label: 'Cube' },
    { id: 'earth', label: 'Earth' },
    { id: 'galaxy', label: 'Galaxy' },
    { id: 'dna', label: 'DNA' },
    { id: 'pyramid', label: 'Pyramid' },
    { id: 't-rex', label: 'T-REX' },
    { id: 'dragon', label: 'Dragon' },
    { id: 'car', label: 'Vehicle' },
  ];

  return (
    <div className="bg-slate-900/80 backdrop-blur-md border-r border-cyan-500/30 p-6 flex flex-col gap-6 w-full md:w-80 h-full overflow-y-auto shadow-[0_0_20px_rgba(0,240,255,0.1)]">
      <div>
        <h2 className="text-2xl font-bold text-cyan-400 mb-1 tracking-wider">HOLOGRAM</h2>
        <p className="text-xs text-cyan-600 uppercase tracking-widest">Control Terminal v2.0</p>
      </div>

      {/* Shape Selector */}
      <div className="space-y-2">
        <label className="text-cyan-200 text-sm font-mono">CORE MODEL</label>
        <div className="grid grid-cols-3 gap-2">
          {shapes.map((shape) => (
            <button
              key={shape.id}
              onClick={() => onChange('shape', shape.id)}
              className={`py-2 px-1 text-[10px] md:text-xs font-bold border rounded transition-all duration-300 uppercase truncate
                ${config.shape === shape.id 
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-100 shadow-[0_0_10px_rgba(0,240,255,0.3)]' 
                  : 'bg-transparent border-slate-700 text-slate-500 hover:border-cyan-500/50 hover:text-cyan-300'}`}
            >
              {shape.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono text-cyan-300">
            <label>SCALE / ZOOM</label>
            <span>{config.zoomLevel?.toFixed(1) || 1.0}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            value={config.zoomLevel || 1}
            onChange={(e) => onChange('zoomLevel', parseFloat(e.target.value))}
            className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400 hover:accent-cyan-300"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono text-cyan-300">
            <label>ROTATION SPEED</label>
            <span>{config.rotationSpeed.toFixed(1)} RPM</span>
          </div>
          <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={config.rotationSpeed}
            onChange={(e) => onChange('rotationSpeed', parseFloat(e.target.value))}
            className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400 hover:accent-cyan-300"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono text-cyan-300">
            <label>PARTICLE SIZE</label>
            <span>{config.particleSize.toFixed(3)} u</span>
          </div>
          <input
            type="range"
            min="0.01"
            max="0.3"
            step="0.01"
            value={config.particleSize}
            onChange={(e) => onChange('particleSize', parseFloat(e.target.value))}
            className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400 hover:accent-cyan-300"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono text-cyan-300">
            <label>GLITCH INTENSITY</label>
            <span>{(config.glitchIntensity * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={config.glitchIntensity}
            onChange={(e) => onChange('glitchIntensity', parseFloat(e.target.value))}
            className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-400 hover:accent-purple-300"
          />
        </div>
      </div>

      {/* Color Picker */}
      <div className="space-y-2">
        <label className="text-cyan-200 text-sm font-mono">EMISSION COLOR</label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={config.color}
            onChange={(e) => onChange('color', e.target.value)}
            className="h-10 w-full bg-slate-800 border border-slate-600 rounded cursor-pointer"
          />
          <span className="text-xs font-mono text-slate-400">{config.color.toUpperCase()}</span>
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-cyan-900/50">
        <div className="p-3 bg-cyan-900/20 border border-cyan-500/20 rounded text-xs text-cyan-300 font-mono">
            <p className="mb-1">STATUS: ONLINE</p>
            <p className="mb-1">RENDERER: WEBGL</p>
            <p>FPS: OPTIMAL</p>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;