
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
      text: 'Hello! I\'m your parking assistant. I can help you find parking spots, suggest alternatives, or provide public transport information. How can I help you today?',
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
    
    if (lowerMessage.includes('parking') && lowerMessage.includes('victoriei')) {
      return {
        id: Date.now().toString(),
        text: 'Piața Victoriei currently has 23 available spots out of 120 total. The zone is quite busy. Would you like me to suggest alternative parking zones nearby?',
        sender: 'bot',
        timestamp: new Date()
      };
    }
    
    if (lowerMessage.includes('alternative') || lowerMessage.includes('nearby')) {
      return {
        id: Date.now().toString(),
        text: 'I recommend checking Bega Shopping Center (156/300 spots available, 15 min walk) or Centrul Vechi (42/85 spots, 8 min walk). Both have better availability right now.',
        sender: 'bot',
        timestamp: new Date()
      };
    }
    
    if (lowerMessage.includes('transport') || lowerMessage.includes('bus')) {
      return {
        id: Date.now().toString(),
        text: 'For public transport, I recommend Line 11 bus (next arrival in 5 min) or Line 1 tram (8 min). Here are the schedule links:',
        sender: 'bot',
        timestamp: new Date(),
        links: [
          { text: 'RATT Bus Schedules', url: 'https://www.ratt.ro/trasee-si-orare/' },
          { text: 'Real-time Arrivals', url: 'https://www.ratt.ro/info-trafic/' }
        ]
      };
    }
    
    if (lowerMessage.includes('prediction') || lowerMessage.includes('chance')) {
      return {
        id: Date.now().toString(),
        text: 'Based on historical data, your best chances for parking are: After 9 PM (85% chance), Early morning before 8 AM (75% chance), or weekends (60% average). Peak hours (6-8 PM) have only 15% success rate.',
        sender: 'bot',
        timestamp: new Date()
      };
    }
    
    if (lowerMessage.includes('zone') || lowerMessage.includes('area')) {
      return {
        id: Date.now().toString(),
        text: 'Current zone availability: 🟢 Iulius Mall (267/450), 🟢 Bega Shopping (156/300), 🟡 Centrul Vechi (42/85), 🔴 Piața Victoriei (23/120), 🔴 Universitate (8/75). Which zone interests you?',
        sender: 'bot',
        timestamp: new Date()
      };
    }
    
    return {
      id: Date.now().toString(),
      text: 'I can help you with parking availability, route alternatives, public transport options, and parking predictions. Try asking about specific zones like "Piața Victoriei parking" or "show me alternatives".',
      sender: 'bot',
      timestamp: new Date()
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
      <Card className="w-full max-w-md h-[600px] bg-card/95 backdrop-blur-sm border-slate-700 flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-primary" />
            <span>Parking Assistant</span>
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.sender === 'bot' && <Bot className="h-4 w-4 mt-0.5 text-primary" />}
                    {message.sender === 'user' && <User className="h-4 w-4 mt-0.5" />}
                    <div className="flex-1">
                      <p className="text-sm">{message.text}</p>
                      {message.links && (
                        <div className="mt-2 space-y-1">
                          {message.links.map((link, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="w-full justify-start"
                              onClick={() => window.open(link.url, '_blank')}
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              {link.text}
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
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                placeholder="Ask about parking, routes, or transport..."
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
