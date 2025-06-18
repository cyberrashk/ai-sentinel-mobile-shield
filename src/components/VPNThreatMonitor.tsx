
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  AlertTriangle, 
  Eye, 
  TrendingUp, 
  Activity,
  Wifi,
  Lock,
  Zap
} from 'lucide-react';

interface ThreatEvent {
  id: string;
  timestamp: Date;
  type: 'malware' | 'phishing' | 'ads' | 'tracking' | 'anomaly';
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  destination: string;
  action: 'blocked' | 'quarantined' | 'monitored';
  details: string;
}

interface NetworkStats {
  totalConnections: number;
  blockedRequests: number;
  encryptedTraffic: number;
  threatScore: number;
  bandwidthSaved: number;
}

export const VPNThreatMonitor = () => {
  const [threatEvents, setThreatEvents] = useState<ThreatEvent[]>([]);
  const [networkStats, setNetworkStats] = useState<NetworkStats>({
    totalConnections: 0,
    blockedRequests: 0,
    encryptedTraffic: 0,
    threatScore: 0,
    bandwidthSaved: 0,
  });

  useEffect(() => {
    generateThreatEvents();
    updateNetworkStats();
    
    const interval = setInterval(() => {
      generateThreatEvents();
      updateNetworkStats();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const generateThreatEvents = () => {
    const eventTypes: ThreatEvent['type'][] = ['malware', 'phishing', 'ads', 'tracking', 'anomaly'];
    const severities: ThreatEvent['severity'][] = ['low', 'medium', 'high', 'critical'];
    const actions: ThreatEvent['action'][] = ['blocked', 'quarantined', 'monitored'];
    
    const newEvent: ThreatEvent = {
      id: `threat_${Date.now()}`,
      timestamp: new Date(),
      type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      source: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      destination: `suspicious-domain-${Math.floor(Math.random() * 1000)}.com`,
      action: actions[Math.floor(Math.random() * actions.length)],
      details: getThreatDetails(eventTypes[Math.floor(Math.random() * eventTypes.length)]),
    };

    if (Math.random() > 0.7) {
      setThreatEvents(prev => [newEvent, ...prev.slice(0, 9)]);
    }
  };

  const updateNetworkStats = () => {
    setNetworkStats(prev => ({
      totalConnections: prev.totalConnections + Math.floor(Math.random() * 10),
      blockedRequests: prev.blockedRequests + Math.floor(Math.random() * 5),
      encryptedTraffic: Math.min(prev.encryptedTraffic + Math.random() * 2, 100),
      threatScore: Math.max(0, 100 - Math.random() * 20),
      bandwidthSaved: prev.bandwidthSaved + Math.random() * 0.5,
    }));
  };

  const getThreatDetails = (type: ThreatEvent['type']): string => {
    const details = {
      malware: 'Malicious executable detected in download stream',
      phishing: 'Suspicious domain attempting credential theft',
      ads: 'Tracking script blocked by AI filter',
      tracking: 'Cross-site tracking attempt prevented',
      anomaly: 'Unusual traffic pattern detected by ML model',
    };
    return details[type];
  };

  const getSeverityColor = (severity: ThreatEvent['severity']) => {
    switch (severity) {
      case 'low': return 'bg-blue-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: ThreatEvent['type']) => {
    switch (type) {
      case 'malware': return <Shield className="h-3 w-3" />;
      case 'phishing': return <AlertTriangle className="h-3 w-3" />;
      case 'ads': return <Eye className="h-3 w-3" />;
      case 'tracking': return <Activity className="h-3 w-3" />;
      case 'anomaly': return <Zap className="h-3 w-3" />;
      default: return <Shield className="h-3 w-3" />;
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Eye className="h-5 w-5 text-purple-400" />
          Real-Time Threat Monitor
        </CardTitle>
        <CardDescription className="text-slate-300">
          AI-powered traffic analysis and threat detection
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Network Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/50 p-3 rounded-lg text-center">
              <div className="text-lg font-bold text-blue-400">{networkStats.totalConnections}</div>
              <div className="text-xs text-slate-400">Total Connections</div>
            </div>
            <div className="bg-slate-900/50 p-3 rounded-lg text-center">
              <div className="text-lg font-bold text-red-400">{networkStats.blockedRequests}</div>
              <div className="text-xs text-slate-400">Blocked Requests</div>
            </div>
            <div className="bg-slate-900/50 p-3 rounded-lg text-center">
              <div className="text-lg font-bold text-green-400">{networkStats.encryptedTraffic.toFixed(1)}%</div>
              <div className="text-xs text-slate-400">Encrypted Traffic</div>
            </div>
            <div className="bg-slate-900/50 p-3 rounded-lg text-center">
              <div className="text-lg font-bold text-purple-400">{networkStats.bandwidthSaved.toFixed(1)} MB</div>
              <div className="text-xs text-slate-400">Bandwidth Saved</div>
            </div>
          </div>

          {/* Threat Score */}
          <div className="bg-slate-900/50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white font-medium">Overall Threat Score</span>
              <span className="text-green-400 font-bold">{networkStats.threatScore.toFixed(0)}/100</span>
            </div>
            <Progress value={networkStats.threatScore} className="h-3" />
            <div className="text-xs text-slate-400 mt-2">
              Based on real-time AI analysis of network traffic patterns
            </div>
          </div>

          {/* Recent Threat Events */}
          <div className="space-y-3">
            <h4 className="text-white font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
              Recent Threat Events
            </h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {threatEvents.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <div>No threats detected</div>
                  <div className="text-xs">Your connection is secure</div>
                </div>
              ) : (
                threatEvents.map((event) => (
                  <div
                    key={event.id}
                    className="bg-slate-900/30 p-3 rounded-lg border border-slate-700"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge className={getSeverityColor(event.severity)} variant="default">
                          {getTypeIcon(event.type)}
                          {event.type.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="text-green-400 border-green-400">
                          {event.action.toUpperCase()}
                        </Badge>
                      </div>
                      <span className="text-xs text-slate-400">
                        {event.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-sm text-slate-300 mb-1">{event.details}</div>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>From: {event.source}</span>
                      <span>To: {event.destination}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* AI Analysis Summary */}
          <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-4 rounded-lg border border-purple-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-purple-400" />
              <span className="text-white font-medium">AI Analysis Summary</span>
            </div>
            <div className="text-sm text-slate-300">
              {threatEvents.length > 5 ? (
                `High threat activity detected. AI models have blocked ${networkStats.blockedRequests} suspicious requests in the last hour. Consider enabling maximum protection mode.`
              ) : threatEvents.length > 2 ? (
                `Moderate threat activity. Your VPN is successfully filtering malicious content and tracking attempts.`
              ) : (
                `Low threat environment detected. Your connection is secure with minimal suspicious activity.`
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
