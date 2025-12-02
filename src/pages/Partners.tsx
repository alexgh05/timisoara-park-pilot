import { useLanguage } from "@/contexts/LanguageContext";

const Partners = () => {
  const { language } = useLanguage();

  const partners = [
    {
      name: "EIT Urban Mobility",
      logo: "/Combination EU1 vertical_1.jpg",
      ringColor: "ring-blue-500/40",
      description: language === 'ro' 
        ? "Inițiativă a Institutului European de Inovare și Tehnologie"
        : "An initiative of the European Institute of Innovation and Technology"
    },
    {
      name: "inVest",
      logo: "/InVest Logo_tagline_Portrait.png",
      ringColor: "ring-green-500/40",
      description: language === 'ro'
        ? "Program de accelerare pentru startup-uri"
        : "Startup acceleration program"
    },
    {
      name: "ADR Vest",
      logo: "/adr-logo-primar.png",
      ringColor: "ring-violet-500/40",
      description: language === 'ro'
        ? "Agenția pentru Dezvoltare Regională Vest"
        : "West Regional Development Agency"
    }
  ];

  return (
    <div className="min-h-screen relative">
      <div className="px-4 sm:px-6 py-8 sm:py-12 max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          <p className="text-xs sm:text-sm font-medium text-primary mb-3">
            {language === 'ro' ? 'Susținători' : 'Supporters'}
          </p>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            {language === 'ro' ? 'Partenerii Noștri' : 'Our Partners'}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            {language === 'ro' 
              ? 'Proiectul Smart-Spot este susținut de organizații care cred în mobilitatea urbană inteligentă.'
              : 'Smart-Spot project is supported by organizations that believe in smart urban mobility.'}
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-10 sm:mb-16">
          {partners.map((partner, index) => (
            <div 
              key={index}
              className="rounded-2xl bg-card/80 backdrop-blur-sm ring-1 ring-border/50 p-6 sm:p-8 flex flex-col items-center text-center"
            >
              <div className={`w-full h-20 sm:h-24 rounded-xl overflow-hidden ring-1 ${partner.ringColor} bg-white flex items-center justify-center mb-4 p-4`}>
                <img 
                  src={partner.logo} 
                  alt={partner.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-foreground mb-2">
                {partner.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                {partner.description}
              </p>
            </div>
          ))}
        </div>

        {/* Visibility Statement */}
        <div className="rounded-2xl bg-card/80 backdrop-blur-sm ring-1 ring-border/50 p-6 sm:p-8">
          <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4 sm:mb-6 text-center">
            {language === 'ro' ? 'Sprijinul Partenerilor Noștri' : 'Our Partners Support'}
          </h2>
          <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-muted-foreground">
            <p className="p-3 sm:p-4 rounded-xl bg-muted/50 text-center">
              {language === 'ro'
                ? '"Activitatea noastră este sprijinită de inVest - Urban Mobility Accelerator, un program cofinanțat de EIT Urban Mobility și ADR Vest."'
                : '"Our activity is supported by inVest - Urban Mobility Accelerator, a program co-funded by EIT Urban Mobility and ADR Vest."'}
            </p>
            <p className="p-3 sm:p-4 rounded-xl bg-muted/50 text-center">
              {language === 'ro'
                ? '"EIT Urban Mobility este sprijinit de Institutul European de Inovare și Tehnologie (EIT), un organism al Uniunii Europene."'
                : '"EIT Urban Mobility is supported by the European Institute of Innovation and Technology (EIT), a body of the European Union."'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Partners;
