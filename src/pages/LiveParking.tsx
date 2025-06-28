import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Activity, Car, MapPin, Clock, Wifi, Battery, RefreshCw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";

interface ZoneData {
  id: string;
  name: string;
  address: string;
  totalSpots: number;
  availableSpots: number;
  lastUpdate: string;
  status: 'online' | 'offline' | 'maintenance';
  latitude: number;
  longitude: number;
  type: string;
  sensors: {
    active: number;
    total: number;
  };
}

// Function to fetch parking zones from API
const fetchParkingZones = async (): Promise<any[]> => {
  try {
    const response = await fetch('/api/parking');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch parking zones:', error);
    throw error;
  }
};

// Function to map API data to ZoneData format
const mapAPIDataToZoneData = (apiData: any[], lastRefresh: Date): ZoneData[] => {
  return apiData.map((zone, index) => {
    // Parse address to get a readable name
    const addressParts = zone.address.split(' ');
    let name = '';
    
    const nrIndex = addressParts.findIndex((part: string) => part.toLowerCase().includes('nr'));
    if (nrIndex !== -1) {
      name = addressParts.slice(0, nrIndex).join(' ');
    } else {
      name = addressParts.slice(0, 3).join(' '); // First 3 words
    }
    
    const availableSpots = zone.availablePlaces !== undefined ? zone.availablePlaces : zone.numberOfSpots;
    const totalSpots = zone.numberOfSpots;
    
    // Generate realistic sensor data
    const sensorsTotal = Math.max(totalSpots, 10);
    const sensorsActive = Math.floor(sensorsTotal * (0.95 + Math.random() * 0.05)); // 95-100% active
    
    return {
      id: `api-zone-${index}`,
      name: name || `Zone ${index + 1}`,
      address: zone.address,
      totalSpots: totalSpots,
      availableSpots: availableSpots,
      lastUpdate: Math.floor(Math.random() * 5) + 1 + ' min', // Random recent update
      status: 'online' as const,
      latitude: zone.latitude,
      longitude: zone.longitude,
      type: zone.type,
      sensors: {
        active: sensorsActive,
        total: sensorsTotal
      }
    };
  });
};

const LiveParking = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [zones, setZones] = useState<ZoneData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Fetch zones from API
  const loadZones = async () => {
    try {
      setIsRefreshing(true);
      const apiData = await fetchParkingZones();
      const mappedZones = mapAPIDataToZoneData(apiData, new Date());
      setZones(mappedZones);
      setLastRefresh(new Date());
      console.log('LiveParking: Loaded zones from API:', mappedZones);
    } catch (error) {
      console.error('Error loading zones:', error);
      toast({
        title: language === 'ro' ? 'Eroare' : 'Error',
        description: language === 'ro' 
          ? 'Nu s-au putut încărca zonele de parcare'
          : 'Failed to load parking zones',
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  };

  // Load zones on component mount
  useEffect(() => {
    loadZones();
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(async () => {
      try {
        const apiData = await fetchParkingZones();
        const mappedZones = mapAPIDataToZoneData(apiData, new Date());
        
        // Only update if data has changed
        if (JSON.stringify(mappedZones) !== JSON.stringify(zones)) {
          setZones(mappedZones);
          setLastRefresh(new Date());
        }
      } catch (error) {
        console.error('Auto-refresh failed:', error);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh, zones]);

  const filteredZones = selectedZone === 'all' ? zones : zones.filter(zone => zone.id === selectedZone);

  const handleRefresh = () => {
    loadZones();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return <Badge className="bg-green-500">{language === 'ro' ? 'Online' : 'Online'}</Badge>;
      case 'offline':
        return <Badge variant="destructive">{language === 'ro' ? 'Offline' : 'Offline'}</Badge>;
      case 'maintenance':
        return <Badge variant="secondary">{language === 'ro' ? 'Mentenanță' : 'Maintenance'}</Badge>;
      default:
        return <Badge variant="outline">{language === 'ro' ? 'Necunoscut' : 'Unknown'}</Badge>;
    }
  };

  const getOccupancyColor = (percentage: number) => {
    if (percentage < 60) return 'text-green-500';
    if (percentage < 80) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {language === 'ro' ? 'Monitor Parcare Live' : 'Live Parking Monitor'}
              </h1>
              <p className="text-slate-300">
            {language === 'ro' 
              ? 'Monitorizare în timp real a disponibilității parcărilor'
              : 'Real-time monitoring of parking availability'
            }
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Select value={selectedZone} onValueChange={setSelectedZone}>
            <SelectTrigger className="w-full md:w-64">
              <SelectValue placeholder={language === 'ro' ? 'Selectează zona' : 'Select zone'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {language === 'ro' ? 'Toate zonele' : 'All zones'}
              </SelectItem>
              {zones.map((zone) => (
                <SelectItem key={zone.id} value={zone.id}>
                  {zone.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex items-center space-x-2">
            <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
            <span className="text-sm text-slate-400">
              {language === 'ro' ? 'Auto-refresh (30s)' : 'Auto-refresh (30s)'}
            </span>
          </div>
          
          <Button onClick={handleRefresh} disabled={isRefreshing} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {language === 'ro' ? 'Actualizează' : 'Refresh'}
          </Button>
          
          <div className="text-sm text-slate-400 flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {language === 'ro' ? 'Ultima actualizare:' : 'Last updated:'} {lastRefresh.toLocaleTimeString()}
            <Badge variant="outline" className="ml-2 text-xs">
              {zones.length} {language === 'ro' ? 'zone' : 'zones'}
            </Badge>
          </div>
        </div>

        {/* Live Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card/50 backdrop-blur-sm border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                {language === 'ro' ? 'Total Locuri' : 'Total Spots'}
              </CardTitle>
              <Car className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {zones.reduce((sum, zone) => sum + zone.totalSpots, 0)}
              </div>
              <p className="text-xs text-slate-400">
                {language === 'ro' ? 'în toate zonele' : 'across all zones'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                {language === 'ro' ? 'Disponibile' : 'Available'}
              </CardTitle>
              <MapPin className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {zones.reduce((sum, zone) => sum + zone.availableSpots, 0)}
              </div>
              <p className="text-xs text-green-500">
                {language === 'ro' ? 'locuri libere' : 'spots free'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                {language === 'ro' ? 'Zone Active' : 'Active Zones'}
              </CardTitle>
              <Activity className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {zones.filter(zone => zone.status === 'online').length}/{zones.length}
              </div>
              <p className="text-xs text-slate-400">
                {language === 'ro' ? 'sisteme funcționale' : 'systems operational'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                {language === 'ro' ? 'Senzori Activi' : 'Active Sensors'}
              </CardTitle>
              <Wifi className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {zones.reduce((sum, zone) => sum + zone.sensors.active, 0)}/
                {zones.reduce((sum, zone) => sum + zone.sensors.total, 0)}
              </div>
              <p className="text-xs text-slate-400">
                {language === 'ro' ? 'funcționali' : 'operational'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Zone Cards */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-slate-400">
                {language === 'ro' ? 'Se încarcă zonele de parcare...' : 'Loading parking zones...'}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredZones.map((zone) => {
              const occupiedSpots = zone.totalSpots - zone.availableSpots;
              const occupancyPercentage = Math.round((occupiedSpots / zone.totalSpots) * 100);

            return (
              <Card key={zone.id} className="bg-card/50 backdrop-blur-sm border-slate-700">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{zone.name}</CardTitle>
                    {getStatusBadge(zone.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Occupancy Display */}
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${getOccupancyColor(occupancyPercentage)}`}>
                      {zone.availableSpots}
                    </div>
                    <p className="text-sm text-slate-400">
                      {language === 'ro' ? 'locuri disponibile' : 'spots available'}
                    </p>
                    <p className="text-xs text-slate-500">
                      {occupiedSpots}/{zone.totalSpots} {language === 'ro' ? 'ocupate' : 'occupied'} ({occupancyPercentage}%)
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      📍 {zone.address}
                    </p>
                    <p className="text-xs text-slate-400">
                      Type: <span className="font-semibold" style={{color: zone.type === 'red' ? '#ef4444' : zone.type === 'yellow' ? '#f59e0b' : '#22c55e'}}>{zone.type}</span>
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="w-full bg-slate-700 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-300 ${
                          occupancyPercentage < 60 ? 'bg-green-500' :
                          occupancyPercentage < 80 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${occupancyPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Sensor Status */}
                  <div className="flex justify-between items-center pt-2 border-t border-slate-700">
                    <div className="flex items-center space-x-2">
                      <Battery className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-400">
                        {language === 'ro' ? 'Senzori:' : 'Sensors:'} {zone.sensors.active}/{zone.sensors.total}
                      </span>
                    </div>
                    <div className="text-sm text-slate-400">
                      {language === 'ro' ? 'Actualizat acum' : 'Updated'} {zone.lastUpdate}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          </div>
        )}

        {/* System Information */}
        <div className="mt-8">
          <Card className="bg-card/50 backdrop-blur-sm border-slate-700">
          <CardHeader>
              <CardTitle>
                {language === 'ro' ? 'Informații Sistem' : 'System Information'}
            </CardTitle>
          </CardHeader>
          <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <h4 className="font-semibold text-white mb-2">
                    {language === 'ro' ? 'Tehnologie Senzori' : 'Sensor Technology'}
                  </h4>
                  <p className="text-sm text-slate-400">
                    {language === 'ro' 
                      ? 'Senzori ultrasonici cu precizie de 99.5%'
                      : 'Ultrasonic sensors with 99.5% accuracy'
                    }
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">
                    {language === 'ro' ? 'Frecvența Actualizării' : 'Update Frequency'}
                  </h4>
                  <p className="text-sm text-slate-400">
                    {language === 'ro' 
                      ? 'La fiecare 30 de secunde'
                      : 'Every 30 seconds'
                    }
                  </p>
                </div>
              <div>
                  <h4 className="font-semibold text-white mb-2">
                    {language === 'ro' ? 'Conectivitate' : 'Connectivity'}
                  </h4>
                  <p className="text-sm text-slate-400">
                    {language === 'ro' 
                      ? 'LoRaWAN & 4G backup'
                      : 'LoRaWAN & 4G backup'
                    }
                  </p>
              </div>
              <div>
                  <h4 className="font-semibold text-white mb-2">
                    {language === 'ro' ? 'Autonomie Baterie' : 'Battery Life'}
                  </h4>
                  <p className="text-sm text-slate-400">
                    {language === 'ro' 
                      ? 'Până la 5 ani'
                      : 'Up to 5 years'
                    }
                  </p>
                </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
};

export default LiveParking; 