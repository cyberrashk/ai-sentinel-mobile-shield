
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Zap, Globe, Lock, Activity } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface VPNServer {
  id: string;
  location: string;
  country: string;
  latency: number;
  load: number;
  quantumResistant: boolean;
  encryption: string;
}

export const QuantumVPN = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [currentServer, setCurrentServer] = useState<VPNServer | null>(null);
  const [servers, setServers] = useState<VPNServer[]>([]);
  const [connectionStats, setConnectionStats] = useState({
    dataTransferred: 0,
    sessionDuration: 0,
    threatsBlocked: 0,
  });

  useEffect(() => {
    initializeServers();
    if (isConnected) {
      startConnectionSimulation();
    }
  }, [isConnected]);

  const initializeServers = () => {
    const vpnServers: VPNServer[] = [
      {
        id: '1',
        location: 'New York, US',
        country: 'US',
        latency: 12,
        load: 23,
        quantumResistant: true,
        encryption: 'NTS-KE + AES-256-GCM',
      },
      {
        id: '2',
        location: 'London, UK',
        country: 'UK',
        latency: 8,
        load: 45,
        quantumResistant: true,
        encryption: 'NTS-KE + ChaCha20-Poly1305',
      },
      {
        id: '3',
        location: 'Tokyo, JP',
        country: 'JP',
        latency: 156,
        load: 67,
        quantumResistant: true,
        encryption: 'NTS-KE + AES-256-GCM',
      },
      {
        id: '4',
        location: 'Frankfurt, DE',
        country: 'DE',
        latency: 18,
        load: 34,
        quantumResistant: true,
        encryption: 'Quantum-Safe Hybrid',
      },
    ];
    setServers(vpnServers);
    setCurrentServer(vpnServers[0]);
  };

  const startConnectionSimulation = () => {
    const interval = setInterval(() => {
      setConnectionStats(prev => ({
        dataTransferred: prev.dataTransferred + Math.random() * 50,
        sessionDuration: prev.sessionDuration + 1,
        threatsBlocked: prev.threatsBlocked + (Math.random() > 0.9 ? 1 : 0),
      }));
    }, 1000);

    return () => clearInterval(interval);
  };

  const connectToVPN = async (server: VPNServer) => {
    setIsConnected(true);
    setCurrentServer(server);

    // Store VPN session in database
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('vpn_sessions').insert({
        user_id: user.id,
        server_location: server.location,
        encryption_protocol: server.encryption,
        session_data: {
          latency: server.latency,
          load: server.load,
          quantum_resistant: server.quantumResistant,
        },
      });
    }
  };

  const disconnectVPN = async () => {
    setIsConnected(false);
    setConnectionStats({ dataTransferred: 0, sessionDuration: 0, threatsBlocked: 0 });

    // Update VPN session end time
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: sessions } = await supabase
        .from('vpn_sessions')
        .select('id')
        .eq('user_id', user.id)
        .is('ended_at', null)
        .order('started_at', { ascending: false })
        .limit(1);

      if (sessions && sessions.length > 0) {
        await supabase
          .from('vpn_sessions')
          .update({ ended_at: new Date().toISOString() })
          .eq('id', sessions[0].id);
      }
    }
  };

  const getLatencyColor = (latency: number) => {
    if (latency < 20) return 'text-green-400';
    if (latency < 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getLoadColor = (load: number) => {
    if (load < 30) return 'bg-green-500';
    if (load < 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Shield className="h-6 w-6 text-purple-400" />
          Quantum-Resistant VPN
        </CardTitle>
        <CardDescription className="text-slate-300">
          Future-proof encryption with NTS protocol
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Connection Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
              <span className="text-white font-medium">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
              {isConnected && currentServer && (
                <Badge variant="outline" className="text-green-400 border-green-400">
                  <Globe className="h-3 w-3 mr-1" />
                  {currentServer.location}
                </Badge>
              )}
            </div>
            <Button
              onClick={isConnected ? disconnectVPN : () => connectToVPN(servers[0])}
              className={isConnected ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
            >
              {isConnected ? 'Disconnect' : 'Quick Connect'}
            </Button>
          </div>

          {/* Current Connection Info */}
          {isConnected && currentServer && (
            <div className="bg-slate-900/50 p-4 rounded-lg space-y-3">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-purple-400" />
                <span className="text-white font-medium">Encryption</span>
                <Badge className="bg-purple-600">{currentServer.encryption}</Badge>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-400">
                    {connectionStats.dataTransferred.toFixed(1)}
                  </div>
                  <div className="text-xs text-slate-400">MB Transferred</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-400">
                    {Math.floor(connectionStats.sessionDuration / 60)}:{connectionStats.sessionDuration % 60 < 10 ? '0' : ''}{connectionStats.sessionDuration % 60}
                  </div>
                  <div className="text-xs text-slate-400">Session Time</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-400">
                    {connectionStats.threatsBlocked}
                  </div>
                  <div className="text-xs text-slate-400">Threats Blocked</div>
                </div>
              </div>
            </div>
          )}

          {/* Server List */}
          <div className="space-y-3">
            <h4 className="text-white font-medium flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-400" />
              Available Servers
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {servers.map((server) => (
                <div
                  key={server.id}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors
                    ${currentServer?.id === server.id ? 'bg-blue-900/30 border border-blue-500' : 'bg-slate-900/30 hover:bg-slate-800/50'}`}
                  onClick={() => !isConnected && connectToVPN(server)}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-white font-medium">{server.location}</div>
                    {server.quantumResistant && (
                      <Badge className="bg-purple-600 text-xs">
                        <Shield className="h-3 w-3 mr-1" />
                        Quantum-Safe
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className={getLatencyColor(server.latency)}>
                      {server.latency}ms
                    </span>
                    <div className="flex items-center gap-1">
                      <Activity className="h-3 w-3 text-slate-400" />
                      <div className="w-12 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getLoadColor(server.load)}`}
                          style={{ width: `${server.load}%` }}
                        ></div>
                      </div>
                      <span className="text-slate-400 text-xs">{server.load}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
