
import { useState } from "react";
import { ParkingMap } from "@/components/ParkingMap";
import { ParkingStats } from "@/components/ParkingStats";
import { RouteAlternatives } from "@/components/RouteAlternatives";
import { ChatBot } from "@/components/ChatBot";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

const Index = () => {
  const [showChat, setShowChat] = useState(false);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">
            Timișoara Smart Parking
          </h1>
          <p className="text-slate-300">
            Real-time parking availability and intelligent route planning
          </p>
        </div>

        {/* Stats Overview */}
        <ParkingStats />

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
          {/* Map */}
          <div className="xl:col-span-2">
            <ParkingMap onZoneSelect={setSelectedZone} />
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
