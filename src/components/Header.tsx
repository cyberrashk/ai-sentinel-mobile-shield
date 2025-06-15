
import React from 'react';
import { Shield, Settings, Bell, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Header = () => {
  return (
    <header className="bg-black/20 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">SecureAI</h2>
              <p className="text-xs text-slate-400">Mobile Security Suite</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Protected</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 md:hidden">
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
