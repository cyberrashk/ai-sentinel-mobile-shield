import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Shield, CheckCircle, AlertTriangle, Radar, Brain, Zap, Sparkles, Activity, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AIMLScanner } from './AIMLScanner';

export const HomeTab = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [threatsFound, setThreatsFound] = useState(false);
  const [securityScore, setSecurityScore] = useState(98);
  const [showAdvancedScan, setShowAdvancedScan] = useState(false);
  const { toast } = useToast();

  const startScan = () => {
    setIsScanning(true);
    setScanComplete(false);
    setThreatsFound(false);
    
    toast({
      title: "🔍 AI/ML Security Scan Started",
      description: "TensorFlow-powered threat detection analyzing your device...",
    });

    // Simulate AI/ML scan process
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
          description: "AI models identified potential security issues.",
          variant: "destructive",
        });
      } else {
        setSecurityScore(Math.floor(Math.random() * 10) + 90); // 90-99
        toast({
          title: "✅ Device Secure",
          description: "AI analysis complete - no threats detected!",
        });
      }
    }, 3000);
  };

  const handleLongPress = () => {
    toast({
      title: "🧠 Deep AI Analysis",
      description: "Initiating advanced TensorFlow neural network scan...",
    });
    startScan();
  };

  if (showAdvancedScan) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-3xl border border-purple-500/20 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Advanced AI/ML Scanner</h2>
              <p className="text-purple-200 text-sm">Deep neural network analysis</p>
            </div>
          </div>
          <Button
            onClick={() => setShowAdvancedScan(false)}
            variant="outline"
            className="text-white border-white/20 hover:bg-white/10 rounded-2xl px-6 py-3 transition-all duration-300 hover:scale-105"
          >
            Back to Home
          </Button>
        </div>
        <AIMLScanner />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        {/* Dynamic floating particles with varied sizes and animations */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className={`absolute rounded-full animate-pulse ${
                i % 3 === 0 ? 'w-2 h-2 bg-blue-400/40' : 
                i % 3 === 1 ? 'w-1.5 h-1.5 bg-cyan-400/30' : 
                'w-1 h-1 bg-purple-400/20'
              }`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
        
        {/* Subtle gradient waves */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -inset-10 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-full blur-3xl animate-pulse" 
               style={{ animation: 'pulse 8s ease-in-out infinite' }} />
        </div>
      </div>

      {/* Enhanced Security Score with micro-interactions */}
      <div className="absolute top-8 right-6 z-10 animate-fade-in">
        <div className="bg-gradient-to-r from-black/40 to-gray-900/40 backdrop-blur-xl rounded-2xl px-6 py-3 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 group">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl transition-all duration-300 ${
              securityScore >= 90 ? 'bg-green-500/20' : 
              securityScore >= 70 ? 'bg-yellow-500/20' : 'bg-red-500/20'
            }`}>
              <Shield className={`h-4 w-4 ${
                securityScore >= 90 ? 'text-green-400' : 
                securityScore >= 70 ? 'text-yellow-400' : 'text-red-400'
              }`} />
            </div>
            <div>
              <span className="text-white text-sm font-medium">Security Score</span>
              <div className="text-2xl font-bold text-white group-hover:scale-110 transition-transform duration-200">
                {securityScore}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status indicators */}
      <div className="absolute top-8 left-6 z-10 animate-fade-in">
        <div className="flex gap-3">
          <div className="bg-black/20 backdrop-blur-lg rounded-full px-4 py-2 border border-green-500/30">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-300 text-sm font-medium">AI Active</span>
            </div>
          </div>
          <div className="bg-black/20 backdrop-blur-lg rounded-full px-4 py-2 border border-blue-500/30">
            <div className="flex items-center gap-2">
              <Activity className="h-3 w-3 text-blue-400" />
              <span className="text-blue-300 text-sm font-medium">Real-time</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with enhanced design */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        <div className="flex flex-col items-center space-y-12">
          {/* Enhanced Central Scan Button */}
          <div className="relative group">
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
                transition-all duration-700 transform border-4 backdrop-blur-xl
                ${isScanning 
                  ? 'bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 animate-pulse scale-105 border-blue-300/40 shadow-2xl shadow-blue-500/40' 
                  : scanComplete 
                    ? threatsFound 
                      ? 'bg-gradient-to-r from-red-500 via-orange-500 to-red-500 border-red-300/40 shadow-2xl shadow-red-500/40 hover:scale-110' 
                      : 'bg-gradient-to-r from-green-500 via-emerald-400 to-green-500 border-green-300/40 shadow-2xl shadow-green-500/40 hover:scale-110'
                    : 'bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500 border-white/20 hover:scale-110 shadow-2xl shadow-blue-500/30 hover:shadow-cyan-500/50'
                }
                group-hover:shadow-3xl
              `}
            >
              {/* Enhanced Radar Animation */}
              {isScanning && (
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  <div className="absolute inset-4 rounded-full border-2 border-white/40 animate-ping" />
                  <div className="absolute inset-8 rounded-full border border-white/30 animate-ping" style={{ animationDelay: '0.3s' }} />
                  <div className="absolute inset-12 rounded-full border border-white/20 animate-ping" style={{ animationDelay: '0.6s' }} />
                  <div className="absolute inset-16 rounded-full border border-white/10 animate-ping" style={{ animationDelay: '0.9s' }} />
                </div>
              )}
              
              {/* Icon and Text with enhanced animations */}
              <div className="relative z-10 flex flex-col items-center justify-center space-y-4">
                <div className="relative">
                  {isScanning ? (
                    <div className="relative">
                      <Radar className="h-20 w-20 animate-spin" />
                      <Sparkles className="h-6 w-6 absolute -top-2 -right-2 text-yellow-300 animate-pulse" />
                    </div>
                  ) : scanComplete ? (
                    threatsFound ? (
                      <div className="relative">
                        <AlertTriangle className="h-20 w-20 animate-bounce" />
                        <div className="absolute -inset-2 bg-red-400/20 rounded-full animate-ping" />
                      </div>
                    ) : (
                      <div className="relative">
                        <CheckCircle className="h-20 w-20" />
                        <div className="absolute -inset-2 bg-green-400/20 rounded-full animate-pulse" />
                      </div>
                    )
                  ) : (
                    <div className="relative group-hover:rotate-12 transition-transform duration-300">
                      <Shield className="h-20 w-20" />
                      <Lock className="h-6 w-6 absolute -bottom-1 -right-1 text-cyan-300" />
                    </div>
                  )}
                </div>
                
                <span className="text-center leading-tight group-hover:scale-105 transition-transform duration-300">
                  {isScanning 
                    ? 'AI Scanning...' 
                    : scanComplete 
                      ? threatsFound 
                        ? 'Threats Found' 
                        : 'Device Secure'
                      : 'AI Scan Now'
                  }
                </span>
              </div>

              {/* Enhanced Glow Effect */}
              <div className={`
                absolute inset-0 rounded-full opacity-60 blur-2xl transition-all duration-700
                ${isScanning 
                  ? 'bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 animate-pulse scale-110' 
                  : scanComplete 
                    ? threatsFound 
                      ? 'bg-gradient-to-r from-red-400 via-orange-300 to-red-400 scale-105' 
                      : 'bg-gradient-to-r from-green-400 via-emerald-300 to-green-400 scale-105'
                    : 'bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 group-hover:scale-110'
                }
              `} />
            </Button>
          </div>

          {/* Enhanced Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Button
              onClick={() => setShowAdvancedScan(true)}
              className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 hover:from-purple-600 hover:via-pink-600 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25 border border-purple-400/20"
            >
              <Brain className="h-5 w-5 mr-3" />
              Advanced AI Scanner
            </Button>
            
            {scanComplete && threatsFound && (
              <Button
                onClick={() => setShowAdvancedScan(true)}
                className="bg-gradient-to-r from-red-500 via-orange-500 to-red-600 hover:from-red-600 hover:via-orange-600 hover:to-red-700 text-white px-8 py-4 rounded-2xl font-semibold animate-pulse hover:animate-none transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-red-500/25 border border-red-400/20"
              >
                <Zap className="h-5 w-5 mr-3" />
                Resolve Issues
              </Button>
            )}
          </div>

          {/* Enhanced Status Text */}
          <div className="text-center space-y-4 max-w-lg animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="bg-black/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <p className="text-white/90 text-lg font-medium mb-2">
                {isScanning 
                  ? 'TensorFlow AI analyzing device security...' 
                  : scanComplete 
                    ? threatsFound 
                      ? 'AI detected security issues - Advanced scanner available' 
                      : 'AI confirms device is protected'
                    : 'Tap for AI-powered security scan'
                }
              </p>
              {!isScanning && !scanComplete && (
                <p className="text-white/60 text-sm flex items-center justify-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Hold for deep neural analysis
                  <Sparkles className="h-4 w-4" />
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
