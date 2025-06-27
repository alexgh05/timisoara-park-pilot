import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Cookie, Shield, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CookieConsentProps {
  onLocationPermissionGranted?: (location: { lat: number; lng: number }) => void;
}

export const CookieConsent = ({ onLocationPermissionGranted }: CookieConsentProps) => {
  const [showConsent, setShowConsent] = useState(false);
  const [consentStatus, setConsentStatus] = useState<'pending' | 'accepted' | 'declined'>('pending');
  const { toast } = useToast();

  useEffect(() => {
    // Check if user has already given consent
    const hasConsent = localStorage.getItem('cookie-consent');
    const locationConsent = localStorage.getItem('location-consent');
    
    if (!hasConsent) {
      setShowConsent(true);
    } else if (hasConsent === 'accepted' && locationConsent === 'accepted') {
      // Auto-request location if previously accepted
      requestLocation();
    }
  }, []);

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          onLocationPermissionGranted?.(location);
          toast({
            title: "Locația detectată",
            description: "Acum putem să îți arătăm parcările din apropierea ta!"
          });
        },
        (error) => {
          console.log("Location access denied or failed", error);
          // Use default Timișoara location
          const defaultLocation = { lat: 45.7489, lng: 21.2267 };
          onLocationPermissionGranted?.(defaultLocation);
          toast({
            title: "Folosim locația implicită",
            description: "Centrul Timișoarei va fi folosit ca punct de referință",
            variant: "default"
          });
        }
      );
    }
  };

  const handleAcceptAll = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    localStorage.setItem('location-consent', 'accepted');
    localStorage.setItem('analytics-consent', 'accepted');
    
    setConsentStatus('accepted');
    setShowConsent(false);
    
    // Request location permission
    requestLocation();
    
    toast({
      title: "Cookie-uri acceptate",
      description: "Mulțumim! Experiența ta va fi optimizată."
    });
  };

  const handleAcceptEssential = () => {
    localStorage.setItem('cookie-consent', 'essential-only');
    localStorage.setItem('location-consent', 'declined');
    localStorage.setItem('analytics-consent', 'declined');
    
    setConsentStatus('declined');
    setShowConsent(false);
    
    // Use default location
    const defaultLocation = { lat: 45.7489, lng: 21.2267 };
    onLocationPermissionGranted?.(defaultLocation);
    
    toast({
      title: "Doar cookie-uri esențiale",
      description: "Vom folosa locația implicită din Timișoara"
    });
  };

  const handleDeclineAll = () => {
    localStorage.setItem('cookie-consent', 'declined');
    localStorage.setItem('location-consent', 'declined');
    localStorage.setItem('analytics-consent', 'declined');
    
    setConsentStatus('declined');
    setShowConsent(false);
    
    // Use default location
    const defaultLocation = { lat: 45.7489, lng: 21.2267 };
    onLocationPermissionGranted?.(defaultLocation);
    
    toast({
      title: "Cookie-uri respinse",
      description: "Vom foloca doar funcționalitățile de bază",
      variant: "destructive"
    });
  };

  if (!showConsent) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-end justify-center p-4 z-50">
      <Card className="w-full max-w-2xl bg-card/95 backdrop-blur-sm border-slate-700 animate-in slide-in-from-bottom-5">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Cookie className="h-5 w-5 text-amber-500" />
            <span>Cookie-uri și Permisiuni de Locație</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-slate-300">
            Pentru a îți oferi cea mai bună experiență cu aplicația de parcare din Timișoara, 
            avem nevoie de câteva permisiuni:
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg">
              <MapPin className="h-5 w-5 text-blue-400" />
              <div className="flex-1">
                <div className="font-medium text-white">Acces la Locație</div>
                <div className="text-xs text-slate-400">
                  Pentru a găsi parcările din apropierea ta și pentru navigare
                </div>
              </div>
              <Badge variant="secondary">Recomandat</Badge>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg">
              <Cookie className="h-5 w-5 text-amber-400" />
              <div className="flex-1">
                <div className="font-medium text-white">Cookie-uri Funcționale</div>
                <div className="text-xs text-slate-400">
                  Pentru a salva preferințele tale și a îmbunătăți experiența
                </div>
              </div>
              <Badge variant="outline">Esențial</Badge>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg">
              <Shield className="h-5 w-5 text-green-400" />
              <div className="flex-1">
                <div className="font-medium text-white">Analiză și Îmbunătățiri</div>
                <div className="text-xs text-slate-400">
                  Pentru a înțelege cum folosești aplicația și a o îmbunătăți
                </div>
              </div>
              <Badge variant="secondary">Opțional</Badge>
            </div>
          </div>
          
          <div className="text-xs text-slate-400 p-3 bg-blue-900/20 rounded-lg border border-blue-800">
            <strong>Confidențialitate:</strong> Locația ta nu va fi stocată permanent și va fi folosită 
            doar pentru a îți arăta parcările apropiate. Poți schimba aceste setări oricând.
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button 
              onClick={handleAcceptAll} 
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Acceptă Toate (Recomandat)
            </Button>
            <Button 
              onClick={handleAcceptEssential} 
              variant="outline" 
              className="flex-1"
            >
              Doar Esențiale
            </Button>
            <Button 
              onClick={handleDeclineAll} 
              variant="ghost" 
              className="flex-1 text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4 mr-2" />
              Respinge
            </Button>
          </div>
          
          <div className="text-xs text-center text-slate-500">
            Prin folosirea aplicației accepți{" "}
            <a href="/privacy" className="text-blue-400 hover:underline">
              Politica de Confidențialitate
            </a>{" "}
            și{" "}
            <a href="/terms" className="text-blue-400 hover:underline">
              Termenii de Utilizare
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 