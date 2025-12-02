import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bike, Navigation, MapPin, Clock, Zap, Battery } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

const BikeStations = () => {
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Încarcă locația automat la inițializare dacă cookie-urile sunt acceptate
  useEffect(() => {
    const loadUserLocation = () => {
      const locationConsent = localStorage.getItem('location-consent');
      
      if (locationConsent === 'accepted') {
        // Încearcă să obții locația dacă utilizatorul a acceptat
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setUserLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude
              });
            },
            () => {
              // Folosește locația implicită din Timișoara dacă nu poate obține locația
              setUserLocation({ lat: 45.7489, lng: 21.2267 });
            }
          );
        } else {
          setUserLocation({ lat: 45.7489, lng: 21.2267 });
        }
      } else {
        // Folosește locația implicită dacă nu s-a dat consimțământ
        setUserLocation({ lat: 45.7489, lng: 21.2267 });
      }
    };

    loadUserLocation();
  }, []);

  const bikeStations = [
    {
      id: 1,
      name: 'Piața Unirii',
      location: language === 'ro' ? 'Centrul Istoric' : 'Historic Center',
      availableBikes: 12,
      totalCapacity: 20,
      distance: '0.3 km',
      status: 'available',
      type: 'standard',
      lastMaintenance: language === 'ro' ? '2 zile' : '2 days'
    },
    {
      id: 2,
      name: 'Bega Shopping Center',
      location: language === 'ro' ? 'Zona Comercială' : 'Shopping Area',
      availableBikes: 8,
      totalCapacity: 25,
      distance: '1.2 km',
      status: 'available',
      type: 'electric',
      lastMaintenance: language === 'ro' ? '1 zi' : '1 day'
    },
    {
      id: 3,
      name: 'Universitatea Politehnica',
      location: 'Campus UPT',
      availableBikes: 15,
      totalCapacity: 30,
      distance: '2.1 km',
      status: 'available',
      type: 'mixed',
      lastMaintenance: language === 'ro' ? '3 ore' : '3 hours'
    },
    {
      id: 4,
      name: 'Parcul Central',
      location: language === 'ro' ? 'Zona Verde' : 'Green Zone',
      availableBikes: 3,
      totalCapacity: 15,
      distance: '0.8 km',
      status: 'limited',
      type: 'standard',
      lastMaintenance: language === 'ro' ? '4 ore' : '4 hours'
    },
    {
      id: 5,
      name: 'Gara de Nord',
      location: language === 'ro' ? 'Zona Transport' : 'Transport Hub',
      availableBikes: 0,
      totalCapacity: 20,
      distance: '1.8 km',
      status: 'empty',
      type: 'electric',
      lastMaintenance: language === 'ro' ? '30 min' : '30 min'
    },
    {
      id: 6,
      name: 'Iulius Mall',
      location: language === 'ro' ? 'Zona Comercială' : 'Shopping Area',
      availableBikes: 0,
      totalCapacity: 25,
      distance: '2.5 km',
      status: 'maintenance',
      type: 'mixed',
      lastMaintenance: language === 'ro' ? 'În curs' : 'Ongoing'
    }
  ];

  const getStatusBadge = (status: string, availableBikes: number) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-500">{language === 'ro' ? 'Disponibil' : 'Available'}</Badge>;
      case 'limited':
        return <Badge className="bg-yellow-500">{language === 'ro' ? 'Limitat' : 'Limited'}</Badge>;
      case 'empty':
        return <Badge className="bg-red-500">{language === 'ro' ? 'Gol' : 'Empty'}</Badge>;
      case 'maintenance':
        return <Badge variant="secondary">{language === 'ro' ? 'Mentenanță' : 'Maintenance'}</Badge>;
      default:
        return <Badge variant="outline">{language === 'ro' ? 'Necunoscut' : 'Unknown'}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'electric':
        return <Zap className="h-4 w-4 text-blue-500" />;
      case 'standard':
        return <Bike className="h-4 w-4 text-gray-500" />;
      case 'mixed':
        return <Battery className="h-4 w-4 text-purple-500" />;
      default:
        return <Bike className="h-4 w-4 text-gray-500" />;
    }
  };

  const openInMaps = (stationName: string) => {
    const query = `${stationName} stație biciclete Timișoara`;
    window.open(`https://www.google.com/maps/search/${encodeURIComponent(query)}`, '_blank');
  };

  return (
    <div className="min-h-screen relative">
      <div className="px-4 sm:px-6 py-6 sm:py-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-1 sm:mb-2">
            {language === 'ro' ? 'Stații Biciclete' : 'Bike Stations'}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {language === 'ro' 
              ? "Rețeaua i'Velo din Timișoara cu disponibilitate în timp real"
              : "i'Velo network in Timișoara with real-time availability"
            }
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-6 sm:mb-8">
          <div className="rounded-xl bg-card/80 backdrop-blur-sm p-3 sm:p-4 ring-1 ring-border/50">
            <p className="text-xs text-muted-foreground mb-1">{language === 'ro' ? 'Stații' : 'Stations'}</p>
            <p className="text-lg sm:text-2xl font-bold text-foreground">{bikeStations.length}</p>
            <p className="text-xs text-muted-foreground">{language === 'ro' ? 'în oraș' : 'citywide'}</p>
          </div>
          <div className="rounded-xl bg-card/80 backdrop-blur-sm p-3 sm:p-4 ring-1 ring-border/50">
            <p className="text-xs text-muted-foreground mb-1">{language === 'ro' ? 'Disponibile' : 'Available'}</p>
            <p className="text-lg sm:text-2xl font-bold text-foreground">
              {bikeStations.reduce((sum, station) => sum + station.availableBikes, 0)}
            </p>
            <p className="text-xs text-green-500">{language === 'ro' ? 'biciclete' : 'bikes'}</p>
          </div>
          <div className="rounded-xl bg-card/80 backdrop-blur-sm p-3 sm:p-4 ring-1 ring-border/50">
            <p className="text-xs text-muted-foreground mb-1">{language === 'ro' ? 'Capacitate' : 'Capacity'}</p>
            <p className="text-lg sm:text-2xl font-bold text-foreground">
              {bikeStations.reduce((sum, station) => sum + station.totalCapacity, 0)}
            </p>
            <p className="text-xs text-muted-foreground">{language === 'ro' ? 'locuri' : 'spots'}</p>
          </div>
          <div className="rounded-xl bg-card/80 backdrop-blur-sm p-3 sm:p-4 ring-1 ring-border/50">
            <p className="text-xs text-muted-foreground mb-1">{language === 'ro' ? 'Utilizare' : 'Usage'}</p>
            <p className="text-lg sm:text-2xl font-bold text-foreground">73%</p>
            <p className="text-xs text-primary">{language === 'ro' ? 'astăzi' : 'today'}</p>
          </div>
        </div>

        {/* Bike Stations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {bikeStations.map((station) => {
            const occupancyPercentage = Math.round((station.availableBikes / station.totalCapacity) * 100);
            
            return (
              <div key={station.id} className="rounded-xl sm:rounded-2xl bg-card/80 backdrop-blur-sm ring-1 ring-border/50 overflow-hidden">
                <div className="p-3 sm:p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(station.type)}
                      <div>
                        <h3 className="text-sm font-medium text-foreground">{station.name}</h3>
                        <p className="text-xs text-muted-foreground">{station.location}</p>
                      </div>
                    </div>
                    {getStatusBadge(station.status, station.availableBikes)}
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className={`text-2xl font-bold ${
                        station.availableBikes > 5 ? 'text-green-500' :
                        station.availableBikes > 2 ? 'text-yellow-500' : 'text-red-500'
                      }`}>
                        {station.availableBikes}
                      </span>
                      <span className="text-xs text-muted-foreground ml-1">/ {station.totalCapacity}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{station.distance}</span>
                  </div>
                  
                  <div className="w-full bg-muted rounded-full h-1.5 mb-3">
                    <div 
                      className={`h-1.5 rounded-full transition-all ${
                        occupancyPercentage > 60 ? 'bg-green-500' :
                        occupancyPercentage > 20 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${occupancyPercentage}%` }}
                    />
                  </div>
                  
                  <button 
                    onClick={() => openInMaps(station.name)}
                    className="w-full px-3 py-2 text-xs font-medium bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                  >
                    {language === 'ro' ? 'Navighează' : 'Navigate'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Usage Instructions */}
        <div className="mt-4 sm:mt-6 rounded-xl sm:rounded-2xl bg-card/80 backdrop-blur-sm ring-1 ring-border/50 overflow-hidden">
          <div className="px-4 py-3 sm:px-5 sm:py-4 border-b border-border/40">
            <h2 className="text-sm sm:text-base font-semibold">
              {language === 'ro' ? "Cum să folosești i'Velo" : "How to use i'Velo"}
            </h2>
          </div>
          <div className="p-3 sm:p-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="text-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-sm sm:text-base font-bold text-primary">1</span>
                </div>
                <p className="text-xs text-muted-foreground">{language === 'ro' ? "Descarcă app" : "Download app"}</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-sm sm:text-base font-bold text-primary">2</span>
                </div>
                <p className="text-xs text-muted-foreground">{language === 'ro' ? "Scanează QR" : "Scan QR"}</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-sm sm:text-base font-bold text-primary">3</span>
                </div>
                <p className="text-xs text-muted-foreground">{language === 'ro' ? "Pedalează" : "Ride"}</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-sm sm:text-base font-bold text-primary">4</span>
                </div>
                <p className="text-xs text-muted-foreground">{language === 'ro' ? "Returnează" : "Return"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BikeStations;
