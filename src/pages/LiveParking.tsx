import { useState } from "react";
import { ParkingSpotVisualization } from "@/components/ParkingSpotVisualization";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Car, Activity, RefreshCw, MapPin, Clock } from "lucide-react";

const LiveParking = () => {
  const [selectedZone, setSelectedZone] = useState<string>("zone-1");
  const [isLive, setIsLive] = useState(true);

  const zones = [
    { id: "zone-1", name: "Piața Victoriei", status: "active", spots: { available: 7, total: 8 } },
    { id: "zone-2", name: "Centrul Vechi", status: "active", spots: { available: 3, total: 8 } },
    { id: "zone-3", name: "Bega Shopping", status: "active", spots: { available: 6, total: 8 } },
    { id: "zone-4", name: "Universitate", status: "maintenance", spots: { available: 0, total: 8 } },
    { id: "zone-5", name: "Iulius Mall", status: "active", spots: { available: 5, total: 8 } }
  ];

  const currentZone = zones.find(zone => zone.id === selectedZone);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center space-x-3">
                <Activity className="h-8 w-8 text-green-500" />
                <span>Live Parking Monitor</span>
              </h1>
              <p className="text-slate-300">
                Real-time parking spot monitoring with embedded sensors
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge 
                variant={isLive ? "default" : "secondary"} 
                className={isLive ? "bg-green-500" : "bg-gray-500"}
              >
                <div className={`w-2 h-2 rounded-full mr-2 ${isLive ? 'bg-white animate-pulse' : 'bg-gray-300'}`} />
                {isLive ? "LIVE" : "PAUSED"}
              </Badge>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsLive(!isLive)}
                className="border-slate-600"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {isLive ? "Pause" : "Resume"}
              </Button>
            </div>
          </div>
        </div>

        {/* Zone Selection */}
        <Card className="bg-card/50 backdrop-blur-sm border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Select Parking Zone</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {zones.map((zone) => (
                <Button
                  key={zone.id}
                  variant={selectedZone === zone.id ? "default" : "outline"}
                  className={`h-auto p-4 flex-col space-y-2 ${
                    selectedZone === zone.id ? "" : "border-slate-600"
                  }`}
                  onClick={() => setSelectedZone(zone.id)}
                  disabled={zone.status === "maintenance"}
                >
                  <div className="font-semibold text-sm">{zone.name}</div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={zone.status === "active" ? "default" : "secondary"}
                      className={`text-xs ${
                        zone.status === "active" 
                          ? "bg-green-500" 
                          : zone.status === "maintenance" 
                            ? "bg-orange-500" 
                            : "bg-gray-500"
                      }`}
                    >
                      {zone.status === "active" ? "Active" : 
                       zone.status === "maintenance" ? "Maintenance" : "Offline"}
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-400">
                    {zone.spots.available}/{zone.spots.total} available
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-card/50 backdrop-blur-sm border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Current Zone</CardTitle>
              <Car className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{currentZone?.name}</div>
              <p className="text-xs text-slate-400">
                {currentZone?.status === "active" ? "Operational" : "Under maintenance"}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Available Spots</CardTitle>
              <MapPin className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {currentZone?.spots.available || 0}
              </div>
              <p className="text-xs text-slate-400">
                of {currentZone?.spots.total || 0} total spots
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Occupancy Rate</CardTitle>
              <Activity className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {currentZone ? Math.round(((currentZone.spots.total - currentZone.spots.available) / currentZone.spots.total) * 100) : 0}%
              </div>
              <p className="text-xs text-slate-400">Real-time data</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Last Updated</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {isLive ? "Now" : "Paused"}
              </div>
              <p className="text-xs text-slate-400">
                {isLive ? "Live monitoring active" : "Updates suspended"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Live Parking Visualization */}
        <ParkingSpotVisualization zoneId={selectedZone} isLive={isLive} />

        {/* Info Panel */}
        <Card className="bg-card/50 backdrop-blur-sm border-slate-700 mt-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>System Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-white mb-2">Sensor Technology</h4>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• Ultrasonic presence detection</li>
                  <li>• Real-time data transmission</li>
                  <li>• 99.7% accuracy rate</li>
                  <li>• 5-second update intervals</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Features</h4>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• Live parking spot status</li>
                  <li>• Historical occupancy data</li>
                  <li>• Maintenance notifications</li>
                  <li>• Integration with mobile app</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LiveParking; 