// Solar System data with realistic proportions (scaled for visualization)
export interface PlanetData {
  name: string;
  radius: number;
  distance: number; // from sun
  orbitalPeriod: number; // relative to Earth (1 = 1 Earth year)
  rotationPeriod: number; // relative to Earth (1 = 1 Earth day)
  color: string;
  texture?: string;
  bumpMap?: string;
  hasRings?: boolean;
  hasAtmosphere?: boolean;
  moons?: MoonData[];
}

export interface MoonData {
  name: string;
  radius: number;
  distance: number; // from planet
  orbitalPeriod: number;
  color: string;
  texture?: string;
  bumpMap?: string;
}

// Scaled distances and sizes for better visualization
// Real ratios maintained but compressed for screen viewing
export const SCALE_FACTOR = 0.1;
export const DISTANCE_SCALE = 0.02;
export const TIME_SCALE = 0.01; // Speed up time for visible motion

export const solarSystemData: PlanetData[] = [
  {
    name: "Mercury",
    radius: 0.38 * SCALE_FACTOR,
    distance: 38.7 * DISTANCE_SCALE,
    orbitalPeriod: 0.24,
    rotationPeriod: 58.6,
    color: "#8C7853",
    texture: "/textures/mercurymap.jpg",
    bumpMap: "/textures/mercurybump.jpg"
  },
  {
    name: "Venus",
    radius: 0.95 * SCALE_FACTOR,
    distance: 72.3 * DISTANCE_SCALE,
    orbitalPeriod: 0.62,
    rotationPeriod: -243, // Retrograde rotation
    color: "#FFC649",
    texture: "/textures/venusmap.jpg",
    bumpMap: "/textures/venusbump.jpg"
  },
  {
    name: "Earth",
    radius: 1.0 * SCALE_FACTOR,
    distance: 100 * DISTANCE_SCALE,
    orbitalPeriod: 1.0,
    rotationPeriod: 1.0,
    color: "#ffffff",
    texture: "/textures/earthmap1k.jpg",
    bumpMap: "/textures/earthbump1k.jpg",
    hasAtmosphere: true,
    moons: [
      {
        name: "Moon",
        radius: 0.27 * SCALE_FACTOR,
        distance: 3.0 * DISTANCE_SCALE,
        orbitalPeriod: 0.075, // ~27 days
        color: "#ffffff",
        texture: "/textures/moonmap1k.jpg",
        bumpMap: "/textures/moonbump1k.jpg"
      }
    ]
  },
  {
    name: "Mars",
    radius: 0.53 * SCALE_FACTOR,
    distance: 152.1 * DISTANCE_SCALE,
    orbitalPeriod: 1.88,
    rotationPeriod: 1.03,
    color: "#CD5C5C",
    texture: "/textures/marsmap1k.jpg",
    bumpMap: "/textures/marsbump1k.jpg"
  }
];

export const sunData = {
  name: "Sun",
  radius: 10.0 * SCALE_FACTOR,
  color: "#FFD700",
  texture: "/textures/sunmap.jpg"
};

// Camera tracking targets
export const CAMERA_TARGETS = {
  0: "overview", // General view
  1: "Mercury",
  2: "Venus", 
  3: "Earth",
  4: "Mars"
};
