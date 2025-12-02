import { useLanguage } from "@/contexts/LanguageContext";

const SmartSpot = () => {
  const { language } = useLanguage();

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative py-12 sm:py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        </div>
        
        <div className="relative px-4 sm:px-6 py-8 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-5xl text-center">
            <p className="text-xs sm:text-sm font-medium text-primary mb-4 sm:mb-6">
              {language === 'ro' ? 'Tehnologie pentru Orașe Inteligente' : 'Smart City Technology'}
            </p>
            
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-bold tracking-tight text-foreground mb-4 sm:mb-8">
              <span className="bg-gradient-to-r from-primary via-blue-400 to-violet-500 bg-clip-text text-transparent">
                Smart-Spot
              </span>
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl leading-relaxed text-muted-foreground max-w-3xl mx-auto px-2">
              {language === 'ro' 
                ? 'Revoluționăm modul în care orașele gestionează parcarea. Soluții inteligente pentru cetățeni și instituții publice.'
                : 'Revolutionizing how cities manage parking. Smart solutions for citizens and public institutions.'}
            </p>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="px-4 sm:px-6 py-12 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {language === 'ro' ? 'Problema este clară' : 'The Problem is Clear'}
            </h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
              {language === 'ro' 
                ? 'Șoferii trebuie să plătească pentru parcare, dar mulți nu o fac. Controlul manual nu poate ține pasul.'
                : "Drivers are required to pay for parking, but many don't. Manual enforcement can't keep up."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                title: language === 'ro' ? 'Venituri Pierdute' : 'Lost Revenue',
                description: language === 'ro' 
                  ? 'Orașele pierd venituri semnificative din taxele de parcare neplătite.'
                  : 'Cities lose significant revenue from unpaid parking fees.'
              },
              {
                title: language === 'ro' ? 'Haos în Trafic' : 'Traffic Chaos',
                description: language === 'ro'
                  ? 'Controlul manual creează întârzieri și congestie în trafic.'
                  : 'Manual enforcement creates delays and congestion.'
              },
              {
                title: language === 'ro' ? 'Frustrare' : 'Frustration',
                description: language === 'ro'
                  ? 'Atât șoferii, cât și oficialii se confruntă cu sisteme ineficiente.'
                  : 'Both drivers and officials face inefficient systems.'
              }
            ].map((item, i) => (
              <div key={i} className="rounded-2xl bg-card p-6 ring-1 ring-border/50">
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="px-4 sm:px-6 py-12 sm:py-20 lg:px-8 bg-muted/30">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {language === 'ro' ? 'Soluția Noastră Inteligentă' : 'Our Smart Solution'}
            </h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
              {language === 'ro'
                ? 'Folosim camere și recunoașterea plăcuțelor de înmatriculare pentru a verifica în timp real dacă un vehicul a plătit.'
                : 'We use cameras and license plate recognition to check in real time if a vehicle has paid.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12">
            <div className="space-y-6">
              {[
                {
                  title: language === 'ro' ? 'Monitorizare în Timp Real' : 'Real-time Monitoring',
                  description: language === 'ro'
                    ? 'Sisteme avansate de camere cu tehnologie de recunoaștere a plăcuțelor pentru verificare instantă.'
                    : 'Advanced camera systems with license plate recognition technology for instant verification.'
                },
                {
                  title: language === 'ro' ? 'Control Automatizat' : 'Automated Enforcement',
                  description: language === 'ro'
                    ? 'Control echitabil și continuu fără intervenție umană, eliminând părtinirea și întârzierile.'
                    : 'Fair and continuous enforcement without human intervention, eliminating bias and delays.'
                },
                {
                  title: language === 'ro' ? 'Analiză de Date' : 'Data Analytics',
                  description: language === 'ro'
                    ? 'Informații complete despre tiparele de parcare și oportunități de optimizare a veniturilor.'
                    : 'Comprehensive insights into parking patterns and revenue optimization opportunities.'
                }
              ].map((item, i) => (
                <div key={i} className="p-5 rounded-xl bg-card ring-1 ring-border/50">
                  <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-violet-500/10 p-8 ring-1 ring-border/50">
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {language === 'ro' ? 'Integrare cu Aplicația Mobilă' : 'Mobile App Integration'}
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                {language === 'ro'
                  ? 'Arată șoferilor unde sunt locurile de parcare disponibile în timp real.'
                  : 'Show drivers where parking spots are available in real time.'}
              </p>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>- {language === 'ro' ? 'Disponibilitate în timp real' : 'Real-time availability'}</li>
                <li>- {language === 'ro' ? 'Navigare directă la locuri libere' : 'Direct navigation to free spaces'}</li>
                <li>- {language === 'ro' ? 'Congestie redusă în trafic' : 'Reduced traffic congestion'}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-4 sm:px-6 py-12 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {language === 'ro' ? 'De ce Smart-Spot?' : 'Why Smart-Spot?'}
            </h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-lg text-muted-foreground px-2">
              {language === 'ro'
                ? 'Soluția noastră economisește timp, reduce traficul și face orașul să funcționeze mai bine.'
                : 'Our solution saves time, reduces traffic, and makes the city flow better.'}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {[
              { title: language === 'ro' ? 'Precizie' : 'Precision', desc: '99.9%' },
              { title: language === 'ro' ? 'Viteză' : 'Speed', desc: language === 'ro' ? 'Timp real' : 'Real-time' },
              { title: language === 'ro' ? 'Acoperire' : 'Coverage', desc: language === 'ro' ? 'Tot orașul' : 'City-wide' },
              { title: 'ROI', desc: language === 'ro' ? 'Venituri crescute' : 'Increased revenue' }
            ].map((item, i) => (
              <div key={i} className="rounded-2xl bg-card p-4 sm:p-6 ring-1 ring-border/50 text-center">
                <h3 className="text-sm sm:text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      </div>
  );
};

export default SmartSpot;
