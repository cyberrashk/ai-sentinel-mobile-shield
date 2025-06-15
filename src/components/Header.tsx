
import React, { useState } from 'react';
import { Shield, Settings, Bell, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export const Header = () => {
  const { toast } = useToast();
  const [notificationCount, setNotificationCount] = useState(3);
  const [chatDialogOpen, setChatDialogOpen] = useState(false);

  const handleNotificationClick = () => {
    toast({
      title: "Recent Security Alerts",
      description: "3 threats detected and blocked in the last hour",
    });
  };

  const handleSettingsClick = () => {
    toast({
      title: "Settings",
      description: "Security settings panel opened",
    });
  };

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
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-white/10 relative"
              onClick={handleNotificationClick}
            >
              <Bell className="h-4 w-4" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </Button>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-slate-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Security Settings</DialogTitle>
                  <DialogDescription className="text-slate-300">
                    Configure your security preferences
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white">Real-time Scanning</span>
                    <Button size="sm" className="bg-green-500 hover:bg-green-600">
                      Enabled
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Auto-quarantine</span>
                    <Button size="sm" className="bg-green-500 hover:bg-green-600">
                      Enabled
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">VPN Auto-connect</span>
                    <Button size="sm" variant="outline">
                      Disabled
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 md:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-slate-900 border-slate-700">
                <SheetHeader>
                  <SheetTitle className="text-white">Menu</SheetTitle>
                  <SheetDescription className="text-slate-300">
                    Quick access to app features
                  </SheetDescription>
                </SheetHeader>
                <div className="space-y-4 mt-6">
                  <Button variant="ghost" className="w-full justify-start text-white">
                    Security Dashboard
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-white">
                    Threat History
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-white">
                    VPN Locations
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-white">
                    Privacy Settings
                  </Button>
                  {/* Updated End-to-End Encryption Chatting menu option to open dialog */}
                  <Dialog open={chatDialogOpen} onOpenChange={setChatDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-white"
                        onClick={() => setChatDialogOpen(true)}
                      >
                        End-to-End Encryption Chatting
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-900 border-slate-700 max-w-md mx-auto">
                      <DialogHeader>
                        <DialogTitle className="text-white">End-to-End Encryption Chatting</DialogTitle>
                        <DialogDescription className="text-slate-300">
                          <span className="block mb-2">A high-level secure chat for safe private conversations.</span>
                          <span className="block mb-4 text-yellow-400 font-semibold">Feature Coming Soon</span>
                          <span className="text-slate-400 text-xs">
                            This secure chatting feature will utilize advanced end-to-end encryption along with a robust backend. Please check back soon for a fully working encrypted chat.
                          </span>
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

