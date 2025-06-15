
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Smartphone, Wifi, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const ThreatMonitor = () => {
  const [threats, setThreats] = useState([
    { 
      id: 1, 
      type: 'Malware', 
      source: 'com.suspicious.app', 
      severity: 'High', 
      time: '2 min ago',
      icon: Smartphone,
      status: 'Blocked'
    },
    {
      id: 2,
      type: 'Phishing',
      source: 'suspicious-link.com',
      severity: 'Medium',
      time: '5 min ago',
      icon: Wifi,
      status: 'Blocked'
    },
    {
      id: 3,
      type: 'Unsafe Download',
      source: 'unknown-file.apk',
      severity: 'High',
      time: '12 min ago',
      icon: Download,
      status: 'Quarantined'
    }
  ]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Blocked': return 'bg-red-500/20 text-red-400';
      case 'Quarantined': return 'bg-yellow-500/20 text-yellow-400';
      case 'Allowed': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <Card className="bg-white/5 backdrop-blur-lg border-white/10">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-red-400" />
          <CardTitle className="text-white">Real-Time Threat Monitor</CardTitle>
        </div>
        <Badge className="bg-red-500/20 text-red-400">
          {threats.length} Active
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {threats.map((threat) => (
          <div key={threat.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <threat.icon className="h-4 w-4 text-red-400" />
              </div>
              <div>
                <h4 className="text-white font-medium">{threat.type}</h4>
                <p className="text-slate-400 text-sm">{threat.source}</p>
                <p className="text-slate-500 text-xs">{threat.time}</p>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-1">
              <Badge className={getSeverityColor(threat.severity)}>
                {threat.severity}
              </Badge>
              <Badge className={getStatusColor(threat.status)}>
                {threat.status}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
