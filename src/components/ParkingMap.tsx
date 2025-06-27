
import { useEffect, useRef, useState } from "react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Car, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ParkingZone {
  id: string;
  name: string;
  address: string;
  totalSpots: number;
  availableSpots: number;
  coordinates: { lat: number; lng: number };
  color: string;
  description: string;
}

interface ParkingMapProps {
  onZoneSelect: (zoneId: string) => void;
}

export const ParkingMap = ({ onZoneSelect }: ParkingMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [showTokenInput, setShowTokenInput] = useState(true);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const { toast } = useToast();

  const [zones] = useState<ParkingZone[]>([
    {
      id: "zone-1",
      name: "Piața Victoriei",
      address: "Piața Victoriei, Timișoara, Romania",
      totalSpots: 120,
      availableSpots: 23,
      coordinates: { lat: 45.7494, lng: 21.2272 },
      color: "#ef4444",
      description: "Central square with premium parking spots"
    },
    {
      id: "zone-2", 
      name: "Centrul Vechi",
      address: "Piața Unirii, Timișoara, Romania",
      totalSpots: 85,
      availableSpots: 42,
      coordinates: { lat: 45.7536, lng: 21.2251 },
      color: "#f59e0b",
      description: "Historic center with limited access"
    },
    {
      id: "zone-3",
      name: "Bega Shopping Center",
      address: "Piața Consiliul Europei 2, Timișoara, Romania",
      totalSpots: 300,
      availableSpots: 156,
      coordinates: { lat: 45.7415, lng: 21.2398 },
      color: "#22c55e",
      description: "Large shopping center parking facility"
    },
    {
      id: "zone-4",
      name: "Universitate",
      address: "Bulevardul Vasile Pârvan 4, Timișoara, Romania",
      totalSpots: 75,
      availableSpots: 8,
      coordinates: { lat: 45.7472, lng: 21.2081 },
      color: "#ef4444",
      description: "University area with student parking"
    },
    {
      id: "zone-5",
      name: "Iulius Mall",
      address: "Strada Alexandru Odobescu 2, Timișoara, Romania",
      totalSpots: 450,
      availableSpots: 267,
      coordinates: { lat: 45.7308, lng: 21.2267 },
      color: "#22c55e",
      description: "Premium mall with multi-level parking"
    }
  ]);

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

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [21.2267, 45.7489], // Timișoara center
      zoom: 13,
      pitch: 45,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      // Add markers for each parking zone
      zones.forEach((zone) => {
        // Create custom marker element
        const markerElement = document.createElement('div');
        markerElement.className = 'parking-marker';
        markerElement.style.cssText = `
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: ${getAvailabilityColor(zone.availableSpots, zone.totalSpots)};
          border: 3px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: white;
          cursor: pointer;
          font-size: 12px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
          transition: transform 0.2s;
        `;
        markerElement.textContent = zone.availableSpots.toString();
        
        markerElement.addEventListener('mouseenter', () => {
          markerElement.style.transform = 'scale(1.2)';
        });
        
        markerElement.addEventListener('mouseleave', () => {
          markerElement.style.transform = 'scale(1)';
        });

        // Create popup content
        const popupContent = `
          <div class="p-3 min-w-[250px]">
            <h3 class="font-bold text-lg mb-2">${zone.name}</h3>
            <p class="text-sm text-gray-600 mb-2">${zone.address}</p>
            <p class="text-sm mb-3">${zone.description}</p>
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm">Available:</span>
              <span class="font-bold">${zone.availableSpots}/${zone.totalSpots}</span>
            </div>
            <div class="flex items-center justify-between mb-3">
              <span class="text-sm">Status:</span>
              <span class="px-2 py-1 rounded text-xs font-medium" style="background-color: ${getAvailabilityColor(zone.availableSpots, zone.totalSpots)}; color: white;">
                ${getAvailabilityText(zone.availableSpots, zone.totalSpots)}
              </span>
            </div>
            <button id="select-zone-${zone.id}" class="w-full bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition-colors text-sm">
              Select This Zone
            </button>
          </div>
        `;

        const popup = new mapboxgl.Popup({
          offset: 25,
          closeButton: true,
          closeOnClick: false
        }).setHTML(popupContent);

        const marker = new mapboxgl.Marker(markerElement)
          .setLngLat([zone.coordinates.lng, zone.coordinates.lat])
          .setPopup(popup)
          .addTo(map.current!);

        // Add click handler for zone selection
        popup.on('open', () => {
          const selectButton = document.getElementById(`select-zone-${zone.id}`);
          if (selectButton) {
            selectButton.addEventListener('click', () => {
              setSelectedZone(zone.id);
              onZoneSelect(zone.id);
              popup.remove();
              toast({
                title: "Zone Selected",
                description: `Selected ${zone.name} for detailed view`
              });
            });
          }
        });
      });
    });
  };

  const handleTokenSubmit = () => {
    if (!mapboxToken.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid Mapbox token",
        variant: "destructive"
      });
      return;
    }
    
    setShowTokenInput(false);
    toast({
      title: "Map Loading",
      description: "Initializing Timișoara parking map..."
    });
    
    setTimeout(() => {
      initializeMap();
    }, 100);
  };

  useEffect(() => {
    return () => {
      map.current?.remove();
    };
  }, []);

  if (showTokenInput) {
    return (
      <Card className="h-[600px] bg-card/50 backdrop-blur-sm border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Timișoara Parking Map</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-full space-y-4">
          <AlertTriangle className="h-12 w-12 text-yellow-500" />
          <div className="text-center max-w-md">
            <h3 className="text-lg font-semibold mb-2">Mapbox Token Required</h3>
            <p className="text-sm text-slate-400 mb-4">
              To display the interactive map of Timișoara with real parking data, please enter your Mapbox public token.
            </p>
            <p className="text-xs text-slate-500 mb-4">
              Get your free token at: <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">mapbox.com</a>
            </p>
          </div>
          <div className="w-full max-w-md space-y-3">
            <Input
              type="text"
              placeholder="Enter your Mapbox public token"
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              className="w-full"
            />
            <Button onClick={handleTokenSubmit} className="w-full">
              Load Map
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[600px] bg-card/50 backdrop-blur-sm border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="h-5 w-5" />
          <span>Timișoara Parking Zones</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-full rounded-lg overflow-hidden">
          <div 
            ref={mapContainer} 
            className="absolute inset-0 w-full h-full"
            style={{ minHeight: '500px' }}
          />
          
          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 border z-10">
            <h4 className="font-semibold text-sm mb-2">Legend</h4>
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
            <div className="mt-2 pt-2 border-t text-xs text-slate-400">
              Click bubbles for details
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
