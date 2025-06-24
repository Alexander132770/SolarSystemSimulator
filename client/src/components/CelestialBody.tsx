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
  
  // Load textures if available with cache busting
  const texture = data.texture ? useLoader(TextureLoader, `${data.texture}?v=${Date.now()}`, (loader) => {
    loader.flipY = false;
    return loader;
  }) : null;
  
  const bumpMap = (data as PlanetData).bumpMap ? useLoader(TextureLoader, `${(data as PlanetData).bumpMap!}?v=${Date.now()}`, (loader) => {
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
      // Special handling for Earth with better lighting
      if (data.name === 'Earth') {
        return new THREE.MeshPhongMaterial({
          map: texture,
          bumpMap: bumpMap,
          color: 0xffffff, // Pure white to show true texture colors
          bumpScale: 0.003,
          shininess: 10,
          specular: 0x333333,
        });
      } else if (data.name === 'Moon') {
        return new THREE.MeshPhongMaterial({
          map: texture,
          bumpMap: bumpMap,
          color: 0xffffff, // Pure white to show true lunar surface colors
          bumpScale: 0.008,
          shininess: 0,
          specular: 0x000000,
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
    }
  }, [texture, bumpMap, data.color, data.name, isSun]);

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
        <sphereGeometry args={[data.radius, 64, 64]} />
      </mesh>
      
      {/* Add atmosphere effect for Earth */}
      {data.name === 'Earth' && (
        <mesh>
          <sphereGeometry args={[data.radius * 1.02, 32, 32]} />
          <meshBasicMaterial 
            color="#87CEEB"
            transparent
            opacity={0.15}
            side={THREE.BackSide}
          />
        </mesh>
      )}
      
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
