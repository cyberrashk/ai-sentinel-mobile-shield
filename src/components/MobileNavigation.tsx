
import React from 'react';
import { Home, Shield, Wifi, Brain, Search, MessageCircle } from 'lucide-react';

interface MobileNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const MobileNavigation = ({ activeTab, onTabChange }: MobileNavigationProps) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'features', label: 'Features', icon: Shield },
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'vpn', label: 'VPN', icon: Wifi },
    { id: 'enhanced', label: 'AI Security', icon: Brain },
    { id: 'scanner', label: 'Scanner', icon: Search },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/20 backdrop-blur-lg border-t border-white/10 z-40">
      <div className="container mx-auto px-2">
        <div className="flex justify-around py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center py-2 px-2 transition-colors min-w-0 ${
                  isActive 
                    ? 'text-blue-400' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className={`h-4 w-4 mb-1 ${isActive ? 'text-blue-400' : ''}`} />
                <span className="text-xs font-medium truncate">{tab.label}</span>
                {isActive && (
                  <div className="w-4 h-0.5 bg-blue-400 rounded-full mt-1"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
