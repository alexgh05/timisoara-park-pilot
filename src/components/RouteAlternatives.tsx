import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car, Bus, Navigation, Clock, ExternalLink, TrendingUp } from "lucide-react";

interface RouteAlternativesProps {
  selectedZone: string | null;
}

export const RouteAlternatives = ({ selectedZone }: RouteAlternativesProps) => {
  const parkingAlternatives = [
    {
      name: "Nearby Zone B",
      distance: "200m",
      walkTime: "3 min",
      availability: "Good",
      spots: "42/85"
    },
    {
      name: "Nearby Zone C", 
      distance: "400m",
      walkTime: "5 min",
      availability: "Excellent",
      spots: "156/300"
    }
  ];

  const publicTransport = [
    {
      type: "Bus",
      line: "Line 11",
      stop: "Piața Victoriei",
      time: "5 min",
      link: "https://www.ratt.ro/trasee-si-orare/"
    },
    {
      type: "Tram",
      line: "Line 1",
      stop: "Catedrala",
      time: "8 min", 
      link: "https://www.ratt.ro/trasee-si-orare/"
    }
  ];

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
                <div className="flex items-center space-x-2">
                  <Navigation className="h-3 w-3" />
                  <span>{alt.distance}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-3 w-3" />
                  <span>{alt.walkTime} walk</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Car className="h-3 w-3" />
                  <span>{alt.spots} available</span>
                </div>
              </div>
              <Button className="w-full mt-2" size="sm">
                Navigate Here
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
            No parking available? Try public transport:
          </p>
          {publicTransport.map((transport, index) => (
            <div key={index} className="p-3 bg-slate-800/50 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{transport.line}</h3>
                <Badge variant="outline">{transport.type}</Badge>
              </div>
              <div className="text-sm text-slate-400 space-y-1">
                <div>Stop: {transport.stop}</div>
                <div>Next arrival: {transport.time}</div>
              </div>
              <Button
                className="w-full mt-2"
                size="sm"
                variant="outline"
                onClick={() => window.open(transport.link, '_blank')}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                View Schedule
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Prediction */}
      <Card className="bg-card/50 backdrop-blur-sm border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Parking Prediction</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-slate-400 mb-3">
            Based on historical data:
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Next hour:</span>
              <Badge variant="secondary">65% chance</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Peak time (6-8 PM):</span>
              <Badge variant="destructive">15% chance</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">After 9 PM:</span>
              <Badge variant="default">85% chance</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
