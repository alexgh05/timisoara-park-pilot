import { useState } from "react";
import { ParkingMap } from "@/components/ParkingMap";
import { ParkingStats } from "@/components/ParkingStats";
import { RouteAlternatives } from "@/components/RouteAlternatives";
import { ChatBot } from "@/components/ChatBot";
import { ParkingHeatmap } from "@/components/ParkingHeatmap";
import { Button } from "@/components/ui/button";
import { MessageCircle, Moon, Sun, Languages, Map, BarChart3 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/components/ThemeProvider";

interface IndexProps {
  userLocation?: { lat: number; lng: number } | null;
}

const Index = ({ userLocation }: IndexProps) => {
  const [showChat, setShowChat] = useState(false);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'heatmap'>('map');
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleLanguage = () => {
    setLanguage(language === 'ro' ? 'en' : 'ro');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto p-6">
        {/* Header with Controls */}
        <div className="mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              {t('home.title')}
            </h1>
            <p className="text-slate-300">
              {t('home.subtitle')}
            </p>
          </div>
          
          {/* Control Buttons */}
          <div className="flex items-center space-x-2">
            {/* View Mode Toggle */}
            <div className="flex bg-card/20 backdrop-blur-sm border border-slate-700 rounded-lg p-1">
              <Button
                variant={viewMode === 'map' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('map')}
                className="h-8"
              >
                <Map className="h-4 w-4 mr-2" />
                {language === 'ro' ? 'Hartă' : 'Map'}
              </Button>
              <Button
                variant={viewMode === 'heatmap' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('heatmap')}
                className="h-8"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                {language === 'ro' ? 'Heatmap' : 'Heatmap'}
              </Button>
            </div>
            
            {/* Language Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="bg-card/50 backdrop-blur-sm border-slate-700"
            >
              <Languages className="h-4 w-4 mr-2" />
              {language === 'ro' ? 'EN' : 'RO'}
            </Button>
            
            {/* Theme Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="bg-card/50 backdrop-blur-sm border-slate-700"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <ParkingStats />

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
          {/* Map or Heatmap */}
          <div className="xl:col-span-2">
            {viewMode === 'map' ? (
              <ParkingMap onZoneSelect={setSelectedZone} userLocation={userLocation} />
            ) : (
              <ParkingHeatmap />
            )}
          </div>

          {/* Route Alternatives */}
          <div className="xl:col-span-1">
            <RouteAlternatives selectedZone={selectedZone} />
          </div>
        </div>
      </div>

      {/* Chat Bot */}
      <ChatBot isOpen={showChat} onClose={() => setShowChat(false)} />
      
      {/* Chat Button */}
      <Button
        onClick={() => setShowChat(true)}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default Index;
