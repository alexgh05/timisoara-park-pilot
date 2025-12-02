import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Car, BarChart3, Menu, X, Bus, Bike, Globe, Sparkles, Users, Mail, Handshake, Cog } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    { href: "/", label: "Smart-Spot", icon: Sparkles },
    { href: "/how-it-works", label: language === 'ro' ? "Cum Funcționează" : "How It Works", icon: Cog },
    { href: "/parking", label: t('nav.parkingMap'), icon: Car },
    { href: "/public-transport", label: t('nav.publicTransport'), icon: Bus },
    { href: "/bike-stations", label: t('nav.bikeStations'), icon: Bike },
    { href: "/analytics", label: t('nav.analytics'), icon: BarChart3 },
    { href: "/about", label: language === 'ro' ? "Despre Noi" : "About Us", icon: Users },
    { href: "/contact", label: language === 'ro' ? "Contact" : "Contact", icon: Mail },
    { href: "/partners", label: language === 'ro' ? "Parteneri" : "Partners", icon: Handshake },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden flex h-10 w-10 items-center justify-center rounded-lg bg-card ring-1 ring-border/50 shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          // Mobile: fixed sidebar with glass effect
          "fixed inset-y-0 left-0 z-40 w-64 bg-card/80 backdrop-blur-2xl border-r border-white/5 transition-all duration-300",
          // Desktop: sticky sidebar that follows scroll
          "md:sticky md:top-0 md:block md:w-64 md:shrink-0 md:h-screen",
          // Mobile toggle
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex flex-col">
          {/* Logo Section */}
          <div className="p-6 border-b border-border/40">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg font-semibold tracking-tight">Smart-Spot</h1>
                <p className="text-xs text-muted-foreground">Timișoara</p>
              </div>
              <button
                onClick={() => setLanguage(language === 'ro' ? 'en' : 'ro')}
                className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
              >
                <Globe className="h-4 w-4" />
                {language === 'ro' ? 'EN' : 'RO'}
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4">
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
