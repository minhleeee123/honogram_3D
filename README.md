<div align="center">

# HoloCore 3D

### AI-Powered Interactive Hologram Particle System

<p align="center">
  <strong>React Three Fiber • Gesture Control • AI Commands • Real-time 3D Visualization • MediaPipe Integration</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2+-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Three.js-0.181-000000?style=for-the-badge&logo=three.js&logoColor=white" alt="Three.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.8+-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Active-success?style=flat-square" alt="Status" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="License" />
  <img src="https://img.shields.io/badge/Platform-Web-orange?style=flat-square" alt="Platform" />
</p>

---

</div>

## Table of Contents

- [Quick Start](#quick-start)
- [Overview](#overview)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage Guide](#usage-guide)
- [AI Commands](#ai-commands)
- [Gesture Controls](#gesture-controls)
- [API Reference](#api-reference)
- [Customization](#customization)

---

## Quick Start

Get your hologram system running in 3 minutes:

```bash
# 1. Clone the repository
git clone https://github.com/minhleeee123/honogram_3D.git
cd honogram_3D

# 2. Install dependencies
npm install

# 3. Configure Gemini API
# Create .env.local file
echo "VITE_GEMINI_API_KEY=your_api_key_here" > .env.local

# 4. Start development server
npm run dev

# 5. Open browser at http://localhost:5173
```

**Get Gemini API Key**: https://aistudio.google.com/apikey

---

## Overview

HoloCore 3D is an interactive holographic particle system that transforms 3D models into stunning particle-based visualizations. Control the hologram through an intuitive interface, natural language AI commands, or hand gesture recognition.

### What Makes It Special?

**AI-Powered Control**
- Natural language commands via Google Gemini
- Intelligent parameter adjustment
- Context-aware responses

**Gesture Recognition**
- Hand tracking with MediaPipe
- Pinch-to-zoom interaction
- Real-time gesture detection

**Interactive 3D Graphics**
- Particle-based hologram rendering
- Multiple shape primitives (Torus, Sphere, Helix)
- Real-time parameter tweaking
- Smooth animations and transitions

**Responsive Design**
- Desktop-optimized interface
- Mobile-friendly controls
- Touch and gesture support

---

## Features

### Core Capabilities

#### 1. 3D Hologram Visualization
- **Particle System**: Thousands of particles forming 3D shapes
- **Dynamic Shapes**: Torus, Sphere, Helix, and custom geometries
- **Real-time Rendering**: 60 FPS performance with WebGL
- **Visual Effects**: Glow, bloom, and holographic distortion
- **Color Customization**: Full RGB color picker
- **Glitch Effects**: Adjustable holographic interference

#### 2. AI Command System
- **Natural Language Processing**: Powered by Google Gemini
- **Voice-like Commands**: "Increase rotation speed", "Change color to blue"
- **Parameter Mapping**: AI understands hologram parameters
- **Context Awareness**: Remembers previous settings
- **Multi-language Support**: Commands in multiple languages

#### 3. Gesture Control
- **Hand Tracking**: MediaPipe Hand Landmark Detection
- **Pinch-to-Zoom**: Scale hologram with finger gestures
- **Real-time Processing**: Low-latency gesture recognition
- **Camera Integration**: WebRTC camera access
- **Visual Feedback**: Hand landmark visualization

#### 4. Control Panel
- **Rotation Speed**: Adjust hologram spin rate
- **Particle Count**: 1,000 to 50,000 particles
- **Particle Size**: Micro to macro particle scaling
- **Color Picker**: Full color spectrum selection
- **Shape Selector**: Switch between geometric primitives
- **Effect Toggles**: Hover effects, glitch intensity
- **Zoom Control**: Manual zoom slider

#### 5. AI Chat Interface
- **Conversational UI**: Chat-based command input
- **Message History**: Track command history
- **AI Responses**: Confirmation and feedback
- **Command Suggestions**: Helpful command examples
- **Error Handling**: Graceful failure messages

---

## System Architecture

<div align="center">

### Architecture Diagram

```
┌────────────────────────────────────────────────────────────┐
│                    USER INTERFACE                          │
│                  (React 19 + TypeScript)                   │
│                                                            │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐ │
│  │  Control     │    │   AI Chat    │    │   Gesture    │ │
│  │   Panel      │    │  Interface   │    │  Controller  │ │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘ │
└─────────┼────────────────────┼────────────────────┼────────┘
          │                    │                    │
          └────────────────────┴────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                       │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              App Component (App.tsx)                 │  │
│  │  • State Management (hologramConfig)                 │  │
│  │  • Event Handling (callbacks)                        │  │
│  │  • Props Distribution                                │  │
│  └────────────────────┬─────────────────────────────────┘  │
└───────────────────────┼────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────────┐
│   3D ENGINE  │ │  AI SERVICE  │ │ GESTURE SERVICE  │
│              │ │              │ │                  │
│ React Three  │ │    Gemini    │ │    MediaPipe     │
│   Fiber      │ │     API      │ │   Hand Detect    │
│              │ │              │ │                  │
│ • Canvas     │ │ • NLP        │ │ • Hand Track     │
│ • Particles  │ │ • Command    │ │ • Pinch Detect   │
│ • Lighting   │ │   Interpret  │ │ • Zoom Calc      │
│ • Effects    │ │ • Response   │ │ • Camera Access  │
└──────────────┘ └──────────────┘ └──────────────────┘
       │                 │                  │
       └─────────────────┴──────────────────┘
                        │
                        ▼
          ┌──────────────────────────┐
          │   HOLOGRAM STATE         │
          │                          │
          │  • rotationSpeed         │
          │  • particleCount         │
          │  • particleSize          │
          │  • color                 │
          │  • shape                 │
          │  • zoomLevel             │
          │  • glitchIntensity       │
          └──────────────────────────┘
```

</div>

### Component Breakdown

#### HologramCanvas (3D Rendering)
- **Three.js Scene**: WebGL rendering context
- **Particle System**: Instance-based particle rendering
- **Camera Controller**: OrbitControls for navigation
- **Post-processing**: Bloom and glow effects
- **Performance**: Optimized with useMemo and useFrame

#### ControlPanel (User Interface)
- **Slider Controls**: Numeric parameter adjustment
- **Color Picker**: RGB color selection
- **Dropdown Menus**: Shape and preset selection
- **Toggle Switches**: Effect on/off controls
- **Responsive Layout**: Mobile/desktop adaptability

#### AIChat (AI Interaction)
- **Message Display**: Scrollable chat history
- **Input Field**: Command text entry
- **Gemini Integration**: API communication
- **Loading States**: Processing indicators
- **Error Handling**: Network failure recovery

#### GestureController (Hand Tracking)
- **MediaPipe Setup**: Hand landmark detection model
- **Camera Stream**: WebRTC video capture
- **Gesture Detection**: Pinch distance calculation
- **Zoom Mapping**: Gesture to zoom translation
- **Visual Overlay**: Hand skeleton rendering

---

## Technology Stack

### Frontend Technologies

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **UI Framework** | React 19.2 | Component-based UI |
| **Language** | TypeScript 5.8 | Type-safe development |
| **3D Rendering** | Three.js 0.181 | WebGL 3D graphics |
| **3D React** | React Three Fiber 9.4 | React bindings for Three.js |
| **3D Helpers** | React Three Drei 10.7 | Three.js utilities |
| **Build Tool** | Vite 6.2 | Fast dev server and bundler |
| **Styling** | Tailwind CSS | Utility-first CSS |

### AI & Computer Vision

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **AI Model** | Google Gemini 1.31 | Natural language processing |
| **Gesture Recognition** | MediaPipe Tasks Vision 0.10 | Hand tracking |
| **Camera Access** | WebRTC | Video stream capture |

### Development Tools

- **Node.js**: Runtime environment
- **npm**: Package manager
- **ESLint**: Code linting
- **Prettier**: Code formatting

---

## Installation

### Prerequisites

- **Node.js**: Version 18.0 or higher
- **npm**: Version 8.0 or higher
- **Modern Browser**: Chrome, Firefox, Safari, Edge (WebGL 2.0 support)
- **Webcam**: Optional, for gesture control
- **Gemini API Key**: Required for AI features

### Step-by-Step Installation

#### 1. Clone Repository

```bash
git clone https://github.com/minhleeee123/honogram_3D.git
cd honogram_3D
```

#### 2. Install Dependencies

```bash
npm install
```

<details>
<summary><b>View Dependencies</b></summary>

**Production Dependencies**:
- react@^19.2.1
- react-dom@^19.2.1
- three@^0.181.2
- @react-three/fiber@^9.4.2
- @react-three/drei@^10.7.7
- @google/genai@^1.31.0
- @mediapipe/tasks-vision@0.10.3
- lucide-react@^0.556.0

**Dev Dependencies**:
- vite@^6.2.0
- typescript@~5.8.2
- @vitejs/plugin-react@^5.0.0
- @types/node@^22.14.0

</details>

#### 3. Configure Environment

Create `.env.local` file in root directory:

```env
# Google Gemini API Key (required for AI commands)
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Development settings
VITE_DEV_MODE=true
```

**Get API Key**:
1. Visit https://aistudio.google.com/apikey
2. Create new API key
3. Copy and paste into `.env.local`

#### 4. Start Development Server

```bash
npm run dev
```

Application will be available at `http://localhost:5173`

#### 5. Build for Production

```bash
npm run build
```

Production files will be in `dist/` directory.

---

## Configuration

### Hologram Default Settings

Edit `App.tsx` to customize initial state:

```typescript
const INITIAL_STATE: HologramState = {
  rotationSpeed: 1.0,        // Rotation speed (0.1 - 5.0)
  particleSize: 0.05,        // Particle size (0.01 - 0.2)
  particleCount: 5000,       // Number of particles (1000 - 50000)
  color: '#00f0ff',          // RGB hex color
  hoverEffect: true,         // Enable hover interactions
  glitchIntensity: 0.1,      // Glitch effect (0 - 1)
  shape: 'torus',            // Shape type
  zoomLevel: 1.0            // Camera zoom (0.5 - 3.0)
};
```

### Gemini AI Configuration

Edit `services/geminiService.ts`:

```typescript
const genAI = new GoogleGenerativeAI(
  import.meta.env.VITE_GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({ 
  model: "gemini-2.0-flash" 
});
```

### MediaPipe Configuration

Edit `components/GestureController.tsx`:

```typescript
const handLandmarker = await HandLandmarker.createFromOptions(
  vision,
  {
    baseOptions: {
      modelAssetPath: "hand_landmarker.task",
      delegate: "GPU" // Use GPU acceleration
    },
    numHands: 2, // Detect up to 2 hands
    minHandDetectionConfidence: 0.5,
    minHandPresenceConfidence: 0.5,
    minTrackingConfidence: 0.5
  }
);
```

---

## Usage Guide

### Control Panel Usage

#### Rotation Speed
- **Range**: 0.1 (slow) to 5.0 (fast)
- **Default**: 1.0
- **Effect**: Controls hologram spin rate

#### Particle Count
- **Range**: 1,000 to 50,000 particles
- **Default**: 5,000
- **Effect**: Density of hologram
- **Performance**: Higher counts reduce FPS

#### Particle Size
- **Range**: 0.01 (tiny) to 0.2 (large)
- **Default**: 0.05
- **Effect**: Size of individual particles

#### Color Picker
- **Format**: RGB Hex (#RRGGBB)
- **Default**: #00f0ff (cyan)
- **Effect**: Changes particle color

#### Shape Selector
- **Options**: Torus, Sphere, Helix
- **Default**: Torus
- **Effect**: Changes hologram geometry

#### Glitch Intensity
- **Range**: 0 (none) to 1 (maximum)
- **Default**: 0.1
- **Effect**: Holographic distortion effect

#### Zoom Level
- **Range**: 0.5 (far) to 3.0 (close)
- **Default**: 1.0
- **Effect**: Camera distance from hologram

---

## AI Commands

### Natural Language Examples

**Shape Changes**:
```
"Change shape to sphere"
"Switch to helix shape"
"Make it a torus"
```

**Color Adjustments**:
```
"Change color to blue"
"Make it red"
"Set color to green"
```

**Speed Control**:
```
"Increase rotation speed"
"Slow down the rotation"
"Set rotation to 2.5"
```

**Particle Adjustments**:
```
"Increase particle count"
"Make particles smaller"
"Set particle size to 0.1"
```

**Effect Controls**:
```
"Add more glitch effect"
"Reduce glitch intensity"
"Turn off hover effect"
```

**Zoom Commands**:
```
"Zoom in"
"Zoom out"
"Set zoom to 2.0"
```

### Command Patterns

The AI understands various command patterns:

- **Action + Parameter**: "increase rotation speed"
- **Set + Value**: "set particle count to 10000"
- **Change + Property**: "change color to red"
- **Adjective + Noun**: "faster rotation"

---

## Gesture Controls

### Hand Gesture Recognition

#### Pinch-to-Zoom
1. **Enable Camera**: Click "Enable Gesture Control" button
2. **Show Hand**: Hold hand in front of camera
3. **Pinch Gesture**: Bring thumb and index finger together
4. **Zoom Effect**: 
   - Close pinch = Zoom out
   - Open pinch = Zoom in

#### Gesture Calibration

**Optimal Conditions**:
- Good lighting
- Hand at 30-60cm from camera
- Clear background
- Steady hand position

**Distance Mapping**:
- 0-30mm: Zoom level 0.5 (far)
- 30-80mm: Zoom level 1.0 (normal)
- 80-150mm: Zoom level 3.0 (close)

---

## API Reference

### Hologram State Interface

```typescript
interface HologramState {
  rotationSpeed: number;     // 0.1 - 5.0
  particleSize: number;      // 0.01 - 0.2
  particleCount: number;     // 1000 - 50000
  color: string;             // Hex color
  hoverEffect: boolean;      // Enable/disable
  glitchIntensity: number;   // 0 - 1
  shape: 'torus' | 'sphere' | 'helix';
  zoomLevel: number;         // 0.5 - 3.0
}
```

### Gemini Service API

```typescript
// Interpret natural language command
async function interpretCommand(
  userInput: string,
  currentState: HologramState
): Promise<CommandResponse>

interface CommandResponse {
  action: 'update_settings' | 'query' | 'error';
  settings?: Partial<HologramState>;
  message?: string;
}
```

### Example Usage

```typescript
const response = await interpretCommand(
  "Change color to blue and increase rotation",
  currentHologramState
);

if (response.action === 'update_settings') {
  setHologramConfig(prev => ({
    ...prev,
    ...response.settings
  }));
}
```

---

## Customization

### Adding New Shapes

Edit `components/HologramCanvas.tsx`:

```typescript
const generateShapeParticles = (shape: string, count: number) => {
  switch (shape) {
    case 'torus':
      return generateTorusParticles(count);
    case 'sphere':
      return generateSphereParticles(count);
    case 'helix':
      return generateHelixParticles(count);
    // Add your custom shape:
    case 'cube':
      return generateCubeParticles(count);
    default:
      return generateTorusParticles(count);
  }
};
```

### Custom Particle Effects

Add post-processing effects:

```typescript
import { EffectComposer, Bloom } from '@react-three/postprocessing';

<EffectComposer>
  <Bloom
    intensity={1.5}
    luminanceThreshold={0.9}
    luminanceSmoothing={0.9}
  />
</EffectComposer>
```

### Theme Customization

Edit Tailwind classes for UI styling:

```tsx
<div className="bg-slate-900 text-cyan-400 border-cyan-500">
  {/* Your component */}
</div>
```

---

## Performance Optimization

### Recommended Settings

**High Performance** (60 FPS):
- Particle Count: 5,000 - 10,000
- Particle Size: 0.03 - 0.05
- Effects: Minimal

**Balanced** (45-60 FPS):
- Particle Count: 10,000 - 20,000
- Particle Size: 0.05 - 0.08
- Effects: Moderate

**High Quality** (30-45 FPS):
- Particle Count: 20,000 - 50,000
- Particle Size: 0.08 - 0.15
- Effects: Maximum

### Optimization Tips

1. **Reduce Particle Count**: Lower for mobile devices
2. **Disable Effects**: Turn off glitch on low-end hardware
3. **GPU Acceleration**: Ensure WebGL 2.0 is enabled
4. **Close Unused Tabs**: Free up GPU memory
5. **Update Graphics Drivers**: Latest drivers improve performance

---

## Browser Compatibility

| Browser | Version | Support | Notes |
|---------|---------|---------|-------|
| Chrome | 90+ | Full | Recommended |
| Firefox | 88+ | Full | Good performance |
| Safari | 14+ | Full | macOS/iOS compatible |
| Edge | 90+ | Full | Chromium-based |
| Opera | 76+ | Full | Chromium-based |

**Required Features**:
- WebGL 2.0
- WebRTC (for gesture control)
- ES6 modules
- async/await support

---

## Troubleshooting

### Common Issues

**Issue: "Failed to load Gemini API"**
```
Error: API key not found
```
**Solution**: Check `.env.local` file has correct `VITE_GEMINI_API_KEY`

**Issue: Camera not working**
```
Error: Permission denied
```
**Solution**: Allow camera access in browser settings

**Issue: Low FPS / Laggy performance**
```
Symptoms: Below 30 FPS
```
**Solution**: 
- Reduce particle count
- Lower particle size
- Disable effects
- Close other applications

**Issue: Gestures not detected**
```
Hand not recognized
```
**Solution**:
- Improve lighting
- Move hand closer to camera
- Ensure clear background

**Issue: Build errors**
```
Module not found
```
**Solution**: Run `npm install` again

---

## Project Structure

```
honogram_3D/
├── src/
│   ├── App.tsx                    # Main application component
│   ├── index.tsx                  # Entry point
│   ├── types.ts                   # TypeScript interfaces
│   ├── components/                # React components
│   │   ├── HologramCanvas.tsx     # 3D rendering
│   │   ├── ControlPanel.tsx       # UI controls
│   │   ├── AIChat.tsx             # Chat interface
│   │   └── GestureController.tsx  # Hand tracking
│   └── services/                  # Services
│       └── geminiService.ts       # AI integration
├── public/                        # Static assets
├── index.html                     # HTML template
├── vite.config.ts                 # Vite configuration
├── tsconfig.json                  # TypeScript config
├── package.json                   # Dependencies
└── README.md                      # This file
```

---

## Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Deploy to Netlify

```bash
# Build
npm run build

# Deploy dist/ folder to Netlify
netlify deploy --prod --dir=dist
```

### Environment Variables

Set in deployment platform:
- `VITE_GEMINI_API_KEY`: Your Gemini API key

---

## Future Enhancements

- Multi-model 3D object import (GLTF, OBJ)
- Voice command recognition
- VR/AR support with WebXR
- Real-time multiplayer synchronization
- Preset gallery and sharing
- Animation timeline editor
- Custom particle shader effects

---

## Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## License

This project is licensed under the MIT License.

---

## Resources

- **AI Studio**: https://ai.studio/apps/drive/1j3X-3sRfNlzEbbOMGAxa0aeIBeDGlzxv
- **Three.js Docs**: https://threejs.org/docs/
- **React Three Fiber**: https://docs.pmnd.rs/react-three-fiber
- **MediaPipe**: https://developers.google.com/mediapipe
- **Gemini API**: https://ai.google.dev/

---

<div align="center">

## Support

For issues or questions:
- Open an issue on GitHub
- Check browser console for errors
- Verify API key configuration

**Built with AI Studio & Modern Web Technologies**

Experience the Future of Interactive 3D Visualization

---

**Transform Reality into Holographic Art**

</div>
