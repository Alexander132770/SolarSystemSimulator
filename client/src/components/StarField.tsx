import { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';

export function StarField() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Load the starfield texture
  const starTexture = useLoader(TextureLoader, "/textures/starmap.jpg", (loader) => {
    loader.flipY = false;
    return loader;
  });
  
  // Create starfield material
  const starMaterial = new THREE.MeshBasicMaterial({
    map: starTexture,
    side: THREE.BackSide, // Render inside of sphere
  });

  return (
    <mesh ref={meshRef} material={starMaterial}>
      <sphereGeometry args={[1000, 32, 32]} />
    </mesh>
  );
}
