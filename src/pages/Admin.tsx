import { useState, useEffect } from "react";
import { AdminLogin } from "@/components/AdminLogin";
import { PrivacySettings } from "@/components/PrivacySettings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, MapPin, Settings, LogOut, Shield, Loader2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface ParkingZone {
  id: string;
  totalSpots: number;
  availableSpots: number;
  address: string;
  latitude: number;
  longitude: number;
  zone: string;
  status: 'active' | 'maintenance' | 'offline';
}



// API function to add parking zone
const addParkingZoneToAPI = async (zoneData: {
  address: string;
  numberOfSpots: number;
  availablePlaces: number;
  latitude: number;
  longitude: number;
  type: string;
}) => {
  try {
    const response = await fetch('/api/parking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(zoneData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

const Admin = () => {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [zones, setZones] = useState<ParkingZone[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [editingZone, setEditingZone] = useState<ParkingZone | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    numberOfSpots: '',
    address: '',
    availablePlaces: '',
    latitude: '',
    longitude: '',
    zone: ''
  });

  // Fetch parking zones from API
  const fetchZones = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/parking');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const apiData = await response.json();
      
      // Map API data to ParkingZone format
      const mappedZones: ParkingZone[] = apiData.map((zone: any, index: number) => {
        // Parse address
        const addressParts = zone.address.split(' ');
        let street = '';
        let number = '';
        
        const nrIndex = addressParts.findIndex((part: string) => part.toLowerCase().includes('nr'));
        if (nrIndex !== -1 && nrIndex + 1 < addressParts.length) {
          street = addressParts.slice(0, nrIndex).join(' ');
          number = addressParts[nrIndex + 1];
        } else {
          const lastPart = addressParts[addressParts.length - 1];
          if (/^\d+$/.test(lastPart)) {
            number = lastPart;
            street = addressParts.slice(0, -1).join(' ');
          } else {
            street = zone.address;
            number = '1';
          }
        }

        return {
          id: `api-zone-${index}`,
          totalSpots: zone.numberOfSpots,
          availableSpots: zone.availablePlaces !== undefined ? zone.availablePlaces : zone.numberOfSpots,
          address: zone.address,
          latitude: zone.latitude,
          longitude: zone.longitude,
          zone: zone.type,
          status: 'active' as const
        };
      });
      
      setZones(mappedZones);
      console.log('Admin: Loaded zones from API:', mappedZones);
    } catch (error) {
      console.error('Error fetching zones:', error);
      toast({
        title: "Error",
        description: "Failed to load parking zones from server",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load zones when component mounts and user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchZones();
    }
  }, [isAuthenticated]);

  const handleLogin = (success: boolean) => {
    setIsAuthenticated(success);
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  const handleAddZone = async () => {
    if (!formData.numberOfSpots || !formData.address || !formData.latitude || !formData.longitude || !formData.zone) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for API
      const apiData = {
        address: formData.address,
        numberOfSpots: parseInt(formData.numberOfSpots),
        availablePlaces: parseInt(formData.numberOfSpots), // Initially all spots available
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        type: formData.zone
      };

      // Log the data being sent to API for debugging
      console.log('Sending to API:', apiData);

      // Send to API
      await addParkingZoneToAPI(apiData);

      // Refresh zones from API to get updated data
      await fetchZones();
      setFormData({ numberOfSpots: '', address: '', availablePlaces: '', latitude: '', longitude: '', zone: '' });
      setShowAddForm(false);
      
      toast({
        title: "Success",
        description: "Parking zone added successfully to API and data refreshed"
      });

    } catch (error) {
      console.error('Error adding parking zone:', error);
      toast({
        title: "API Error",
        description: "Failed to add parking zone to the API. Please check the server connection.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditZone = (zone: ParkingZone) => {
    setEditingZone(zone);
    setFormData({
      numberOfSpots: zone.totalSpots.toString(),
      address: zone.address,
      availablePlaces: zone.availableSpots.toString(),
      latitude: zone.latitude.toString(),
      longitude: zone.longitude.toString(),
      zone: zone.zone
    });
  };

  const handleUpdateZone = async () => {
    if (!editingZone) return;

    setZones(zones.map(zone => 
      zone.id === editingZone.id 
        ? {
            ...zone,
            totalSpots: parseInt(formData.numberOfSpots),
            address: formData.address,
            latitude: parseFloat(formData.latitude),
            longitude: parseFloat(formData.longitude),
            zone: formData.zone
          }
        : zone
    ));

    // Update zone via API
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/parking/${encodeURIComponent(editingZone.address)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: formData.address,
          numberOfSpots: parseInt(formData.numberOfSpots),
          availablePlaces: parseInt(formData.availablePlaces),
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
          type: formData.zone
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchZones(); // Refresh zones from API
      setEditingZone(null);
      setFormData({ numberOfSpots: '', address: '', availablePlaces: '', latitude: '', longitude: '', zone: '' });
      
      toast({
        title: "Success",
        description: "Parking zone updated successfully via API"
      });
    } catch (error) {
      console.error('Error updating parking zone:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update parking zone",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteZone = async (zone: ParkingZone) => {
    if (!confirm(`Are you sure you want to delete the parking zone at ${zone.address}?`)) {
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/parking/${encodeURIComponent(zone.address)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchZones(); // Refresh zones from API
      toast({
        title: "Success",
        description: "Parking zone deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting parking zone:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete parking zone",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleZoneStatus = (id: string) => {
    setZones(zones.map(zone =>
      zone.id === id
        ? { ...zone, status: zone.status === 'active' ? 'offline' : 'active' }
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
                    <span>{editingZone ? 'Edit Parking Zone' : 'Add New Parking Zone'}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="numberOfSpots">Number of Spots</Label>
                      <Input
                        id="numberOfSpots"
                        type="number"
                        value={formData.numberOfSpots}
                        onChange={(e) => setFormData({ ...formData, numberOfSpots: e.target.value })}
                        placeholder="Enter total number of spots"
                      />
                    </div>
                    <div>
                      <Label htmlFor="availablePlaces">Available Places</Label>
                      <Input
                        id="availablePlaces"
                        type="number"
                        value={formData.availablePlaces}
                        onChange={(e) => setFormData({ ...formData, availablePlaces: e.target.value })}
                        placeholder="Enter available places"
                      />
                    </div>
                    <div>
                      <Label htmlFor="zone">Zone (Color)</Label>
                      <Input
                        id="zone"
                        value={formData.zone}
                        onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                        placeholder="Enter zone color (red, yellow, green, etc.)"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Enter full address"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input
                        id="latitude"
                        type="number"
                        step="any"
                        value={formData.latitude}
                        onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                        placeholder="Enter latitude (e.g., 45.7607)"
                      />
                    </div>
                    <div>
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input
                        id="longitude"
                        type="number"
                        step="any"
                        value={formData.longitude}
                        onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                        placeholder="Enter longitude (e.g., 21.2268)"
                      />
                    </div>
                  </div>
                                      <div className="flex space-x-2">
                      <Button 
                        onClick={editingZone ? handleUpdateZone : handleAddZone}
                        disabled={isSubmitting}
                      >
                        {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        {editingZone ? 'Update Zone' : 'Add Zone'}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setShowAddForm(false);
                          setEditingZone(null);
                          setFormData({ numberOfSpots: '', address: '', availablePlaces: '', latitude: '', longitude: '', zone: '' });
                        }}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                    </div>
                </CardContent>
              </Card>
            )}

                        {/* Add Zone Button & Refresh */}
            {!showAddForm && !editingZone && (
              <div className="flex gap-2 mb-4">
                <Button onClick={() => setShowAddForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Parking Zone
                </Button>
                <Button onClick={fetchZones} variant="outline" disabled={isLoading}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh from API
                </Button>
              </div>
            )}

            {/* Zones List */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                  <p className="text-slate-400">Loading parking zones from API...</p>
                </div>
              </div>
            ) : zones.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-400 mb-4">No parking zones found</p>
                <Button onClick={() => setShowAddForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Zone
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {zones.map((zone) => (
                <Card key={zone.id} className="bg-card/50 backdrop-blur-sm border-slate-700">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{zone.address.split(' ').slice(0, 3).join(' ')}</CardTitle>
                      <Badge 
                        variant={zone.status === 'active' ? 'default' : 'secondary'}
                        style={{ backgroundColor: zone.zone === 'red' ? '#ef4444' : zone.zone === 'yellow' ? '#f59e0b' : '#22c55e' }}
                      >
                        {zone.zone}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-slate-400">
                      <MapPin className="h-4 w-4" />
                      <span>{zone.address}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-400">Total Spots:</span>
                        <div className="font-semibold">{zone.totalSpots}</div>
                      </div>
                      <div>
                        <span className="text-slate-400">Available:</span>
                        <div className="font-semibold text-green-500">{zone.availableSpots}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-400">Latitude:</span>
                        <div className="font-mono text-xs">{zone.latitude.toFixed(6)}</div>
                      </div>
                      <div>
                        <span className="text-slate-400">Longitude:</span>
                        <div className="font-mono text-xs">{zone.longitude.toFixed(6)}</div>
                      </div>
                    </div>
                    
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${(zone.availableSpots / zone.totalSpots) * 100}%`,
                          backgroundColor: zone.availableSpots === 0 ? '#ef4444' : 
                                         (zone.availableSpots / zone.totalSpots) < 0.3 ? '#f59e0b' : '#22c55e'
                        }}
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
                        onClick={() => handleDeleteZone(zone)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              </div>
            )}
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
