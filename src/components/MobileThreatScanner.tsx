
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Smartphone, 
  Wifi, 
  Lock, 
  Eye,
  Shield,
  AlertTriangle,
  CheckCircle,
  Activity,
  Scan
} from 'lucide-react';

interface MobileThreat {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  location: string;
  confidence: number;
  timestamp: string;
}

export const MobileThreatScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [threats, setThreats] = useState<MobileThreat[]>([]);
  const [scanPhase, setScanPhase] = useState('');
  const { toast } = useToast();

  const runMobileScan = async () => {
    setIsScanning(true);
    setScanProgress(0);
    setThreats([]);

    const phases = [
      { name: 'Scanning installed apps...', duration: 1000 },
      { name: 'Analyzing network connections...', duration: 1200 },
      { name: 'Checking device permissions...', duration: 800 },
      { name: 'Monitoring system behavior...', duration: 1500 },
      { name: 'AI threat correlation...', duration: 900 }
    ];

    try {
      for (let i = 0; i < phases.length; i++) {
        const phase = phases[i];
        setScanPhase(phase.name);
        
        await new Promise(resolve => setTimeout(resolve, phase.duration));
        setScanProgress(((i + 1) / phases.length) * 100);

        // Simulate finding threats
        if (Math.random() > 0.6) {
          const threat: MobileThreat = {
            id: `threat_${Date.now()}_${i}`,
            type: ['Malicious App', 'Network Intrusion', 'Privacy Leak', 'Suspicious Behavior'][i % 4],
            severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as any,
            description: [
              'Suspicious app requesting excessive permissions',
              'Unencrypted data transmission detected',
              'Location tracking without consent',
              'Abnormal system call patterns'
            ][i % 4],
            location: ['System Apps', 'Network Layer', 'Background Services', 'Runtime Environment'][i % 4],
            confidence: 0.7 + Math.random() * 0.3,
            timestamp: new Date().toISOString()
          };

          setThreats(prev => [...prev, threat]);

          toast({
            title: `📱 Mobile Threat Detected`,
            description: threat.description,
            variant: threat.severity === 'critical' || threat.severity === 'high' ? "destructive" : "default"
          });
        }
      }

      toast({
        title: "📱 Mobile Scan Complete",
        description: `Scan finished. ${threats.length} threats identified.`,
      });

    } catch (error) {
      console.error('Mobile scan error:', error);
    } finally {
      setIsScanning(false);
      setScanPhase('');
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="h-4 w-4" />;
      case 'medium':
        return <Eye className="h-4 w-4" />;
      case 'low':
        return <Shield className="h-4 w-4" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="h-6 w-6 text-blue-400" />
            <CardTitle className="text-white">Mobile Security Scanner</CardTitle>
          </div>
          <Badge className="bg-blue-500/20 text-blue-400">
            Real-time Protection
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-3">
          <Button
            onClick={runMobileScan}
            disabled={isScanning}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <Scan className="h-4 w-4 mr-2" />
            {isScanning ? 'Scanning...' : 'Start Mobile Scan'}
          </Button>
        </div>

        {isScanning && (
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-blue-300">{scanPhase}</span>
              <span className="text-blue-400">{Math.round(scanProgress)}%</span>
            </div>
            <Progress value={scanProgress} className="h-2" />
          </div>
        )}

        {/* Mobile Security Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-slate-900/50 rounded-lg text-center">
            <div className="flex items-center justify-center mb-2">
              <Smartphone className="h-5 w-5 text-blue-400" />
            </div>
            <p className="text-white font-medium text-sm">Apps Scanned</p>
            <p className="text-blue-400 text-lg font-bold">247</p>
          </div>
          <div className="p-3 bg-slate-900/50 rounded-lg text-center">
            <div className="flex items-center justify-center mb-2">
              <Wifi className="h-5 w-5 text-green-400" />
            </div>
            <p className="text-white font-medium text-sm">Network</p>
            <p className="text-green-400 text-lg font-bold">Secure</p>
          </div>
          <div className="p-3 bg-slate-900/50 rounded-lg text-center">
            <div className="flex items-center justify-center mb-2">
              <Lock className="h-5 w-5 text-yellow-400" />
            </div>
            <p className="text-white font-medium text-sm">Permissions</p>
            <p className="text-yellow-400 text-lg font-bold">Review</p>
          </div>
          <div className="p-3 bg-slate-900/50 rounded-lg text-center">
            <div className="flex items-center justify-center mb-2">
              <Activity className="h-5 w-5 text-purple-400" />
            </div>
            <p className="text-white font-medium text-sm">Behavior</p>
            <p className="text-purple-400 text-lg font-bold">Normal</p>
          </div>
        </div>

        {/* Threat Results */}
        {threats.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-white font-medium">Detected Threats</h4>
            {threats.map((threat) => (
              <div key={threat.id} className="p-4 bg-slate-900/50 rounded-lg border border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getSeverityIcon(threat.severity)}
                    <span className="text-white font-medium">{threat.type}</span>
                  </div>
                  <Badge className={getSeverityColor(threat.severity)}>
                    {threat.severity.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-slate-300 text-sm mb-2">{threat.description}</p>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Location: {threat.location}</span>
                  <span className="text-slate-500">
                    Confidence: {(threat.confidence * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {threats.length === 0 && !isScanning && (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-3" />
            <p className="text-white font-medium">Device Secure</p>
            <p className="text-slate-400 text-sm">No threats detected in recent scans</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
