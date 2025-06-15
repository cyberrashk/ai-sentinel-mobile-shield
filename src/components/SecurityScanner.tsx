
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Scan, Play, Pause, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export const SecurityScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResults, setScanResults] = useState<any[]>([]);
  const [lastScan, setLastScan] = useState('Never');

  useEffect(() => {
    if (isScanning && scanProgress < 100) {
      const timer = setTimeout(() => {
        setScanProgress(prev => {
          const newProgress = Math.min(prev + Math.random() * 5, 100);
          
          // Simulate finding threats during scan
          if (newProgress > 25 && newProgress < 30 && scanResults.length === 0) {
            setScanResults([{ type: 'Malware', file: 'suspicious.apk', severity: 'High' }]);
          }
          if (newProgress > 60 && newProgress < 65 && scanResults.length === 1) {
            setScanResults(prev => [...prev, { type: 'Adware', file: 'ad_tracker.js', severity: 'Medium' }]);
          }
          
          return newProgress;
        });
      }, 150);
      return () => clearTimeout(timer);
    } else if (scanProgress >= 100) {
      setIsScanning(false);
      setLastScan(new Date().toLocaleTimeString());
    }
  }, [scanProgress, isScanning, scanResults.length]);

  const startScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setScanResults([]);
  };

  const stopScan = () => {
    setIsScanning(false);
  };

  return (
    <Card className="bg-white/5 backdrop-blur-lg border-white/10">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <Scan className="h-5 w-5 text-blue-400" />
          <CardTitle className="text-white">Security Scanner</CardTitle>
        </div>
        <Badge className="bg-blue-500/20 text-blue-400">
          Real-time Protection
        </Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-white">Quick Scan Progress</span>
            <span className="text-slate-400">{Math.round(scanProgress)}%</span>
          </div>
          <Progress value={scanProgress} className="h-2" />
          
          <div className="flex space-x-2">
            {!isScanning ? (
              <Button onClick={startScan} className="bg-green-500 hover:bg-green-600 text-white">
                <Play className="h-4 w-4 mr-2" />
                Start Scan
              </Button>
            ) : (
              <Button onClick={stopScan} className="bg-red-500 hover:bg-red-600 text-white">
                <Pause className="h-4 w-4 mr-2" />
                Stop Scan
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-white font-medium">Scan Results</h4>
          {scanResults.length === 0 ? (
            <div className="flex items-center space-x-2 text-green-400">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">No threats detected</span>
            </div>
          ) : (
            scanResults.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  <div>
                    <p className="text-white text-sm font-medium">{result.type}</p>
                    <p className="text-slate-400 text-xs">{result.file}</p>
                  </div>
                </div>
                <Badge className="bg-red-500/20 text-red-400">
                  {result.severity}
                </Badge>
              </div>
            ))
          )}
        </div>

        <div className="text-xs text-slate-500">
          Last scan: {lastScan}
        </div>
      </CardContent>
    </Card>
  );
};
