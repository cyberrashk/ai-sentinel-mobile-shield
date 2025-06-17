
import React from 'react';
import { BiometricAnalyzer } from './BiometricAnalyzer';
import { ThreatVisualizer } from './ThreatVisualizer';
import { QuantumVPN } from './QuantumVPN';
import { BackendDashboard } from './BackendDashboard';
import { AdvancedThreatScanner } from './AdvancedThreatScanner';

export const EnhancedSecurityTab = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Enhanced AI Security</h2>
        <p className="text-slate-300">
          Advanced AI-powered security features with behavioral biometrics, quantum-resistant protection, and comprehensive threat analysis.
        </p>
      </div>

      {/* Enterprise Threat Scanner */}
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-bold text-white mb-2">AI-Powered Threat Intelligence</h3>
          <p className="text-slate-300">
            Enterprise-grade APK and URL analysis with machine learning detection
          </p>
        </div>
        <AdvancedThreatScanner />
      </div>

      <div className="space-y-6">
        <BackendDashboard />
        <BiometricAnalyzer />
        <ThreatVisualizer />
        <QuantumVPN />
      </div>
    </div>
  );
};
