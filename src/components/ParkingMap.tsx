import { useEffect, useRef, useState } from "react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Car, Navigation } from "lucide-react";
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
  userLocation?: { lat: number; lng: number } | null;
}

export const ParkingMap = ({ onZoneSelect, userLocation: propUserLocation }: ParkingMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(propUserLocation || null);
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
          setUserLocation({ lat: 45.7489, lng: 21.2267 });
        }
      );
    } else {
      setUserLocation({ lat: 45.7489, lng: 21.2267 });
    }
  };

  const openGoogleMapsRoute = (destination: { lat: number; lng: number }, destinationName: string) => {
    if (userLocation) {
      // Formatează coordonatele cu 6 zecimale pentru a evita notația științifică
      const userLat = userLocation.lat.toFixed(6);
      const userLng = userLocation.lng.toFixed(6);
      const destLat = destination.lat.toFixed(6);
      const destLng = destination.lng.toFixed(6);
      const url = `https://www.google.com/maps/dir/${userLat},${userLng}/${destLat},${destLng}`;
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

  const openPublicTransportRoute = (destination: { lat: number; lng: number }, destinationName: string) => {
    // Verifică dacă utilizatorul a acceptat locația
    const locationConsent = localStorage.getItem('location-consent');
    
    if (locationConsent === 'accepted' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Folosește locația reală pentru navigare cu transport public
          // Formatează coordonatele cu 6 zecimale pentru a evita notația științifică
          const userLat = position.coords.latitude.toFixed(6);
          const userLng = position.coords.longitude.toFixed(6);
          const destLat = destination.lat.toFixed(6);
          const destLng = destination.lng.toFixed(6);
          const url = `https://www.google.com/maps/dir/${userLat},${userLng}/${destLat},${destLng}/data=!3m1!4b1!4m2!4m1!3e3`;
          window.open(url, '_blank');
          toast({
            title: "Transport public",
            description: `Deschis transport public către ${destinationName} în Google Maps`
          });
        },
        () => {
          // Fallback la căutare cu transport public dacă nu poate obține locația
          const url = `https://www.google.com/maps/search/${encodeURIComponent(destinationName + " Timișoara")}/data=!3m1!4b1!4m2!4m1!3e3`;
          window.open(url, '_blank');
          toast({
            title: "Transport public",
            description: `Deschis transport public către ${destinationName}`
          });
        }
      );
    } else if (userLocation) {
      // Folosește locația din props dacă este disponibilă
      // Formatează coordonatele cu 6 zecimale pentru a evita notația științifică
      const userLat = userLocation.lat.toFixed(6);
      const userLng = userLocation.lng.toFixed(6);
      const destLat = destination.lat.toFixed(6);
      const destLng = destination.lng.toFixed(6);
      const url = `https://www.google.com/maps/dir/${userLat},${userLng}/${destLat},${destLng}/data=!3m1!4b1!4m2!4m1!3e3`;
      window.open(url, '_blank');
      toast({
        title: "Transport public",
        description: `Deschis transport public către ${destinationName} în Google Maps`
      });
    } else {
      // Fallback la căutare cu transport public
      const url = `https://www.google.com/maps/search/${encodeURIComponent(destinationName + " Timișoara")}/data=!3m1!4b1!4m2!4m1!3e3`;
      window.open(url, '_blank');
      toast({
        title: "Transport public",
        description: `Deschis transport public către ${destinationName}`
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
      center: [21.2267, 45.7489],
      zoom: 13,
      pitch: 45,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      if (!map.current || !userLocation) return;

      // Store markers for zoom-based scaling
      const markers: { marker: mapboxgl.Marker; element: HTMLDivElement; zone: ParkingZone }[] = [];

      // Add parking zone markers
      zones.forEach((zone) => {
        const isFullOrAlmostFull = zone.availableSpots === 0 || (zone.availableSpots / zone.totalSpots) < 0.1;

        const markerElement = document.createElement('div');
        markerElement.className = 'parking-marker';
        markerElement.style.cssText = `
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: ${zone.color};
          border: 3px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
          font-weight: bold;
          font-size: 12px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
          position: relative;
          transition: all 0.3s ease;
        `;
        markerElement.textContent = zone.availableSpots.toString();

        // Modern popup content with better styling
        const popupContent = `
          <div style="
            background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
            border: 1px solid #475569;
            border-radius: 12px;
            padding: 20px;
            min-width: 300px;
            max-width: 350px;
            color: white;
            font-family: system-ui, -apple-system, sans-serif;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4);
          ">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
              <h3 style="
                font-size: 18px; 
                font-weight: 700; 
                margin: 0;
                color: #f1f5f9;
              ">${zone.name}</h3>
              <div style="
                background-color: ${getAvailabilityColor(zone.availableSpots, zone.totalSpots)};
                color: white;
                padding: 4px 8px;
                border-radius: 6px;
                font-size: 12px;
                font-weight: 600;
              ">
                ${getAvailabilityText(zone.availableSpots, zone.totalSpots)}
              </div>
            </div>
            
            <div style="margin-bottom: 16px;">
              <p style="
                color: #94a3b8; 
                font-size: 14px; 
                margin: 0 0 8px 0;
                line-height: 1.4;
              ">📍 ${zone.address}</p>
              <p style="
                color: #cbd5e1; 
                font-size: 13px; 
                margin: 0;
                line-height: 1.4;
              ">${zone.description}</p>
            </div>
            
            <div style="
              background: rgba(0,0,0,0.2);
              border-radius: 8px;
              padding: 12px;
              margin-bottom: 16px;
            ">
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #94a3b8; font-size: 14px;">Disponibile:</span>
                <span style="color: #f1f5f9; font-weight: 600; font-size: 16px;">
                  ${zone.availableSpots}/${zone.totalSpots}
                </span>
              </div>
              <div style="
                width: 100%;
                height: 4px;
                background: rgba(255,255,255,0.1);
                border-radius: 2px;
                overflow: hidden;
              ">
                <div style="
                  width: ${(zone.availableSpots / zone.totalSpots) * 100}%;
                  height: 100%;
                  background: ${getAvailabilityColor(zone.availableSpots, zone.totalSpots)};
                  transition: width 0.3s ease;
                "></div>
              </div>
            </div>
            
            ${isFullOrAlmostFull ? `
              <div style="
                background: rgba(239, 68, 68, 0.1);
                border: 1px solid rgba(239, 68, 68, 0.3);
                border-radius: 8px;
                padding: 12px;
                margin-bottom: 16px;
              ">
                <p style="
                  color: #fca5a5;
                  font-size: 12px;
                  margin: 0;
                  font-weight: 500;
                ">⚠️ Parcare plină - Verifică alternative în sidebar</p>
              </div>
            ` : ''}
            
            <div style="display: flex; gap: 8px;">
              <button id="alternatives-zone-${zone.id}" style="
                flex: 1;
                background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                color: white;
                border: none;
                padding: 12px 16px;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
              " onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 8px rgba(59, 130, 246, 0.4)';" 
                 onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(59, 130, 246, 0.3)';">
                👁️ Vezi alternative
              </button>
              <button id="route-zone-${zone.id}" style="
                flex: 1;
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
                border: none;
                padding: 12px 16px;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
              " onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 8px rgba(16, 185, 129, 0.4)';" 
                 onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(16, 185, 129, 0.3)';">
                🗺️ Navigare
              </button>
            </div>
          </div>
        `;

        const popup = new mapboxgl.Popup({
          offset: [15, 0],
          closeButton: true,
          closeOnClick: false,
          className: 'modern-parking-popup',
          anchor: 'left',
          maxWidth: '320px'
        }).setHTML(popupContent);

        const marker = new mapboxgl.Marker(markerElement)
          .setLngLat([zone.coordinates.lng, zone.coordinates.lat])
          .setPopup(popup)
          .addTo(map.current!);

        // Store marker reference for zoom handling
        markers.push({ marker, element: markerElement, zone });

        popup.on('open', () => {
          const alternativesButton = document.getElementById(`alternatives-zone-${zone.id}`);
          const routeButton = document.getElementById(`route-zone-${zone.id}`);
          
          if (alternativesButton) {
            alternativesButton.addEventListener('click', () => {
              popup.remove();
              openPublicTransportRoute(zone.coordinates, zone.name);
            });
          }

          if (routeButton) {
            routeButton.addEventListener('click', () => {
              openGoogleMapsRoute(zone.coordinates, zone.name);
              popup.remove();
            });
          }
        });
      });

      // Function to update marker size based on zoom level
      const updateMarkersForZoom = () => {
        const currentZoom = map.current?.getZoom() || 13;
        
        markers.forEach(({ element, marker }) => {
          // Hide markers when zoom is too low (below 11)
          if (currentZoom < 11) {
            element.style.display = 'none';
            return;
          }
          
          // Show markers and scale them based on zoom
          element.style.display = 'flex';
          
          // Calculate scale factor (zoom 13 = normal size, zoom 11 = 50%, zoom 15+ = 120%)
          let scaleFactor = 1;
          if (currentZoom < 13) {
            scaleFactor = 0.5 + ((currentZoom - 11) / 2) * 0.5; // 0.5 to 1.0
          } else if (currentZoom > 15) {
            scaleFactor = 1.2; // Max scale at high zoom
          } else {
            scaleFactor = 1 + ((currentZoom - 13) / 2) * 0.2; // 1.0 to 1.2
          }
          
          // Apply scaling
          const baseSize = 40;
          const newSize = Math.round(baseSize * scaleFactor);
          const fontSize = Math.round(12 * scaleFactor);
          const borderWidth = Math.round(3 * scaleFactor);
          
          element.style.width = `${newSize}px`;
          element.style.height = `${newSize}px`;
          element.style.fontSize = `${fontSize}px`;
          element.style.borderWidth = `${borderWidth}px`;
        });
      };

      // Listen for zoom changes
      map.current.on('zoom', updateMarkersForZoom);
      map.current.on('zoomend', updateMarkersForZoom);
      
      // Initial marker sizing
      updateMarkersForZoom();
    });
  };

  useEffect(() => {
    if (propUserLocation) {
      setUserLocation(propUserLocation);
    } else {
      getUserLocation();
    }
    initializeMap();
    
    return () => {
      map.current?.remove();
    };
  }, [propUserLocation]);

  useEffect(() => {
    if (userLocation && map.current) {
      const userMarker = document.createElement('div');
      userMarker.style.cssText = `
        width: 15px;
        height: 15px;
        border-radius: 50%;
        background-color: #3b82f6;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      `;

      new mapboxgl.Marker(userMarker)
        .setLngLat([userLocation.lng, userLocation.lat])
        .addTo(map.current);
    }
  }, [userLocation]);

  return (
    <Card className="overflow-hidden bg-card/50 backdrop-blur-sm border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Car className="h-5 w-5" />
          <span>Parking Map - Timișoara</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div ref={mapContainer} className="h-[500px] w-full rounded-lg overflow-hidden" />
        
        <div className="p-4 space-y-4">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span className="text-slate-300">Full/Limited</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-amber-500"></div>
              <span className="text-slate-300">Medium</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="text-slate-300">Available</span>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button onClick={getUserLocation} variant="outline" size="sm" className="flex-1">
              <MapPin className="h-4 w-4 mr-2" />
              Update Location
            </Button>
            <Button onClick={() => map.current?.flyTo({ center: [21.2267, 45.7489], zoom: 13 })} variant="outline" size="sm" className="flex-1">
              <Navigation className="h-4 w-4 mr-2" />
              Reset View
            </Button>
          </div>
          
          {selectedZone && (
            <div className="p-3 bg-slate-800/50 rounded-lg">
              <h3 className="font-medium text-white mb-1">Selected Zone</h3>
              <p className="text-sm text-slate-300">
                {zones.find(z => z.id === selectedZone)?.name}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
