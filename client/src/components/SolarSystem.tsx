import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CelestialBody } from './CelestialBody';
import { StarField } from './StarField';
import { solarSystemData, sunData, TIME_SCALE } from '../lib/solarSystemData';

interface SolarSystemProps {
  planetRefs: Record<string, React.RefObject<THREE.Group>>;
}

export function SolarSystem({ planetRefs }: SolarSystemProps) {
  // Create orbital groups for each planet
  const orbitalGroups = useRef<Record<string, THREE.Group>>({});

  // Initialize orbital groups
  useMemo(() => {
    solarSystemData.forEach(planet => {
      orbitalGroups.current[planet.name] = new THREE.Group();
    });
  }, []);

  // Animate orbital motion
  useFrame(() => {
    solarSystemData.forEach(planet => {
      const group = orbitalGroups.current[planet.name];
      if (group) {
        // Calculate orbital speed (faster = closer to sun)
        const orbitalSpeed = (2 * Math.PI * TIME_SCALE) / planet.orbitalPeriod;
        group.rotation.y += orbitalSpeed;
      }
    });
  });

  return (
    <>
      {/* Starfield background */}
      <StarField />
      
      {/* Lighting - Sun as primary light source with realistic illumination */}
      <ambientLight intensity={0.2} color="#404080" />
      <pointLight 
        position={[0, 0, 0]} 
        intensity={5} 
        color="#FFD700"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        decay={2}
        distance={0}
      />
      <directionalLight
        position={[0, 0, 0]}
        intensity={1.2}
        color="#FFFFFF"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      
      {/* Sun at center */}
      <CelestialBody data={sunData} isSun={true} />
      
      {/* Planets with orbital motion */}
      {solarSystemData.map((planet, index) => {
        // Create orbital visualization (subtle ring)
        const orbitGeometry = new THREE.RingGeometry(
          planet.distance - 0.01, 
          planet.distance + 0.01, 
          64
        );
        const orbitMaterial = new THREE.MeshBasicMaterial({
          color: 0x444444,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.3
        });

        return (
          <group key={planet.name}>
            {/* Orbital path visualization */}
            <mesh 
              geometry={orbitGeometry} 
              material={orbitMaterial} 
              rotation={[-Math.PI / 2, 0, 0]}
            />
            
            {/* Orbital group that rotates */}
            <primitive 
              object={orbitalGroups.current[planet.name]}
              ref={planetRefs[planet.name]}
            >
              <CelestialBody 
                data={planet} 
                position={[planet.distance, 0, 0]}
              />
            </primitive>
          </group>
        );
      })}
    </>
  );
}
