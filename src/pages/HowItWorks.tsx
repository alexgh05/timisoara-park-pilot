import { useLanguage } from "@/contexts/LanguageContext";

const HowItWorks = () => {
  const { language } = useLanguage();

  const steps = [
    {
      number: "01",
      title: language === 'ro' ? "Detectare" : "Detection",
      description: language === 'ro'
        ? "Camerele detectează vehiculele automat"
        : "Cameras detect vehicles automatically"
    },
    {
      number: "02",
      title: language === 'ro' ? "Citire" : "Reading",
      description: language === 'ro'
        ? "ANPR citește plăcuța instant"
        : "ANPR reads the plate instantly"
    },
    {
      number: "03",
      title: language === 'ro' ? "Verificare" : "Check",
      description: language === 'ro'
        ? "Verifică plata în baza de date"
        : "Checks payment in database"
    },
    {
      number: "04",
      title: language === 'ro' ? "Alertă" : "Alert",
      description: language === 'ro'
        ? "Generează alertă dacă nu e plătit"
        : "Generates alert if unpaid"
    }
  ];

  return (
    <div className="min-h-screen relative">
      <div className="px-4 sm:px-6 py-8 sm:py-12 max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <p className="text-xs sm:text-sm font-medium text-primary mb-2">
            {language === 'ro' ? 'Tehnologie ANPR' : 'ANPR Technology'}
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">
            {language === 'ro' ? 'Cum Funcționează?' : 'How It Works?'}
          </h1>
        </div>

        {/* Main Content - Image + Steps side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Image */}
          <div className="rounded-2xl overflow-hidden ring-1 ring-border/50 bg-card/50">
            <img 
              src="/WhatsApp Image 2025-12-02 at 14.57.51_264eb1e8.jpg" 
              alt="ANPR Technology"
              className="w-full h-48 sm:h-64 object-cover"
            />
            <div className="p-4">
              <h3 className="text-sm font-semibold text-foreground mb-1">
                {language === 'ro' ? 'Recunoaștere Automată' : 'Automatic Recognition'}
              </h3>
              <p className="text-xs text-muted-foreground">
                {language === 'ro' 
                  ? 'Sistemul detectează vehiculele și citește plăcuțele în timp real cu precizie de 99.9%'
                  : 'The system detects vehicles and reads plates in real-time with 99.9% accuracy'}
              </p>
            </div>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-2 gap-3">
            {steps.map((step, index) => (
              <div 
                key={index}
                className="rounded-xl bg-card/80 backdrop-blur-sm ring-1 ring-border/50 p-4"
              >
                <div className="text-2xl font-bold text-primary/40 mb-2">
                  {step.number}
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  {step.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="rounded-xl bg-card/80 backdrop-blur-sm ring-1 ring-border/50 p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-primary">99.9%</div>
            <p className="text-xs text-muted-foreground">{language === 'ro' ? 'Precizie' : 'Accuracy'}</p>
          </div>
          <div className="rounded-xl bg-card/80 backdrop-blur-sm ring-1 ring-border/50 p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-green-500">&lt;1s</div>
            <p className="text-xs text-muted-foreground">{language === 'ro' ? 'Procesare' : 'Processing'}</p>
          </div>
          <div className="rounded-xl bg-card/80 backdrop-blur-sm ring-1 ring-border/50 p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-violet-500">24/7</div>
            <p className="text-xs text-muted-foreground">{language === 'ro' ? 'Activ' : 'Active'}</p>
          </div>
        </div>

        {/* How it helps */}
        <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-violet-500/10 ring-1 ring-border/50 p-5 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-foreground mb-3 text-center">
            {language === 'ro' ? 'Beneficii pentru Oraș' : 'Benefits for the City'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm font-medium text-foreground">{language === 'ro' ? 'Venituri Crescute' : 'Increased Revenue'}</p>
              <p className="text-xs text-muted-foreground">{language === 'ro' ? 'Mai puține parcări neplătite' : 'Fewer unpaid parkings'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{language === 'ro' ? 'Trafic Redus' : 'Reduced Traffic'}</p>
              <p className="text-xs text-muted-foreground">{language === 'ro' ? 'Șoferii găsesc locuri mai rapid' : 'Drivers find spots faster'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{language === 'ro' ? 'Control Automat' : 'Automated Control'}</p>
              <p className="text-xs text-muted-foreground">{language === 'ro' ? 'Fără intervenție umană' : 'No human intervention'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
