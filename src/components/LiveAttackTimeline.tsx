
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, AlertTriangle, Shield, Zap, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AttackEvent {
  id: string;
  timestamp: Date;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  target: string;
  status: 'detected' | 'blocked' | 'investigating' | 'resolved';
  description: string;
}

export const LiveAttackTimeline = () => {
  const [events, setEvents] = useState<AttackEvent[]>([
    {
      id: '1',
      timestamp: new Date(Date.now() - 5000),
      type: 'SQL Injection',
      severity: 'high',
      source: '192.168.1.100',
      target: '/api/user/login',
      status: 'blocked',
      description: 'Malicious SQL payload detected and blocked'
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 15000),
      type: 'DDoS Attack',
      severity: 'critical',
      source: 'Multiple IPs',
      target: 'Main Server',
      status: 'investigating',
      description: 'High volume traffic spike from suspicious sources'
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 45000),
      type: 'Phishing Attempt',
      severity: 'medium',
      source: 'suspicious@email.com',
      target: 'User Email',
      status: 'resolved',
      description: 'Phishing email filtered and quarantined'
    }
  ]);

  useEffect(() => {
    // Simulate real-time attack events
    const eventInterval = setInterval(() => {
      if (Math.random() > 0.8) {
        const attackTypes = ['Port Scan', 'Brute Force', 'XSS Attempt', 'Malware Download', 'Data Exfiltration'];
        const severities: ('low' | 'medium' | 'high' | 'critical')[] = ['low', 'medium', 'high', 'critical'];
        const statuses: ('detected' | 'blocked' | 'investigating' | 'resolved')[] = ['detected', 'blocked', 'investigating'];
        
        const newEvent: AttackEvent = {
          id: Date.now().toString(),
          timestamp: new Date(),
          type: attackTypes[Math.floor(Math.random() * attackTypes.length)],
          severity: severities[Math.floor(Math.random() * severities.length)],
          source: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          target: '/api/endpoint',
          status: statuses[Math.floor(Math.random() * statuses.length)],
          description: 'Real-time threat detected by AI engine'
        };

        setEvents(prev => [newEvent, ...prev.slice(0, 9)]);
      }
    }, 8000);

    return () => clearInterval(eventInterval);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-l-red-500 bg-red-500/5';
      case 'high': return 'border-l-orange-500 bg-orange-500/5';
      case 'medium': return 'border-l-yellow-500 bg-yellow-500/5';
      case 'low': return 'border-l-green-500 bg-green-500/5';
      default: return 'border-l-gray-500 bg-gray-500/5';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'blocked': return <Shield className="h-4 w-4 text-green-400" />;
      case 'detected': return <Eye className="h-4 w-4 text-yellow-400" />;
      case 'investigating': return <Zap className="h-4 w-4 text-blue-400" />;
      case 'resolved': return <Shield className="h-4 w-4 text-gray-400" />;
      default: return <AlertTriangle className="h-4 w-4 text-red-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'blocked': return 'bg-green-500/20 text-green-400';
      case 'detected': return 'bg-yellow-500/20 text-yellow-400';
      case 'investigating': return 'bg-blue-500/20 text-blue-400';
      case 'resolved': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-red-500/20 text-red-400';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Clock className="h-6 w-6 text-blue-400" />
          Live Attack Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {events.map((event, index) => (
            <div
              key={event.id}
              className={`border-l-4 pl-4 py-3 ${getSeverityColor(event.severity)} ${
                index === 0 ? 'animate-fade-in' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(event.status)}
                  <span className="text-white font-medium text-sm">{event.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(event.status)}>
                    {event.status}
                  </Badge>
                  <span className="text-xs text-slate-400">
                    {formatTime(event.timestamp)}
                  </span>
                </div>
              </div>
              
              <div className="text-xs text-slate-400 space-y-1">
                <div>Source: <span className="text-slate-300">{event.source}</span></div>
                <div>Target: <span className="text-slate-300">{event.target}</span></div>
                <div className="text-slate-300">{event.description}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
