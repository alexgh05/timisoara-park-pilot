import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Sidebar } from "@/components/Sidebar";
import { CookieConsent } from "@/components/CookieConsent";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import Contact from "./pages/Contact";
import Analytics from "./pages/Analytics";
import PublicTransport from "./pages/PublicTransport";
import BikeStations from "./pages/BikeStations";
import LiveParking from "./pages/LiveParking";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const handleLocationPermission = (location: { lat: number; lng: number }) => {
    setUserLocation(location);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="parking-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="flex min-h-screen bg-background">
              <Sidebar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Index userLocation={userLocation} />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/public-transport" element={<PublicTransport />} />
                  <Route path="/bike-stations" element={<BikeStations />} />
                  <Route path="/live-parking" element={<LiveParking />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
            <CookieConsent onLocationPermissionGranted={handleLocationPermission} />
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
