
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { MobileNavigation } from '../components/MobileNavigation';
import { HomeTab } from '../components/HomeTab';
import { FeaturesTab } from '../components/FeaturesTab';
import { ChatTab } from '../components/ChatTab';
import { VPNTab } from '../components/VPNTab';
import { EnhancedSecurityTab } from '../components/EnhancedSecurityTab';
import { ThreatScannerTab } from '../components/ThreatScannerTab';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, LogIn } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Show login prompt for unauthenticated users
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center px-4">
        <Card className="w-full max-w-md bg-slate-900/50 border-slate-700 backdrop-blur-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full">
                <Shield className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl text-white">Welcome to SecureAI</CardTitle>
            <CardDescription className="text-slate-300">
              Advanced AI-powered mobile security suite with behavioral biometrics and quantum-resistant protection.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => navigate('/auth')}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Sign In / Sign Up
            </Button>
            <p className="text-center text-sm text-slate-400">
              Secure your mobile experience with enterprise-grade AI security
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTab />;
      case 'features':
        return <FeaturesTab />;
      case 'chat':
        return <ChatTab />;
      case 'vpn':
        return <VPNTab />;
      case 'enhanced':
        return <EnhancedSecurityTab />;
      case 'scanner':
        return <ThreatScannerTab />;
      default:
        return <HomeTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <Header />
      <main className="container mx-auto px-4 py-8 pb-24">
        {renderActiveTab()}
      </main>
      <MobileNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
