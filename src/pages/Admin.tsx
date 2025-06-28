import { useState } from "react";
import { AdminLogin } from "@/components/AdminLogin";
import { PrivacySettings } from "@/components/PrivacySettings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, MapPin, Settings, LogOut, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface ParkingZone {
  id: string;
  name: string;
  totalSpots: number;
  occupiedSpots: number;
  address: string;
  status: 'active' | 'maintenance' | 'offline';
}

const Admin = () => {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [zones, setZones] = useState<ParkingZone[]>([
    {
      id: "1",
      name: "Piața Victoriei",
      totalSpots: 120,
      availableSpots: 23,
      address: "Piața Victoriei, Timișoara",
      status: 'active'
    },
    {
      id: "2",
      name: "Centrul Vechi",
      totalSpots: 85,
      availableSpots: 42,
      address: "Piața Unirii, Timișoara",
      status: 'active'
    },
    {
      id: "3",
      name: "Bega Shopping Center",
      totalSpots: 300,
      availableSpots: 156,
      address: "Calea Timișoarei 20, Timișoara",
      status: 'active'
    }
  ]);

  const [editingZone, setEditingZone] = useState<ParkingZone | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    totalSpots: '',
    address: ''
  });

  const handleLogin = (success: boolean) => {
    setIsAuthenticated(success);
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  const handleAddZone = () => {
    if (!formData.name || !formData.totalSpots || !formData.address) {
      toast({
        title: "Eroare",
        description: "Te rugăm să completezi toate câmpurile",
        variant: "destructive"
      });
      return;
    }

    const newZone: ParkingZone = {
      id: Date.now().toString(),
      name: formData.name,
      totalSpots: parseInt(formData.totalSpots),
      availableSpots: parseInt(formData.totalSpots),
      address: formData.address,
      status: 'active'
    };

    setZones([...zones, newZone]);
    setFormData({ name: '', totalSpots: '', address: '' });
    setShowAddForm(false);
    
    toast({
      title: "Succes",
      description: "Zona de parcare adăugată cu succes"
    });
  };

  const handleEditZone = (zone: ParkingZone) => {
    setEditingZone(zone);
    setFormData({
      name: zone.name,
      totalSpots: zone.totalSpots.toString(),
      address: zone.address
    });
  };

  const handleUpdateZone = () => {
    if (!editingZone) return;

    setZones(zones.map(zone => 
      zone.id === editingZone.id 
        ? {
            ...zone,
            name: formData.name,
            totalSpots: parseInt(formData.totalSpots),
            address: formData.address
          }
        : zone
    ));

    setEditingZone(null);
    setFormData({ name: '', totalSpots: '', address: '' });
    
    toast({
      title: "Succes",
      description: "Zona de parcare actualizată cu succes"
    });
  };

  const handleDeleteZone = (id: string) => {
    setZones(zones.filter(zone => zone.id !== id));
    toast({
      title: "Succes",
      description: "Zona de parcare ștearsă cu succes"
    });
  };

  const toggleZoneStatus = (id: string) => {
    setZones(zones.map(zone =>
      zone.id === id
        ? { ...zone, status: zone.status === 'active' ? 'inactive' : 'active' }
        : zone
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="container mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-slate-300">Manage parking zones and system settings</p>
          </div>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>

        <Tabs defaultValue="zones" className="space-y-6">
          <TabsList className="bg-card/50 backdrop-blur-sm">
            <TabsTrigger value="zones">Parking Zones</TabsTrigger>
            <TabsTrigger value="settings">System Settings</TabsTrigger>
            <TabsTrigger value="privacy">Privacy Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="zones" className="space-y-6">
            {/* Add Zone Form */}
            {(showAddForm || editingZone) && (
              <Card className="bg-card/50 backdrop-blur-sm border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Plus className="h-5 w-5" />
                    <span>{editingZone ? 'Editează Zona' : 'Adaugă Zonă Nouă'}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Numele Zonei</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Introdu numele zonei"
                      />
                    </div>
                    <div>
                      <Label htmlFor="totalSpots">Total Locuri</Label>
                      <Input
                        id="totalSpots"
                        type="number"
                        value={formData.totalSpots}
                        onChange={(e) => setFormData({ ...formData, totalSpots: e.target.value })}
                        placeholder="Introdu numărul total de locuri"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Enter address"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={editingZone ? handleUpdateZone : handleAddZone}>
                      {editingZone ? 'Update Zone' : 'Add Zone'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingZone(null);
                        setFormData({ name: '', totalSpots: '', address: '' });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Add Zone Button */}
            {!showAddForm && !editingZone && (
              <Button onClick={() => setShowAddForm(true)} className="mb-4">
                <Plus className="h-4 w-4 mr-2" />
                Add New Zone
              </Button>
            )}

            {/* Zones List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {zones.map((zone) => (
                <Card key={zone.id} className="bg-card/50 backdrop-blur-sm border-slate-700">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{zone.name}</CardTitle>
                      <Badge variant={zone.status === 'active' ? 'default' : 'secondary'}>
                        {zone.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-slate-400">
                      <MapPin className="h-4 w-4" />
                      <span>{zone.address}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Available:</span>
                      <span className="font-semibold">{zone.availableSpots}/{zone.totalSpots}</span>
                    </div>
                    
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(zone.availableSpots / zone.totalSpots) * 100}%` }}
                      ></div>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditZone(zone)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleZoneStatus(zone.id)}
                      >
                        <Settings className="h-3 w-3 mr-1" />
                        {zone.status === 'active' ? 'Disable' : 'Enable'}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteZone(zone.id)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="bg-card/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="updateInterval">Data Update Interval (seconds)</Label>
                    <Input id="updateInterval" type="number" defaultValue="30" />
                  </div>
                  <div>
                    <Label htmlFor="maxCapacity">System Max Capacity</Label>
                    <Input id="maxCapacity" type="number" defaultValue="1030" />
                  </div>
                  <div>
                    <Label htmlFor="alertThreshold">Low Availability Alert (%)</Label>
                    <Input id="alertThreshold" type="number" defaultValue="20" />
                  </div>
                  <div>
                    <Label htmlFor="predictionRange">Prediction Range (hours)</Label>
                    <Input id="predictionRange" type="number" defaultValue="24" />
                  </div>
                </div>
                <Button>Save Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy">
            <div className="flex justify-center">
              <PrivacySettings />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
