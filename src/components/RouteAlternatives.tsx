import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface RouteAlternativesProps {
  selectedZone: string | null;
}

export const RouteAlternatives = ({ selectedZone }: RouteAlternativesProps) => {
  const { t, language } = useLanguage();

  const parkingAlternatives = [
    {
      name: "Bega Shopping Center",
      distance: "1.2km",
      driveTime: "8 min",
      spots: "156/300",
      availability: 52
    },
    {
      name: "Iulius Mall", 
      distance: "2.1km",
      driveTime: "12 min",
      spots: "267/450",
      availability: 59
    }
  ];

  const openGoogleMapsRoute = (destination: string) => {
    const locationConsent = localStorage.getItem('location-consent');
    
    if (locationConsent === 'accepted' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const url = `https://www.google.com/maps/dir/${position.coords.latitude},${position.coords.longitude}/${encodeURIComponent(destination + " Timișoara")}`;
          window.open(url, '_blank');
        },
        () => {
          const baseUrl = "https://www.google.com/maps/search/";
          window.open(`${baseUrl}${encodeURIComponent(destination + " Timișoara")}`, '_blank');
        }
      );
    } else {
      const baseUrl = "https://www.google.com/maps/search/";
      window.open(`${baseUrl}${encodeURIComponent(destination + " Timișoara")}`, '_blank');
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Parking Alternatives */}
      <div className="rounded-xl sm:rounded-2xl ring-1 ring-border/50 bg-card overflow-hidden">
        <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-border/40">
          <h3 className="text-xs sm:text-sm font-semibold">{t('routes.alternativeParking')}</h3>
        </div>
        <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
          {parkingAlternatives.map((alt, index) => (
            <button
              key={index}
              onClick={() => openGoogleMapsRoute(alt.name)}
              className="w-full p-3 sm:p-4 rounded-lg sm:rounded-xl bg-muted/30 hover:bg-muted/50 ring-1 ring-border/30 transition-all duration-200 text-left"
            >
              <h4 className="font-medium text-xs sm:text-sm text-foreground">{alt.name}</h4>
              <p className="text-xs text-muted-foreground mt-1">{alt.spots} {t('routes.available')}</p>
              <p className="text-xs text-muted-foreground mt-1">{alt.distance} - {alt.driveTime}</p>
              <div className="mt-2 sm:mt-3 h-1 sm:h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{ width: `${alt.availability}%` }}
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Transport Options */}
      <div className="rounded-xl sm:rounded-2xl ring-1 ring-border/50 bg-card overflow-hidden">
        <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-border/40">
          <h3 className="text-xs sm:text-sm font-semibold">{t('routes.otherTransportOptions')}</h3>
        </div>
        <div className="p-3 sm:p-4 space-y-2">
          <Link to="/public-transport" className="block p-2 sm:p-3 rounded-lg sm:rounded-xl hover:bg-muted/50 transition-colors">
            <p className="text-xs sm:text-sm font-medium">{t('routes.transportPublic')}</p>
            <p className="text-xs text-muted-foreground">{t('routes.busAndTram')}</p>
          </Link>
          
          <Link to="/bike-stations" className="block p-2 sm:p-3 rounded-lg sm:rounded-xl hover:bg-muted/50 transition-colors">
            <p className="text-xs sm:text-sm font-medium">{t('routes.bikeStations')}</p>
            <p className="text-xs text-muted-foreground">{t('routes.ecoFriendlyBikes')}</p>
          </Link>
        </div>
      </div>

      {/* Tips */}
      <div className="rounded-xl sm:rounded-2xl ring-1 ring-border/50 bg-card overflow-hidden">
        <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-border/40">
          <h3 className="text-xs sm:text-sm font-semibold">{t('routes.smartTips')}</h3>
        </div>
        <div className="p-3 sm:p-4">
          <ul className="space-y-1.5 sm:space-y-2 text-xs text-muted-foreground">
            <li>- {language === 'ro' ? 'Centrele comerciale au de obicei cele mai multe locuri' : 'Shopping centers usually have the most spots'}</li>
            <li>- {language === 'ro' ? 'Ore de vârf: 7-9 AM și 17-19 PM' : 'Peak hours: 7-9 AM and 5-7 PM'}</li>
            <li>- {language === 'ro' ? 'Rutele se deschid în Google Maps' : 'Routes open in Google Maps'}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
