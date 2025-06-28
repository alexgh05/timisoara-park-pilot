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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {language === 'ro' ? 'Stații Biciclete' : 'Bike Stations'}
          </h1>
          <p className="text-slate-300">
            {language === 'ro' 
              ? 'Rețeaua de bike-sharing din Timișoara cu disponibilitate în timp real'
              : 'Timișoara bike-sharing network with real-time availability'
            }
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card/50 backdrop-blur-sm border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                {language === 'ro' ? 'Total Stații' : 'Total Stations'}
              </CardTitle>
              <MapPin className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{bikeStations.length}</div>
              <p className="text-xs text-slate-400">
                {language === 'ro' ? 'în oraș' : 'citywide'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                {language === 'ro' ? 'Biciclete Disponibile' : 'Available Bikes'}
              </CardTitle>
              <Bike className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {bikeStations.reduce((sum, station) => sum + station.availableBikes, 0)}
              </div>
              <p className="text-xs text-green-500">
                {language === 'ro' ? 'gata de folosit' : 'ready to use'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                {language === 'ro' ? 'Capacitate Totală' : 'Total Capacity'}
              </CardTitle>
              <Battery className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {bikeStations.reduce((sum, station) => sum + station.totalCapacity, 0)}
              </div>
              <p className="text-xs text-slate-400">
                {language === 'ro' ? 'locuri total' : 'total spots'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                {language === 'ro' ? 'Utilizare' : 'Usage Rate'}
              </CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">73%</div>
              <p className="text-xs text-orange-500">
                {language === 'ro' ? 'astăzi' : 'today'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Bike Stations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bikeStations.map((station) => {
            const occupancyPercentage = Math.round((station.availableBikes / station.totalCapacity) * 100);
            
            return (
              <Card key={station.id} className="bg-card/50 backdrop-blur-sm border-slate-700">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg flex items-center space-x-2">
                        {getTypeIcon(station.type)}
                        <span>{station.name}</span>
                      </CardTitle>
                      <p className="text-sm text-slate-400">{station.location}</p>
                    </div>
                    {getStatusBadge(station.status, station.availableBikes)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Availability Display */}
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${
                      station.availableBikes > 5 ? 'text-green-500' :
                      station.availableBikes > 2 ? 'text-yellow-500' : 'text-red-500'
                    }`}>
                      {station.availableBikes}
                    </div>
                    <p className="text-sm text-slate-400">
                      {language === 'ro' ? 'biciclete disponibile' : 'bikes available'}
                    </p>
                    <p className="text-xs text-slate-500">
                      {station.totalCapacity} {language === 'ro' ? 'capacitate totală' : 'total capacity'} ({occupancyPercentage}%)
                    </p>
                    </div>
                    
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="w-full bg-slate-700 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-300 ${
                          occupancyPercentage > 60 ? 'bg-green-500' :
                          occupancyPercentage > 20 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${occupancyPercentage}%` }}
                      />
                    </div>
                      </div>
                    
                  {/* Station Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">
                        {language === 'ro' ? 'Distanță:' : 'Distance:'}
                      </span>
                      <span className="text-white">{station.distance}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">
                        {language === 'ro' ? 'Tip:' : 'Type:'}
                      </span>
                      <span className="text-white capitalize">
                        {station.type === 'electric' ? (language === 'ro' ? 'Electrice' : 'Electric') :
                         station.type === 'standard' ? (language === 'ro' ? 'Standard' : 'Standard') :
                         (language === 'ro' ? 'Mixte' : 'Mixed')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">
                        {language === 'ro' ? 'Ultima verificare:' : 'Last check:'}
                      </span>
                      <span className="text-white">{station.lastMaintenance}</span>
                    </div>
                  </div>

                  {/* Navigation Button */}
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => openInMaps(station.name)}
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    {language === 'ro' ? 'Navighează Aici' : 'Navigate Here'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Usage Instructions */}
        <div className="mt-8">
          <Card className="bg-card/50 backdrop-blur-sm border-slate-700">
          <CardHeader>
              <CardTitle>
                {language === 'ro' ? 'Cum Să Folosești Bicicletele' : 'How to Use the Bikes'}
              </CardTitle>
          </CardHeader>
          <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center space-y-2">
                  <div className="bg-primary/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-xl font-bold text-primary">1</span>
                  </div>
                  <h4 className="font-semibold text-white">
                    {language === 'ro' ? 'Înregistrează-te' : 'Sign Up'}
                  </h4>
                  <p className="text-sm text-slate-400">
                    {language === 'ro' 
                      ? 'Descarcă aplicația TimBike și creează un cont'
                      : 'Download the TimBike app and create an account'
                    }
                  </p>
                </div>

                <div className="text-center space-y-2">
                  <div className="bg-primary/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-xl font-bold text-primary">2</span>
                  </div>
                  <h4 className="font-semibold text-white">
                    {language === 'ro' ? 'Scanează QR' : 'Scan QR Code'}
                  </h4>
                  <p className="text-sm text-slate-400">
                    {language === 'ro' 
                      ? 'Scanează codul QR de pe bicicletă pentru deblocare'
                      : 'Scan the QR code on the bike to unlock'
                    }
                  </p>
                </div>

                <div className="text-center space-y-2">
                  <div className="bg-primary/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-xl font-bold text-primary">3</span>
                  </div>
                  <h4 className="font-semibold text-white">
                    {language === 'ro' ? 'Mergi cu Plăcere' : 'Enjoy Your Ride'}
                  </h4>
                  <p className="text-sm text-slate-400">
                    {language === 'ro' 
                      ? 'Urmează traseele recomandate și fii în siguranță'
                      : 'Follow recommended routes and stay safe'
                    }
                  </p>
                </div>

                <div className="text-center space-y-2">
                  <div className="bg-primary/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-xl font-bold text-primary">4</span>
                  </div>
                  <h4 className="font-semibold text-white">
                    {language === 'ro' ? 'Returnează' : 'Return'}
                  </h4>
                  <p className="text-sm text-slate-400">
                    {language === 'ro' 
                      ? 'Lasă bicicleta la orice stație disponibilă'
                      : 'Drop off the bike at any available station'
                    }
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-700">
                <h4 className="font-semibold text-white mb-4">
                  {language === 'ro' ? 'Informații Importante' : 'Important Information'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-400">
                  <div className="space-y-2">
                    <p>• {language === 'ro' ? 'Preț: 2 RON/oră sau 25 RON/zi' : 'Price: 2 RON/hour or 25 RON/day'}</p>
                    <p>• {language === 'ro' ? 'Prima 30 min gratuită pentru studenți' : 'First 30 min free for students'}</p>
                    <p>• {language === 'ro' ? 'Casca inclusă și obligatorie' : 'Helmet included and mandatory'}</p>
                  </div>
                  <div className="space-y-2">
                    <p>• {language === 'ro' ? 'Serviciu disponibil 24/7' : 'Service available 24/7'}</p>
                    <p>• {language === 'ro' ? 'Suport tehnic: 0256-123-456' : 'Technical support: 0256-123-456'}</p>
                    <p>• {language === 'ro' ? 'App: iOS și Android' : 'App: iOS and Android'}</p>
                  </div>
                </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
};

export default BikeStations;
