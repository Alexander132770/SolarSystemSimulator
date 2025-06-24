# 3D Solar System Simulation

## Overview

This project is a 3D interactive solar system simulation built with React Three Fiber and TypeScript. It features realistic planetary orbits, camera controls, and an immersive 3D environment. The application is designed as a full-stack web application with a React frontend and Express backend, though the current implementation focuses primarily on the frontend 3D experience.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **3D Rendering**: React Three Fiber (@react-three/fiber) with Three.js
- **3D Helpers**: React Three Drei (@react-three/drei) for camera controls and utilities
- **Post-processing**: React Three Postprocessing for visual effects
- **UI Components**: Radix UI components with custom styling
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Zustand for game state and audio management
- **Build Tool**: Vite with custom configuration for 3D assets

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: Drizzle ORM with PostgreSQL (via Neon Database)
- **Session Storage**: In-memory storage with fallback to PostgreSQL
- **Development**: Hot module replacement with Vite integration

## Key Components

### 3D Solar System Components
- **SolarSystem**: Main container managing planetary orbits and lighting
- **CelestialBody**: Individual planets and moons with realistic rotation
- **StarField**: Background sphere with star texture mapping
- **CameraController**: Keyboard-controlled camera system with smooth transitions

### Core Systems
- **Planetary Data**: Scientifically accurate orbital periods and distances (scaled for visualization)
- **Time Simulation**: Accelerated time system for visible orbital motion
- **Interactive Controls**: Number key shortcuts for camera targeting (0-4)
- **UI Overlay**: Information display with auto-hide functionality

### State Management
- **Game State**: Phase management (ready/playing/ended) via Zustand
- **Audio System**: Sound effect management with mute/unmute controls
- **Camera Targeting**: Dynamic camera focus system for different celestial bodies

## Data Flow

1. **Application Initialization**: 
   - Solar system data loaded from configuration
   - Planet references created for camera targeting
   - 3D scene initialized with lighting and background

2. **Render Loop**:
   - Planetary positions calculated based on orbital mechanics
   - Camera smoothly transitions between targets
   - UI updates reflect current camera target

3. **User Interaction**:
   - Keyboard input triggers camera target changes
   - Mouse movement controls UI visibility
   - Audio controls manage sound effects

4. **Backend Integration**:
   - API routes ready for future features
   - Database schema prepared for user data
   - Session management configured

## External Dependencies

### 3D Graphics & Animation
- **Three.js ecosystem**: Core 3D rendering capabilities
- **GLSL shaders**: Custom shader support via vite-plugin-glsl
- **3D model support**: GLTF/GLB format loading

### UI & Styling
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework
- **Lucide React**: Icon library for UI elements

### Database & Backend
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle ORM**: Type-safe database operations
- **Express.js**: Web server framework

### Development Tools
- **Replit**: Cloud development environment
- **Vite**: Fast build tool with HMR
- **TypeScript**: Static type checking

## Deployment Strategy

### Production Build
- **Frontend**: Vite builds optimized React application
- **Backend**: ESBuild bundles Express server
- **Assets**: 3D models, textures, and fonts included in build

### Hosting Configuration
- **Platform**: Replit with autoscale deployment
- **Port**: 5000 (development) → 80 (production)
- **Process**: Single server serving both API and static files

### Environment Variables
- **DATABASE_URL**: PostgreSQL connection string (required)
- **NODE_ENV**: Environment detection for production optimizations

## Changelog

Changelog:
- June 24, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.