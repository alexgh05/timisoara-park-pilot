import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'ro' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  ro: {
    // Navigation
    'nav.parkingMap': 'Hartă Parcare',
    'nav.liveParking': 'Parcare Live',
    'nav.publicTransport': 'Transport Public',
    'nav.bikeStations': 'Stații Biciclete',
    'nav.analytics': 'Statistici',
    'nav.admin': 'Administrator',
    'nav.contact': 'Contact',
    
    // Home page
    'home.title': 'Parcare Inteligentă Timișoara',
    'home.subtitle': 'Disponibilitate parcări în timp real și planificare inteligentă a traseelor',
    
    // Parking stats
    'stats.totalSpots': 'Total Locuri Parcare',
    'stats.availableNow': 'Disponibile Acum',
    'stats.activeZones': 'Zone Active',
    'stats.avgWaitTime': 'Timp Mediu Așteptare',
    'stats.thisWeek': 'săptămâna aceasta',
    'stats.occupancy': 'ocupare',
    'stats.allOperational': 'Toate operaționale',
    'stats.fromYesterday': 'față de ieri',
    
    // Route alternatives
    'routes.alternativeParking': 'Parcări Alternative',
    'routes.otherTransportOptions': 'Alte Opțiuni de Transport',
    'routes.smartTips': 'Sfaturi Inteligente',
    'routes.navigateHere': 'Navighează Aici',
    'routes.available': 'disponibile',
    'routes.good': 'Bună',
    'routes.excellent': 'Excelentă',
    'routes.transportPublic': 'Transport Public',
    'routes.bikeStations': 'Stații Biciclete',
    'routes.busAndTram': 'Opțiuni autobuz & tramvai',
    'routes.ecoFriendlyBikes': 'Biciclete eco-friendly',
    'routes.parkingFull': 'Parcare ocupată? Încearcă transport alternativ:',
    
    // ChatBot
    'chatbot.title': 'Asistent Parcare Inteligent',
    'chatbot.placeholder': 'Întreabă despre parcare, transport, biciclete sau rute...',
    'chatbot.welcomeMessage': '🤖 Salut! Sunt Asistentul tău Inteligent pentru Parcare din Timișoara! Am acces în timp real la toate zonele de parcare, disponibilitatea locurilor și pot oferi recomandări inteligente.\n\n✨ Întreabă-mă orice despre:\n• Disponibilitatea curentă a parcărilor\n• Cele mai bune rute alternative când zonele sunt ocupate\n• Conexiuni transport public\n• Opțiuni de împărțire biciclete\n• Navigare și direcții\n\nVăd că în acest moment avem 425 de locuri disponibile în tot orașul. Cu ce te pot ajuta?',
    'chatbot.errorMessage': 'Am probleme cu conectarea la serviciul AI în acest moment. Te rog să încerci din nou într-un moment. Între timp, poți verifica harta noastră de parcare pentru disponibilitate în timp real!',
    'chatbot.genericError': 'Îmi pare rău, am întâmpinat o eroare. Te rog să încerci din nou.',
    'chatbot.viewParkingMap': 'Vezi Harta Parcărilor',
    'chatbot.viewPublicTransport': 'Vezi Transport Public',
    'chatbot.viewBikeStations': 'Vezi Stații Biciclete',
    'chatbot.navigateTo': 'Navighează la',
    
    // Contact page
    'contact.title': 'Contactează-ne',
    'contact.subtitle': 'Ia legătura cu echipa noastră pentru suport, parteneriate sau feedback',
    'contact.sendMessage': 'Trimite-ne un Mesaj',
    'contact.name': 'Nume',
    'contact.email': 'Email',
    'contact.subject': 'Subiect',
    'contact.message': 'Mesaj',
    'contact.sendButton': 'Trimite Mesajul',
    'contact.nameRequired': 'Numele tău complet',
    'contact.emailRequired': 'email@tau.com',
    'contact.subjectPlaceholder': 'Descriere scurtă a solicitării tale',
    'contact.messagePlaceholder': 'Spune-ne cum te putem ajuta...',
    'contact.information': 'Informații de Contact',
    'contact.phone': 'Telefon',
    'contact.address': 'Adresă',
    'contact.businessHours': 'Program de Lucru',
    'contact.mondayFriday': 'Luni - Vineri',
    'contact.saturday': 'Sâmbătă',
    'contact.sunday': 'Duminică',
    'contact.closed': 'Închis',
    'contact.emergencySupport': 'Suport de urgență disponibil 24/7 pentru probleme critice de sistem',
    'contact.faq': 'Întrebări Frecvente',
    'contact.errorTitle': 'Eroare',
    'contact.errorDescription': 'Te rugăm să completezi toate câmpurile obligatorii',
    'contact.successTitle': 'Mesaj Trimis',
    'contact.successDescription': 'Mulțumim pentru mesajul tău. Îți vom răspunde cât de curând!',
    'contact.responseTime': 'Îți vom răspunde în 24 de ore',
    'contact.timeSchedule': '8:00 - 18:00',
    'contact.timeScheduleSat': '9:00 - 14:00',
    'contact.timeScheduleMF': 'Luni-Vineri, 8:00 - 18:00',
    
    // Admin
    'admin.title': 'Tablou de Bord Administrator',
    'admin.subtitle': 'Gestionează zonele de parcare și setările sistemului',
    'admin.logout': 'Deconectare',
    'admin.parkingZones': 'Zone de Parcare',
    'admin.systemSettings': 'Setări Sistem',
    'admin.privacySettings': 'Setări Confidențialitate',
    'admin.addNewZone': 'Adaugă Zonă Nouă',
    'admin.editZone': 'Editează Zona',
    'admin.zoneName': 'Numele Zonei',
    'admin.totalSpots': 'Total Locuri',
    'admin.address': 'Adresă',
    'admin.enterZoneName': 'Introdu numele zonei',
    'admin.enterTotalSpots': 'Introdu numărul total de locuri',
    'admin.enterAddress': 'Introdu adresa zonei',
    'admin.errorTitle': 'Eroare',
    'admin.errorDescription': 'Te rugăm să completezi toate câmpurile',
    'admin.successTitle': 'Succes',
    'admin.zoneAdded': 'Zona de parcare adăugată cu succes',
    'admin.zoneUpdated': 'Zona de parcare actualizată cu succes',
    'admin.zoneDeleted': 'Zona de parcare ștearsă cu succes',
    
    // Admin Login
    'adminLogin.title': 'Conectare Administrator',
    'adminLogin.subtitle': 'Accesează tabloul de bord pentru gestionarea parcării',
    'adminLogin.username': 'Nume utilizator',
    'adminLogin.password': 'Parolă',
    'adminLogin.usernameLabel': 'Introdu numele de utilizator',
    'adminLogin.passwordLabel': 'Introdu parola',
    'adminLogin.signIn': 'Conectare',
    'adminLogin.signingIn': 'Se conectează...',
    'adminLogin.demoCredentials': 'Date de demonstrație:',
    'adminLogin.successTitle': 'Conectare Reușită',
    'adminLogin.successDescription': 'Bun venit în tabloul de bord administrator',
    'adminLogin.errorTitle': 'Conectare Eșuată',
    'adminLogin.errorDescription': 'Nume de utilizator sau parolă invalidă',
    
    // 404 Page
    'notFound.title': '404',
    'notFound.message': 'Ups! Pagina nu a fost găsită',
    'notFound.returnHome': 'Întoarce-te la Acasă'
  },
  en: {
    // Navigation
    'nav.parkingMap': 'Parking Map',
    'nav.liveParking': 'Live Parking',
    'nav.publicTransport': 'Public Transport',
    'nav.bikeStations': 'Bike Stations',
    'nav.analytics': 'Analytics',
    'nav.admin': 'Admin',
    'nav.contact': 'Contact',
    
    // Home page
    'home.title': 'Timișoara Smart Parking',
    'home.subtitle': 'Real-time parking availability and intelligent route planning',
    
    // Parking stats
    'stats.totalSpots': 'Total Parking Spots',
    'stats.availableNow': 'Available Now',
    'stats.activeZones': 'Active Zones',
    'stats.avgWaitTime': 'Avg. Wait Time',
    'stats.thisWeek': 'this week',
    'stats.occupancy': 'occupancy',
    'stats.allOperational': 'All operational',
    'stats.fromYesterday': 'from yesterday',
    
    // Route alternatives
    'routes.alternativeParking': 'Alternative Parking',
    'routes.otherTransportOptions': 'Other Transport Options',
    'routes.smartTips': 'Smart Tips',
    'routes.navigateHere': 'Navigate Here',
    'routes.available': 'available',
    'routes.good': 'Good',
    'routes.excellent': 'Excellent',
    'routes.transportPublic': 'Public Transport',
    'routes.bikeStations': 'Bike Stations',
    'routes.busAndTram': 'Bus & Tram options',
    'routes.ecoFriendlyBikes': 'Eco-friendly bikes',
    'routes.parkingFull': 'Parking full? Try alternative transport:',
    
    // ChatBot
    'chatbot.title': 'Smart Parking Assistant',
    'chatbot.placeholder': 'Ask about parking, transport, bikes, or routes...',
    'chatbot.welcomeMessage': '🤖 Hello! I\'m your AI-powered Smart Parking Assistant for Timișoara! I have real-time access to all parking zones, live spot availability, and can provide intelligent recommendations.\n\n✨ Ask me anything about:\n• Current parking availability\n• Best alternative routes when zones are full\n• Public transport connections\n• Bike sharing options\n• Navigation and directions\n\nI can see that right now we have 425 total available spots across the city. What can I help you find?',
    'chatbot.errorMessage': 'I\'m having trouble connecting to the AI service right now. Please try again in a moment. In the meantime, you can check our parking map for real-time availability!',
    'chatbot.genericError': 'Sorry, I encountered an error. Please try again.',
    'chatbot.viewParkingMap': 'View Parking Map',
    'chatbot.viewPublicTransport': 'View Public Transport',
    'chatbot.viewBikeStations': 'View Bike Stations',
    'chatbot.navigateTo': 'Navigate to',
    
    // Contact page
    'contact.title': 'Contact Us',
    'contact.subtitle': 'Get in touch with our team for support, partnerships, or feedback',
    'contact.sendMessage': 'Send us a Message',
    'contact.name': 'Name',
    'contact.email': 'Email',
    'contact.subject': 'Subject',
    'contact.message': 'Message',
    'contact.sendButton': 'Send Message',
    'contact.nameRequired': 'Your full name',
    'contact.emailRequired': 'your@email.com',
    'contact.subjectPlaceholder': 'Brief description of your inquiry',
    'contact.messagePlaceholder': 'Tell us how we can help you...',
    'contact.information': 'Contact Information',
    'contact.phone': 'Phone',
    'contact.address': 'Address',
    'contact.businessHours': 'Business Hours',
    'contact.mondayFriday': 'Monday - Friday',
    'contact.saturday': 'Saturday',
    'contact.sunday': 'Sunday',
    'contact.closed': 'Closed',
    'contact.emergencySupport': 'Emergency support available 24/7 for system-critical issues',
    'contact.faq': 'Frequently Asked Questions',
    'contact.errorTitle': 'Error',
    'contact.errorDescription': 'Please fill in all required fields',
    'contact.successTitle': 'Message Sent',
    'contact.successDescription': 'Thank you for your message. We\'ll get back to you soon!',
    'contact.responseTime': 'We\'ll respond within 24 hours',
    'contact.timeSchedule': '8:00 AM - 6:00 PM',
    'contact.timeScheduleSat': '9:00 AM - 2:00 PM',
    'contact.timeScheduleMF': 'Mon-Fri, 8:00 AM - 6:00 PM',
    
    // Admin
    'admin.title': 'Admin Dashboard',
    'admin.subtitle': 'Manage parking zones and system settings',
    'admin.logout': 'Logout',
    'admin.parkingZones': 'Parking Zones',
    'admin.systemSettings': 'System Settings',
    'admin.privacySettings': 'Privacy Settings',
    'admin.addNewZone': 'Add New Zone',
    'admin.editZone': 'Edit Zone',
    'admin.zoneName': 'Zone Name',
    'admin.totalSpots': 'Total Spots',
    'admin.address': 'Address',
    'admin.enterZoneName': 'Enter zone name',
    'admin.enterTotalSpots': 'Enter total spots',
    'admin.enterAddress': 'Enter zone address',
    'admin.errorTitle': 'Error',
    'admin.errorDescription': 'Please fill in all fields',
    'admin.successTitle': 'Success',
    'admin.zoneAdded': 'Parking zone added successfully',
    'admin.zoneUpdated': 'Parking zone updated successfully',
    'admin.zoneDeleted': 'Parking zone deleted successfully',
    
    // Admin Login
    'adminLogin.title': 'Admin Login',
    'adminLogin.subtitle': 'Access the parking management dashboard',
    'adminLogin.username': 'Username',
    'adminLogin.password': 'Password',
    'adminLogin.usernameLabel': 'Enter username',
    'adminLogin.passwordLabel': 'Enter password',
    'adminLogin.signIn': 'Sign In',
    'adminLogin.signingIn': 'Signing in...',
    'adminLogin.demoCredentials': 'Demo credentials:',
    'adminLogin.successTitle': 'Login Successful',
    'adminLogin.successDescription': 'Welcome to the admin dashboard',
    'adminLogin.errorTitle': 'Login Failed',
    'adminLogin.errorDescription': 'Invalid username or password',
    
    // 404 Page
    'notFound.title': '404',
    'notFound.message': 'Oops! Page not found',
    'notFound.returnHome': 'Return to Home'
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'ro';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
    
    // Update page title based on language
    if (language === 'ro') {
      document.title = 'ParkSmart Timișoara - Soluție de Parcare Inteligentă';
    } else {
      document.title = 'ParkSmart Timișoara - Smart Parking Solution';
    }
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 