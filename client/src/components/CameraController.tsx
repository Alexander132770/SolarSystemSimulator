import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import * as THREE from 'three';
import { CAMERA_TARGETS, solarSystemData } from '../lib/solarSystemData';

enum Controls {
  overview = 'overview',
  mercury = 'mercury',
  venus = 'venus',
  earth = 'earth',
  mars = 'mars'
}

interface CameraControllerProps {
  planetRefs: Record<string, React.RefObject<THREE.Group>>;
  currentTarget: string;
  onTargetChange: (target: string) => void;
}

export function CameraController({ planetRefs, currentTarget, onTargetChange }: CameraControllerProps) {
  const { camera } = useThree();
  const [subscribe, get] = useKeyboardControls<Controls>();
  
  const targetPosition = useRef(new THREE.Vector3());
  const currentPosition = useRef(new THREE.Vector3());
  const lookAtTarget = useRef(new THREE.Vector3());
  const orbitAngle = useRef(0);

  // Handle keyboard input for camera switching
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key;
      console.log(`Key pressed: ${key}`);
      
      switch (key) {
        case '0':
          onTargetChange('overview');
          break;
        case '1':
          onTargetChange('Mercury');
          break;
        case '2':
          onTargetChange('Venus');
          break;
        case '3':
          onTargetChange('Earth');
          break;
        case '4':
          onTargetChange('Mars');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onTargetChange]);

  useFrame(() => {
    // Determine target position based on current tracking target
    if (currentTarget === 'overview') {
      // Overview position - show entire solar system
      targetPosition.current.set(0, 15, 25);
      lookAtTarget.current.set(0, 0, 0);
      
      // Smooth camera transition for overview
      const distanceToTarget = camera.position.distanceTo(targetPosition.current);
      if (distanceToTarget > 0.1) {
        currentPosition.current.copy(camera.position);
        currentPosition.current.lerp(targetPosition.current, 0.05);
        camera.position.copy(currentPosition.current);
      }
      
      camera.lookAt(lookAtTarget.current);
    } else {
      // Track specific planet - orbit around it
      const planetRef = planetRefs[currentTarget];
      if (planetRef?.current) {
        const planetPos = new THREE.Vector3();
        planetRef.current.getWorldPosition(planetPos);
        
        // Increment orbit angle for rotation around planet (reversed direction)
        orbitAngle.current -= 0.01; // Changed to negative for opposite direction
        
        // Calculate orbital camera position around the planet with planet-specific distance
        const planetData = solarSystemData.find(p => p.name === currentTarget);
        let orbitRadius = 5; // Default distance
        
        if (planetData) {
          // Adjust orbit radius based on planet size and characteristics
          const baseRadius = planetData.radius * 100; // Scale up from planet radius
          orbitRadius = Math.max(baseRadius + 3, 2); // Minimum distance of 2, plus buffer
          
          // Special adjustments for specific planets
          if (currentTarget === 'Mercury') orbitRadius = 3.5;
          if (currentTarget === 'Venus') orbitRadius = 4.5;
          if (currentTarget === 'Earth') orbitRadius = 6.5;
          if (currentTarget === 'Mars') orbitRadius = 7.5;
        }
        
        const orbitHeight = orbitRadius * 0.3; // Height proportional to orbit radius
        
        const orbitX = planetPos.x + Math.cos(orbitAngle.current) * orbitRadius;
        const orbitZ = planetPos.z + Math.sin(orbitAngle.current) * orbitRadius;
        const orbitY = planetPos.y + orbitHeight;
        
        targetPosition.current.set(orbitX, orbitY, orbitZ);
        lookAtTarget.current.copy(planetPos);
        
        // Smooth transition to orbital position
        currentPosition.current.copy(camera.position);
        currentPosition.current.lerp(targetPosition.current, 0.08);
        camera.position.copy(currentPosition.current);
        
        // Always look at the planet
        camera.lookAt(lookAtTarget.current);
      }
    }
  });

  return null;
}
