import { useState, useEffect } from 'react';

interface UIProps {
  currentTarget: string;
}

export function UI({ currentTarget }: UIProps) {
  const [isVisible, setIsVisible] = useState(true);

  // Auto-hide UI after 3 seconds of no interaction
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 3000);
    return () => clearTimeout(timer);
  }, [currentTarget]);

  const handleMouseMove = () => {
    setIsVisible(true);
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      className={`fixed inset-0 pointer-events-none transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-20'
      }`}
    >
      {/* Header */}
      <div className="absolute top-4 left-4 text-white">
        <h1 className="text-2xl font-bold mb-2">Solar System Simulation</h1>
        <div className="text-sm opacity-80">
          <p>Current Target: <span className="font-semibold text-yellow-400">{currentTarget}</span></p>
        </div>
      </div>

      {/* Controls help */}
      <div className="absolute top-4 right-4 text-white text-sm">
        <div className="bg-black bg-opacity-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Camera Controls</h3>
          <div className="space-y-1">
            <p><kbd className="bg-gray-700 px-2 py-1 rounded text-xs">0</kbd> Overview</p>
            <p><kbd className="bg-gray-700 px-2 py-1 rounded text-xs">1</kbd> Mercury</p>
            <p><kbd className="bg-gray-700 px-2 py-1 rounded text-xs">2</kbd> Venus</p>
            <p><kbd className="bg-gray-700 px-2 py-1 rounded text-xs">3</kbd> Earth</p>
            <p><kbd className="bg-gray-700 px-2 py-1 rounded text-xs">4</kbd> Mars</p>
          </div>
        </div>
      </div>

      {/* Planet info */}
      {currentTarget !== 'overview' && (
        <div className="absolute bottom-4 left-4 text-white">
          <div className="bg-black bg-opacity-50 p-4 rounded-lg max-w-sm">
            <h3 className="font-semibold text-lg mb-2">{currentTarget}</h3>
            <div className="text-sm space-y-1">
              {getPlanetInfo(currentTarget).map((info, index) => (
                <p key={index}>{info}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getPlanetInfo(planetName: string): string[] {
  const info: Record<string, string[]> = {
    Mercury: [
      "Closest planet to the Sun",
      "Extremely hot during day, freezing at night",
      "No atmosphere or moons",
      "Orbital period: 88 Earth days"
    ],
    Venus: [
      "Hottest planet in solar system",
      "Thick toxic atmosphere",
      "Rotates backwards (retrograde)",
      "Often called Earth's twin"
    ],
    Earth: [
      "Our home planet",
      "Only known planet with life",
      "71% of surface covered by water",
      "Has one natural satellite: the Moon"
    ],
    Mars: [
      "The Red Planet",
      "Has the largest volcano in solar system",
      "Thin atmosphere, mostly CO2",
      "Evidence of ancient water flows"
    ]
  };

  return info[planetName] || [];
}
