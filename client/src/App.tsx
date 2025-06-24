import { useState, useRef, Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { KeyboardControls, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { SolarSystem } from './components/SolarSystem';
import { CameraController } from './components/CameraController';
import { UI } from './components/UI';
import { solarSystemData } from './lib/solarSystemData';
import './index.css';

// Define keyboard controls (though we mainly use direct key events)
const keyMap = [
  { name: 'overview', keys: ['Digit0'] },
  { name: 'mercury', keys: ['Digit1'] },
  { name: 'venus', keys: ['Digit2'] },
  { name: 'earth', keys: ['Digit3'] },
  { name: 'mars', keys: ['Digit4'] },
];

function App() {
  const [currentTarget, setCurrentTarget] = useState('overview');
  
  // Create refs for each planet to track their positions
  const mercuryRef = useRef<THREE.Group>(null);
  const venusRef = useRef<THREE.Group>(null);
  const earthRef = useRef<THREE.Group>(null);
  const marsRef = useRef<THREE.Group>(null);
  
  const planetRefs = useMemo(() => ({
    Mercury: mercuryRef,
    Venus: venusRef,
    Earth: earthRef,
    Mars: marsRef,
  }), []);

  const handleTargetChange = (target: string) => {
    console.log(`Switching camera target to: ${target}`);
    setCurrentTarget(target);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <KeyboardControls map={keyMap}>
        <Canvas
          shadows
          camera={{
            position: [0, 15, 25],
            fov: 45,
            near: 0.1,
            far: 2000
          }}
          gl={{
            antialias: true,
            powerPreference: "high-performance",
            alpha: false
          }}
        >
          {/* Black space background */}
          <color attach="background" args={["#000000"]} />
          
          <Suspense fallback={null}>
            {/* Main solar system */}
            <SolarSystem planetRefs={planetRefs} />
            
            {/* Camera controller for planet tracking */}
            <CameraController 
              planetRefs={planetRefs}
              currentTarget={currentTarget}
              onTargetChange={handleTargetChange}
            />
            
            {/* Orbit controls for manual camera control */}
            <OrbitControls 
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              maxDistance={100}
              minDistance={1}
              enabled={currentTarget === 'overview'}
            />
          </Suspense>
        </Canvas>
        
        {/* UI overlay */}
        <UI currentTarget={currentTarget} />
      </KeyboardControls>
    </div>
  );
}

export default App;
