import { useRef } from 'react';
import * as THREE from 'three';
import { solarSystemData } from '../lib/solarSystemData';

export function OrbitRings() {
  return (
    <group>
      {solarSystemData.map((planet) => (
        <OrbitRing 
          key={planet.name}
          radius={planet.distance}
          name={planet.name}
        />
      ))}
    </group>
  );
}

interface OrbitRingProps {
  radius: number;
  name: string;
}

function OrbitRing({ radius, name }: OrbitRingProps) {
  const ringRef = useRef<THREE.Mesh>(null);

  // Create ring geometry
  const ringGeometry = new THREE.RingGeometry(radius - 0.05, radius + 0.05, 64);
  
  return (
    <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
      <primitive object={ringGeometry} />
      <meshBasicMaterial 
        color="#ffffff" 
        transparent 
        opacity={0.3}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}