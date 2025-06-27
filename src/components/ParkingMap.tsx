
import { useEffect, useRef, useState } from "react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Car, Bus, Bike, Navigation } from "lucide-react";
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

interface PublicTransport {
  id: string;
  type: 'bus' | 'tram';
  line: string;
  stop: string;
  coordinates: { lat: number; lng: number };
  nextArrival: string;
}

interface BikeStation {
  id: string;
  name: string;
  coordinates: { lat: number; lng: number };
  availableBikes: number;
  totalSpots: number;
}

interface ParkingMapProps {
  onZoneSelect: (zoneId: string) => void;
}

export const ParkingMap = ({ onZoneSelect }: ParkingMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const { toast } = useToast();

  const [zones] = useState<ParkingZone[]>([
    {
      id: "zone-1",
      name: "Piața Victoriei",
      address: "Piața Victoriei, Timișoara, Romania",
      totalSpots: 120,
      availableSpots: 0, // Full parking
      coordinates: { lat: 45.7494, lng: 21.2272 },
      color: "#ef4444",
      description: "Central square with premium parking spots"
    },
    {
      id: "zone-2", 
      name: "Centrul Vechi",
      address: "Piața Unirii, Timișoara, Romania",
      totalSpots: 85,
      availableSpots: 2, // Almost full
      coordinates: { lat: 45.7536, lng: 21.2251 },
      color: "#ef4444",
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
      availableSpots: 0, // Full parking
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

  const [publicTransport] = useState<PublicTransport[]>([
    {
      id: "bus-1",
      type: "bus",
      line: "Line 11",
      stop: "Piața Victoriei",
      coordinates: { lat: 45.7498, lng: 21.2275 },
      nextArrival: "3 min"
    },
    {
      id: "tram-1",
      type: "tram",
      line: "Line 1",
      stop: "Catedrala",
      coordinates: { lat: 45.7540, lng: 21.2255 },
      nextArrival: "7 min"
    },
    {
      id: "bus-2",
      type: "bus",
      line: "Line 14",
      stop: "Universitate",
      coordinates: { lat: 45.7475, lng: 21.2085 },
      nextArrival: "5 min"
    }
  ]);

  const [bikeStations] = useState<BikeStation[]>([
    {
      id: "bike-1",
      name: "Piața Victoriei Bikes",
      coordinates: { lat: 45.7490, lng: 21.2270 },
      availableBikes: 8,
      totalSpots: 15
    },
    {
      id: "bike-2",
      name: "Centrul Vechi Bikes",
      coordinates: { lat: 45.7540, lng: 21.2248 },
      availableBikes: 3,
      totalSpots: 12
    },
    {
      id: "bike-3",
      name: "Universitate Bikes",
      coordinates: { lat: 45.7470, lng: 21.2078 },
      availableBikes: 12,
      totalSpots: 20
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

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log("Location access denied, using default location");
          setUserLocation({ lat: 45.7489, lng: 21.2267 }); // Default to Timișoara center
        }
      );
    } else {
      setUserLocation({ lat: 45.7489, lng: 21.2267 }); // Default to Timișoara center
    }
  };

  const openGoogleMapsRoute = (destination: { lat: number; lng: number }, destinationName: string) => {
    if (userLocation) {
      const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${destination.lat},${destination.lng}`;
      window.open(url, '_blank');
      toast({
        title: "Route Opened",
        description: `Opening route to ${destinationName} in Google Maps`
      });
    } else {
      toast({
        title: "Location Required",
        description: "Please enable location access for routing",
        variant: "destructive"
      });
    }
  };

  const initializeMap = () => {
    if (!mapContainer.current) return;

    const mapboxToken = 'pk.eyJ1IjoiZ2hpbGUxOSIsImEiOiJjbWNlenJsMTkwM3RmMmtxdWJ5aGxhM3poIn0.OUbxCpLdIw2fQn0UN16XdA';
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
      // Add user location if available
      if (userLocation) {
        const userMarker = document.createElement('div');
        userMarker.className = 'user-marker';
        userMarker.style.cssText = `
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: #3b82f6;
          border: 3px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          position: relative;
        `;
        
        new mapboxgl.Marker(userMarker)
          .setLngLat([userLocation.lng, userLocation.lat])
          .addTo(map.current!);
      }

      // Add parking zone markers
      zones.forEach((zone) => {
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

        const isFullOrAlmostFull = zone.availableSpots <= 2;
        
        const popupContent = `
          <div class="p-3 min-w-[280px]">
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
            ${isFullOrAlmostFull ? `
              <div class="mb-3 p-2 bg-red-50 border border-red-200 rounded">
                <p class="text-xs text-red-700 font-medium">⚠️ Parking Full - Alternatives Available</p>
              </div>
            ` : ''}
            <div class="space-y-2">
              <button id="select-zone-${zone.id}" class="w-full bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition-colors text-sm">
                ${zone.availableSpots > 0 ? 'Select This Zone' : 'View Alternatives'}
              </button>
              <button id="route-zone-${zone.id}" class="w-full bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 transition-colors text-sm">
                🗺️ Route to Parking
              </button>
              ${isFullOrAlmostFull ? `
                <button id="transport-${zone.id}" class="w-full bg-purple-600 text-white px-3 py-2 rounded hover:bg-purple-700 transition-colors text-sm">
                  🚌 Public Transport
                </button>
                <button id="bikes-${zone.id}" class="w-full bg-orange-600 text-white px-3 py-2 rounded hover:bg-orange-700 transition-colors text-sm">
                  🚲 Bike Stations
                </button>
              ` : ''}
            </div>
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

        popup.on('open', () => {
          const selectButton = document.getElementById(`select-zone-${zone.id}`);
          const routeButton = document.getElementById(`route-zone-${zone.id}`);
          const transportButton = document.getElementById(`transport-${zone.id}`);
          const bikesButton = document.getElementById(`bikes-${zone.id}`);
          
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

          if (routeButton) {
            routeButton.addEventListener('click', () => {
              openGoogleMapsRoute(zone.coordinates, zone.name);
              popup.remove();
            });
          }

          if (transportButton) {
            transportButton.addEventListener('click', () => {
              showPublicTransportOptions(zone);
              popup.remove();
            });
          }

          if (bikesButton) {
            bikesButton.addEventListener('click', () => {
              showBikeStations(zone);
              popup.remove();
            });
          }
        });
      });

      // Add public transport markers
      publicTransport.forEach((transport) => {
        const transportMarker = document.createElement('div');
        transportMarker.className = 'transport-marker';
        transportMarker.style.cssText = `
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background-color: ${transport.type === 'bus' ? '#8b5cf6' : '#06b6d4'};
          border: 2px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
          font-size: 14px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        `;
        transportMarker.textContent = transport.type === 'bus' ? '🚌' : '🚋';

        const transportPopup = new mapboxgl.Popup({ offset: 15 })
          .setHTML(`
            <div class="p-2">
              <h3 class="font-bold">${transport.line}</h3>
              <p class="text-sm">Stop: ${transport.stop}</p>
              <p class="text-sm">Next: ${transport.nextArrival}</p>
            </div>
          `);

        new mapboxgl.Marker(transportMarker)
          .setLngLat([transport.coordinates.lng, transport.coordinates.lat])
          .setPopup(transportPopup)
          .addTo(map.current!);
      });

      // Add bike station markers
      bikeStations.forEach((station) => {
        const bikeMarker = document.createElement('div');
        bikeMarker.className = 'bike-marker';
        bikeMarker.style.cssText = `
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background-color: #f97316;
          border: 2px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
          font-size: 14px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        `;
        bikeMarker.textContent = '🚲';

        const bikePopup = new mapboxgl.Popup({ offset: 15 })
          .setHTML(`
            <div class="p-2">
              <h3 class="font-bold text-sm">${station.name}</h3>
              <p class="text-sm">Available: ${station.availableBikes}/${station.totalSpots}</p>
              <button onclick="window.open('https://www.google.com/maps/dir/${userLocation?.lat},${userLocation?.lng}/${station.coordinates.lat},${station.coordinates.lng}', '_blank')" class="mt-1 text-xs bg-blue-500 text-white px-2 py-1 rounded">
                Route Here
              </button>
            </div>
          `);

        new mapboxgl.Marker(bikeMarker)
          .setLngLat([station.coordinates.lng, station.coordinates.lat])
          .setPopup(bikePopup)
          .addTo(map.current!);
      });
    });
  };

  const showPublicTransportOptions = (zone: ParkingZone) => {
    const nearbyTransport = publicTransport.filter(transport => {
      // Simple distance calculation to find nearby transport
      const distance = Math.sqrt(
        Math.pow(transport.coordinates.lat - zone.coordinates.lat, 2) +
        Math.pow(transport.coordinates.lng - zone.coordinates.lng, 2)
      );
      return distance < 0.01; // Roughly 1km
    });

    toast({
      title: "Public Transport Options",
      description: `Found ${nearbyTransport.length} nearby stops. Check the purple/cyan markers on the map.`
    });
  };

  const showBikeStations = (zone: ParkingZone) => {
    const nearbyBikes = bikeStations.filter(station => {
      const distance = Math.sqrt(
        Math.pow(station.coordinates.lat - zone.coordinates.lat, 2) +
        Math.pow(station.coordinates.lng - zone.coordinates.lng, 2)
      );
      return distance < 0.015; // Roughly 1.5km
    });

    toast({
      title: "Bike Stations",
      description: `Found ${nearbyBikes.length} bike stations nearby. Check the orange markers on the map.`
    });
  };

  useEffect(() => {
    getUserLocation();
    initializeMap();
    
    return () => {
      map.current?.remove();
    };
  }, []);

  return (
    <Card className="h-[600px] bg-card/50 backdrop-blur-sm border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="h-5 w-5" />
          <span>Timișoara Smart Parking & Transport</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-full rounded-lg overflow-hidden">
          <div 
            ref={mapContainer} 
            className="absolute inset-0 w-full h-full"
            style={{ minHeight: '500px' }}
          />
          
          {/* Enhanced Legend */}
          <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 border z-10">
            <h4 className="font-semibold text-sm mb-2">Legend</h4>
            <div className="space-y-1 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Parking Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>Limited Parking</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>Parking Full</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span>🚌 Bus Stops</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                <span>🚋 Tram Stops</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span>🚲 Bike Stations</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span>📍 Your Location</span>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t text-xs text-slate-400">
              Click bubbles for options & routing
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
