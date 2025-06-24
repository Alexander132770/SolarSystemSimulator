import { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import { PlanetData, MoonData, TIME_SCALE } from '../lib/solarSystemData';

interface CelestialBodyProps {
  data: PlanetData | (MoonData & { name: string });
  position?: [number, number, number];
  isSun?: boolean;
  parentRef?: React.RefObject<THREE.Group>;
}

export function CelestialBody({ data, position = [0, 0, 0], isSun = false, parentRef }: CelestialBodyProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  // Load textures if available
  const texture = data.texture ? useLoader(TextureLoader, data.texture, (loader) => {
    loader.flipY = false;
    return loader;
  }) : null;
  
  const bumpMap = (data as PlanetData).bumpMap ? useLoader(TextureLoader, (data as PlanetData).bumpMap!, (loader) => {
    loader.flipY = false;
    return loader;
  }) : null;
  
  // Create material based on whether it's the sun or a planet
  const material = useMemo(() => {
    if (isSun) {
      return new THREE.MeshBasicMaterial({
        map: texture,
        color: data.color,
      });
    } else {
      return new THREE.MeshPhongMaterial({
        map: texture,
        bumpMap: bumpMap,
        color: data.color,
        bumpScale: 0.02,
        shininess: 0,
        specular: 0x111111,
      });
    }
  }, [texture, bumpMap, data.color, isSun]);

  // Animation state
  const rotationSpeed = useMemo(() => {
    const period = 'rotationPeriod' in data ? data.rotationPeriod : 1;
    return (2 * Math.PI * TIME_SCALE) / Math.abs(period);
  }, [data]);

  useFrame((state) => {
    if (meshRef.current) {
      // Rotate the celestial body around its axis
      const direction = 'rotationPeriod' in data && data.rotationPeriod < 0 ? -1 : 1;
      meshRef.current.rotation.y += rotationSpeed * direction;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh ref={meshRef} material={material} castShadow receiveShadow>
        <sphereGeometry args={[data.radius, 32, 32]} />
      </mesh>
      
      {/* Render moons if this is a planet */}
      {'moons' in data && data.moons && data.moons.map((moon, index) => (
        <OrbitingMoon key={moon.name} moon={moon} planetRadius={data.radius} />
      ))}
    </group>
  );
}

interface OrbitingMoonProps {
  moon: MoonData;
  planetRadius: number;
}

function OrbitingMoon({ moon, planetRadius }: OrbitingMoonProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  const orbitalSpeed = useMemo(() => {
    return (2 * Math.PI * TIME_SCALE) / moon.orbitalPeriod;
  }, [moon.orbitalPeriod]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += orbitalSpeed;
    }
  });

  return (
    <group ref={groupRef}>
      <CelestialBody 
        data={moon} 
        position={[planetRadius + moon.distance, 0, 0]} 
      />
    </group>
  );
}
