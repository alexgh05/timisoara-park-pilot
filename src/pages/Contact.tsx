import { useLanguage } from "@/contexts/LanguageContext";
import { Mail, Phone, MapPin, Send, CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";

const FORMSPREE_ID = "manrjdqr"; // Formspree form ID

const Contact = () => {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen relative">
      <div className="px-4 sm:px-6 py-8 sm:py-12 max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          <p className="text-xs sm:text-sm font-medium text-primary mb-3">
            {language === 'ro' ? 'Hai să vorbim' : "Let's Talk"}
          </p>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            {language === 'ro' ? 'Contactează-ne' : 'Contact Us'}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto">
            {language === 'ro' 
              ? 'Suntem aici să răspundem la orice întrebare despre Smart-Spot.'
              : 'We are here to answer any questions about Smart-Spot.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">
          {/* Contact Info */}
          <div className="space-y-4 sm:space-y-6">
            {/* Email Card */}
            <div className="rounded-2xl bg-card/80 backdrop-blur-sm ring-1 ring-border/50 p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-foreground mb-1">
                    Email
                  </h3>
                  <a 
                    href="mailto:alex.ghenciu05@gmail.com" 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    alex.ghenciu05@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Team Members */}
            <div className="rounded-2xl bg-card/80 backdrop-blur-sm ring-1 ring-border/50 p-5 sm:p-6">
              <h3 className="text-sm sm:text-base font-semibold text-foreground mb-4">
                {language === 'ro' ? 'Echipa Noastră' : 'Our Team'}
              </h3>
              
              <div className="space-y-4">
                {/* Ghilezan Madalin */}
                <div className="flex items-center gap-4 p-3 rounded-xl bg-muted/30 ring-1 ring-border/30">
                  <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-blue-500/30 shrink-0">
                    <img 
                      src="/ghilezan_madalin.png" 
                      alt="Ghilezan Madalin"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">Ghilezan Madalin</p>
                    <a 
                      href="tel:+40787788291" 
                      className="text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      0787 788 291
                    </a>
                  </div>
                </div>

                {/* Ghenciu Alexandru */}
                <div className="flex items-center gap-4 p-3 rounded-xl bg-muted/30 ring-1 ring-border/30">
                  <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-violet-500/30 shrink-0">
                    <img 
                      src="/ghenciu_alexandru.jpg" 
                      alt="Ghenciu Alexandru Octavian"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">Ghenciu Alexandru Octavian</p>
                    <a 
                      href="tel:+40723864811" 
                      className="text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      0723 864 811
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="rounded-2xl bg-card/80 backdrop-blur-sm ring-1 ring-border/50 p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-foreground mb-1">
                    {language === 'ro' ? 'Locație' : 'Location'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Timișoara, România
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-2xl bg-card/80 backdrop-blur-sm ring-1 ring-border/50 p-5 sm:p-8">
            <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4 sm:mb-6">
              {language === 'ro' ? 'Trimite-ne un mesaj' : 'Send us a message'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  {language === 'ro' ? 'Numele tău' : 'Your name'}
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm bg-muted/50 border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  placeholder={language === 'ro' ? 'Ion Popescu' : 'John Doe'}
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm bg-muted/50 border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  placeholder="email@exemplu.com"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  {language === 'ro' ? 'Mesaj' : 'Message'}
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm bg-muted/50 border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                  placeholder={language === 'ro' ? 'Scrie mesajul tău aici...' : 'Write your message here...'}
                />
              </div>
              
              {status === 'success' ? (
                <div className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium bg-green-500/20 text-green-400 rounded-xl">
                  <CheckCircle className="w-4 h-4" />
                  {language === 'ro' ? 'Mesaj trimis cu succes!' : 'Message sent successfully!'}
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {language === 'ro' ? 'Se trimite...' : 'Sending...'}
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {language === 'ro' ? 'Trimite mesajul' : 'Send message'}
                    </>
                  )}
                </button>
              )}
              
              {status === 'error' && (
                <p className="text-xs text-red-400 text-center">
                  {language === 'ro' ? 'Eroare la trimitere. Încearcă din nou.' : 'Error sending. Please try again.'}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
