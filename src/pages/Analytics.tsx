import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Activity, Clock, BarChart3, PieChart as RechartsPieChart, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ParkingHeatmap } from "@/components/ParkingHeatmap";

const Analytics = () => {
  const { t, language } = useLanguage();

  const hourlyData = [
    { hour: '00:00', occupancy: 15 },
    { hour: '02:00', occupancy: 8 },
    { hour: '04:00', occupancy: 5 },
    { hour: '06:00', occupancy: 25 },
    { hour: '08:00', occupancy: 65 },
    { hour: '10:00', occupancy: 45 },
    { hour: '12:00', occupancy: 70 },
    { hour: '14:00', occupancy: 55 },
    { hour: '16:00', occupancy: 80 },
    { hour: '18:00', occupancy: 90 },
    { hour: '20:00', occupancy: 75 },
    { hour: '22:00', occupancy: 40 },
  ];

  const zoneData = [
    { name: 'Piața Victoriei', occupancy: 81, total: 120 },
    { name: 'Centrul Vechi', occupancy: 51, total: 85 },
    { name: 'Bega Shopping', occupancy: 48, total: 300 },
    { name: 'Universitate', occupancy: 89, total: 75 },
    { name: 'Iulius Mall', occupancy: 41, total: 450 },
  ];

  const weeklyData = [
    { day: language === 'ro' ? 'Lun' : 'Mon', occupancy: 85 },
    { day: language === 'ro' ? 'Mar' : 'Tue', occupancy: 78 },
    { day: language === 'ro' ? 'Mie' : 'Wed', occupancy: 82 },
    { day: language === 'ro' ? 'Joi' : 'Thu', occupancy: 90 },
    { day: language === 'ro' ? 'Vin' : 'Fri', occupancy: 95 },
    { day: language === 'ro' ? 'Sâm' : 'Sat', occupancy: 65 },
    { day: language === 'ro' ? 'Dum' : 'Sun', occupancy: 45 },
  ];

  const pieData = [
    { name: language === 'ro' ? 'Ocupat' : 'Occupied', value: 534, color: '#f59e0b' },
    { name: language === 'ro' ? 'Disponibil' : 'Available', value: 496, color: '#10b981' },
  ];

  const predictionData = [
    { time: 'Now', probability: 48 },
    { time: '+1h', probability: 35 },
    { time: '+2h', probability: 25 },
    { time: '+3h', probability: 15 },
    { time: '+4h', probability: 45 },
    { time: '+5h', probability: 65 },
  ];

  const metrics = [
    {
      title: language === 'ro' ? 'Ocupare Curentă' : 'Current Occupancy',
      value: '518/1030',
      percentage: '50.3%',
      change: '+2.1%',
      trend: 'up',
      icon: BarChart3
    },
    {
      title: language === 'ro' ? 'Ora de Vârf' : 'Peak Hour',
      value: '14:30',
      percentage: '95%',
      change: '-15min',
      trend: 'down',
      icon: Clock
    },
    {
      title: language === 'ro' ? 'Zone Active' : 'Active Zones',
      value: '5/5',
      percentage: '100%',
      change: '0',
      trend: 'stable',
      icon: MapPin
    },
    {
      title: language === 'ro' ? 'Eficiență' : 'Efficiency',
      value: '87.2%',
      percentage: '',
      change: '+1.8%',
      trend: 'up',
      icon: TrendingUp
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {language === 'ro' ? 'Tablou de Bord Statistici' : 'Analytics Dashboard'}
          </h1>
          <p className="text-slate-300">
            {language === 'ro' 
              ? 'Monitorizarea în timp real a performanței sistemului de parcare'
              : 'Real-time monitoring of parking system performance'
            }
          </p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <Card key={index} className="bg-card/50 backdrop-blur-sm border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">
                  {metric.title}
                </CardTitle>
                <metric.icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{metric.value}</div>
                <div className="flex items-center space-x-2 mt-1">
                  {metric.percentage && (
                    <span className="text-sm text-slate-400">{metric.percentage}</span>
                  )}
                  <div className="flex items-center space-x-1">
                    {metric.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-500" />}
                    {metric.trend === 'down' && <TrendingDown className="h-3 w-3 text-red-500" />}
                    <span className={`text-xs ${
                      metric.trend === 'up' ? 'text-green-500' : 
                      metric.trend === 'down' ? 'text-red-500' : 'text-slate-400'
                    }`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Hourly Occupancy */}
          <Card className="bg-card/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle>Model de Ocupare pe Ore</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="hour" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#374151', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: '#fff'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="occupancy" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Zone Comparison */}
          <Card className="bg-card/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle>Compararea Ocupării pe Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={zoneData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#374151', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: '#fff'
                    }} 
                  />
                  <Bar dataKey="occupancy" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Overall Distribution */}
          <Card className="bg-card/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle>Distribuția Generală</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <RechartsPieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#374151', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: '#fff'
                    }} 
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
              <div className="flex justify-center space-x-4 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Occupied</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Available</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Trends */}
          <Card className="bg-card/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle>Weekly Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="day" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#374151', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: '#fff'
                    }} 
                  />
                  <Bar dataKey="occupancy" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Predictions */}
          <Card className="bg-card/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle>Parking Probability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {predictionData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.time}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${item.probability}%` }}
                        ></div>
                      </div>
                      <Badge variant={item.probability > 50 ? "default" : item.probability > 20 ? "secondary" : "destructive"}>
                        {item.probability}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Parking Heatmap */}
        <div className="mt-8">
          <ParkingHeatmap />
        </div>

        {/* Zone Details */}
        <div className="mt-8">
          <Card className="bg-card/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle>
                {language === 'ro' ? 'Detalii Zone' : 'Zone Details'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'Centrul Istoric', occupied: 98, total: 150, efficiency: 88 },
                  { name: 'Bega Shopping Center', occupied: 156, total: 300, efficiency: 92 },
                  { name: 'Iulius Mall', occupied: 267, total: 450, efficiency: 85 },
                  { name: 'Piața Libertății', occupied: 45, total: 80, efficiency: 90 },
                  { name: 'Campus UPT', occupied: 28, total: 50, efficiency: 86 }
                ].map((zone, index) => (
                  <div key={index} className="p-4 bg-slate-800/50 rounded-lg">
                    <h3 className="font-semibold text-white mb-2">{zone.name}</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">
                          {language === 'ro' ? 'Ocupare:' : 'Occupancy:'}
                        </span>
                        <span className="text-white">{zone.occupied}/{zone.total}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">
                          {language === 'ro' ? 'Eficiență:' : 'Efficiency:'}
                        </span>
                        <Badge variant={zone.efficiency > 85 ? 'default' : 'secondary'}>
                          {zone.efficiency}%
                        </Badge>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(zone.occupied / zone.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
