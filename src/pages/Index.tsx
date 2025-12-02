import { useState } from "react";
import { ParkingMap } from "@/components/ParkingMap";
import { ParkingStats } from "@/components/ParkingStats";
import { RouteAlternatives } from "@/components/RouteAlternatives";
import { ParkingHeatmap } from "@/components/ParkingHeatmap";
import { useLanguage } from "@/contexts/LanguageContext";

interface IndexProps {
  userLocation?: { lat: number; lng: number } | null;
}

const Index = ({ userLocation }: IndexProps) => {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'heatmap'>('map');
  const { t, language, setLanguage } = useLanguage();

  return (
    <div className="min-h-screen relative">
      {/* Header */}
      <header className="border-b border-border/40">
        <div className="px-4 sm:px-6 py-4 sm:py-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
            {/* Title Section */}
            <div>
              <h1 className="text-lg sm:text-2xl lg:text-3xl font-semibold tracking-tight text-foreground">
                {t('home.title')}
              </h1>
              <p className="text-muted-foreground text-xs sm:text-sm lg:text-base max-w-xl mt-1">
                {t('home.subtitle')}
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* View Toggle */}
              <div className="inline-flex items-center rounded-lg bg-muted/50 p-1 ring-1 ring-border/50">
                <button
                  onClick={() => setViewMode('map')}
                  className={`rounded-md px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium transition-all ${
                    viewMode === 'map'
                      ? 'bg-background text-foreground shadow-sm ring-1 ring-border/50'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {language === 'ro' ? 'Hartă' : 'Map'}
                </button>
                <button
                  onClick={() => setViewMode('heatmap')}
                  className={`rounded-md px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium transition-all ${
                    viewMode === 'heatmap'
                      ? 'bg-background text-foreground shadow-sm ring-1 ring-border/50'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Heatmap
                </button>
              </div>

              {/* Language Toggle */}
              <button
                onClick={() => setLanguage(language === 'ro' ? 'en' : 'ro')}
                className="rounded-lg bg-muted/50 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-muted-foreground ring-1 ring-border/50 transition-all hover:bg-muted hover:text-foreground"
              >
                {language === 'ro' ? 'EN' : 'RO'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 py-4 sm:py-6 lg:px-8">
        {/* Stats */}
        <section className="mb-4 sm:mb-6">
          <ParkingStats />
        </section>

        {/* Map & Sidebar Grid */}
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6">
          {/* Map Area */}
          <div className="xl:col-span-8 2xl:col-span-9">
            <div className="rounded-xl sm:rounded-2xl overflow-hidden ring-1 ring-border/50 bg-card">
              {viewMode === 'map' ? (
                <ParkingMap onZoneSelect={setSelectedZone} userLocation={userLocation} />
              ) : (
                <ParkingHeatmap />
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="xl:col-span-4 2xl:col-span-3">
            <RouteAlternatives selectedZone={selectedZone} />
          </aside>
        </section>
      </main>
    </div>
  );
};

export default Index;
