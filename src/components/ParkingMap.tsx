
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Car } from "lucide-react";

interface ParkingZone {
  id: string;
  name: string;
  totalSpots: number;
  availableSpots: number;
  coordinates: { lat: number; lng: number };
  color: string;
}

interface ParkingMapProps {
  onZoneSelect: (zoneId: string) => void;
}

export const ParkingMap = ({ onZoneSelect }: ParkingMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [zones] = useState<ParkingZone[]>([
    {
      id: "zone-1",
      name: "Piața Victoriei",
      totalSpots: 120,
      availableSpots: 23,
      coordinates: { lat: 45.7494, lng: 21.2272 },
      color: "#ef4444"
    },
    {
      id: "zone-2", 
      name: "Centrul Vechi",
      totalSpots: 85,
      availableSpots: 42,
      coordinates: { lat: 45.7536, lng: 21.2251 },
      color: "#f59e0b"
    },
    {
      id: "zone-3",
      name: "Bega Shopping Center",
      totalSpots: 300,
      availableSpots: 156,
      coordinates: { lat: 45.7415, lng: 21.2398 },
      color: "#22c55e"
    },
    {
      id: "zone-4",
      name: "Universitate",
      totalSpots: 75,
      availableSpots: 8,
      coordinates: { lat: 45.7472, lng: 21.2081 },
      color: "#ef4444"
    },
    {
      id: "zone-5",
      name: "Iulius Mall",
      totalSpots: 450,
      availableSpots: 267,
      coordinates: { lat: 45.7308, lng: 21.2267 },
      color: "#22c55e"
    }
  ]);

  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  const getAvailabilityColor = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage > 50) return "#22c55e";
    if (percentage > 20) return "#f59e0b";
    return "#ef4444";
  };

  const getAvailabilityText = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage > 50) return "Good";
    if (percentage > 20) return "Limited";
    return "Full";
  };

  return (
    <Card className="h-[600px] bg-card/50 backdrop-blur-sm border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="h-5 w-5" />
          <span>Parking Zones - Timișoara</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-full bg-slate-800 rounded-lg overflow-hidden">
          {/* Map Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-800">
            <div className="absolute inset-0 opacity-20">
              <svg width="100%" height="100%">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#475569" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
          </div>

          {/* Parking Zones */}
          <div className="absolute inset-0 p-4">
            {zones.map((zone, index) => (
              <div
                key={zone.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-110 ${
                  selectedZone === zone.id ? 'scale-110 z-10' : ''
                }`}
                style={{
                  left: `${20 + (index * 15)}%`,
                  top: `${25 + (index * 10)}%`,
                }}
                onClick={() => {
                  setSelectedZone(zone.id);
                  onZoneSelect(zone.id);
                }}
              >
                <div className="relative">
                  {/* Zone Circle */}
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg border-4 border-white/20"
                    style={{ backgroundColor: getAvailabilityColor(zone.availableSpots, zone.totalSpots) }}
                  >
                    {zone.availableSpots}
                  </div>
                  
                  {/* Zone Info */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-card/90 backdrop-blur-sm rounded-lg p-3 min-w-max shadow-xl border">
                    <h3 className="font-semibold text-sm mb-1">{zone.name}</h3>
                    <div className="flex items-center space-x-2 text-xs">
                      <Car className="h-3 w-3" />
                      <span>{zone.availableSpots}/{zone.totalSpots}</span>
                      <Badge
                        variant="outline"
                        className="text-xs"
                        style={{
                          color: getAvailabilityColor(zone.availableSpots, zone.totalSpots),
                          borderColor: getAvailabilityColor(zone.availableSpots, zone.totalSpots)
                        }}
                      >
                        {getAvailabilityText(zone.availableSpots, zone.totalSpots)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 border">
            <h4 className="font-semibold text-sm mb-2">Availability</h4>
            <div className="space-y-1 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Good (50%+)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>Limited (20-50%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>Full (0-20%)</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
