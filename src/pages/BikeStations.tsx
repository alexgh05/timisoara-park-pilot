
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bike, Navigation, MapPin, Clock, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BikeStations = () => {
  const { toast } = useToast();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const bikeStations = [
    {
      id: "bike-1",
      name: "Piața Victoriei Bikes",
      coordinates: { lat: 45.7490, lng: 21.2270 },
      availableBikes: 8,
      totalSpots: 15,
      electricBikes: 3,
      distance: "300m",
      walkTime: "4 min",
      bikeTimeToDestination: "8 min",
      status: "operational" as const
    },
    {
      id: "bike-2",
      name: "Centrul Vechi Bikes",
      coordinates: { lat: 45.7540, lng: 21.2248 },
      availableBikes: 3,
      totalSpots: 12,
      electricBikes: 1,
      distance: "600m",
      walkTime: "7 min",
      bikeTimeToDestination: "5 min",
      status: "operational" as const
    },
    {
      id: "bike-3",
      name: "Universitate Bikes",
      coordinates: { lat: 45.7470, lng: 21.2078 },
      availableBikes: 12,
      totalSpots: 20,
      electricBikes: 4,
      distance: "800m",
      walkTime: "10 min",
      bikeTimeToDestination: "12 min",
      status: "operational" as const
    },
    {
      id: "bike-4",
      name: "Bega Shopping Bikes",
      coordinates: { lat: 45.7415, lng: 21.2398 },
      availableBikes: 0,
      totalSpots: 18,
      electricBikes: 0,
      distance: "1.2km",
      walkTime: "15 min",
      bikeTimeToDestination: "18 min",
      status: "maintenance" as const
    },
    {
      id: "bike-5",
      name: "Iulius Mall Bikes",
      coordinates: { lat: 45.7308, lng: 21.2267 },
      availableBikes: 15,
      totalSpots: 25,
      electricBikes: 6,
      distance: "2.1km",
      walkTime: "25 min",
      bikeTimeToDestination: "22 min",
      status: "operational" as const
    },
    {
      id: "bike-6",
      name: "Parcul Central Bikes",
      coordinates: { lat: 45.7520, lng: 21.2300 },
      availableBikes: 7,
      totalSpots: 16,
      electricBikes: 2,
      distance: "1.5km",
      walkTime: "18 min",
      bikeTimeToDestination: "15 min",
      status: "operational" as const
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

  const getAvailabilityBadge = (station: typeof bikeStations[0]) => {
    if (station.status === "maintenance") return { variant: "destructive" as const, text: "Maintenance" };
    if (station.availableBikes === 0) return { variant: "destructive" as const, text: "Empty" };
    if (station.availableBikes <= 3) return { variant: "secondary" as const, text: "Limited" };
    return { variant: "default" as const, text: "Available" };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">
            Bike Stations - Timișoara
          </h1>
          <p className="text-slate-300">
            Real-time bike sharing information and eco-friendly transport
          </p>
        </div>

        {/* Location Button */}
        <div className="mb-6">
          <Button onClick={getUserLocation} className="bg-green-600 hover:bg-green-700">
            <MapPin className="h-4 w-4 mr-2" />
            Get My Location for Routing
          </Button>
        </div>

        {/* Bike Station Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bikeStations.map((station) => {
            const badge = getAvailabilityBadge(station);
            return (
              <Card key={station.id} className="bg-card/50 backdrop-blur-sm border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bike className="h-5 w-5" />
                      <span className="text-sm">{station.name}</span>
                    </div>
                    <Badge variant={badge.variant}>
                      {badge.text}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center space-x-1">
                        <Bike className="h-3 w-3" />
                        <span>Available bikes:</span>
                      </span>
                      <span className="font-medium text-green-400">
                        {station.availableBikes}/{station.totalSpots}
                      </span>
                    </div>
                    
                    {station.electricBikes > 0 && (
                      <div className="flex justify-between">
                        <span className="flex items-center space-x-1">
                          <Zap className="h-3 w-3" />
                          <span>Electric bikes:</span>
                        </span>
                        <span className="text-blue-400">{station.electricBikes}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span>Distance:</span>
                      <span className="text-slate-300">{station.distance}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>Walk to station:</span>
                      </span>
                      <span className="text-slate-300">{station.walkTime}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Bike to destination:</span>
                      <span className="text-slate-300">{station.bikeTimeToDestination}</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full" 
                    size="sm"
                    disabled={station.availableBikes === 0 || station.status === "maintenance"}
                    onClick={() => openGoogleMapsRoute(station.coordinates, station.name)}
                  >
                    {station.status === "maintenance" ? (
                      "Under Maintenance"
                    ) : station.availableBikes === 0 ? (
                      "No Bikes Available"
                    ) : (
                      <>
                        <Navigation className="h-3 w-3 mr-1" />
                        Route to Station
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Info Section */}
        <Card className="mt-8 bg-card/50 backdrop-blur-sm border-slate-700">
          <CardHeader>
            <CardTitle>Bike Sharing Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-300">
              <div>
                <h4 className="font-medium text-white mb-2">🚲 How to Use</h4>
                <ul className="space-y-1">
                  <li>• Download the bike sharing app</li>
                  <li>• Register and add payment method</li>
                  <li>• Unlock bike with QR code or app</li>
                  <li>• Return to any station when done</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-white mb-2">💡 Tips</h4>
                <ul className="space-y-1">
                  <li>• Electric bikes cost more but go further</li>
                  <li>• Check station capacity before arriving</li>
                  <li>• Wear a helmet for safety</li>
                  <li>• Follow bike lanes and traffic rules</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BikeStations;
