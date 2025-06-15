
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wifi, Shield, Activity, MapPin, Globe, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const EnhancedVPN = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedServer, setSelectedServer] = useState('US East');
  const [connectionTime, setConnectionTime] = useState(0);
  const [dataUsage, setDataUsage] = useState({ sent: 0, received: 0 });

  const servers = [
    { name: 'US East', ping: '12ms', load: 'Low', country: '🇺🇸' },
    { name: 'US West', ping: '18ms', load: 'Medium', country: '🇺🇸' },
    { name: 'UK London', ping: '45ms', load: 'Low', country: '🇬🇧' },
    { name: 'Germany', ping: '52ms', load: 'High', country: '🇩🇪' },
    { name: 'Japan', ping: '78ms', load: 'Low', country: '🇯🇵' },
    { name: 'Canada', ping: '25ms', load: 'Medium', country: '🇨🇦' },
    { name: 'Australia', ping: '95ms', load: 'Low', country: '🇦🇺' }
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isConnected) {
      timer = setInterval(() => {
        setConnectionTime(prev => prev + 1);
        setDataUsage(prev => ({
          sent: prev.sent + Math.random() * 0.5,
          received: prev.received + Math.random() * 1.2
        }));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isConnected]);

  const handleToggleVPN = async () => {
    if (isConnected) {
      setIsConnected(false);
      setConnectionTime(0);
      setDataUsage({ sent: 0, received: 0 });
    } else {
      setIsConnecting(true);
      // Simulate connection delay
      setTimeout(() => {
        setIsConnecting(false);
        setIsConnected(true);
      }, 2000);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatData = (mb: number) => {
    return mb < 1024 ? `${mb.toFixed(1)} MB` : `${(mb / 1024).toFixed(1)} GB`;
  };

  return (
    <div className="space-y-6">
      {/* VPN Status Card */}
      <Card className="bg-white/5 backdrop-blur-lg border-white/10">
        <CardHeader className="text-center">
          <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
            isConnected ? 'bg-green-500/20' : isConnecting ? 'bg-yellow-500/20' : 'bg-slate-500/20'
          }`}>
            <Shield className={`h-10 w-10 ${
              isConnected ? 'text-green-400' : isConnecting ? 'text-yellow-400' : 'text-slate-400'
            }`} />
          </div>
          <CardTitle className="text-white">
            {isConnected ? 'Protected' : isConnecting ? 'Connecting...' : 'Not Connected'}
          </CardTitle>
          <p className="text-slate-400">
            {isConnected ? `Connected to ${selectedServer}` : 'Click to connect'}
          </p>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <Button
            onClick={handleToggleVPN}
            disabled={isConnecting}
            className={`w-full py-3 ${
              isConnected 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isConnecting ? 'Connecting...' : isConnected ? 'Disconnect' : 'Connect'}
          </Button>

          {isConnected && (
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="text-center">
                <p className="text-lg font-bold text-green-400">{formatTime(connectionTime)}</p>
                <p className="text-slate-400 text-sm">Connected</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-blue-400">
                  {servers.find(s => s.name === selectedServer)?.ping}
                </p>
                <p className="text-slate-400 text-sm">Latency</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Connection Stats */}
      {isConnected && (
        <Card className="bg-white/5 backdrop-blur-lg border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Activity className="h-5 w-5 text-green-400" />
              <span>Connection Stats</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-xl font-bold text-cyan-400">{formatData(dataUsage.sent)}</p>
                <p className="text-slate-400 text-sm">Sent</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-purple-400">{formatData(dataUsage.received)}</p>
                <p className="text-slate-400 text-sm">Received</p>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-4 pt-2">
              <div className="flex items-center space-x-2">
                <Lock className="h-4 w-4 text-green-400" />
                <span className="text-sm text-green-400">AES-256 Encrypted</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Server Selection */}
      <Card className="bg-white/5 backdrop-blur-lg border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Globe className="h-5 w-5 text-cyan-400" />
            <span>Server Locations</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {servers.map((server, index) => (
            <div
              key={index}
              onClick={() => !isConnected && setSelectedServer(server.name)}
              className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                selectedServer === server.name
                  ? 'bg-blue-500/20 border border-blue-500/30'
                  : 'bg-white/5 hover:bg-white/10'
              } ${isConnected ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{server.country}</span>
                <div>
                  <p className="text-white font-medium">{server.name}</p>
                  <p className="text-slate-400 text-sm">{server.ping}</p>
                </div>
              </div>
              <Badge className={
                server.load === 'Low' 
                  ? 'bg-green-500/20 text-green-400'
                  : server.load === 'Medium'
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'bg-red-500/20 text-red-400'
              }>
                {server.load}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
