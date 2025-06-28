import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Send, Bot, User, ExternalLink, MapPin, Navigation } from "lucide-react";
import { aiService, type ChatMessage } from "@/services/aiService";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: t('chatbot.welcomeMessage'),
      sender: 'bot',
      timestamp: new Date(),
      links: [
        { text: t('chatbot.viewParkingMap'), url: '/' },
        { text: t('chatbot.viewPublicTransport'), url: '/public-transport' },
        { text: t('chatbot.viewBikeStations'), url: '/bike-stations' }
      ]
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

  // Update welcome message when language changes
  useEffect(() => {
    setMessages([
      {
        id: '1',
        text: t('chatbot.welcomeMessage'),
        sender: 'bot',
        timestamp: new Date(),
        links: [
          { text: t('chatbot.viewParkingMap'), url: '/' },
          { text: t('chatbot.viewPublicTransport'), url: '/public-transport' },
          { text: t('chatbot.viewBikeStations'), url: '/bike-stations' }
        ]
      }
    ]);
  }, [t]);

  const generateAIResponse = async (userMessage: string, conversationHistory: ChatMessage[]): Promise<Message> => {
    try {
      const response = await aiService.sendMessage([
        ...conversationHistory,
        { role: 'user', content: userMessage }
      ]);

      // Parse response for navigation links
      const links: { text: string; url: string }[] = [];
      
      // Check if response mentions available zones and add navigation links
      const bestZones = aiService.getBestAvailableZones();
      const lowerResponse = response.toLowerCase();
      
      if (lowerResponse.includes('bega shopping') && bestZones.some(z => z.name === 'Bega Shopping Center')) {
        const zone = bestZones.find(z => z.name === 'Bega Shopping Center');
        if (zone) {
          links.push({
            text: `🗺️ ${t('chatbot.navigateTo')} ${zone.name}`,
            url: `https://www.google.com/maps/dir//${zone.coordinates.lat.toFixed(6)},${zone.coordinates.lng.toFixed(6)}`
          });
        }
      }
      
      if (lowerResponse.includes('iulius mall') && bestZones.some(z => z.name === 'Iulius Mall')) {
        const zone = bestZones.find(z => z.name === 'Iulius Mall');
        if (zone) {
          links.push({
            text: `🗺️ ${t('chatbot.navigateTo')} ${zone.name}`,
            url: `https://www.google.com/maps/dir//${zone.coordinates.lat.toFixed(6)},${zone.coordinates.lng.toFixed(6)}`
          });
        }
      }

      // Add app navigation links for transport and bikes
      if (lowerResponse.includes('public transport') || lowerResponse.includes('bus') || lowerResponse.includes('tram')) {
        links.push({ text: `🚌 ${t('chatbot.viewPublicTransport')}`, url: '/public-transport' });
      }
      
      if (lowerResponse.includes('bike') || lowerResponse.includes('bicycle')) {
        links.push({ text: `🚲 ${t('chatbot.viewBikeStations')}`, url: '/bike-stations' });
      }

      return {
        id: Date.now().toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date(),
        links: links.length > 0 ? links : undefined
      };
    } catch (error) {
      console.error('AI Response Error:', error);
      return {
        id: Date.now().toString(),
        text: t('chatbot.errorMessage'),
        sender: 'bot',
        timestamp: new Date(),
        links: [
          { text: t('chatbot.viewPublicTransport'), url: '/public-transport' },
          { text: t('chatbot.viewBikeStations'), url: '/bike-stations' }
        ]
      };
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    // Build conversation history for context
    const conversationHistory: ChatMessage[] = messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    }));

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText('');
    setIsTyping(true);

    try {
      const botResponse = await generateAIResponse(currentInput, conversationHistory);
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error generating response:', error);
      const errorResponse: Message = {
        id: Date.now().toString(),
        text: t('chatbot.genericError'),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
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
            <span>{t('chatbot.title')}</span>
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
                placeholder={t('chatbot.placeholder')}
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
