
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Activity, Zap, Target } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export const AIDetectionEngine = () => {
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    if (isScanning && scanProgress < 100) {
      const timer = setTimeout(() => {
        setScanProgress(prev => Math.min(prev + 2, 100));
      }, 100);
      return () => clearTimeout(timer);
    } else if (scanProgress >= 100) {
      setIsScanning(false);
    }
  }, [scanProgress, isScanning]);

  const aiModels = [
    {
      name: 'Malware Detection CNN',
      accuracy: '99.7%',
      status: 'Active',
      icon: Target,
      color: 'text-green-400'
    },
    {
      name: 'Phishing NLP Model',
      accuracy: '98.2%',
      status: 'Active',
      icon: Brain,
      color: 'text-blue-400'
    },
    {
      name: 'Behavioral Analysis',
      accuracy: '96.8%',
      status: 'Learning',
      icon: Activity,
      color: 'text-cyan-400'
    }
  ];

  return (
    <Card className="bg-white/5 backdrop-blur-lg border-white/10">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-blue-400" />
          <CardTitle className="text-white">AI Detection Engine</CardTitle>
        </div>
        <Badge className="bg-blue-500/20 text-blue-400">
          <Zap className="h-3 w-3 mr-1" />
          Neural Network
        </Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-white font-medium">Real-time Scan</span>
            <span className="text-slate-400">{scanProgress}%</span>
          </div>
          <Progress value={scanProgress} className="h-2" />
          <p className="text-slate-500 text-sm mt-1">
            {isScanning ? 'Analyzing system behavior...' : 'Scan complete - System secure'}
          </p>
        </div>
        
        <div className="space-y-3">
          <h4 className="text-white font-medium">Active AI Models</h4>
          {aiModels.map((model, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-3">
                <model.icon className={`h-4 w-4 ${model.color}`} />
                <div>
                  <p className="text-white text-sm font-medium">{model.name}</p>
                  <p className="text-slate-400 text-xs">Accuracy: {model.accuracy}</p>
                </div>
              </div>
              <Badge className={
                model.status === 'Active' 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-yellow-500/20 text-yellow-400'
              }>
                {model.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
