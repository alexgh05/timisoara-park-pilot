import { useEffect, useRef, useState } from "react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { MapPin, Car, Navigation, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useParkingSync } from "@/hooks/useParkingSync";

interface ParkingZone {
  id: string;
  name: string;
  street: string;
  number: string;
  city: string;
  country: string;
  totalSpots: number;
  availableSpots: number;
  coordinates?: { lat: number; lng: number };
  color: string;
  description: string;
}

interface APIResponse {
  address: string;
  numberOfSpots: number;
  availablePlaces?: number; // Available places from server
  latitude: number;
  longitude: number;
  type: string;
}

// Function to fetch parking zones from API
const fetchParkingZones = async (): Promise<APIResponse[]> => {
  try {
    const response = await fetch('/api/parking');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Raw API response:', data);
    return data;
  } catch (error) {
    console.error('Failed to fetch parking zones:', error);
    throw error;
  }
};

// Function to parse address and map API data to ParkingZone
const mapAPIDataToParkingZone = (apiData: APIResponse, index: number): ParkingZone => {
  // Parse address - try to extract street number and name
  const addressParts = apiData.address.split(' ');
  let street = '';
  let number = '';
  
  // Look for "Nr" pattern or try to find number at the end
  const nrIndex = addressParts.findIndex(part => part.toLowerCase().includes('nr'));
  if (nrIndex !== -1 && nrIndex + 1 < addressParts.length) {
    street = addressParts.slice(0, nrIndex).join(' ');
    number = addressParts[nrIndex + 1];
  } else {
    // Try to find a number at the end
    const lastPart = addressParts[addressParts.length - 1];
    if (/^\d+$/.test(lastPart)) {
      number = lastPart;
      street = addressParts.slice(0, -1).join(' ');
    } else {
      street = apiData.address;
      number = '1'; // Default number
    }
  }

  // Use actual available places from server, or default to numberOfSpots if not provided
  const availableSpots = apiData.availablePlaces !== undefined ? apiData.availablePlaces : apiData.numberOfSpots;
  
  // Set color based on type and availability
  let color = '#22c55e'; // Default green
  const availabilityPercentage = (availableSpots / apiData.numberOfSpots) * 100;
  
  if (apiData.type === 'red' || availableSpots === 0) {
    color = '#ef4444'; // Red
  } else if (apiData.type === 'yellow' || availabilityPercentage < 30) {
    color = '#f59e0b'; // Yellow/Orange
  } else if (apiData.type === 'green' || availabilityPercentage >= 50) {
    color = '#22c55e'; // Green
  }

  console.log(`Mapping zone ${index + 1}:`, {
    address: apiData.address,
    totalSpots: apiData.numberOfSpots,
    availableSpots: availableSpots,
    type: apiData.type,
    calculatedColor: color
  });

  return {
    id: `api-zone-${index}`,
    name: street, // Use street as name
    street: street,
    number: number,
    city: 'Timișoara', // Default city
    country: 'Romania', // Default country
    totalSpots: apiData.numberOfSpots,
    availableSpots: availableSpots,
    coordinates: {
      lat: apiData.latitude,
      lng: apiData.longitude
    },
    color: color,
    description: `${street} - ${availableSpots}/${apiData.numberOfSpots} spots available`
  };
};

interface ParkingMapProps {
  onZoneSelect: (zoneId: string) => void;
  userLocation?: { lat: number; lng: number } | null;
}

export const ParkingMap = ({ onZoneSelect, userLocation: propUserLocation }: ParkingMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(propUserLocation || null);
  const [zones, setZones] = useState<ParkingZone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const { toast } = useToast();

  // Fetch parking zones from API on component mount
  useEffect(() => {
    const loadParkingZones = async () => {
      try {
        setIsLoading(true);
        const apiData = await fetchParkingZones();
        const mappedZones = apiData.map((zone, index) => mapAPIDataToParkingZone(zone, index));
        setZones(mappedZones);
        setLastUpdate(new Date());
        console.log('Loaded parking zones from API:', mappedZones);
      } catch (error) {
        console.error('Error loading parking zones:', error);
        toast({
          title: "API Error",
          description: "Failed to load parking zones from server. Using fallback data.",
          variant: "destructive"
        });
        
        // Fallback to default zones if API fails
        setZones([
          {
            id: "fallback-1",
            name: "Piața Victoriei",
            street: "Piața Victoriei",
            number: "1",
            city: "Timișoara",
            country: "Romania",
            totalSpots: 120,
            availableSpots: 0,
            coordinates: { lat: 45.7607, lng: 21.2268 },
            color: "#ef4444",
            description: "Central square with premium parking spots"
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    loadParkingZones();
  }, [toast]);

  // Auto-refresh parking data every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return;

    const refreshInterval = setInterval(async () => {
      try {
        console.log('Auto-refreshing parking data...');
        const apiData = await fetchParkingZones();
        const mappedZones = apiData.map((zone, index) => mapAPIDataToParkingZone(zone, index));
        
        // Only update if data has changed to avoid unnecessary re-renders
        const hasChanges = JSON.stringify(mappedZones) !== JSON.stringify(zones);
        if (hasChanges) {
          setZones(mappedZones);
          setLastUpdate(new Date());
          console.log('Parking data updated automatically');
        }
      } catch (error) {
        console.error('Auto-refresh failed:', error);
        // Don't show toast for auto-refresh failures to avoid spam
      }
    }, 30000); // 30 seconds

    return () => clearInterval(refreshInterval);
  }, [autoRefresh, zones]);

  // Manual refresh function
  const handleManualRefresh = async () => {
    try {
      setIsLoading(true);
      const apiData = await fetchParkingZones();
      const mappedZones = apiData.map((zone, index) => mapAPIDataToParkingZone(zone, index));
      setZones(mappedZones);
      setLastUpdate(new Date());
      
      toast({
        title: "Data Refreshed",
        description: `Updated ${mappedZones.length} parking zones`
      });
    } catch (error) {
      console.error('Manual refresh failed:', error);
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh parking data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getAvailabilityColor = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    return percentage < 30 ? '#ef4444' : percentage < 70 ? '#f59e0b' : '#22c55e';
  };

  const getAvailabilityText = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    return percentage < 30 ? 'Low' : percentage < 70 ? 'Medium' : 'High';
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          if (map.current) {
            map.current.flyTo({
              center: [longitude, latitude],
              zoom: 15
            });
          }
          toast({
            title: "Location Found",
            description: "Map centered on your location"
          });
        },
        () => {
          toast({
            title: "Location Error",
            description: "Unable to get your location"
          });
        }
      );
    }
  };

  const openGoogleMapsRoute = (destination: { lat: number; lng: number }, destinationName: string) => {
    if (userLocation) {
      const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${destination.lat},${destination.lng}`;
      window.open(url, '_blank');
      toast({
        title: "Navigation",
        description: `Opened route to ${destinationName} in Google Maps`
      });
    } else {
      const url = `https://www.google.com/maps/search/?api=1&query=${destination.lat},${destination.lng}`;
      window.open(url, '_blank');
      toast({
        title: "Navigation",
        description: `Opened ${destinationName} in Google Maps`
      });
    }
  };

  const openPublicTransportRoute = (destination: { lat: number; lng: number }, destinationName: string) => {
    if (userLocation) {
      const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${destination.lat},${destination.lng}/@${destination.lat},${destination.lng},15z/data=!3m1!4b1!4m2!4m1!3e3`;
      window.open(url, '_blank');
      toast({
        title: "Transport public",
        description: `Deschis transport public către ${destinationName}`
      });
    }
  };

  // Clear existing markers
  const clearMarkers = () => {
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
  };

  // Add markers to map
  const addMarkersToMap = () => {
    if (!map.current || !isMapReady || zones.length === 0) {
      console.log('Cannot add markers:', { 
        hasMap: !!map.current, 
        isMapReady, 
        zonesCount: zones.length 
      });
      return;
    }

    console.log('Adding markers for', zones.length, 'zones');
    
    // Clear existing markers first
    clearMarkers();

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
            ">📍 ${zone.street} ${zone.number}, ${zone.city}, ${zone.country}</p>
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
        .setLngLat([zone.coordinates?.lng || 0, zone.coordinates?.lat || 0])
        .setPopup(popup)
        .addTo(map.current!);

      // Store marker reference
      markersRef.current.push(marker);

      popup.on('open', () => {
        const alternativesButton = document.getElementById(`alternatives-zone-${zone.id}`);
        const routeButton = document.getElementById(`route-zone-${zone.id}`);
        
        if (alternativesButton) {
          alternativesButton.addEventListener('click', () => {
            popup.remove();
            openPublicTransportRoute(zone.coordinates || { lat: 0, lng: 0 }, zone.name);
          });
        }

        if (routeButton) {
          routeButton.addEventListener('click', () => {
            openGoogleMapsRoute(zone.coordinates || { lat: 0, lng: 0 }, zone.name);
            popup.remove();
          });
        }
      });
    });
  };

  // Initialize map
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
      console.log('Map loaded, ready for markers');
      setIsMapReady(true);
    });
  };

  // Effect to update markers when zones change OR map becomes ready
  useEffect(() => {
    addMarkersToMap();
  }, [zones, isMapReady]);

  // Effect to initialize map and get user location
  useEffect(() => {
    if (propUserLocation) {
      setUserLocation(propUserLocation);
    } else {
      getUserLocation();
    }
    initializeMap();
    
    return () => {
      clearMarkers();
      map.current?.remove();
    };
  }, [propUserLocation]);

  // Effect to add user location marker
  useEffect(() => {
    if (userLocation && map.current && isMapReady) {
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
  }, [userLocation, isMapReady]);

  return (
    <div className="relative">
      <Card className="overflow-hidden bg-card/50 backdrop-blur-sm border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Car className="h-5 w-5" />
            <span>Parking Map - Timișoara</span>
            {isLoading && (
              <div className="flex items-center space-x-2 ml-auto">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                <span className="text-xs text-slate-400">Loading API data...</span>
              </div>
            )}
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
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Auto-refresh (30s)</span>
                <Switch 
                  checked={autoRefresh}
                  onCheckedChange={setAutoRefresh}
                />
              </div>
              
              <div className="flex items-center justify-between text-xs text-slate-400">
                {lastUpdate && (
                  <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
                )}
                <Badge variant="outline" className="text-xs">
                  {zones.length} zones loaded
                </Badge>
              </div>
              
              <div className="flex space-x-2">
                <Button onClick={getUserLocation} variant="outline" size="sm" className="flex-1">
                  <MapPin className="h-4 w-4 mr-2" />
                  Location
                </Button>
                <Button onClick={() => map.current?.flyTo({ center: [21.2267, 45.7489], zoom: 13 })} variant="outline" size="sm" className="flex-1">
                  <Navigation className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button 
                  onClick={handleManualRefresh} 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
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
    </div>
  );
};
