import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Car, Clock, Navigation, TrendingUp, Bus, Bike, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

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

  const openGoogleMapsRoute = (destination: string) => {
    // Verifică dacă utilizatorul a acceptat locația
    const locationConsent = localStorage.getItem('location-consent');
    
    if (locationConsent === 'accepted' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Folosește locația reală pentru navigare
          const url = `https://www.google.com/maps/dir/${position.coords.latitude},${position.coords.longitude}/${encodeURIComponent(destination + " Timișoara")}`;
          window.open(url, '_blank');
        },
        () => {
          // Fallback la căutare simplă dacă nu poate obține locația
          const baseUrl = "https://www.google.com/maps/search/";
          window.open(`${baseUrl}${encodeURIComponent(destination + " Timișoara")}`, '_blank');
        }
      );
    } else {
      // Folosește căutare simplă dacă nu s-a acceptat locația
      const baseUrl = "https://www.google.com/maps/search/";
      window.open(`${baseUrl}${encodeURIComponent(destination + " Timișoara")}`, '_blank');
    }
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

      {/* Transport Alternatives */}
      <Card className="bg-card/50 backdrop-blur-sm border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Other Transport Options</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-slate-400 mb-3">
            🚫 Parking full? Try alternative transport:
          </p>
          
          <div className="grid grid-cols-1 gap-3">
            <Link to="/public-transport">
              <Button variant="outline" className="w-full h-auto p-3 justify-start">
                <div className="flex items-center space-x-3">
                  <Bus className="h-5 w-5 text-purple-400" />
                  <div className="text-left">
                    <div className="font-medium">Public Transport</div>
                    <div className="text-xs text-slate-400">Bus & Tram options</div>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 ml-auto" />
              </Button>
            </Link>
            
            <Link to="/bike-stations">
              <Button variant="outline" className="w-full h-auto p-3 justify-start">
                <div className="flex items-center space-x-3">
                  <Bike className="h-5 w-5 text-orange-400" />
                  <div className="text-left">
                    <div className="font-medium">Bike Stations</div>
                    <div className="text-xs text-slate-400">Eco-friendly bikes</div>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 ml-auto" />
              </Button>
            </Link>
          </div>
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
              <span>Try alternative parking zones first - often closer than expected</span>
            </div>
            <div className="flex items-start space-x-2">
              <span>⏰</span>
              <span>Peak hours (7-9 AM, 5-7 PM): Consider public transport</span>
            </div>
            <div className="flex items-start space-x-2">
              <span>🌍</span>
              <span>Eco-tip: Bike + walk combination reduces traffic</span>
            </div>
            <div className="flex items-start space-x-2">
              <span>📱</span>
              <span>All routes open in Google Maps with live traffic</span>
            </div>
            <div className="flex items-start space-x-2">
              <span>🅿️</span>
              <span>Shopping centers often have the most available spots</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
