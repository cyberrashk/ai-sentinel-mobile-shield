
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Zap, 
  Globe, 
  Lock, 
  Activity, 
  Settings, 
  Wifi, 
  AlertTriangle,
  Eye,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface VPNServer {
  id: string;
  name: string;
  location: string;
  country: string;
  region: string;
  latency: number;
  load: number;
  security_score: number;
  threat_level: 'low' | 'medium' | 'high';
  protocol: 'WireGuard' | 'OpenVPN' | 'IKEv2';
  encryption: string;
  ai_optimization: boolean;
  ddos_protection: boolean;
}

interface ConnectionStats {
  dataTransferred: number;
  uploadSpeed: number;
  downloadSpeed: number;
  sessionDuration: number;
  threatsBlocked: number;
  phishingBlocked: number;
  adsBlocked: number;
  malwareDomains: number;
  anomaliesDetected: number;
}

interface ThreatDetection {
  [key: string]: boolean;
  enabled: boolean;
  real_time_scanning: boolean;
  dns_filtering: boolean;
  phishing_protection: boolean;
  anomaly_detection: boolean;
  split_tunneling: boolean;
}

export const AIVPNCore = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentServer, setCurrentServer] = useState<VPNServer | null>(null);
  const [servers, setServers] = useState<VPNServer[]>([]);
  const [connectionStats, setConnectionStats] = useState<ConnectionStats>({
    dataTransferred: 0,
    uploadSpeed: 0,
    downloadSpeed: 0,
    sessionDuration: 0,
    threatsBlocked: 0,
    phishingBlocked: 0,
    adsBlocked: 0,
    malwareDomains: 0,
    anomaliesDetected: 0,
  });
  const [threatDetection, setThreatDetection] = useState<ThreatDetection>({
    enabled: true,
    real_time_scanning: true,
    dns_filtering: true,
    phishing_protection: true,
    anomaly_detection: true,
    split_tunneling: false,
  });
  const [selectedApps, setSelectedApps] = useState<string[]>(['browser', 'email']);

  useEffect(() => {
    initializeVPNServers();
    if (isConnected) {
      startConnectionMonitoring();
    }
  }, [isConnected]);

  const initializeVPNServers = useCallback(() => {
    const vpnServers: VPNServer[] = [
      {
        id: 'us-ny-01',
        name: 'New York Quantum',
        location: 'New York, NY',
        country: 'United States',
        region: 'Americas',
        latency: 12,
        load: 23,
        security_score: 98,
        threat_level: 'low',
        protocol: 'WireGuard',
        encryption: 'ChaCha20-Poly1305',
        ai_optimization: true,
        ddos_protection: true,
      },
      {
        id: 'uk-lon-01',
        name: 'London Fortress',
        location: 'London, UK',
        country: 'United Kingdom',
        region: 'Europe',
        latency: 8,
        load: 45,
        security_score: 96,
        threat_level: 'low',
        protocol: 'WireGuard',
        encryption: 'AES-256-GCM',
        ai_optimization: true,
        ddos_protection: true,
      },
      {
        id: 'jp-tok-01',
        name: 'Tokyo Shield',
        location: 'Tokyo, Japan',
        country: 'Japan',
        region: 'Asia-Pacific',
        latency: 156,
        load: 67,
        security_score: 94,
        threat_level: 'medium',
        protocol: 'OpenVPN',
        encryption: 'AES-256-CBC',
        ai_optimization: false,
        ddos_protection: true,
      },
      {
        id: 'de-fra-01',
        name: 'Frankfurt Sentinel',
        location: 'Frankfurt, Germany',
        country: 'Germany',
        region: 'Europe',
        latency: 18,
        load: 34,
        security_score: 97,
        threat_level: 'low',
        protocol: 'IKEv2',
        encryption: 'AES-256-GCM + PFS',
        ai_optimization: true,
        ddos_protection: true,
      },
      {
        id: 'sg-sin-01',
        name: 'Singapore Nexus',
        location: 'Singapore',
        country: 'Singapore',
        region: 'Asia-Pacific',
        latency: 89,
        load: 56,
        security_score: 95,
        threat_level: 'low',
        protocol: 'WireGuard',
        encryption: 'ChaCha20-Poly1305',
        ai_optimization: true,
        ddos_protection: true,
      }
    ];
    setServers(vpnServers);
    setCurrentServer(vpnServers[0]);
  }, []);

  const startConnectionMonitoring = useCallback(() => {
    const interval = setInterval(() => {
      setConnectionStats(prev => ({
        dataTransferred: prev.dataTransferred + Math.random() * 100,
        uploadSpeed: 50 + Math.random() * 150,
        downloadSpeed: 100 + Math.random() * 300,
        sessionDuration: prev.sessionDuration + 1,
        threatsBlocked: prev.threatsBlocked + (Math.random() > 0.95 ? 1 : 0),
        phishingBlocked: prev.phishingBlocked + (Math.random() > 0.98 ? 1 : 0),
        adsBlocked: prev.adsBlocked + (Math.random() > 0.85 ? Math.floor(Math.random() * 5) : 0),
        malwareDomains: prev.malwareDomains + (Math.random() > 0.97 ? 1 : 0),
        anomaliesDetected: prev.anomaliesDetected + (Math.random() > 0.99 ? 1 : 0),
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const connectToVPN = async (server: VPNServer) => {
    setIsConnecting(true);
    
    try {
      // Simulate AI-powered server optimization
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsConnected(true);
      setCurrentServer(server);

      // Log VPN session
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('vpn_sessions').insert({
          user_id: user.id,
          server_location: server.location,
          encryption_protocol: `${server.protocol} + ${server.encryption}`,
          session_data: {
            latency: server.latency,
            load: server.load,
            security_score: server.security_score,
            ai_optimization: server.ai_optimization,
            threat_detection: threatDetection,
          } as any,
        });
      }
    } catch (error) {
      console.error('VPN connection failed:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectVPN = async () => {
    setIsConnected(false);
    setConnectionStats({
      dataTransferred: 0,
      uploadSpeed: 0,
      downloadSpeed: 0,
      sessionDuration: 0,
      threatsBlocked: 0,
      phishingBlocked: 0,
      adsBlocked: 0,
      malwareDomains: 0,
      anomaliesDetected: 0,
    });

    // Update session end time
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

  const optimizeServerSelection = () => {
    // AI-powered server selection based on latency, load, and security
    const optimalServer = servers.reduce((best, current) => {
      const bestScore = best.security_score - (best.latency * 0.1) - (best.load * 0.5);
      const currentScore = current.security_score - (current.latency * 0.1) - (current.load * 0.5);
      return currentScore > bestScore ? current : best;
    });
    
    setCurrentServer(optimalServer);
    if (!isConnected) {
      connectToVPN(optimalServer);
    }
  };

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getLatencyColor = (latency: number) => {
    if (latency < 20) return 'text-green-400';
    if (latency < 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Shield className="h-6 w-6 text-blue-400" />
          AI-Powered VPN Shield
        </CardTitle>
        <CardDescription className="text-slate-300">
          Enterprise-grade VPN with AI threat protection and quantum-resistant encryption
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Connection Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${
                isConnected ? 'bg-green-400 animate-pulse' : 
                isConnecting ? 'bg-yellow-400 animate-pulse' : 'bg-red-400'
              }`}></div>
              <span className="text-white font-medium">
                {isConnected ? 'Connected' : isConnecting ? 'Connecting...' : 'Disconnected'}
              </span>
              {isConnected && currentServer && (
                <Badge variant="outline" className="text-green-400 border-green-400">
                  <MapPin className="h-3 w-3 mr-1" />
                  {currentServer.location}
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={optimizeServerSelection}
                size="sm"
                className="bg-purple-600 hover:bg-purple-700"
                disabled={isConnecting}
              >
                <Zap className="h-4 w-4 mr-1" />
                AI Optimize
              </Button>
              <Button
                onClick={isConnected ? disconnectVPN : () => connectToVPN(currentServer!)}
                className={isConnected ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
                disabled={isConnecting}
              >
                {isConnected ? 'Disconnect' : isConnecting ? 'Connecting...' : 'Connect'}
              </Button>
            </div>
          </div>

          {/* Current Connection Details */}
          {isConnected && currentServer && (
            <div className="bg-slate-900/50 p-4 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-green-400" />
                  <span className="text-white font-medium">Security Protocol</span>
                </div>
                <Badge className="bg-green-600">{currentServer.protocol}</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Encryption</span>
                <span className="text-white">{currentServer.encryption}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Security Score</span>
                <div className="flex items-center gap-2">
                  <Progress value={currentServer.security_score} className="w-20" />
                  <span className="text-green-400">{currentServer.security_score}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Real-time Stats */}
          {isConnected && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-900/30 p-3 rounded-lg text-center">
                <div className="text-lg font-bold text-blue-400">
                  {connectionStats.downloadSpeed.toFixed(0)} Mbps
                </div>
                <div className="text-xs text-slate-400">Download</div>
              </div>
              <div className="bg-slate-900/30 p-3 rounded-lg text-center">
                <div className="text-lg font-bold text-green-400">
                  {connectionStats.uploadSpeed.toFixed(0)} Mbps
                </div>
                <div className="text-xs text-slate-400">Upload</div>
              </div>
              <div className="bg-slate-900/30 p-3 rounded-lg text-center">
                <div className="text-lg font-bold text-purple-400">
                  {connectionStats.dataTransferred.toFixed(1)} MB
                </div>
                <div className="text-xs text-slate-400">Data Used</div>
              </div>
              <div className="bg-slate-900/30 p-3 rounded-lg text-center">
                <div className="text-lg font-bold text-yellow-400">
                  {Math.floor(connectionStats.sessionDuration / 60)}:{(connectionStats.sessionDuration % 60).toString().padStart(2, '0')}
                </div>
                <div className="text-xs text-slate-400">Session Time</div>
              </div>
            </div>
          )}

          {/* AI Threat Protection Stats */}
          {isConnected && threatDetection.enabled && (
            <div className="bg-slate-900/50 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                <Eye className="h-4 w-4 text-red-400" />
                AI Threat Protection
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
                <div>
                  <div className="text-xl font-bold text-red-400">{connectionStats.threatsBlocked}</div>
                  <div className="text-xs text-slate-400">Threats Blocked</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-orange-400">{connectionStats.phishingBlocked}</div>
                  <div className="text-xs text-slate-400">Phishing Blocked</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-yellow-400">{connectionStats.adsBlocked}</div>
                  <div className="text-xs text-slate-400">Ads Blocked</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-purple-400">{connectionStats.malwareDomains}</div>
                  <div className="text-xs text-slate-400">Malware Domains</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-cyan-400">{connectionStats.anomaliesDetected}</div>
                  <div className="text-xs text-slate-400">Anomalies</div>
                </div>
              </div>
            </div>
          )}

          {/* AI Security Settings */}
          <div className="space-y-4">
            <h4 className="text-white font-medium flex items-center gap-2">
              <Settings className="h-4 w-4 text-blue-400" />
              AI Security Features
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Real-time Threat Scanning</span>
                <Switch 
                  checked={threatDetection.real_time_scanning}
                  onCheckedChange={(checked) => 
                    setThreatDetection(prev => ({ ...prev, real_time_scanning: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">AI DNS Filtering</span>
                <Switch 
                  checked={threatDetection.dns_filtering}
                  onCheckedChange={(checked) => 
                    setThreatDetection(prev => ({ ...prev, dns_filtering: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Phishing Protection</span>
                <Switch 
                  checked={threatDetection.phishing_protection}
                  onCheckedChange={(checked) => 
                    setThreatDetection(prev => ({ ...prev, phishing_protection: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Anomaly Detection</span>
                <Switch 
                  checked={threatDetection.anomaly_detection}
                  onCheckedChange={(checked) => 
                    setThreatDetection(prev => ({ ...prev, anomaly_detection: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Split Tunneling</span>
                <Switch 
                  checked={threatDetection.split_tunneling}
                  onCheckedChange={(checked) => 
                    setThreatDetection(prev => ({ ...prev, split_tunneling: checked }))
                  }
                />
              </div>
            </div>
          </div>

          {/* Server List */}
          <div className="space-y-3">
            <h4 className="text-white font-medium flex items-center gap-2">
              <Globe className="h-4 w-4 text-green-400" />
              Available Servers
            </h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {servers.map((server) => (
                <div
                  key={server.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors border ${
                    currentServer?.id === server.id 
                      ? 'bg-blue-900/30 border-blue-500' 
                      : 'bg-slate-900/30 border-slate-700 hover:bg-slate-800/50'
                  }`}
                  onClick={() => !isConnected && connectToVPN(server)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="text-white font-medium">{server.name}</div>
                      <Badge className={getThreatLevelColor(server.threat_level)}>
                        {server.threat_level}
                      </Badge>
                      {server.ai_optimization && (
                        <Badge className="bg-purple-600 text-xs">
                          <Zap className="h-3 w-3 mr-1" />
                          AI
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={getLatencyColor(server.latency)}>
                        {server.latency}ms
                      </span>
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">{server.location}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400">{server.protocol}</span>
                      <div className="flex items-center gap-1">
                        <Activity className="h-3 w-3 text-slate-400" />
                        <Progress value={server.load} className="w-12 h-2" />
                        <span className="text-slate-400 text-xs">{server.load}%</span>
                      </div>
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
