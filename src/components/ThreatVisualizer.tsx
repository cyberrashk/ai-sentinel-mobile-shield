
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, AlertCircle, Shield, Zap, Globe, Wifi } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Threat {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: { x: number; y: number };
  description: string;
  timestamp: string;
}

export const ThreatVisualizer = () => {
  const [threats, setThreats] = useState<Threat[]>([]);
  const [is3DView, setIs3DView] = useState(false);
  const [selectedThreat, setSelectedThreat] = useState<Threat | null>(null);

  useEffect(() => {
    generateMockThreats();
    fetchStoredThreats();
  }, []);

  const generateMockThreats = () => {
    const mockThreats: Threat[] = [
      {
        id: '1',
        type: 'DNS Spoofing',
        severity: 'high',
        location: { x: 45, y: 30 },
        description: 'Malicious DNS server detected on network',
        timestamp: new Date().toISOString(),
      },
      {
        id: '2',
        type: 'Phishing Attempt',
        severity: 'critical',
        location: { x: 70, y: 60 },
        description: 'Suspicious email with credential harvesting link',
        timestamp: new Date().toISOString(),
      },
      {
        id: '3',
        type: 'Weak Encryption',
        severity: 'medium',
        location: { x: 25, y: 80 },
        description: 'WEP encryption detected on nearby WiFi',
        timestamp: new Date().toISOString(),
      },
      {
        id: '4',
        type: 'Malware Signature',
        severity: 'high',
        location: { x: 85, y: 25 },
        description: 'Known malware hash detected in download',
        timestamp: new Date().toISOString(),
      },
    ];
    setThreats(mockThreats);
  };

  const fetchStoredThreats = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('threat_reports')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching threats:', error);
      return;
    }

    console.log('Stored threats:', data);
  };

  const saveThreatReport = async (threat: Threat) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('threat_reports').insert({
      user_id: user.id,
      threat_type: threat.type,
      severity: threat.severity,
      location_data: threat.location,
      compliance_data: {
        detected_at: threat.timestamp,
        description: threat.description,
      },
    });

    if (error) {
      console.error('Error saving threat report:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityIcon = (type: string) => {
    switch (type) {
      case 'DNS Spoofing': return <Globe className="h-4 w-4" />;
      case 'Phishing Attempt': return <AlertCircle className="h-4 w-4" />;
      case 'Weak Encryption': return <Wifi className="h-4 w-4" />;
      case 'Malware Signature': return <Zap className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Eye className="h-6 w-6 text-cyan-400" />
          3D Threat Visualization
        </CardTitle>
        <CardDescription className="text-slate-300">
          Real-time security threat mapping with AI analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant={is3DView ? "default" : "outline"}
              size="sm"
              onClick={() => setIs3DView(!is3DView)}
              className="text-white"
            >
              {is3DView ? '2D View' : '3D View'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={generateMockThreats}
              className="text-white"
            >
              Refresh Scan
            </Button>
          </div>

          <div className="relative bg-slate-900 rounded-lg p-4 h-64 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20"></div>
            
            {/* Threat visualization area */}
            <div className="relative h-full">
              {threats.map((threat) => (
                <div
                  key={threat.id}
                  className={`absolute w-4 h-4 rounded-full ${getSeverityColor(threat.severity)} 
                    animate-pulse cursor-pointer transform hover:scale-150 transition-transform
                    ${is3DView ? 'shadow-lg border-2 border-white/30' : ''}`}
                  style={{
                    left: `${threat.location.x}%`,
                    top: `${threat.location.y}%`,
                    transform: is3DView ? `perspective(1000px) rotateX(45deg) rotateY(${threat.location.x}deg)` : 'none',
                  }}
                  onClick={() => {
                    setSelectedThreat(threat);
                    saveThreatReport(threat);
                  }}
                  title={`${threat.type} - ${threat.severity}`}
                >
                  <div className="absolute -top-1 -left-1 w-6 h-6 rounded-full border-2 border-current opacity-50 animate-ping"></div>
                </div>
              ))}

              {/* Grid overlay */}
              <div className="absolute inset-0 opacity-20">
                <svg className="w-full h-full">
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" className="text-cyan-400" />
                </svg>
              </div>
            </div>
          </div>

          {/* Threat details */}
          {selectedThreat && (
            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
              <div className="flex items-center gap-2 mb-2">
                {getSeverityIcon(selectedThreat.type)}
                <h4 className="text-white font-medium">{selectedThreat.type}</h4>
                <span className={`px-2 py-1 rounded text-xs text-white ${getSeverityColor(selectedThreat.severity)}`}>
                  {selectedThreat.severity.toUpperCase()}
                </span>
              </div>
              <p className="text-slate-300 text-sm mb-2">{selectedThreat.description}</p>
              <p className="text-slate-400 text-xs">
                Detected: {new Date(selectedThreat.timestamp).toLocaleString()}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center">
            <div className="bg-slate-900/50 p-3 rounded">
              <div className="text-green-400 font-bold">{threats.filter(t => t.severity === 'low').length}</div>
              <div className="text-xs text-slate-400">Low Risk</div>
            </div>
            <div className="bg-slate-900/50 p-3 rounded">
              <div className="text-yellow-400 font-bold">{threats.filter(t => t.severity === 'medium').length}</div>
              <div className="text-xs text-slate-400">Medium Risk</div>
            </div>
            <div className="bg-slate-900/50 p-3 rounded">
              <div className="text-orange-400 font-bold">{threats.filter(t => t.severity === 'high').length}</div>
              <div className="text-xs text-slate-400">High Risk</div>
            </div>
            <div className="bg-slate-900/50 p-3 rounded">
              <div className="text-red-400 font-bold">{threats.filter(t => t.severity === 'critical').length}</div>
              <div className="text-xs text-slate-400">Critical</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
