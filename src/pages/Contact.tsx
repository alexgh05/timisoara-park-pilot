import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

const Contact = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: t('contact.errorTitle'),
        description: t('contact.errorDescription'),
        variant: "destructive"
      });
      return;
    }

    // Simulate form submission
    toast({
      title: t('contact.successTitle'),
      description: t('contact.successDescription'),
    });

    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">{t('contact.title')}</h1>
          <p className="text-slate-300">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="bg-card/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Send className="h-5 w-5" />
                <span>{t('contact.sendMessage')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">{t('contact.name')} *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder={t('contact.nameRequired')}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">{t('contact.email')} *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder={t('contact.emailRequired')}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="subject">{t('contact.subject')}</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    placeholder={t('contact.subjectPlaceholder')}
                  />
                </div>
                
                <div>
                  <Label htmlFor="message">{t('contact.message')} *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder={t('contact.messagePlaceholder')}
                    rows={6}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  {t('contact.sendButton')}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Details */}
            <Card className="bg-card/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle>{t('contact.information')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/20 p-3 rounded-lg">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{t('contact.phone')}</h3>
                    <p className="text-slate-300">+40 256 123 456</p>
                    <p className="text-slate-400 text-sm">{t('contact.timeScheduleMF')}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary/20 p-3 rounded-lg">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{t('contact.email')}</h3>
                    <p className="text-slate-300">support@parksmart.ro</p>
                    <p className="text-slate-400 text-sm">{t('contact.responseTime')}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary/20 p-3 rounded-lg">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{t('contact.address')}</h3>
                    <p className="text-slate-300">
                      Strada Popa Șapcă 15<br />
                      300057 Timișoara<br />
                      România
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card className="bg-card/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>{t('contact.businessHours')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-300">{t('contact.mondayFriday')}</span>
                    <span className="text-white font-medium">{t('contact.timeSchedule')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">{t('contact.saturday')}</span>
                    <span className="text-white font-medium">{t('contact.timeScheduleSat')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">{t('contact.sunday')}</span>
                    <span className="text-slate-400">{t('contact.closed')}</span>
                  </div>
                  <div className="pt-3 border-t border-slate-600">
                    <p className="text-sm text-slate-400">
                      {t('contact.emergencySupport')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ */}
            <Card className="bg-card/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle>{t('contact.faq')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">{t('contact.faq1.question')}</h4>
                  <p className="text-sm text-slate-400">
                    {t('contact.faq1.answer')}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">{t('contact.faq2.question')}</h4>
                  <p className="text-sm text-slate-400">
                    {t('contact.faq2.answer')}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">{t('contact.faq3.question')}</h4>
                  <p className="text-sm text-slate-400">
                    {t('contact.faq3.answer')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
