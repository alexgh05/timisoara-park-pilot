import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Send, Bot, User, ExternalLink } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  links?: { text: string; url: string }[];
}

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatBot = ({ isOpen, onClose }: ChatBotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your smart parking assistant. I can help you find parking spots, suggest public transport alternatives when parking is full, locate bike stations, and provide routing options. How can I help you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('parking') && lowerMessage.includes('full')) {
      return {
        id: Date.now().toString(),
        text: 'When parking is full, I recommend these alternatives: 🚌 Public transport (Bus Line 11 to Piața Victoriei, Tram Line 1 to Centrul Vechi), 🚲 Bike stations (8 bikes available at Piața Victoriei, 12 at Universitate), or 🗺️ I can route you to alternative parking zones. Would you like me to show you the closest options?',
        sender: 'bot',
        timestamp: new Date()
      };
    }
    
    if (lowerMessage.includes('transport') || lowerMessage.includes('bus') || lowerMessage.includes('tram')) {
      return {
        id: Date.now().toString(),
        text: 'Check out our dedicated Public Transport page for real-time bus and tram information! 🚌 Bus lines with next arrivals, 🚋 Tram schedules, 🗺️ Route planning from your location. Click the link below to explore all options.',
        sender: 'bot',
        timestamp: new Date(),
        links: [
          { text: 'View Public Transport Options', url: '/public-transport' },
          { text: 'RATT Official Schedules', url: 'https://www.ratt.ro/trasee-si-orare/' }
        ]
      };
    }
    
    if (lowerMessage.includes('bike') || lowerMessage.includes('bicycle')) {
      return {
        id: Date.now().toString(),
        text: 'Visit our Bike Stations page for complete bike sharing information! 🚲 Real-time bike availability, ⚡ Electric bike locations, 🗺️ Routes to stations, and usage tips. Perfect eco-friendly alternative when parking is full!',
        sender: 'bot',
        timestamp: new Date(),
        links: [
          { text: 'View Bike Stations', url: '/bike-stations' }
        ]
      };
    }
    
    if (lowerMessage.includes('route') || lowerMessage.includes('directions') || lowerMessage.includes('navigate')) {
      return {
        id: Date.now().toString(),
        text: 'I can help you with routing! 🗺️ Click any parking bubble on the map for "Route to Parking" option, or I can show you routes to public transport stops and bike stations. All routes open in Google Maps with turn-by-turn directions from your current location.',
        sender: 'bot',
        timestamp: new Date()
      };
    }
    
    if (lowerMessage.includes('alternative') || lowerMessage.includes('options')) {
      return {
        id: Date.now().toString(),
        text: 'Smart Alternatives when parking is full: 1️⃣ Alternative Parking (Bega Shopping: 156 spots, Iulius Mall: 267 spots), 2️⃣ Public Transport (dedicated page with live updates), 3️⃣ Bike Stations (dedicated page with real-time availability), 4️⃣ Walking + Transport combos. Need specific directions?',
        sender: 'bot',
        timestamp: new Date(),
        links: [
          { text: 'Public Transport Options', url: '/public-transport' },
          { text: 'Bike Station Locations', url: '/bike-stations' }
        ]
      };
    }
    
    if (lowerMessage.includes('victoriei')) {
      return {
        id: Date.now().toString(),
        text: 'Piața Victoriei is currently FULL (0/120 spots). Alternatives: 🚌 Check Public Transport page for Bus Line 11 details, 🚲 Visit Bike Stations page for nearby bikes, or 🅿️ Try Bega Shopping (15 min walk, 156 spots available). Which option works best?',
        sender: 'bot',
        timestamp: new Date(),
        links: [
          { text: 'Public Transport', url: '/public-transport' },
          { text: 'Bike Stations', url: '/bike-stations' }
        ]
      };
    }
    
    if (lowerMessage.includes('universitate')) {
      return {
        id: Date.now().toString(),
        text: 'Universitate parking is FULL (0/75 spots). Great alternatives: 🚲 Check our Bike Stations page (very popular with students!), 🚌 View Public Transport page for Bus Line 14, or 🅿️ Iulius Mall parking (10 min by bus, 267 spots). Students love the bike option!',
        sender: 'bot',
        timestamp: new Date(),
        links: [
          { text: 'Bike Stations', url: '/bike-stations' },
          { text: 'Public Transport', url: '/public-transport' }
        ]
      };
    }
    
    if (lowerMessage.includes('zone') || lowerMessage.includes('area') || lowerMessage.includes('status')) {
      return {
        id: Date.now().toString(),
        text: 'Current Status: 🔴 FULL: Piața Victoriei (0/120), Universitate (0/75) 🔴 ALMOST FULL: Centrul Vechi (2/85) 🟢 AVAILABLE: Bega Shopping (156/300), Iulius Mall (267/450). For full zones, I recommend public transport or bikes - want specific directions?',
        sender: 'bot',
        timestamp: new Date()
      };
    }
    
    return {
      id: Date.now().toString(),
      text: 'I can help you with: 🅿️ Real-time parking availability, 🚌 Public transport (dedicated page), 🚲 Bike stations (dedicated page), 🗺️ Google Maps routing, 📍 Smart alternatives when parking is full. Try asking "What if parking is full?" or check our transport pages!',
      sender: 'bot',
      timestamp: new Date(),
      links: [
        { text: 'Public Transport', url: '/public-transport' },
        { text: 'Bike Stations', url: '/bike-stations' }
      ]
    };
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = generateBotResponse(inputText);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md h-[600px] bg-card/95 backdrop-blur-sm border-slate-700 flex flex-col overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-primary" />
            <span>Smart Parking Assistant</span>
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0 min-h-0">
          {/* Messages */}
          <div 
            className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 chat-scrollable min-h-0"
            style={{ 
              scrollbarWidth: 'thin',
              scrollbarColor: '#64748b #1e293b',
              maxHeight: 'calc(600px - 120px)'
            }}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex chat-message-container ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 break-words overflow-hidden ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.sender === 'bot' && <Bot className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />}
                    {message.sender === 'user' && <User className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm chat-message-text">{message.text}</p>
                      {message.links && (
                        <div className="mt-2 space-y-1">
                          {message.links.map((link, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="w-full justify-start text-left"
                              onClick={() => window.open(link.url, '_blank')}
                            >
                              <ExternalLink className="h-3 w-3 mr-1 flex-shrink-0" />
                              <span className="truncate block">{link.text}</span>
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-4 w-4 text-primary" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input */}
          <div className="p-4 border-t flex-shrink-0 bg-card">
            <div className="flex space-x-2">
              <Input
                placeholder="Ask about parking, transport, bikes, or routes..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
