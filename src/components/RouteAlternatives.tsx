
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car, Bus, Bike, Navigation, Clock, ExternalLink, TrendingUp } from "lucide-react";

interface RouteAlternativesProps {
  selectedZone: string | null;
}

export const RouteAlternatives = ({ selectedZone }: RouteAlternativesProps) => {
  const parkingAlternatives = [
    {
      name: "Bega Shopping Center",
      distance: "1.2km",
      walkTime: "15 min",
      driveTime: "8 min",
      availability: "Good",
      spots: "156/300",
      status: "available"
    },
    {
      name: "Iulius Mall", 
      distance: "2.1km",
      walkTime: "25 min",
      driveTime: "12 min",
      availability: "Excellent",
      spots: "267/450",
      status: "available"
    }
  ];

  const publicTransport = [
    {
      type: "Bus",
      line: "Line 11",
      stop: "Piața Victoriei",
      time: "3 min",
      walkToStop: "2 min",
      link: "https://www.ratt.ro/trasee-si-orare/",
      route: "Direct to city center"
    },
    {
      type: "Tram",
      line: "Line 1",
      stop: "Catedrala",
      time: "7 min", 
      walkToStop: "5 min",
      link: "https://www.ratt.ro/trasee-si-orare/",
      route: "Historic center route"
    },
    {
      type: "Bus",
      line: "Line 14",
      stop: "Universitate",
      time: "5 min",
      walkToStop: "3 min", 
      link: "https://www.ratt.ro/trasee-si-orare/",
      route: "University district"
    }
  ];

  const bikeStations = [
    {
      name: "Piața Victoriei Bikes",
      distance: "300m",
      walkTime: "4 min",
      availableBikes: 8,
      totalSpots: 15,
      bikeTimeToDestination: "8 min"
    },
    {
      name: "Centrul Vechi Bikes",
      distance: "600m",
      walkTime: "7 min",
      availableBikes: 3,
      totalSpots: 12,
      bikeTimeToDestination: "5 min"
    },
    {
      name: "Universitate Bikes",
      distance: "800m",
      walkTime: "10 min",
      availableBikes: 12,
      totalSpots: 20,
      bikeTimeToDestination: "12 min"
    }
  ];

  const openGoogleMapsRoute = (destination: string) => {
    const baseUrl = "https://www.google.com/maps/search/";
    window.open(`${baseUrl}${encodeURIComponent(destination + " Timișoara")}`, '_blank');
  };

  return (
    <div className="space-y-4">
      {/* Parking Alternatives */}
      <Card className="bg-card/50 backdrop-blur-sm border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Car className="h-5 w-5" />
            <span>Alternative Parking</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {parkingAlternatives.map((alt, index) => (
            <div key={index} className="p-3 bg-slate-800/50 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{alt.name}</h3>
                <Badge variant={alt.availability === "Excellent" ? "default" : "secondary"}>
                  {alt.availability}
                </Badge>
              </div>
              <div className="text-sm text-slate-400 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="flex items-center space-x-1">
                    <Navigation className="h-3 w-3" />
                    <span>{alt.distance}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>🚗 {alt.driveTime}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center space-x-1">
                    <Car className="h-3 w-3" />
                    <span>{alt.spots} available</span>
                  </span>
                  <span className="text-xs">🚶 {alt.walkTime}</span>
                </div>
              </div>
              <Button 
                className="w-full mt-2" 
                size="sm"
                onClick={() => openGoogleMapsRoute(alt.name)}
              >
                🗺️ Navigate Here
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Public Transport */}
      <Card className="bg-card/50 backdrop-blur-sm border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bus className="h-5 w-5" />
            <span>Public Transport</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-slate-400 mb-3">
            🚫 Parking full? Use public transport:
          </p>
          {publicTransport.map((transport, index) => (
            <div key={index} className="p-3 bg-slate-800/50 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{transport.line}</h3>
                <Badge variant="outline">{transport.type}</Badge>
              </div>
              <div className="text-sm text-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>Stop: {transport.stop}</span>
                  <span>🚶 {transport.walkToStop}</span>
                </div>
                <div className="flex justify-between">
                  <span>Next arrival: {transport.time}</span>
                  <span className="text-xs">{transport.route}</span>
                </div>
              </div>
              <div className="flex space-x-2 mt-2">
                <Button
                  className="flex-1"
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(transport.link, '_blank')}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Schedule
                </Button>
                <Button
                  className="flex-1"
                  size="sm"
                  onClick={() => openGoogleMapsRoute(transport.stop)}
                >
                  🗺️ Route
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Bike Stations */}
      <Card className="bg-card/50 backdrop-blur-sm border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bike className="h-5 w-5" />
            <span>Bike Stations</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-slate-400 mb-3">
            🚲 Eco-friendly alternative when parking is full:
          </p>
          {bikeStations.map((station, index) => (
            <div key={index} className="p-3 bg-slate-800/50 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-sm">{station.name}</h3>
                <Badge variant={station.availableBikes > 5 ? "default" : station.availableBikes > 0 ? "secondary" : "destructive"}>
                  {station.availableBikes > 5 ? "Available" : station.availableBikes > 0 ? "Limited" : "Full"}
                </Badge>
              </div>
              <div className="text-sm text-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>🚲 {station.availableBikes}/{station.totalSpots} bikes</span>
                  <span>🚶 {station.walkTime} to station</span>
                </div>
                <div className="flex justify-between">
                  <span>📍 {station.distance}</span>
                  <span>🚴 {station.bikeTimeToDestination} to destination</span>
                </div>
              </div>
              <Button 
                className="w-full mt-2" 
                size="sm"
                disabled={station.availableBikes === 0}
                onClick={() => openGoogleMapsRoute(station.name)}
              >
                {station.availableBikes > 0 ? "🗺️ Route to Bikes" : "No Bikes Available"}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Smart Routing Tips */}
      <Card className="bg-card/50 backdrop-blur-sm border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Smart Tips</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-slate-400 space-y-2">
            <div className="flex items-start space-x-2">
              <span>💡</span>
              <span>Combine transport: Walk to bike station → Bike to destination</span>
            </div>
            <div className="flex items-start space-x-2">
              <span>⏰</span>
              <span>Peak hours (6-8 PM): Public transport is faster than driving</span>
            </div>
            <div className="flex items-start space-x-2">
              <span>🌍</span>
              <span>Eco-friendly: Bikes reduce CO2 and parking stress</span>
            </div>
            <div className="flex items-start space-x-2">
              <span>📱</span>
              <span>All routes open in Google Maps with live traffic</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
