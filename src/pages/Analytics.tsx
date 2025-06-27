
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Activity, Clock } from "lucide-react";

const Analytics = () => {
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

  const weeklyTrends = [
    { day: 'Mon', avg: 65 },
    { day: 'Tue', avg: 70 },
    { day: 'Wed', avg: 68 },
    { day: 'Thu', avg: 72 },
    { day: 'Fri', avg: 85 },
    { day: 'Sat', avg: 75 },
    { day: 'Sun', avg: 55 },
  ];

  const pieData = [
    { name: 'Occupied', value: 534, color: '#ef4444' },
    { name: 'Available', value: 496, color: '#22c55e' },
  ];

  const predictionData = [
    { time: 'Now', probability: 48 },
    { time: '+1h', probability: 35 },
    { time: '+2h', probability: 25 },
    { time: '+3h', probability: 15 },
    { time: '+4h', probability: 45 },
    { time: '+5h', probability: 65 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="container mx-auto">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">Analytics Dashboard</h1>
          <p className="text-slate-300">Comprehensive parking statistics and predictions</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-card/50 backdrop-blur-sm border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Occupancy</CardTitle>
              <Activity className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">51.8%</div>
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span>+2.3% from yesterday</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Peak Hour</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">18:00</div>
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <span>90% occupancy</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weekly Average</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">68.6%</div>
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <TrendingDown className="h-3 w-3 text-red-500" />
                <span>-1.2% from last week</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Busiest Zone</CardTitle>
              <Activity className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">Universitate</div>
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <span>89% occupancy</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Hourly Occupancy */}
          <Card className="bg-card/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle>Hourly Occupancy Pattern</CardTitle>
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
              <CardTitle>Zone Occupancy Comparison</CardTitle>
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
              <CardTitle>Overall Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
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
                </PieChart>
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
                <BarChart data={weeklyTrends}>
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
                  <Bar dataKey="avg" fill="#10b981" />
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
      </div>
    </div>
  );
};

export default Analytics;
