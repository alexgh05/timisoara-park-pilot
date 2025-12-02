import { useLanguage } from "@/contexts/LanguageContext";

const About = () => {
  const { language } = useLanguage();

  const team = [
    {
      name: "Ghilezan Madalin",
      image: "/ghilezan_madalin.png",
      role: language === 'ro' ? "Co-fondator & Software Developer" : "Co-founder & Software Developer",
      education: language === 'ro' 
        ? "Student anul IV - Automatică și Calculatoare, UPT"
        : "4th year - Automation and Computers, UPT",
      bio: language === 'ro'
        ? "Dezvoltator pasionat de aplicații web moderne și site-uri performante, cu o bază solidă în C/C++, Java și tehnologii web. Focus pe soluții software robuste, scalabile și optimizate."
        : "Passionate developer of modern web applications, with a solid foundation in C/C++, Java, and web technologies. Focus on robust, scalable, and optimized software solutions.",
      skills: ["C/C++", "Java", "Web Dev", "APIs"],
      color: "blue"
    },
    {
      name: "Ghenciu Alexandru Octavian",
      image: "/ghenciu_alexandru.jpg",
      role: language === 'ro' ? "Co-fondator & Software Developer" : "Co-founder & Software Developer",
      education: language === 'ro'
        ? "Student anul IV - Automatică și Calculatoare, UPT"
        : "4th year - Automation and Computers, UPT",
      bio: language === 'ro'
        ? "Specialist în inteligență artificială și machine learning, cu experiență în backend systems și computer vision. Expert în soluții AI scalabile pentru aplicații enterprise."
        : "Specialist in AI and machine learning, with experience in backend systems and computer vision. Expert in scalable AI solutions for enterprise applications.",
      skills: ["ML/AI", "Backend", "Computer Vision"],
      color: "violet"
    }
  ];

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative py-12 sm:py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-500/10 via-transparent to-transparent" />
        </div>
        
        <div className="relative px-4 sm:px-6 py-8 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs sm:text-sm font-medium text-violet-400 mb-4 sm:mb-6">
              {language === 'ro' ? 'Echipa din Spatele Proiectului' : 'The Team Behind the Project'}
            </p>
            
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-4 sm:mb-6">
              {language === 'ro' ? 'Cunoaște ' : 'Meet '}
              <span className="bg-gradient-to-r from-violet-400 to-primary bg-clip-text text-transparent">
                {language === 'ro' ? 'Echipa' : 'the Team'}
              </span>
            </h1>
            
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
              {language === 'ro'
                ? 'Expertiză tehnică combinată cu pasiune pentru inovație și soluții software de calitate.'
                : 'Technical expertise combined with passion for innovation and quality software solutions.'}
            </p>
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="px-4 sm:px-6 py-10 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
            {team.map((member, i) => (
              <div 
                key={i} 
                className="group relative rounded-2xl sm:rounded-3xl bg-card ring-1 ring-border/50 overflow-hidden"
              >
                <div className={`h-1 sm:h-1.5 bg-gradient-to-r ${member.color === 'blue' ? 'from-blue-500 to-cyan-400' : 'from-violet-500 to-purple-400'}`} />
                
                <div className="p-4 sm:p-8">
                  {/* Profile Photo */}
                  <div className="flex justify-center mb-4 sm:mb-6">
                    <div className={`w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden ring-4 ${member.color === 'blue' ? 'ring-blue-500/20' : 'ring-violet-500/20'}`}>
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="text-center mb-4 sm:mb-6">
                    <h2 className="text-base sm:text-lg font-semibold text-foreground mb-1">{member.name}</h2>
                    <p className={`text-xs sm:text-sm font-medium ${member.color === 'blue' ? 'text-blue-500' : 'text-violet-500'}`}>{member.role}</p>
                    <p className="text-xs text-muted-foreground mt-1">{member.education}</p>
                  </div>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4 sm:mb-6 text-center">
                    {member.bio}
                  </p>

                  <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
                    {member.skills.map((skill, j) => (
                      <span 
                        key={j}
                        className={`inline-flex items-center rounded-full px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-medium ring-1 ${
                          member.color === 'blue' 
                            ? 'bg-blue-500/10 text-blue-400 ring-blue-500/20' 
                            : 'bg-violet-500/10 text-violet-400 ring-violet-500/20'
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="px-4 sm:px-6 py-10 sm:py-16 lg:px-8 bg-muted/30">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 items-center">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-4 sm:mb-6">
                {language === 'ro' ? 'Misiunea Noastră' : 'Our Mission'}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-8">
                {language === 'ro'
                  ? 'Credem că orașele pot fi mai inteligente, mai eficiente și mai prietenoase cu cetățenii. Soluția noastră Smart-Spot transformă modul în care gestionăm parcarea urbană.'
                  : 'We believe cities can be smarter, more efficient, and more citizen-friendly. Our Smart-Spot solution transforms how we manage urban parking.'}
              </p>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-muted-foreground">
                <li>- {language === 'ro' ? 'Reducem congestia traficului prin găsirea rapidă a locurilor de parcare' : 'Reduce traffic congestion by quickly finding parking spaces'}</li>
                <li>- {language === 'ro' ? 'Creștem veniturile orașelor prin eficientizarea serviciilor de parcare' : 'Increase city revenues by streamlining parking services'}</li>
                <li>- {language === 'ro' ? 'Îmbunătățim experiența șoferilor prin tehnologie inteligentă' : 'Improve driver experience through smart technology'}</li>
              </ul>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-violet-500/10 p-4 sm:p-8 ring-1 ring-border/50">
              <h3 className="text-base sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">
                {language === 'ro' ? 'Viziunea Noastră' : 'Our Vision'}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {language === 'ro'
                  ? 'Un viitor în care fiecare oraș poate gestiona parcarea în mod inteligent, automat și eficient, pentru beneficiul tuturor cetățenilor.'
                  : 'A future where every city can manage parking intelligently, automatically, and efficiently, for the benefit of all citizens.'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
