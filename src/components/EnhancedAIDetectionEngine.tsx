
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Zap, Target, AlertCircle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface ThreatSignature {
  id: string;
  name: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  indicators: string[];
}

export const EnhancedAIDetectionEngine = () => {
  const [isHunting, setIsHunting] = useState(false);
  const [detectedThreats, setDetectedThreats] = useState<ThreatSignature[]>([]);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [autonomousMode, setAutonomousMode] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (autonomousMode) {
      const huntingInterval = setInterval(() => {
        performAutonomousThreatHunt();
      }, 30000); // Hunt every 30 seconds

      return () => clearInterval(huntingInterval);
    }
  }, [autonomousMode]);

  const performAutonomousThreatHunt = async () => {
    setIsHunting(true);
    setAnalysisProgress(0);

    // Simulate AI threat hunting with progressive analysis
    const huntingPhases = [
      'Scanning network signatures...',
      'Analyzing behavioral patterns...',
      'Correlating threat intelligence...',
      'Processing machine learning models...',
      'Validating threat indicators...'
    ];

    for (let i = 0; i < huntingPhases.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setAnalysisProgress((i + 1) * 20);
      
      // Simulate threat detection
      if (Math.random() > 0.7 && i === 2) {
        const newThreat: ThreatSignature = {
          id: `threat_${Date.now()}`,
          name: 'Advanced Persistent Threat (APT)',
          confidence: 87 + Math.random() * 10,
          severity: 'high',
          category: 'Network Intrusion',
          indicators: ['Encrypted C2 communication', 'Process injection detected', 'Registry modification']
        };
        
        setDetectedThreats(prev => [newThreat, ...prev.slice(0, 4)]);
        
        toast({
          title: "🎯 Autonomous Threat Hunter",
          description: `High-confidence threat detected: ${newThreat.name}`,
          variant: "destructive",
        });
      }
    }

    setIsHunting(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-500 bg-red-500/10';
      case 'high': return 'text-orange-500 bg-orange-500/10';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10';
      case 'low': return 'text-green-500 bg-green-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-400" />
            <CardTitle className="text-white">AI Threat Hunter</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={`${autonomousMode ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
              {autonomousMode ? 'Autonomous' : 'Manual'}
            </Badge>
            <button
              onClick={() => setAutonomousMode(!autonomousMode)}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              Toggle
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isHunting && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-400 animate-pulse" />
              <span className="text-white text-sm">AI Engine Active</span>
            </div>
            <Progress value={analysisProgress} className="h-2" />
          </div>
        )}

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-white font-medium">Live Threat Feed</h4>
            <button
              onClick={performAutonomousThreatHunt}
              disabled={isHunting}
              className="text-sm text-purple-400 hover:text-purple-300 disabled:opacity-50"
            >
              Manual Hunt
            </button>
          </div>

          {detectedThreats.length === 0 ? (
            <div className="flex items-center gap-2 text-green-400 p-3 bg-green-500/10 rounded-lg">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">No active threats detected</span>
            </div>
          ) : (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {detectedThreats.map((threat) => (
                <div key={threat.id} className="p-3 bg-slate-900/50 rounded-lg border border-slate-600">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-sm font-medium">{threat.name}</span>
                    <Badge className={getSeverityColor(threat.severity)}>
                      {threat.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-400 mb-2">
                    Confidence: {threat.confidence.toFixed(1)}% | Category: {threat.category}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {threat.indicators.slice(0, 2).map((indicator, idx) => (
                      <span key={idx} className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
                        {indicator}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
