import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Car, MapPin, Clock, Wifi, Battery, RefreshCw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ZoneData {
  id: string;
  name: string;
  totalSpots: number;
  occupiedSpots: number;
  lastUpdate: string;
  status: 'online' | 'offline' | 'maintenance';
  sensors: {
    active: number;
    total: number;
  };
}

const LiveParking = () => {
  const { t, language } = useLanguage();
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const zones: ZoneData[] = [
    {
      id: '1',
      name: 'Centrul Istoric',
      totalSpots: 150,
      occupiedSpots: 98,
      lastUpdate: '2 min',
      status: 'online',
      sensors: { active: 150, total: 150 }
    },
    {
      id: '2',
      name: 'Bega Shopping Center',
      totalSpots: 300,
      occupiedSpots: 156,
      lastUpdate: '1 min',
      status: 'online',
      sensors: { active: 298, total: 300 }
    },
    {
      id: '3',
      name: 'Iulius Mall',
      totalSpots: 450,
      occupiedSpots: 267,
      lastUpdate: '30 sec',
      status: 'online',
      sensors: { active: 450, total: 450 }
    },
    {
      id: '4',
      name: 'Piața Libertății',
      totalSpots: 80,
      occupiedSpots: 45,
      lastUpdate: '5 min',
      status: 'maintenance',
      sensors: { active: 75, total: 80 }
    },
    {
      id: '5',
      name: 'Campus UPT',
      totalSpots: 50,
      occupiedSpots: 28,
      lastUpdate: '1 min',
      status: 'online',
      sensors: { active: 50, total: 50 }
    }
  ];

  const filteredZones = selectedZone === 'all' ? zones : zones.filter(zone => zone.id === selectedZone);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastRefresh(new Date());
      setIsRefreshing(false);
    }, 1000);
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
          
          <Button onClick={handleRefresh} disabled={isRefreshing} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {language === 'ro' ? 'Actualizează' : 'Refresh'}
          </Button>
          
          <div className="text-sm text-slate-400 flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {language === 'ro' ? 'Ultima actualizare:' : 'Last updated:'} {lastRefresh.toLocaleTimeString()}
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
                {zones.reduce((sum, zone) => sum + (zone.totalSpots - zone.occupiedSpots), 0)}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredZones.map((zone) => {
            const occupancyPercentage = Math.round((zone.occupiedSpots / zone.totalSpots) * 100);
            const availableSpots = zone.totalSpots - zone.occupiedSpots;

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
                      {availableSpots}
                    </div>
                    <p className="text-sm text-slate-400">
                      {language === 'ro' ? 'locuri disponibile' : 'spots available'}
                    </p>
                    <p className="text-xs text-slate-500">
                      {zone.occupiedSpots}/{zone.totalSpots} {language === 'ro' ? 'ocupate' : 'occupied'} ({occupancyPercentage}%)
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