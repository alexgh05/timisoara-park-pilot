import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Sidebar } from "@/components/Sidebar";
import { CookieConsent } from "@/components/CookieConsent";
import { Footer } from "@/components/Footer";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { ScrollToTop } from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Analytics from "./pages/Analytics";
import PublicTransport from "./pages/PublicTransport";
import BikeStations from "./pages/BikeStations";
import NotFound from "./pages/NotFound";
import SmartSpot from "./pages/SmartSpot";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Partners from "./pages/Partners";
import HowItWorks from "./pages/HowItWorks";

const queryClient = new QueryClient();

const App = () => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const handleLocationPermission = (location: { lat: number; lng: number }) => {
    setUserLocation(location);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <ThemeProvider defaultTheme="dark" storageKey="parking-theme">
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <AnimatedBackground />
              <div className="min-h-screen relative">
                <div className="flex flex-col md:flex-row">
                  <Sidebar />
                  <div className="flex-1 flex flex-col min-h-screen w-full">
                    <main className="flex-1 pt-16 md:pt-0">
                      <Routes>
                        <Route path="/" element={<SmartSpot />} />
                        <Route path="/how-it-works" element={<HowItWorks />} />
                        <Route path="/parking" element={<Index userLocation={userLocation} />} />
                        <Route path="/analytics" element={<Analytics />} />
                        <Route path="/public-transport" element={<PublicTransport />} />
                        <Route path="/bike-stations" element={<BikeStations />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/partners" element={<Partners />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>
                    <Footer />
                  </div>
                </div>
              </div>
              <CookieConsent onLocationPermissionGranted={handleLocationPermission} />
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
