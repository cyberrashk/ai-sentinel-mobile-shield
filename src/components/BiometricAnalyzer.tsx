
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Activity, Shield, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface BiometricData {
  keystroke_dynamics: {
    average_dwell_time: number;
    average_flight_time: number;
    typing_rhythm_variance: number;
  };
  interaction_patterns: {
    touch_pressure: number[];
    scroll_velocity: number[];
    app_usage_pattern: string[];
  };
  risk_score: number;
}

export const BiometricAnalyzer = () => {
  const [biometricData, setBiometricData] = useState<BiometricData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high'>('low');

  useEffect(() => {
    // Simulate keystroke dynamics tracking
    const trackKeystrokes = () => {
      const dwellTimes: number[] = [];
      const flightTimes: number[] = [];
      
      document.addEventListener('keydown', (e) => {
        const timestamp = Date.now();
        // Simulate keystroke timing analysis
        dwellTimes.push(Math.random() * 200 + 50);
        flightTimes.push(Math.random() * 150 + 30);
      });
    };

    trackKeystrokes();
    analyzeBehavior();
  }, []);

  const analyzeBehavior = async () => {
    setIsAnalyzing(true);
    
    // Simulate behavioral analysis
    setTimeout(async () => {
      const mockData: BiometricData = {
        keystroke_dynamics: {
          average_dwell_time: Math.random() * 100 + 80,
          average_flight_time: Math.random() * 80 + 40,
          typing_rhythm_variance: Math.random() * 20 + 5,
        },
        interaction_patterns: {
          touch_pressure: Array.from({length: 10}, () => Math.random() * 100),
          scroll_velocity: Array.from({length: 10}, () => Math.random() * 500),
          app_usage_pattern: ['morning_active', 'evening_moderate'],
        },
        risk_score: Math.random() * 100,
      };

      setBiometricData(mockData);
      
      // Determine risk level
      if (mockData.risk_score < 30) setRiskLevel('low');
      else if (mockData.risk_score < 70) setRiskLevel('medium');
      else setRiskLevel('high');

      // Store in database
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('behavioral_patterns').insert({
          user_id: user.id,
          keystroke_dynamics: mockData.keystroke_dynamics,
          interaction_patterns: mockData.interaction_patterns,
          risk_score: mockData.risk_score,
        });
      }

      setIsAnalyzing(false);
    }, 3000);
  };

  const getRiskColor = () => {
    switch (riskLevel) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getRiskIcon = () => {
    switch (riskLevel) {
      case 'low': return <Shield className="h-5 w-5 text-green-400" />;
      case 'medium': return <Activity className="h-5 w-5 text-yellow-400" />;
      case 'high': return <AlertTriangle className="h-5 w-5 text-red-400" />;
      default: return <Brain className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Brain className="h-6 w-6 text-blue-400" />
          Behavioral Biometrics
        </CardTitle>
        <CardDescription className="text-slate-300">
          Continuous authentication through behavior analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isAnalyzing ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-slate-300">Analyzing behavioral patterns...</p>
          </div>
        ) : biometricData ? (
          <div className="space-y-4">
            <div className={`flex items-center gap-2 ${getRiskColor()}`}>
              {getRiskIcon()}
              <span className="font-medium">
                Risk Level: {riskLevel.toUpperCase()}
              </span>
              <span className="text-sm">
                ({biometricData.risk_score.toFixed(1)}%)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900/50 p-4 rounded-lg">
                <h4 className="text-white font-medium mb-2">Keystroke Dynamics</h4>
                <div className="space-y-2 text-sm text-slate-300">
                  <div>Dwell Time: {biometricData.keystroke_dynamics.average_dwell_time.toFixed(1)}ms</div>
                  <div>Flight Time: {biometricData.keystroke_dynamics.average_flight_time.toFixed(1)}ms</div>
                  <div>Rhythm Variance: {biometricData.keystroke_dynamics.typing_rhythm_variance.toFixed(1)}%</div>
                </div>
              </div>

              <div className="bg-slate-900/50 p-4 rounded-lg">
                <h4 className="text-white font-medium mb-2">Interaction Patterns</h4>
                <div className="space-y-2 text-sm text-slate-300">
                  <div>Avg Touch Pressure: {biometricData.interaction_patterns.touch_pressure.reduce((a, b) => a + b, 0) / biometricData.interaction_patterns.touch_pressure.length | 0}%</div>
                  <div>Scroll Velocity: {biometricData.interaction_patterns.scroll_velocity.reduce((a, b) => a + b, 0) / biometricData.interaction_patterns.scroll_velocity.length | 0}px/s</div>
                  <div>Usage Pattern: {biometricData.interaction_patterns.app_usage_pattern.join(', ')}</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-slate-300">Behavioral analysis will start automatically</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
