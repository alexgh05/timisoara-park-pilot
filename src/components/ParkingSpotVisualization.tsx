import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car, Trees, Circle } from "lucide-react";
import { useParkingSync } from "@/hooks/useParkingSync";

interface ParkingSpot {
  id: string;
  isOccupied: boolean;
  orientation: 'horizontal' | 'vertical' | 'diagonal';
  position: { x: number; y: number };
}

interface ParkingSpotVisualizationProps {
  zoneId?: string;
  isLive?: boolean;
}

export const ParkingSpotVisualization = ({ zoneId, isLive = true }: ParkingSpotVisualizationProps) => {
  const [spots, setSpots] = useState<ParkingSpot[]>([
    // Horizontal spots (top row)
    { id: "H1", isOccupied: false, orientation: 'horizontal', position: { x: 15, y: 20 } },
    { id: "H2", isOccupied: true, orientation: 'horizontal', position: { x: 35, y: 20 } },
    { id: "H3", isOccupied: false, orientation: 'horizontal', position: { x: 55, y: 20 } },
    { id: "H4", isOccupied: true, orientation: 'horizontal', position: { x: 75, y: 20 } },
    
    // Diagonal spots (bottom row)
    { id: "V1", isOccupied: false, orientation: 'diagonal', position: { x: 20, y: 80 } },
    { id: "V2", isOccupied: true, orientation: 'diagonal', position: { x: 35, y: 80 } },
    { id: "V3", isOccupied: false, orientation: 'diagonal', position: { x: 50, y: 80 } },
    { id: "V4", isOccupied: false, orientation: 'diagonal', position: { x: 65, y: 80 } },
  ]);

  // Sync live parking spot data with AI service  
  const { updateAIData } = useParkingSync(undefined, spots);

  // Simulate real-time updates from embedded system
  useEffect(() => {
    if (!isLive) return;
    
    const interval = setInterval(() => {
      setSpots(prevSpots => 
        prevSpots.map(spot => ({
          ...spot,
          isOccupied: Math.random() > 0.6 // 40% chance of being occupied
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isLive]);

  const availableSpots = spots.filter(spot => !spot.isOccupied).length;
  const totalSpots = spots.length;

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-slate-700">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center space-x-2">
            <Car className="h-5 w-5" />
            <span>Live Parking Zone</span>
          </CardTitle>
          <Badge variant={availableSpots > 4 ? "default" : availableSpots > 2 ? "secondary" : "destructive"}>
            {availableSpots}/{totalSpots} Available
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-80 bg-slate-800 rounded-lg overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="asphalt" width="20" height="20" patternUnits="userSpaceOnUse">
                  <rect width="20" height="20" fill="#374151"/>
                  <circle cx="10" cy="10" r="1" fill="#6b7280"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#asphalt)" />
            </svg>
          </div>

          {/* Trees on the sides */}
          <Trees 
            className="absolute top-4 left-4 h-8 w-8 text-green-500" 
            style={{ transform: 'rotate(-15deg)' }}
          />
          <Trees 
            className="absolute top-12 left-2 h-6 w-6 text-green-600" 
          />
          <Trees 
            className="absolute bottom-4 left-4 h-8 w-8 text-green-500" 
            style={{ transform: 'rotate(25deg)' }}
          />
          <Trees 
            className="absolute top-8 right-4 h-7 w-7 text-green-600" 
          />
          <Trees 
            className="absolute bottom-8 right-2 h-8 w-8 text-green-500" 
            style={{ transform: 'rotate(-30deg)' }}
          />

          {/* Walking people */}
          <div className="absolute top-1/2 left-8">
            <Circle className="h-3 w-3 text-blue-400 fill-current" />
            <div className="w-1 h-4 bg-blue-400 mx-auto"></div>
            <div className="flex">
              <div className="w-2 h-1 bg-blue-400 transform rotate-12"></div>
              <div className="w-2 h-1 bg-blue-400 transform -rotate-12"></div>
            </div>
          </div>

          <div className="absolute bottom-6 right-12">
            <Circle className="h-3 w-3 text-purple-400 fill-current" />
            <div className="w-1 h-4 bg-purple-400 mx-auto"></div>
            <div className="flex">
              <div className="w-2 h-1 bg-purple-400 transform rotate-45"></div>
              <div className="w-2 h-1 bg-purple-400 transform -rotate-45"></div>
            </div>
          </div>

          {/* Parking spots */}
          {spots.map((spot) => (
            <div
              key={spot.id}
              className={`absolute transition-all duration-500 ${
                spot.orientation === 'horizontal' ? 'w-16 h-8' : 
                spot.orientation === 'vertical' ? 'w-8 h-16' : 
                'w-14 h-10'
              }`}
              style={{
                left: `${spot.position.x}%`,
                top: `${spot.position.y}%`,
                transform: spot.orientation === 'diagonal' 
                  ? 'translate(-50%, -50%) rotate(-30deg)' 
                  : 'translate(-50%, -50%)'
              }}
            >
              {/* Parking spot outline */}
              <div 
                className={`w-full h-full border-2 border-dashed border-slate-400 rounded ${
                  spot.isOccupied ? 'bg-red-500/20' : 'bg-green-500/20'
                }`}
              >
                {/* Car if occupied */}
                {spot.isOccupied && (
                  <div className="w-full h-full flex items-center justify-center">
                    <Car 
                      className={`text-slate-300 ${
                        spot.orientation === 'horizontal' ? 'h-6 w-6' : 
                        spot.orientation === 'vertical' ? 'h-6 w-6 rotate-90' :
                        'h-5 w-5'
                      }`}
                    />
                  </div>
                )}
                
                {/* Spot ID */}
                <div className={`absolute ${
                  spot.orientation === 'diagonal' ? '-top-3 left-1/2' : '-top-4 left-1/2'
                } transform -translate-x-1/2 text-xs font-bold text-slate-300 bg-slate-700 px-1 rounded ${
                  spot.orientation === 'diagonal' ? 'rotate-30' : ''
                }`}>
                  {spot.id}
                </div>
              </div>
            </div>
          ))}

          {/* Road markings */}
          <div className="absolute top-1/2 left-4 right-4 h-px bg-yellow-400 transform -translate-y-1/2"></div>
          <div className="absolute bottom-1/3 left-4 right-4 h-px bg-yellow-400"></div>
        </div>

        {/* Spot details */}
        <div className="mt-4 grid grid-cols-4 gap-2 text-xs">
          {spots.map((spot) => (
            <div 
              key={spot.id}
              className={`p-2 rounded text-center ${
                spot.isOccupied ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'
              }`}
            >
              <div className="font-bold">{spot.id}</div>
              <div>{spot.isOccupied ? 'Occupied' : 'Free'}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
