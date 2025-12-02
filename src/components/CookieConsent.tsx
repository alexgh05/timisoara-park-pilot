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
    <div className="fixed bottom-0 left-0 right-0 z-50 p-3 sm:p-4">
      <div className="max-w-lg mx-auto bg-card/95 backdrop-blur-xl rounded-xl sm:rounded-2xl ring-1 ring-border/50 shadow-2xl p-4 sm:p-5">
        <div className="flex items-start gap-3 mb-3">
          <Cookie className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-1">
              Cookie-uri și Locație
            </h3>
            <p className="text-xs text-muted-foreground">
              Folosim cookie-uri și locația ta pentru a-ți arăta parcările din apropiere.
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={handleAcceptAll} 
            className="flex-1 min-w-[120px] px-3 py-2 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Acceptă tot
          </button>
          <button 
            onClick={handleAcceptEssential} 
            className="px-3 py-2 text-xs font-medium bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
          >
            Doar esențiale
          </button>
          <button 
            onClick={handleDeclineAll} 
            className="px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Respinge
          </button>
        </div>
      </div>
    </div>
  );
};