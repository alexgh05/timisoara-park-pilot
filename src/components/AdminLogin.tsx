import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Circle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface AdminLoginProps {
  onLogin: (success: boolean) => void;
}

export const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication - in production, this would be a real API call
    setTimeout(() => {
      if (credentials.username === 'admin' && credentials.password === 'parking123') {
        toast({
          title: t('adminLogin.successTitle'),
          description: t('adminLogin.successDescription')
        });
        onLogin(true);
      } else {
        toast({
          title: t('adminLogin.errorTitle'),
          description: t('adminLogin.errorDescription'),
          variant: "destructive"
        });
        onLogin(false);
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated background cars */}
        <div className="absolute top-20 left-10 opacity-20">
          <Circle className="h-4 w-4 text-blue-400 fill-current animate-pulse" />
        </div>
        <div className="absolute top-40 right-20 opacity-20">
          <Circle className="h-3 w-3 text-green-400 fill-current animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="absolute bottom-32 left-32 opacity-20">
          <Circle className="h-5 w-5 text-purple-400 fill-current animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
      </div>

      <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm border-slate-700">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {t('adminLogin.title')}
          </CardTitle>
          <p className="text-slate-400 mt-2">
            {t('adminLogin.subtitle')}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="username">{t('adminLogin.username')}</Label>
              <Input
                id="username"
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                placeholder={t('adminLogin.usernameLabel')}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password">{t('adminLogin.password')}</Label>
              <Input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                placeholder={t('adminLogin.passwordLabel')}
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? t('adminLogin.signingIn') : t('adminLogin.signIn')}
            </Button>
          </form>

          <div className="mt-6 p-3 bg-slate-800/50 rounded-lg">
            <p className="text-xs text-slate-400 text-center">
              {t('adminLogin.demoCredentials')}<br />
              {t('adminLogin.username')}: <span className="text-slate-300">admin</span><br />
              {t('adminLogin.password')}: <span className="text-slate-300">parking123</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
