import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, MapPin, TrendingUp, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const ParkingStats = () => {
  const { t } = useLanguage();
  
  const stats = [
    {
      title: t('stats.totalSpots'),
      value: "1,030",
      change: `+12 ${t('stats.thisWeek')}`,
      icon: Car,
      color: "text-blue-500"
    },
    {
      title: t('stats.availableNow'),
      value: "496",
      change: `48.2% ${t('stats.occupancy')}`,
      icon: MapPin,
      color: "text-green-500"
    },
    {
      title: t('stats.activeZones'),
      value: "5",
      change: t('stats.allOperational'),
      icon: TrendingUp,
      color: "text-purple-500"
    },
    {
      title: t('stats.avgWaitTime'),
      value: "12 min",
      change: `-3 min ${t('stats.fromYesterday')}`,
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
