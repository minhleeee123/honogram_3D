import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { HologramState } from '../types';

// Fix for missing JSX types in the current environment
declare global {
  namespace JSX {
    interface IntrinsicElements {
      points: any;
      bufferGeometry: any;
      bufferAttribute: any;
      pointsMaterial: any;
      ambientLight: any;
      fog: any;
    }
  }
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      points: any;
      bufferGeometry: any;
      bufferAttribute: any;
      pointsMaterial: any;
      ambientLight: any;
      fog: any;
    }
  }
}

interface HologramCanvasProps {
  config: HologramState;
}

// Map shape names to RELIABLE public 3D model URLs (using 'main' branch)
// Note: 't-rex' is mapped to 'BrainStem' as a sci-fi creature placeholder since a public T-Rex GLB is hard to find reliably.
const MODEL_URLS: Record<string, string> = {
  't-rex': 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/BrainStem/glTF-Binary/BrainStem.glb',
  'dragon': 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/DragonAttenuation/glTF-Binary/DragonAttenuation.glb',
  'car': 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/Buggy/glTF-Binary/Buggy.glb',
};

// Error Boundary Component to handle 404s or load failures gracefully
class ModelErrorBoundary extends React.Component<{ fallback: React.ReactNode, children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidUpdate(prevProps: any) {
     if (prevProps.children !== this.props.children) {
         this.setState({ hasError: false });
     }
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

const ProceduralParticles: React.FC<{ config: HologramState }> = ({ config }) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  // Create geometry based on shape selection
  const geometry = useMemo(() => {
    let geo: THREE.BufferGeometry;
    
    // Helper for galaxy spiral
    if (config.shape === 'galaxy') {
      const particleCount = 10000;
      const positions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const radius = Math.random() * Math.random() * 4;
        const spinAngle = radius * 5;
        const branchAngle = (i % 3) * ((2 * Math.PI) / 3);
        
        const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.3;
        const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.3;
        const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.3;

        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
        positions[i3 + 1] = randomY * 2; // Flattened galaxy
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;
      }
      geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      return geo;
    }

    switch (config.shape) {
      case 'sphere':
        geo = new THREE.SphereGeometry(2.5, 64, 64);
        break;
      case 'earth':
        geo = new THREE.IcosahedronGeometry(2.8, 16); 
        break;
      case 'box':
        geo = new THREE.BoxGeometry(3.5, 3.5, 3.5, 32, 32, 32);
        break;
      case 'pyramid':
        geo = new THREE.ConeGeometry(2.5, 4, 32, 20);
        break;
      case 'dna':
        geo = new THREE.TorusKnotGeometry(1.8, 0.4, 200, 32, 2, 8);
        break;
      case 'torus':
      default:
        geo = new THREE.TorusKnotGeometry(1.8, 0.6, 150, 30);
        break;
    }
    return geo;
  }, [config.shape]);

  // Generate particles from geometry vertices
  const particles = useMemo(() => {
    const positionAttribute = geometry.getAttribute('position');
    const count = positionAttribute.count;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    const colorObj = new THREE.Color(config.color);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = positionAttribute.getX(i);
      positions[i * 3 + 1] = positionAttribute.getY(i);
      positions[i * 3 + 2] = positionAttribute.getZ(i);

      const mixFactor = Math.random() * 0.2;
      colors[i * 3] = colorObj.r + (Math.random() - 0.5) * mixFactor;
      colors[i * 3 + 1] = colorObj.g + (Math.random() - 0.5) * mixFactor;
      colors[i * 3 + 2] = colorObj.b + (Math.random() - 0.5) * mixFactor;
    }

    return { positions, colors };
  }, [geometry, config.color]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += config.rotationSpeed * 0.005;
      pointsRef.current.rotation.x += config.rotationSpeed * 0.002;
      
      const time = state.clock.getElapsedTime();
      const pulseEffect = 1 + Math.sin(time * 2) * (config.glitchIntensity * 0.05);
      const baseZoom = config.zoomLevel || 1.0;
      const finalScale = baseZoom * pulseEffect;

      pointsRef.current.scale.set(finalScale, finalScale, finalScale);
      
      if (config.glitchIntensity > 0.5 && Math.random() > 0.95) {
         pointsRef.current.position.x = (Math.random() - 0.5) * 0.1;
      } else {
         pointsRef.current.position.x = 0;
      }
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particles.colors.length / 3}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={config.particleSize}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

// Component to load external GLB and convert to particles
const ModelParticles: React.FC<{ config: HologramState, url: string }> = ({ config, url }) => {
    const pointsRef = useRef<THREE.Points>(null);
    // Use React Suspense implicitly via useGLTF
    const { scene } = useGLTF(url);
    
    // Extract vertices from the loaded model
    const particles = useMemo(() => {
        let positions: number[] = [];
        
        // Traverse the model to find all meshes
        scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                const geometry = mesh.geometry;
                
                // Ensure geometry has position attribute
                if (geometry.attributes.position) {
                     // Get geometry, handling both BufferGeometry and InstancedBufferGeometry
                     const attr = geometry.attributes.position;
                     const count = attr.count;
                     
                     // Transform local positions to world space (relative to model root) would be ideal
                     // but for point clouds, simple aggregation usually works if model is centered.
                     
                     // Optimization: Downsample if too many points
                     const step = count > 20000 ? Math.ceil(count / 20000) : 1;

                     for(let i = 0; i < count; i += step) {
                         positions.push(attr.getX(i));
                         positions.push(attr.getY(i));
                         positions.push(attr.getZ(i));
                     }
                }
            }
        });

        const posArray = new Float32Array(positions);
        
        // Normalize positions to fit in view
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        geometry.computeBoundingBox();
        geometry.center();
        
        // Scale down if too big (simple heuristic)
        if (geometry.boundingBox) {
            const maxDim = Math.max(
                geometry.boundingBox.max.x - geometry.boundingBox.min.x,
                geometry.boundingBox.max.y - geometry.boundingBox.min.y,
                geometry.boundingBox.max.z - geometry.boundingBox.min.z
            );
            // Target size roughly 5 units
            const scale = 5 / (maxDim || 1);
            geometry.scale(scale, scale, scale);
        }

        // Create colors
        const colorArray = new Float32Array(posArray.length);
        const colorObj = new THREE.Color(config.color);
        
        for(let i=0; i < posArray.length / 3; i++) {
             const mixFactor = Math.random() * 0.3;
             colorArray[i * 3] = colorObj.r + (Math.random() - 0.5) * mixFactor;
             colorArray[i * 3 + 1] = colorObj.g + (Math.random() - 0.5) * mixFactor;
             colorArray[i * 3 + 2] = colorObj.b + (Math.random() - 0.5) * mixFactor;
        }

        return {
            positions: geometry.attributes.position.array,
            colors: colorArray
        };

    }, [scene, config.color]);

    useFrame((state) => {
        if (pointsRef.current) {
          pointsRef.current.rotation.y += config.rotationSpeed * 0.005;
          
          const time = state.clock.getElapsedTime();
          const pulseEffect = 1 + Math.sin(time * 2) * (config.glitchIntensity * 0.05);
          const baseZoom = config.zoomLevel || 1.0;
          const finalScale = baseZoom * pulseEffect;
    
          pointsRef.current.scale.set(finalScale, finalScale, finalScale);
          
          if (config.glitchIntensity > 0.5 && Math.random() > 0.95) {
             pointsRef.current.position.x = (Math.random() - 0.5) * 0.1;
          } else {
             pointsRef.current.position.x = 0;
          }
        }
    });

    return (
        <points ref={pointsRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={particles.positions.length / 3}
              array={particles.positions}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-color"
              count={particles.colors.length / 3}
              array={particles.colors}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={config.particleSize}
            vertexColors
            transparent
            opacity={0.8}
            sizeAttenuation={true}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      );
}

const HologramCanvas: React.FC<HologramCanvasProps> = ({ config }) => {
  const isExternalModel = Object.keys(MODEL_URLS).includes(config.shape);

  return (
    <div className="w-full h-full relative bg-black">
        {/* Decorative Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none hologram-grid z-10" />
      
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
        <ambientLight intensity={0.5} />
        
        <ModelErrorBoundary fallback={<ProceduralParticles config={{...config, shape: 'box'}} />}>
            <React.Suspense fallback={null}>
                {isExternalModel ? (
                    <ModelParticles key={MODEL_URLS[config.shape]} config={config} url={MODEL_URLS[config.shape]} />
                ) : (
                    <ProceduralParticles config={config} />
                )}
            </React.Suspense>
        </ModelErrorBoundary>
        
        <OrbitControls 
          enablePan={true} 
          enableZoom={true} 
          enableRotate={true}
          autoRotate={false}
        />
        <Environment preset="city" />
        
        <fog attach="fog" args={['#000000', 5, 20]} />
      </Canvas>
    </div>
  );
};

export default HologramCanvas;