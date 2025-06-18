
import React, { useState, useEffect } from 'react';
import { SecurityDashboard } from './SecurityDashboard';
import { SecurityMetrics } from './SecurityMetrics';
import { AIMLScanner } from './AIMLScanner';
import { MobileThreatScanner } from './MobileThreatScanner';
import { Button } from '@/components/ui/button';
import { Shield, CheckCircle, AlertTriangle, Radar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const HomeTab = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [threatsFound, setThreatsFound] = useState(false);
  const [securityScore, setSecurityScore] = useState(98);
  const [showDetails, setShowDetails] = useState(false);
  const { toast } = useToast();

  const startScan = () => {
    setIsScanning(true);
    setScanComplete(false);
    setThreatsFound(false);
    
    toast({
      title: "🔍 Security Scan Started",
      description: "Scanning your device for threats...",
    });

    // Simulate scan process
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
      
      // Randomly determine if threats are found (for demo)
      const hasThreats = Math.random() < 0.3;
      setThreatsFound(hasThreats);
      
      if (hasThreats) {
        setSecurityScore(Math.floor(Math.random() * 30) + 60); // 60-89
        toast({
          title: "⚠️ Threats Detected",
          description: "Potential security issues found. Tap for details.",
          variant: "destructive",
        });
      } else {
        setSecurityScore(Math.floor(Math.random() * 10) + 90); // 90-99
        toast({
          title: "✅ Device Secure",
          description: "No threats detected. Your device is protected!",
        });
      }
    }, 3000);
  };

  const handleLongPress = () => {
    toast({
      title: "🔬 Deep Scan Mode",
      description: "Initiating comprehensive security analysis...",
    });
    startScan();
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-black">
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Security Score Indicator */}
      <div className="absolute top-8 right-6 z-10">
        <div className="bg-black/20 backdrop-blur-lg rounded-full px-4 py-2 border border-white/10">
          <span className="text-white text-sm font-semibold">{securityScore}%</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        {/* Hero Scan Button */}
        <div className="flex flex-col items-center space-y-8">
          {/* Large Central Scan Button */}
          <div className="relative">
            <Button
              onClick={startScan}
              onTouchStart={(e) => {
                const timer = setTimeout(handleLongPress, 800);
                e.currentTarget.dataset.timer = timer.toString();
              }}
              onTouchEnd={(e) => {
                const timer = e.currentTarget.dataset.timer;
                if (timer) clearTimeout(parseInt(timer));
              }}
              disabled={isScanning}
              className={`
                relative w-80 h-80 rounded-full text-white font-bold text-2xl
                transition-all duration-500 transform
                ${isScanning 
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-400 animate-pulse scale-105' 
                  : scanComplete 
                    ? threatsFound 
                      ? 'bg-gradient-to-r from-red-500 to-orange-500 animate-bounce shadow-red-500/50' 
                      : 'bg-gradient-to-r from-green-500 to-emerald-400 shadow-green-500/50'
                    : 'bg-gradient-to-r from-blue-500 to-cyan-400 hover:scale-105 shadow-blue-500/30'
                }
                shadow-2xl border-4 border-white/20 backdrop-blur-lg
                ${!isScanning && !scanComplete ? 'hover:shadow-blue-500/50' : ''}
              `}
            >
              {/* Radar Animation Background */}
              {isScanning && (
                <div className="absolute inset-0 rounded-full">
                  <div className="absolute inset-4 rounded-full border-2 border-white/30 animate-ping" />
                  <div className="absolute inset-8 rounded-full border border-white/20 animate-ping" style={{ animationDelay: '0.5s' }} />
                  <div className="absolute inset-12 rounded-full border border-white/10 animate-ping" style={{ animationDelay: '1s' }} />
                </div>
              )}
              
              {/* Icon and Text */}
              <div className="relative z-10 flex flex-col items-center justify-center space-y-4">
                {isScanning ? (
                  <Radar className="h-20 w-20 animate-spin" />
                ) : scanComplete ? (
                  threatsFound ? (
                    <AlertTriangle className="h-20 w-20 animate-pulse" />
                  ) : (
                    <CheckCircle className="h-20 w-20" />
                  )
                ) : (
                  <Shield className="h-20 w-20" />
                )}
                
                <span className="text-center leading-tight">
                  {isScanning 
                    ? 'Scanning...' 
                    : scanComplete 
                      ? threatsFound 
                        ? 'Threats Found' 
                        : 'Device Secure'
                      : 'Scan Now'
                  }
                </span>
              </div>

              {/* Glow Effect */}
              <div className={`
                absolute inset-0 rounded-full opacity-75 blur-xl
                ${isScanning 
                  ? 'bg-gradient-to-r from-blue-400 to-cyan-300 animate-pulse' 
                  : scanComplete 
                    ? threatsFound 
                      ? 'bg-gradient-to-r from-red-400 to-orange-300' 
                      : 'bg-gradient-to-r from-green-400 to-emerald-300'
                    : 'bg-gradient-to-r from-blue-400 to-cyan-300'
                }
              `} />
            </Button>
          </div>

          {/* Minimal Status Text */}
          {!showDetails && (
            <div className="text-center space-y-2">
              <p className="text-white/80 text-lg">
                {isScanning 
                  ? 'Analyzing your device security...' 
                  : scanComplete 
                    ? threatsFound 
                      ? 'Swipe up for threat details' 
                      : 'Your device is protected'
                    : 'Tap to start security scan'
                }
              </p>
              {!isScanning && !scanComplete && (
                <p className="text-white/50 text-sm">Hold for deep scan</p>
              )}
            </div>
          )}
        </div>

        {/* Swipe Up Indicator */}
        {scanComplete && !showDetails && (
          <div 
            className="absolute bottom-20 left-1/2 transform -translate-x-1/2 cursor-pointer"
            onClick={() => setShowDetails(true)}
          >
            <div className="flex flex-col items-center space-y-2 animate-bounce">
              <div className="w-1 h-8 bg-white/50 rounded-full" />
              <span className="text-white/70 text-sm">Swipe up for details</span>
            </div>
          </div>
        )}
      </div>

      {/* Detailed Report (Hidden by default) */}
      {showDetails && (
        <div className="absolute inset-x-0 bottom-0 bg-black/40 backdrop-blur-xl border-t border-white/10 rounded-t-3xl z-20 p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">Scan Report</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowDetails(false)}
              className="text-white/70 hover:text-white"
            >
              ✕
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SecurityDashboard />
            <SecurityMetrics />
          </div>
          
          <div className="space-y-6">
            <AIMLScanner />
            <MobileThreatScanner />
          </div>
        </div>
      )}
    </div>
  );
};
