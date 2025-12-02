import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

const PublicTransport = () => {
  const { language } = useLanguage();

  const busLines = [
    {
      number: '11',
      name: language === 'ro' ? 'Linia 11' : 'Line 11',
      route: language === 'ro' 
        ? 'Circumvalațiuni - Piața Libertății - Centru - UPT'
        : 'Circumvalațiuni - Piața Libertății - Center - UPT',
      frequency: '8-12 min',
      status: 'active',
      nextArrival: '3 min'
    },
    {
      number: '14',
      name: language === 'ro' ? 'Linia 14' : 'Line 14',
      route: language === 'ro' 
        ? 'Fabric - Piața Unirii - Centru - Bega'
        : 'Fabric - Piața Unirii - Center - Bega',
      frequency: '10-15 min',
      status: 'active',
      nextArrival: '7 min'
    },
    {
      number: '8',
      name: language === 'ro' ? 'Linia 8' : 'Line 8',
      route: language === 'ro' 
        ? 'Complexul Studențesc - Iulius Mall - Aeroport'
        : 'Student Complex - Iulius Mall - Airport',
      frequency: '15-20 min',
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
      frequency: '6-10 min',
      status: 'active',
      nextArrival: '5 min'
    },
    {
      number: '2',
      name: language === 'ro' ? 'Linia 2' : 'Line 2',
      route: language === 'ro' 
        ? 'Bucovina - Centru - Calea Sagului'
        : 'Bucovina - Center - Calea Sagului',
      frequency: '8-12 min',
      status: 'maintenance',
      nextArrival: 'N/A'
    }
  ];

  const openInMaps = (lineNumber: string) => {
    const query = `transport public linia ${lineNumber} Timișoara`;
    window.open(`https://www.google.com/maps/search/${encodeURIComponent(query)}`, '_blank');
  };

  return (
    <div className="min-h-screen relative">
      <div className="px-4 sm:px-6 py-6 sm:py-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-1 sm:mb-2">
            {language === 'ro' ? 'Transport Public' : 'Public Transport'}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {language === 'ro' 
              ? 'Informații în timp real despre autobuzele și tramvaiele din Timișoara'
              : 'Real-time information about buses and trams in Timișoara'
            }
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-6 sm:mb-8">
          <div className="rounded-xl bg-card p-3 sm:p-4 ring-1 ring-border/50">
            <p className="text-xs text-muted-foreground mb-1">{language === 'ro' ? 'Linii Active' : 'Active Lines'}</p>
            <p className="text-lg sm:text-2xl font-bold text-foreground">8</p>
            <p className="text-xs text-muted-foreground">{language === 'ro' ? 'din 9' : 'of 9'}</p>
          </div>
          <div className="rounded-xl bg-card p-3 sm:p-4 ring-1 ring-border/50">
            <p className="text-xs text-muted-foreground mb-1">{language === 'ro' ? 'Frecvență' : 'Frequency'}</p>
            <p className="text-lg sm:text-2xl font-bold text-foreground">9 min</p>
            <p className="text-xs text-muted-foreground">{language === 'ro' ? 'medie' : 'average'}</p>
          </div>
          <div className="rounded-xl bg-card p-3 sm:p-4 ring-1 ring-border/50">
            <p className="text-xs text-muted-foreground mb-1">{language === 'ro' ? 'Acoperire' : 'Coverage'}</p>
            <p className="text-lg sm:text-2xl font-bold text-foreground">89%</p>
            <p className="text-xs text-muted-foreground">{language === 'ro' ? 'oraș' : 'city'}</p>
          </div>
          <div className="rounded-xl bg-card p-3 sm:p-4 ring-1 ring-border/50">
            <p className="text-xs text-muted-foreground mb-1">{language === 'ro' ? 'Electrice' : 'Electric'}</p>
            <p className="text-lg sm:text-2xl font-bold text-foreground">67%</p>
            <p className="text-xs text-green-500">eco</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Bus Lines */}
          <div className="rounded-xl sm:rounded-2xl bg-card ring-1 ring-border/50 overflow-hidden">
            <div className="px-4 py-3 sm:px-5 sm:py-4 border-b border-border/40">
              <h2 className="text-sm sm:text-base font-semibold">{language === 'ro' ? 'Linii de Autobuz' : 'Bus Lines'}</h2>
            </div>
            <div className="p-3 sm:p-4 space-y-3">
              {busLines.map((line, index) => (
                <div 
                  key={index} 
                  className="p-3 sm:p-4 bg-muted/30 rounded-lg sm:rounded-xl ring-1 ring-border/30"
                >
                  <div className="flex items-start gap-3 mb-2">
                    <Badge className="bg-blue-600 text-white shrink-0">{line.number}</Badge>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-sm font-medium text-foreground">{line.name}</h3>
                        <Badge variant={line.status === 'active' ? 'default' : 'secondary'} className="text-xs shrink-0">
                          {line.status === 'active' ? (language === 'ro' ? 'Activ' : 'Active') : 'N/A'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{line.route}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{language === 'ro' ? 'Frecvență:' : 'Freq:'} {line.frequency}</span>
                      <span>{language === 'ro' ? 'Următorul:' : 'Next:'} {line.nextArrival}</span>
                    </div>
                    <button
                      onClick={() => openInMaps(line.number)}
                      className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors"
                    >
                      {language === 'ro' ? 'Vezi' : 'View'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
                  
          {/* Tram Lines */}
          <div className="rounded-xl sm:rounded-2xl bg-card ring-1 ring-border/50 overflow-hidden">
            <div className="px-4 py-3 sm:px-5 sm:py-4 border-b border-border/40">
              <h2 className="text-sm sm:text-base font-semibold">{language === 'ro' ? 'Linii de Tramvai' : 'Tram Lines'}</h2>
            </div>
            <div className="p-3 sm:p-4 space-y-3">
              {tramLines.map((line, index) => (
                <div 
                  key={index} 
                  className="p-3 sm:p-4 bg-muted/30 rounded-lg sm:rounded-xl ring-1 ring-border/30"
                >
                  <div className="flex items-start gap-3 mb-2">
                    <Badge className="bg-green-600 text-white shrink-0">{line.number}</Badge>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-sm font-medium text-foreground">{line.name}</h3>
                        <Badge variant={line.status === 'active' ? 'default' : 'secondary'} className="text-xs shrink-0">
                          {line.status === 'active' ? (language === 'ro' ? 'Activ' : 'Active') : 'N/A'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{line.route}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{language === 'ro' ? 'Frecvență:' : 'Freq:'} {line.frequency}</span>
                      <span>{language === 'ro' ? 'Următorul:' : 'Next:'} {line.nextArrival}</span>
                    </div>
                    <button
                      onClick={() => openInMaps(line.number)}
                      className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors"
                    >
                      {language === 'ro' ? 'Vezi' : 'View'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-4 sm:mt-6 rounded-xl sm:rounded-2xl bg-card ring-1 ring-border/50 overflow-hidden">
          <div className="px-4 py-3 sm:px-5 sm:py-4 border-b border-border/40">
            <h2 className="text-sm sm:text-base font-semibold">{language === 'ro' ? 'Sfaturi' : 'Tips'}</h2>
          </div>
          <div className="p-3 sm:p-4">
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li>- {language === 'ro' ? 'Evită orele 7-9 și 17-19 pentru călătorii confortabile' : 'Avoid 7-9 AM and 5-7 PM for comfortable rides'}</li>
              <li>- {language === 'ro' ? 'Descarcă aplicația STPT pentru tracking în timp real' : 'Download STPT app for real-time tracking'}</li>
              <li>- {language === 'ro' ? 'Plătește cu cardul contactless pentru acces rapid' : 'Pay with contactless card for quick access'}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicTransport;
