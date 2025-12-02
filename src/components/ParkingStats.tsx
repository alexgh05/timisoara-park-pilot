import { useLanguage } from "@/contexts/LanguageContext";

export const ParkingStats = () => {
  const { t } = useLanguage();
  
  const stats = [
    {
      title: t('stats.totalSpots'),
      value: "1,030",
      change: `+12 ${t('stats.thisWeek')}`
    },
    {
      title: t('stats.availableNow'),
      value: "496",
      change: `48.2% ${t('stats.occupancy')}`
    },
    {
      title: t('stats.activeZones'),
      value: "5",
      change: t('stats.allOperational')
    },
    {
      title: t('stats.avgWaitTime'),
      value: "12 min",
      change: `-3 min ${t('stats.fromYesterday')}`
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="rounded-xl sm:rounded-2xl bg-card p-3 sm:p-5 ring-1 ring-border/50"
        >
          <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 sm:mb-2">
            {stat.title}
          </p>
          <p className="text-lg sm:text-2xl font-semibold tracking-tight text-foreground">
            {stat.value}
          </p>
          <p className="text-xs text-muted-foreground mt-1 truncate">
            {stat.change}
          </p>
        </div>
      ))}
    </div>
  );
};
