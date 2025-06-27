import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Settings, MapPin, Cookie, Shield, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const PrivacySettings = () => {
  const [locationConsent, setLocationConsent] = useState(false);
  const [analyticsConsent, setAnalyticsConsent] = useState(false);
  const [cookieConsent, setCookieConsent] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load current settings
    const location = localStorage.getItem('location-consent') === 'accepted';
    const analytics = localStorage.getItem('analytics-consent') === 'accepted';
    const cookies = localStorage.getItem('cookie-consent') === 'accepted';
    
    setLocationConsent(location);
    setAnalyticsConsent(analytics);
    setCookieConsent(cookies);
  }, []);

  const updateLocationConsent = (enabled: boolean) => {
    setLocationConsent(enabled);
    localStorage.setItem('location-consent', enabled ? 'accepted' : 'declined');
    
    if (enabled) {
      // Request location permission
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          () => {
            toast({
              title: "Locația activată",
              description: "Acum îți vom arăta parcările din apropierea ta"
            });
          },
          () => {
            toast({
              title: "Locația nu poate fi accesată",
              description: "Vom folosi locația implicită din Timișoara",
              variant: "destructive"
            });
          }
        );
      }
    } else {
      toast({
        title: "Locația dezactivată",
        description: "Vom folosi locația implicită din Timișoara"
      });
    }
  };

  const updateAnalyticsConsent = (enabled: boolean) => {
    setAnalyticsConsent(enabled);
    localStorage.setItem('analytics-consent', enabled ? 'accepted' : 'declined');
    
    toast({
      title: enabled ? "Analiză activată" : "Analiză dezactivată",
      description: enabled 
        ? "Ne ajuți să îmbunătățim aplicația" 
        : "Nu vom mai colecta date de analiză"
    });
  };

  const updateCookieConsent = (enabled: boolean) => {
    setCookieConsent(enabled);
    localStorage.setItem('cookie-consent', enabled ? 'accepted' : 'essential-only');
    
    toast({
      title: enabled ? "Cookie-uri activate" : "Doar cookie-uri esențiale",
      description: enabled 
        ? "Experiența ta va fi optimizată" 
        : "Vor fi folosite doar cookie-urile necesare"
    });
  };

  const resetAllSettings = () => {
    localStorage.removeItem('cookie-consent');
    localStorage.removeItem('location-consent');
    localStorage.removeItem('analytics-consent');
    
    setLocationConsent(false);
    setAnalyticsConsent(false);
    setCookieConsent(false);
    
    toast({
      title: "Setări resetate",
      description: "Toate preferințele au fost șterse. Reîncarcă pagina pentru a fi întrebat din nou.",
      variant: "destructive"
    });
  };

  return (
    <Card className="w-full max-w-2xl bg-card/50 backdrop-blur-sm border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="h-5 w-5" />
          <span>Setări de Confidențialitate</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Location Settings */}
        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
          <div className="flex items-center space-x-3">
            <MapPin className="h-5 w-5 text-blue-400" />
            <div>
              <div className="font-medium text-white">Acces la Locație</div>
              <div className="text-sm text-slate-400">
                Pentru parkări din apropierea ta
              </div>
            </div>
            <Badge variant={locationConsent ? "default" : "secondary"}>
              {locationConsent ? "Activat" : "Dezactivat"}
            </Badge>
          </div>
          <Switch
            checked={locationConsent}
            onCheckedChange={updateLocationConsent}
          />
        </div>

        {/* Analytics Settings */}
        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Shield className="h-5 w-5 text-green-400" />
            <div>
              <div className="font-medium text-white">Analiză și Îmbunătățiri</div>
              <div className="text-sm text-slate-400">
                Pentru îmbunătățirea aplicației
              </div>
            </div>
            <Badge variant={analyticsConsent ? "default" : "secondary"}>
              {analyticsConsent ? "Activat" : "Dezactivat"}
            </Badge>
          </div>
          <Switch
            checked={analyticsConsent}
            onCheckedChange={updateAnalyticsConsent}
          />
        </div>

        {/* Cookie Settings */}
        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Cookie className="h-5 w-5 text-amber-400" />
            <div>
              <div className="font-medium text-white">Cookie-uri Funcționale</div>
              <div className="text-sm text-slate-400">
                Pentru salvarea preferințelor
              </div>
            </div>
            <Badge variant={cookieConsent ? "default" : "secondary"}>
              {cookieConsent ? "Toate" : "Doar Esențiale"}
            </Badge>
          </div>
          <Switch
            checked={cookieConsent}
            onCheckedChange={updateCookieConsent}
          />
        </div>

        {/* Info Section */}
        <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-800">
          <div className="text-sm text-slate-300">
            <strong>Notă:</strong> Aceste setări sunt salvate local pe dispozitivul tău. 
            Locația ta nu este transmisă pe servere externe și este folosită doar pentru 
            calcularea distanțelor până la parkări.
          </div>
        </div>

        {/* Reset Button */}
        <div className="flex justify-center pt-4">
          <Button 
            onClick={resetAllSettings} 
            variant="outline" 
            className="text-red-400 border-red-400 hover:bg-red-400/10"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Resetează Toate Setările
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}; 