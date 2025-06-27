
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, MapPin, TrendingUp, Clock } from "lucide-react";

export const ParkingStats = () => {
  const stats = [
    {
      title: "Total Parking Spots",
      value: "1,030",
      change: "+12 this week",
      icon: Car,
      color: "text-blue-500"
    },
    {
      title: "Available Now",
      value: "496",
      change: "48.2% occupancy",
      icon: MapPin,
      color: "text-green-500"
    },
    {
      title: "Active Zones",
      value: "5",
      change: "All operational",
      icon: TrendingUp,
      color: "text-purple-500"
    },
    {
      title: "Avg. Wait Time",
      value: "12 min",
      change: "-3 min from yesterday",
      icon: Clock,
      color: "text-orange-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-card/50 backdrop-blur-sm border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <p className="text-xs text-slate-400">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
