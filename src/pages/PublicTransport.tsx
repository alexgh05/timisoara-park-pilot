
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bus, Clock, ExternalLink, Navigation, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PublicTransport = () => {
  const { toast } = useToast();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const publicTransport = [
    {
      id: "bus-1",
      type: "bus" as const,
      line: "Line 11",
      stop: "Piața Victoriei",
      coordinates: { lat: 45.7498, lng: 21.2275 },
      nextArrival: "3 min",
      route: "Direct to city center",
      frequency: "Every 5-8 minutes",
      operatingHours: "05:30 - 23:00"
    },
    {
      id: "tram-1",
      type: "tram" as const,
      line: "Line 1",
      stop: "Catedrala",
      coordinates: { lat: 45.7540, lng: 21.2255 },
      nextArrival: "7 min",
      route: "Historic center route",
      frequency: "Every 6-10 minutes",
      operatingHours: "05:00 - 23:30"
    },
    {
      id: "bus-2",
      type: "bus" as const,
      line: "Line 14",
      stop: "Universitate",
      coordinates: { lat: 45.7475, lng: 21.2085 },
      nextArrival: "5 min",
      route: "University district",
      frequency: "Every 7-12 minutes",
      operatingHours: "05:45 - 22:30"
    },
    {
      id: "bus-3",
      type: "bus" as const,
      line: "Line 33",
      stop: "Bega Shopping Center",
      coordinates: { lat: 45.7415, lng: 21.2398 },
      nextArrival: "2 min",
      route: "Shopping and residential areas",
      frequency: "Every 10-15 minutes",
      operatingHours: "06:00 - 22:00"
    },
    {
      id: "tram-2",
      type: "tram" as const,
      line: "Line 2",
      stop: "Iulius Mall",
      coordinates: { lat: 45.7308, lng: 21.2267 },
      nextArrival: "12 min",
      route: "Mall and business district",
      frequency: "Every 8-12 minutes",
      operatingHours: "05:15 - 23:45"
    }
  ];

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          toast({
            title: "Location Found",
            description: "Your location has been detected for routing"
          });
        },
        () => {
          setUserLocation({ lat: 45.7489, lng: 21.2267 });
          toast({
            title: "Using Default Location",
            description: "Using Timișoara city center as your location"
          });
        }
      );
    } else {
      setUserLocation({ lat: 45.7489, lng: 21.2267 });
    }
  };

  const openGoogleMapsRoute = (destination: { lat: number; lng: number }, destinationName: string) => {
    if (!userLocation) {
      getUserLocation();
      return;
    }
    
    const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${destination.lat},${destination.lng}`;
    window.open(url, '_blank');
    toast({
      title: "Route Opened",
      description: `Opening route to ${destinationName} in Google Maps`
    });
  };

  const openScheduleLink = () => {
    window.open("https://www.ratt.ro/trasee-si-orare/", '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">
            Public Transport - Timișoara
          </h1>
          <p className="text-slate-300">
            Real-time public transport information and route planning
          </p>
        </div>

        {/* Location Button */}
        <div className="mb-6">
          <Button onClick={getUserLocation} className="bg-blue-600 hover:bg-blue-700">
            <MapPin className="h-4 w-4 mr-2" />
            Get My Location for Routing
          </Button>
        </div>

        {/* Transport Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publicTransport.map((transport) => (
            <Card key={transport.id} className="bg-card/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bus className="h-5 w-5" />
                    <span>{transport.line}</span>
                  </div>
                  <Badge variant={transport.type === 'bus' ? 'default' : 'secondary'}>
                    {transport.type === 'bus' ? '🚌 Bus' : '🚋 Tram'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium text-lg">{transport.stop}</h3>
                  <p className="text-sm text-slate-400">{transport.route}</p>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>Next arrival:</span>
                    </span>
                    <span className="font-medium text-green-400">{transport.nextArrival}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Frequency:</span>
                    <span className="text-slate-300">{transport.frequency}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Hours:</span>
                    <span className="text-slate-300">{transport.operatingHours}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={openScheduleLink}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Schedule
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => openGoogleMapsRoute(transport.coordinates, transport.stop)}
                  >
                    <Navigation className="h-3 w-3 mr-1" />
                    Route
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Section */}
        <Card className="mt-8 bg-card/50 backdrop-blur-sm border-slate-700">
          <CardHeader>
            <CardTitle>Public Transport Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-300">
              <div>
                <h4 className="font-medium text-white mb-2">🎫 Tickets & Payment</h4>
                <ul className="space-y-1">
                  <li>• Buy tickets from RATT machines or mobile app</li>
                  <li>• Contactless payment available</li>
                  <li>• Validate your ticket when boarding</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-white mb-2">📱 Real-time Info</h4>
                <ul className="space-y-1">
                  <li>• Use RATT mobile app for live updates</li>
                  <li>• Check digital displays at stops</li>
                  <li>• SMS service available for schedules</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PublicTransport;
