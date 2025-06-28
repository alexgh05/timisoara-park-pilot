import { useEffect, useRef, useState } from "react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCcw, Clock, Car, MapPin, Navigation, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

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
  availablePlaces?: number;
  latitude: number;
  longitude: number;
  type: string;
}

// Function to fetch parking zones from API (same as ParkingMap)
const fetchParkingZones = async (): Promise<APIResponse[]> => {
  try {
    const response = await fetch('/api/parking');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Heatmap: Raw API response:', data);
    return data;
  } catch (error) {
    console.error('Failed to fetch parking zones:', error);
    throw error;
  }
};

// Function to parse address and map API data to ParkingZone (same as ParkingMap)
const mapAPIDataToParkingZone = (apiData: APIResponse, index: number): ParkingZone => {
  const addressParts = apiData.address.split(' ');
  let street = '';
  let number = '';
  
  const nrIndex = addressParts.findIndex(part => part.toLowerCase().includes('nr'));
  if (nrIndex !== -1 && nrIndex + 1 < addressParts.length) {
    street = addressParts.slice(0, nrIndex).join(' ');
    number = addressParts[nrIndex + 1];
  } else {
    const lastPart = addressParts[addressParts.length - 1];
    if (/^\d+$/.test(lastPart)) {
      number = lastPart;
      street = addressParts.slice(0, -1).join(' ');
    } else {
      street = apiData.address;
      number = '1';
    }
  }

  const availableSpots = apiData.availablePlaces !== undefined ? apiData.availablePlaces : apiData.numberOfSpots;
  
  let color = '#22c55e';
  const availabilityPercentage = (availableSpots / apiData.numberOfSpots) * 100;
  
  if (apiData.type === 'red' || availableSpots === 0) {
    color = '#ef4444';
  } else if (apiData.type === 'yellow' || availabilityPercentage < 30) {
    color = '#f59e0b';
  } else if (apiData.type === 'green' || availabilityPercentage >= 50) {
    color = '#22c55e';
  }

  const mappedZone = {
    id: `api-zone-${index}`,
    name: street,
    street: street,
    number: number,
    city: 'Timișoara',
    country: 'Romania',
    totalSpots: apiData.numberOfSpots,
    availableSpots: availableSpots,
    coordinates: {
      lat: apiData.latitude,
      lng: apiData.longitude
    },
    color: color,
    description: `${street} - ${availableSpots}/${apiData.numberOfSpots} spots available`
  };

  // Debug log for first few zones
  if (index < 3) {
    console.log(`ParkingHeatmap: Mapping zone ${index}:`, {
      address: apiData.address,
      apiLat: apiData.latitude,
      apiLng: apiData.longitude,
      mappedCoords: mappedZone.coordinates
    });
  }

  return mappedZone;
};

// Function to generate realistic traffic patterns for each zone
const generateTrafficPattern = (zoneName: string, address: string): number[] => {
  const hourlyIntensity = new Array(24).fill(30);
  
  const addressLower = address.toLowerCase();
  const nameLower = zoneName.toLowerCase();
  
  const isMall = addressLower.includes('mall') || addressLower.includes('shopping') || 
                nameLower.includes('mall') || addressLower.includes('iulius');
  const isCenter = addressLower.includes('centru') || addressLower.includes('central') || 
                  addressLower.includes('piața') || addressLower.includes('victoriei');
  const isUniversity = addressLower.includes('universit') || addressLower.includes('campus');
  const isHospital = addressLower.includes('spital') || addressLower.includes('medical');
  const isResidential = addressLower.includes('rezidential') || addressLower.includes('cartier');
  const isBusinessDistrict = addressLower.includes('business') || addressLower.includes('office');
  
  for (let hour = 0; hour < 24; hour++) {
    let intensity = 30;
    
    if (hour >= 7 && hour <= 9) {
      if (isCenter || isBusinessDistrict) intensity = 85;
      else if (isUniversity) intensity = 75;
      else if (isHospital) intensity = 65;
      else if (isMall) intensity = 35;
      else intensity = 40;
    }
    else if (hour >= 9 && hour <= 17) {
      if (isCenter || isBusinessDistrict) intensity = 75;
      else if (isHospital) intensity = 70;
      else if (isUniversity) intensity = 65;
      else if (isMall) intensity = 55;
      else intensity = 25;
    }
    else if (hour >= 17 && hour <= 19) {
      if (isMall) intensity = 90;
      else if (isCenter) intensity = 80;
      else if (isResidential) intensity = 70;
      else if (isBusinessDistrict) intensity = 60;
      else intensity = 45;
    }
    else if (hour >= 19 && hour <= 23) {
      if (isMall) intensity = 75;
      else if (isCenter) intensity = 65;
      else if (isResidential) intensity = 80;
      else intensity = 35;
    }
    else {
      if (isHospital) intensity = 40;
      else if (isResidential) intensity = 60;
      else intensity = 15;
    }
    
    intensity = Math.max(10, Math.min(95, intensity + (Math.random() - 0.5) * 15));
    hourlyIntensity[hour] = Math.round(intensity);
  }
  
  return hourlyIntensity;
};

interface ParkingHeatmapProps {
  userLocation?: { lat: number; lng: number } | null;
}

export const ParkingHeatmap = ({ userLocation: propUserLocation }: ParkingHeatmapProps) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [isPlaying, setIsPlaying] = useState(false);
  const [zones, setZones] = useState<ParkingZone[]>([]);
  const [zonePatterns, setZonePatterns] = useState<Record<string, number[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isMapReady, setIsMapReady] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(propUserLocation || null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Fetch parking zones from API (exact same as ParkingMap)
  useEffect(() => {
    console.log('ParkingHeatmap: Component mounted, starting data load...');
    const loadParkingZones = async () => {
      try {
        setIsLoading(true);
        console.log('ParkingHeatmap: Fetching parking zones from:', `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/parking`);
        const apiData = await fetchParkingZones();
        console.log('ParkingHeatmap: API returned', apiData.length, 'zones');
        console.log('ParkingHeatmap: Raw API data sample:', apiData.slice(0, 2));
        const mappedZones = apiData.map((zone, index) => mapAPIDataToParkingZone(zone, index));
        console.log('ParkingHeatmap: Mapped zones sample:', mappedZones.slice(0, 2));
        console.log('ParkingHeatmap: All zone coordinates:', mappedZones.map(z => ({ name: z.name, coords: z.coordinates })));
        setZones(mappedZones);
        setLastUpdate(new Date());
        
        // Generate traffic patterns for each zone
        const patterns: Record<string, number[]> = {};
        mappedZones.forEach(zone => {
          patterns[zone.id] = generateTrafficPattern(zone.name, zone.street);
        });
        setZonePatterns(patterns);
        
        console.log('Heatmap: Successfully loaded', mappedZones.length, 'zones with traffic patterns');
        console.log('First zone example:', mappedZones[0]);
        console.log('Patterns:', patterns);
      } catch (error) {
        console.error('ParkingHeatmap: Error loading parking zones:', error);
        toast({
          title: language === 'ro' ? 'Eroare API' : 'API Error',
          description: language === 'ro' 
            ? 'Nu s-au putut încărca zonele de parcare'
            : 'Failed to load parking zones from server',
          variant: "destructive"
        });
        
        // Fallback to empty zones
        setZones([]);
      } finally {
        setIsLoading(false);
        console.log('ParkingHeatmap: Loading finished - zones:', zones.length, 'patterns:', Object.keys(zonePatterns).length);
      }
    };

    loadParkingZones();
  }, [toast, language]);

  // Initialize map (exact same as ParkingMap)
  const initializeMap = () => {
    console.log('ParkingHeatmap: Initializing map...');
    if (!mapContainer.current) {
      console.log('ParkingHeatmap: No map container found!');
      return;
    }

    if (isInitializing) {
      console.log('ParkingHeatmap: Already initializing, skipping...');
      return;
    }

    setIsInitializing(true);

    // Cleanup existing map if any
    if (map.current) {
      console.log('ParkingHeatmap: Cleaning up existing map...');
      map.current.remove();
      map.current = null;
    }

    try {
      const mapboxToken = 'pk.eyJ1IjoiZ2hpbGUxOSIsImEiOiJjbWNlenJsMTkwM3RmMmtxdWJ5aGxhM3poIn0.OUbxCpLdIw2fQn0UN16XdA';
      mapboxgl.accessToken = mapboxToken;
      
      console.log('ParkingHeatmap: Creating Mapbox instance with token:', mapboxToken.substring(0, 20) + '...');
      console.log('ParkingHeatmap: Container element:', mapContainer.current);
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [21.2267, 45.7489],
        zoom: 13,
        pitch: 45,
        preserveDrawingBuffer: true // Help with multiple instances
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      map.current.on('load', () => {
        console.log('ParkingHeatmap: Map loaded successfully, ready for heat zones');
        setIsMapReady(true);
        setIsInitializing(false);
      });

      map.current.on('error', (e) => {
        console.error('ParkingHeatmap: Map error:', e);
        setIsMapReady(false);
        setIsInitializing(false);
      });

      map.current.on('styledata', () => {
        console.log('ParkingHeatmap: Map style loaded');
      });

      console.log('ParkingHeatmap: Map initialization complete');
    } catch (error) {
      console.error('ParkingHeatmap: Failed to initialize map:', error);
      setIsMapReady(false);
      setIsInitializing(false);
    }
  };

  // Get user location (same as ParkingMap)
  const getUserLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          
          if (map.current) {
            map.current.flyTo({
              center: [location.lng, location.lat],
              zoom: 15
            });
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          toast({
            title: language === 'ro' ? 'Eroare Localizare' : 'Location Error',
            description: language === 'ro' 
              ? 'Nu s-a putut determina locația'
              : 'Could not determine location',
            variant: "destructive"
          });
        }
      );
    } else {
      toast({
        title: language === 'ro' ? 'Localizare Indisponibilă' : 'Location Unavailable',
        description: language === 'ro' 
          ? 'Browserul nu suportă geolocalizarea'
          : 'Browser does not support geolocation',
        variant: "destructive"
      });
    }
  };

  // Clear markers
  const clearMarkers = () => {
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
  };

  // Add heat zone markers to map
  const addHeatZonesToMap = () => {
    if (!map.current || !isMapReady || zones.length === 0) {
      console.log('ParkingHeatmap: Cannot add heat zones:', { 
        hasMap: !!map.current, 
        isMapReady, 
        zonesCount: zones.length,
        patternsCount: Object.keys(zonePatterns).length
      });
      return;
    }

    console.log('ParkingHeatmap: Adding heat zones for hour', currentHour, 'with', zones.length, 'zones');
    
    clearMarkers();

    let addedCount = 0;
    zones.forEach((zone) => {
      const pattern = zonePatterns[zone.id];
      if (!pattern) {
        console.log('ParkingHeatmap: No pattern for zone', zone.id);
        return;
      }

      // Check if coordinates exist (same validation as ParkingMap)
      if (!zone.coordinates || !zone.coordinates.lat || !zone.coordinates.lng) {
        console.log('ParkingHeatmap: Missing coordinates for zone', zone.id, zone.name, zone.coordinates);
        return;
      }
      
      const intensity = pattern[currentHour];
      const heatColor = getHeatColor(intensity);
      const radius = getHeatRadius(intensity);

      const markerElement = document.createElement('div');
      markerElement.className = 'heat-zone-marker';
      markerElement.style.cssText = `
        width: ${radius}px;
        height: ${radius}px;
        border-radius: 50%;
        background-color: ${heatColor};
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
        animation: pulse 2s infinite;
      `;
      markerElement.textContent = `${intensity}%`;

      // Add CSS animation (only once)
      if (!document.querySelector('#heatmap-pulse-animation')) {
        const style = document.createElement('style');
        style.id = 'heatmap-pulse-animation';
        style.textContent = `
          @keyframes pulse {
            0% { opacity: 0.8; }
            50% { opacity: 1; }
            100% { opacity: 0.8; }
          }
        `;
        document.head.appendChild(style);
      }

      const popupContent = `
        <div style="
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          border: 1px solid #475569;
          border-radius: 12px;
          padding: 20px;
          min-width: 280px;
          color: white;
          font-family: system-ui, -apple-system, sans-serif;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4);
        ">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
            <h3 style="font-size: 18px; font-weight: 700; margin: 0; color: #f1f5f9;">${zone.name}</h3>
            <div style="
              background-color: ${heatColor};
              color: white;
              padding: 4px 8px;
              border-radius: 6px;
              font-size: 12px;
              font-weight: 600;
            ">
              ${getIntensityLabel(intensity)}
            </div>
          </div>
          
          <div style="margin-bottom: 16px;">
            <p style="color: #94a3b8; font-size: 14px; margin: 0 0 8px 0; line-height: 1.4;">
              📍 ${zone.street} ${zone.number}, ${zone.city}
            </p>
            <p style="color: #cbd5e1; font-size: 13px; margin: 0; line-height: 1.4;">
              Densitate trafic: ${intensity}%
            </p>
          </div>
          
          <div style="
            background: rgba(0,0,0,0.2);
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 16px;
          ">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #94a3b8; font-size: 14px;">Intensitate actuală:</span>
              <span style="color: #f1f5f9; font-weight: 600; font-size: 16px;">${intensity}%</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #94a3b8; font-size: 14px;">Capacitate totală:</span>
              <span style="color: #f1f5f9; font-weight: 600; font-size: 16px;">${zone.totalSpots} locuri</span>
            </div>
            <div style="
              width: 100%;
              height: 4px;
              background: rgba(255,255,255,0.1);
              border-radius: 2px;
              overflow: hidden;
            ">
              <div style="
                width: ${intensity}%;
                height: 100%;
                background: ${heatColor};
                transition: width 0.3s ease;
              "></div>
            </div>
          </div>
          
          <div style="
            background: rgba(59, 130, 246, 0.1);
            border: 1px solid rgba(59, 130, 246, 0.3);
            border-radius: 8px;
            padding: 12px;
          ">
            <p style="color: #93c5fd; font-size: 12px; margin: 0; font-weight: 500;">
              🕐 Ora: ${String(currentHour).padStart(2, '0')}:00 - ${String((currentHour + 1) % 24).padStart(2, '0')}:00
            </p>
          </div>
        </div>
      `;

      const popup = new mapboxgl.Popup({
        offset: [15, 0],
        closeButton: true,
        closeOnClick: false,
        className: 'modern-heatmap-popup',
        anchor: 'left',
        maxWidth: '320px'
      }).setHTML(popupContent);

      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat([zone.coordinates?.lng || 0, zone.coordinates?.lat || 0])
        .setPopup(popup)
        .addTo(map.current!);

      markersRef.current.push(marker);
      addedCount++;
    });

    console.log(`ParkingHeatmap: Successfully added ${addedCount} heat zones out of ${zones.length} total zones`);
  };

  // Helper functions
  const getHeatColor = (intensity: number) => {
    if (intensity <= 30) return '#22c55e'; // Green
    if (intensity <= 60) return '#f59e0b'; // Yellow
    if (intensity <= 80) return '#f97316'; // Orange
    return '#ef4444'; // Red
  };

  const getHeatRadius = (intensity: number) => {
    return Math.max(30, Math.min(80, 30 + (intensity * 0.5)));
  };

  const getIntensityLabel = (intensity: number) => {
    if (intensity <= 30) return language === 'ro' ? 'Scăzută' : 'Low';
    if (intensity <= 60) return language === 'ro' ? 'Medie' : 'Medium';
    if (intensity <= 80) return language === 'ro' ? 'Ridicată' : 'High';
    return language === 'ro' ? 'Foarte Ridicată' : 'Very High';
  };

  const getHourDescription = (hour: number) => {
    if (hour >= 6 && hour <= 9) return language === 'ro' ? 'Vârf Dimineață' : 'Morning Rush';
    if (hour >= 9 && hour <= 17) return language === 'ro' ? 'Ore de Lucru' : 'Business Hours';
    if (hour >= 17 && hour <= 20) return language === 'ro' ? 'Vârf Seară' : 'Evening Peak';
    if (hour >= 20 && hour <= 23) return language === 'ro' ? 'Activitate Seară' : 'Evening Activity';
    return language === 'ro' ? 'Ore Liniștite' : 'Quiet Hours';
  };

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentHour(prev => (prev + 1) % 24);
    }, 1500);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Update heat zones when hour changes
  useEffect(() => {
    console.log('ParkingHeatmap: Heat zones effect triggered', { 
      isMapReady, 
      zonesCount: zones.length, 
      patternsCount: Object.keys(zonePatterns).length,
      currentHour,
      hasMap: !!map.current,
      isInitializing
    });
    if (isMapReady && zones.length > 0) {
      console.log('ParkingHeatmap: Conditions met, adding heat zones to map...');
      addHeatZonesToMap();
    } else {
      console.log('ParkingHeatmap: Cannot add heat zones - missing requirements');
    }
  }, [currentHour, zones, zonePatterns, isMapReady]);

  // Initialize map
  useEffect(() => {
    console.log('ParkingHeatmap: UseEffect triggered - initializing map...');
    // Wait a bit for the container to be ready
    const timer = setTimeout(() => {
      console.log('ParkingHeatmap: Timer triggered, starting map initialization...');
      if (propUserLocation) {
        setUserLocation(propUserLocation);
      } else {
        getUserLocation();
      }
      initializeMap();
    }, 100);
    
    return () => {
      console.log('ParkingHeatmap: Cleanup - removing map...');
      clearTimeout(timer);
      clearMarkers();
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [propUserLocation]);

  // Add user location marker
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

  const currentIntensity = zones.length > 0 ? 
    Math.round(zones.reduce((sum, zone) => {
      const pattern = zonePatterns[zone.id];
      return sum + (pattern ? pattern[currentHour] : 0);
    }, 0) / zones.length) : 0;

  if (isLoading) {
    return (
      <Card className="w-full bg-card/50 backdrop-blur-sm border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {language === 'ro' ? 'Hartă Termală Parcare' : 'Parking Heatmap'}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
            <span className="text-slate-400">
              {language === 'ro' ? 'Se încarcă datele din API...' : 'Loading API data...'}
            </span>
            <span className="text-xs text-slate-500">
              {language === 'ro' ? 'Obținere zone de parcare din /api/parking' : 'Fetching parking zones from /api/parking'}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Debug info
  console.log('ParkingHeatmap: Render state:', {
    isLoading,
    isMapReady,
    zonesCount: zones.length,
    currentHour,
    patternsCount: Object.keys(zonePatterns).length
  });

  return (
    <div className="relative">
      <Card className="overflow-hidden bg-card/50 backdrop-blur-sm border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {language === 'ro' ? 'Hartă Termală Parcare' : 'Parking Heatmap'}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {getHourDescription(currentHour)}
              </Badge>
              {/* Debug status */}
              <Badge variant={isMapReady ? "default" : zones.length > 0 ? "secondary" : "destructive"} className="text-xs">
                {isMapReady ? 
                  `✅ ${zones.length} zones` : 
                  zones.length > 0 ? 
                    `⏳ Map loading...` : 
                    `❌ No data`
                }
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Time Controls */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-300">
                {String(currentHour).padStart(2, '0')}:00 - {String((currentHour + 1) % 24).padStart(2, '0')}:00
              </span>
              <div className="flex items-center gap-2">
                <Badge 
                  variant={currentIntensity <= 40 ? "secondary" : currentIntensity <= 70 ? "default" : "destructive"}
                  className="text-xs"
                >
                  {currentIntensity}% {language === 'ro' ? 'Intensitate' : 'Intensity'}
                </Badge>
              </div>
            </div>
            
            {/* Hour Slider */}
            <Slider
              value={[currentHour]}
              onValueChange={(value) => setCurrentHour(value[0])}
              max={23}
              min={0}
              step={1}
              className="w-full"
              disabled={zones.length === 0}
            />
            
            {/* Control Buttons */}
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
                className="bg-card/50 backdrop-blur-sm border-slate-700"
                disabled={zones.length === 0}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setCurrentHour(new Date().getHours());
                  setIsPlaying(false);
                }}
                className="bg-card/50 backdrop-blur-sm border-slate-700"
                disabled={zones.length === 0}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  console.log('ParkingHeatmap: Force reinitialize map...');
                  setIsMapReady(false);
                  setIsInitializing(false);
                  initializeMap();
                }}
                className="bg-card/50 backdrop-blur-sm border-slate-700"
              >
                🔄
              </Button>
            </div>
          </div>

          {/* Map */}
          <div className="relative">
            <div ref={mapContainer} className="h-[500px] w-full rounded-lg overflow-hidden" />
            
            {/* Debug overlay */}
            {!isMapReady && !isLoading && (
              <div className="absolute inset-0 bg-slate-800 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-pulse text-yellow-400 mb-2">⚠️</div>
                  <p className="text-slate-300 text-sm">
                    {isInitializing 
                      ? (language === 'ro' ? 'Inițializare Mapbox...' : 'Initializing Mapbox...')
                      : (language === 'ro' ? 'Se încarcă harta...' : 'Loading map...')
                    }
                  </p>
                  <p className="text-slate-500 text-xs mt-1">
                    Mapbox GL JS
                  </p>
                </div>
              </div>
            )}
            
            {zones.length === 0 && !isLoading && (
              <div className="absolute inset-0 bg-slate-800/90 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-red-400 mb-2">❌</div>
                  <p className="text-slate-300 text-sm">
                    {language === 'ro' ? 'Nu s-au putut încărca zonele' : 'Failed to load zones'}
                  </p>
                  <p className="text-slate-500 text-xs mt-1">
                    {language === 'ro' ? 'Verifică API-ul' : 'Check API connection'}
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            {/* Legend */}
            <div className="flex justify-between items-center text-xs text-slate-400">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
                  <span>{language === 'ro' ? 'Scăzută' : 'Low'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
                  <span>{language === 'ro' ? 'Medie' : 'Medium'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500/70"></div>
                  <span>{language === 'ro' ? 'Ridicată' : 'High'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
                  <span>{language === 'ro' ? 'Foarte Ridicată' : 'Very High'}</span>
                </div>
              </div>
              <span className="text-xs text-slate-500">
                {language === 'ro' ? 'Densitate Trafic' : 'Traffic Density'}
              </span>
            </div>

            {/* Map Controls */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              {lastUpdate && (
                <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
              )}
              <Badge variant="outline" className="text-xs">
                {zones.length} {language === 'ro' ? 'zone încărcate' : 'zones loaded'}
              </Badge>
            </div>
            
            <div className="flex space-x-2">
              <Button onClick={getUserLocation} variant="outline" size="sm" className="flex-1">
                <MapPin className="h-4 w-4 mr-2" />
                {language === 'ro' ? 'Locație' : 'Location'}
              </Button>
              <Button 
                onClick={() => map.current?.flyTo({ center: [21.2267, 45.7489], zoom: 13 })} 
                variant="outline" 
                size="sm" 
                className="flex-1"
              >
                <Navigation className="h-4 w-4 mr-2" />
                {language === 'ro' ? 'Resetare' : 'Reset'}
              </Button>
            </div>

            {/* Stats Summary */}
            {zones.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-white">
                    {zones.filter(zone => {
                      const pattern = zonePatterns[zone.id];
                      return pattern && pattern[currentHour] <= 30;
                    }).length}
                  </div>
                  <div className="text-xs text-green-400">
                    {language === 'ro' ? 'Zone Libere' : 'Free Zones'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-white">
                    {zones.filter(zone => {
                      const pattern = zonePatterns[zone.id];
                      return pattern && pattern[currentHour] > 30 && pattern[currentHour] <= 70;
                    }).length}
                  </div>
                  <div className="text-xs text-yellow-400">
                    {language === 'ro' ? 'Zone Moderate' : 'Moderate Zones'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-white">
                    {zones.filter(zone => {
                      const pattern = zonePatterns[zone.id];
                      return pattern && pattern[currentHour] > 70;
                    }).length}
                  </div>
                  <div className="text-xs text-red-400">
                    {language === 'ro' ? 'Zone Aglomerate' : 'Crowded Zones'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 