
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wifi, Shield, Activity, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const VPNTab = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [selectedServer, setSelectedServer] = useState('US East');

  const servers = [
    { name: 'US East', ping: '12ms', load: 'Low' },
    { name: 'US West', ping: '18ms', load: 'Medium' },
    { name: 'UK London', ping: '45ms', load: 'Low' },
    { name: 'Germany', ping: '52ms', load: 'High' },
    { name: 'Japan', ping: '78ms', load: 'Low' }
  ];

  const handleToggleVPN = () => {
    setIsConnected(!isConnected);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
          Secure VPN
        </h2>
        <p className="text-slate-300">
          Protect your connection with military-grade encryption
        </p>
      </div>

      {/* VPN Status Card */}
      <Card className="bg-white/5 backdrop-blur-lg border-white/10">
        <CardHeader className="text-center">
          <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
            isConnected ? 'bg-green-500/20' : 'bg-slate-500/20'
          }`}>
            <Shield className={`h-10 w-10 ${isConnected ? 'text-green-400' : 'text-slate-400'}`} />
          </div>
          <CardTitle className="text-white">
            {isConnected ? 'Protected' : 'Not Connected'}
          </CardTitle>
          <p className="text-slate-400">
            {isConnected ? `Connected to ${selectedServer}` : 'Click to connect'}
          </p>
        </CardHeader>
        <CardContent className="text-center">
          <Button
            onClick={handleToggleVPN}
            className={`w-full py-3 ${
              isConnected 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isConnected ? 'Disconnect' : 'Connect'}
          </Button>
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
                <p className="text-2xl font-bold text-green-400">256-bit</p>
                <p className="text-slate-400 text-sm">Encryption</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-400">12ms</p>
                <p className="text-slate-400 text-sm">Latency</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Server Selection */}
      <Card className="bg-white/5 backdrop-blur-lg border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-cyan-400" />
            <span>Server Locations</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {servers.map((server, index) => (
            <div
              key={index}
              onClick={() => setSelectedServer(server.name)}
              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                selectedServer === server.name
                  ? 'bg-blue-500/20 border border-blue-500/30'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Wifi className="h-4 w-4 text-cyan-400" />
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
