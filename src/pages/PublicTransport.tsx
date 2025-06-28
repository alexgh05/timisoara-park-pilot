import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bus, Clock, MapPin, ExternalLink, Zap, Route } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const PublicTransport = () => {
  const { t, language } = useLanguage();

  const busLines = [
    {
      number: '11',
      name: language === 'ro' ? 'Linia 11' : 'Line 11',
      route: language === 'ro' 
        ? 'Circumvalațiuni - Piața Libertății - Centru - UPT'
        : 'Circumvalațiuni - Piața Libertății - Center - UPT',
      frequency: language === 'ro' ? '8-12 min' : '8-12 min',
      type: 'bus',
      status: 'active',
      nextArrival: '3 min'
    },
    {
      number: '14',
      name: language === 'ro' ? 'Linia 14' : 'Line 14',
      route: language === 'ro' 
        ? 'Fabric - Piața Unirii - Centru - Bega'
        : 'Fabric - Piața Unirii - Center - Bega',
      frequency: language === 'ro' ? '10-15 min' : '10-15 min',
      type: 'bus',
      status: 'active',
      nextArrival: '7 min'
    },
    {
      number: '8',
      name: language === 'ro' ? 'Linia 8' : 'Line 8',
      route: language === 'ro' 
        ? 'Complexul Studențesc - Iulius Mall - Aeroport'
        : 'Student Complex - Iulius Mall - Airport',
      frequency: language === 'ro' ? '15-20 min' : '15-20 min',
      type: 'bus',
      status: 'active',
      nextArrival: '12 min'
    }
  ];

  const tramLines = [
    {
      number: '1',
      name: language === 'ro' ? 'Linia 1' : 'Line 1',
      route: language === 'ro' 
        ? 'Calea Buziașului - Centru - Calea Aradului'
        : 'Calea Buziașului - Center - Calea Aradului',
      frequency: language === 'ro' ? '6-10 min' : '6-10 min',
      type: 'tram',
      status: 'active',
      nextArrival: '5 min'
    },
    {
      number: '2',
      name: language === 'ro' ? 'Linia 2' : 'Line 2',
      route: language === 'ro' 
        ? 'Bucovina - Centru - Calea Sagului'
        : 'Bucovina - Center - Calea Sagului',
      frequency: language === 'ro' ? '8-12 min' : '8-12 min',
      type: 'tram',
      status: 'maintenance',
      nextArrival: 'N/A'
    }
  ];

  const openInMaps = (lineNumber: string) => {
    const query = `transport public linia ${lineNumber} Timișoara`;
    window.open(`https://www.google.com/maps/search/${encodeURIComponent(query)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {language === 'ro' ? 'Transport Public' : 'Public Transport'}
          </h1>
          <p className="text-slate-300">
            {language === 'ro' 
              ? 'Informații în timp real despre autobuzele și tramvaiele din Timișoara'
              : 'Real-time information about buses and trams in Timișoara'
            }
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card/50 backdrop-blur-sm border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                {language === 'ro' ? 'Linii Active' : 'Active Lines'}
              </CardTitle>
              <Route className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">8</div>
              <p className="text-xs text-slate-400">
                {language === 'ro' ? 'din 9 totale' : 'out of 9 total'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                {language === 'ro' ? 'Frecvența Medie' : 'Average Frequency'}
              </CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {language === 'ro' ? '9 min' : '9 min'}
              </div>
              <p className="text-xs text-slate-400">
                {language === 'ro' ? 'între vehicule' : 'between vehicles'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                {language === 'ro' ? 'Acoperire Oraș' : 'City Coverage'}
              </CardTitle>
              <MapPin className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">89%</div>
              <p className="text-xs text-slate-400">
                {language === 'ro' ? 'zone acoperite' : 'areas covered'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                {language === 'ro' ? 'Vehicule Electrice' : 'Electric Vehicles'}
              </CardTitle>
              <Zap className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">67%</div>
              <p className="text-xs text-green-500">
                {language === 'ro' ? 'eco-friendly' : 'eco-friendly'}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bus Lines */}
          <div>
            <Card className="bg-card/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <Bus className="h-5 w-5" />
                  <span>{language === 'ro' ? 'Linii de Autobuz' : 'Bus Lines'}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {busLines.map((line, index) => (
                  <div key={index} className="p-4 bg-slate-800/50 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-3">
                        <Badge className="bg-blue-600 text-white">
                          {line.number}
                        </Badge>
                <div>
                          <h3 className="font-semibold text-white">{line.name}</h3>
                          <p className="text-sm text-slate-400">{line.route}</p>
                        </div>
                      </div>
                      <Badge variant={line.status === 'active' ? 'default' : 'secondary'}>
                        {line.status === 'active' 
                          ? (language === 'ro' ? 'Activ' : 'Active')
                          : (language === 'ro' ? 'Mentenanță' : 'Maintenance')
                        }
                      </Badge>
                </div>
                
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4 text-sm text-slate-400">
                        <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                          <span>{language === 'ro' ? 'Frecvența:' : 'Frequency:'} {line.frequency}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Bus className="h-3 w-3" />
                          <span>{language === 'ro' ? 'Următorul:' : 'Next:'} {line.nextArrival}</span>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => openInMaps(line.number)}
                      >
                        <MapPin className="h-3 w-3 mr-1" />
                        {language === 'ro' ? 'Vezi Ruta' : 'View Route'}
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
                  </div>
                  
          {/* Tram Lines */}
          <div>
            <Card className="bg-card/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span>{language === 'ro' ? 'Linii de Tramvai' : 'Tram Lines'}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {tramLines.map((line, index) => (
                  <div key={index} className="p-4 bg-slate-800/50 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-3">
                        <Badge className="bg-green-600 text-white">
                          {line.number}
                        </Badge>
                        <div>
                          <h3 className="font-semibold text-white">{line.name}</h3>
                          <p className="text-sm text-slate-400">{line.route}</p>
                        </div>
                      </div>
                      <Badge variant={line.status === 'active' ? 'default' : 'secondary'}>
                        {line.status === 'active' 
                          ? (language === 'ro' ? 'Activ' : 'Active')
                          : (language === 'ro' ? 'Mentenanță' : 'Maintenance')
                        }
                      </Badge>
                  </div>
                  
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4 text-sm text-slate-400">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{language === 'ro' ? 'Frecvența:' : 'Frequency:'} {line.frequency}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Zap className="h-3 w-3" />
                          <span>{language === 'ro' ? 'Următorul:' : 'Next:'} {line.nextArrival}</span>
                  </div>
                </div>
                  <Button
                    size="sm"
                        variant="outline"
                        onClick={() => openInMaps(line.number)}
                  >
                        <MapPin className="h-3 w-3 mr-1" />
                        {language === 'ro' ? 'Vezi Ruta' : 'View Route'}
                  </Button>
                </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Transportation Tips */}
        <div className="mt-8">
          <Card className="bg-card/50 backdrop-blur-sm border-slate-700">
          <CardHeader>
              <CardTitle>
                {language === 'ro' ? 'Sfaturi Transport' : 'Transportation Tips'}
                </CardTitle>
          </CardHeader>
          <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h4 className="font-semibold text-white flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>
                      {language === 'ro' ? 'Ore de Vârf' : 'Peak Hours'}
                    </span>
                  </h4>
                  <p className="text-sm text-slate-400">
                    {language === 'ro' 
                      ? 'Evită orele 7:00-9:00 și 17:00-19:00 pentru călătorii mai confortabile.'
                      : 'Avoid 7:00-9:00 AM and 5:00-7:00 PM for more comfortable rides.'
                    }
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-white flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-green-500" />
                    <span>
                      {language === 'ro' ? 'Vehicule Electrice' : 'Electric Vehicles'}
                    </span>
                  </h4>
                  <p className="text-sm text-slate-400">
                    {language === 'ro' 
                      ? 'Autobuzele și tramvaiele noi sunt 100% electrice - mai silențioase și eco-friendly.'
                      : 'New buses and trams are 100% electric - quieter and eco-friendly.'
                    }
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-white flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    <span>
                      {language === 'ro' ? 'Aplicație Mobilă' : 'Mobile App'}
                    </span>
                  </h4>
                  <p className="text-sm text-slate-400">
                    {language === 'ro' 
                      ? 'Descarcă aplicația oficială STPT pentru tracking în timp real și planificare călătorii.'
                      : 'Download the official STPT app for real-time tracking and trip planning.'
                    }
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-white flex items-center space-x-2">
                    <Bus className="h-4 w-4 text-purple-500" />
                    <span>
                      {language === 'ro' ? 'Bilete și Abonamente' : 'Tickets & Passes'}
                    </span>
                  </h4>
                  <p className="text-sm text-slate-400">
                    {language === 'ro' 
                      ? 'Plata cu cardul contactless sau aplicația mobilă pentru un acces rapid.'
                      : 'Pay with contactless card or mobile app for quick access.'
                    }
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-white flex items-center space-x-2">
                    <Route className="h-4 w-4 text-orange-500" />
                    <span>
                      {language === 'ro' ? 'Planificare Rute' : 'Route Planning'}
                    </span>
                  </h4>
                  <p className="text-sm text-slate-400">
                    {language === 'ro' 
                      ? 'Combină liniile pentru călătorii eficiente - multe destinații au conexiuni directe.'
                      : 'Combine lines for efficient trips - many destinations have direct connections.'
                    }
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-white flex items-center space-x-2">
                    <ExternalLink className="h-4 w-4 text-cyan-500" />
                    <span>
                      {language === 'ro' ? 'Conectivitate' : 'Connectivity'}
                    </span>
                  </h4>
                  <p className="text-sm text-slate-400">
                    {language === 'ro' 
                      ? 'Toate vehiculele au WiFi gratuit și porturi USB pentru încărcare.'
                      : 'All vehicles have free WiFi and USB charging ports.'
                    }
                  </p>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
};

export default PublicTransport;
