export interface HologramState {
  rotationSpeed: number; // 0 to 5
  particleSize: number; // 0.01 to 0.5
  particleCount: number; // 1000 to 20000
  color: string; // Hex code
  hoverEffect: boolean; // Expand on hover
  glitchIntensity: number; // 0 to 1
  shape: 'torus' | 'sphere' | 'box' | 'earth' | 'galaxy' | 'dna' | 'pyramid' | 't-rex' | 'dragon' | 'car';
  zoomLevel: number; // 0.5 to 3.0
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: number;
}

export interface AICommandResponse {
  action: 'update_settings' | 'chat';
  settings?: Partial<HologramState>;
  message?: string;
}