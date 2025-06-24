import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import * as THREE from 'three';
import { CAMERA_TARGETS } from '../lib/solarSystemData';

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
    } else {
      // Track specific planet
      const planetRef = planetRefs[currentTarget];
      if (planetRef?.current) {
        const planetPos = new THREE.Vector3();
        planetRef.current.getWorldPosition(planetPos);
        
        // Position camera behind and above the planet
        const offset = new THREE.Vector3(0, 2, 5);
        targetPosition.current.copy(planetPos).add(offset);
        lookAtTarget.current.copy(planetPos);
      }
    }

    // Smooth camera transition
    currentPosition.current.copy(camera.position);
    currentPosition.current.lerp(targetPosition.current, 0.02);
    camera.position.copy(currentPosition.current);
    
    // Smooth look-at transition
    camera.lookAt(lookAtTarget.current);
  });

  return null;
}
