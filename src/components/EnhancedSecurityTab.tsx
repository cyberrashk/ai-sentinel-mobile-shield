
import React from 'react';
import { BiometricAnalyzer } from './BiometricAnalyzer';
import { ThreatVisualizer } from './ThreatVisualizer';
import { QuantumVPN } from './QuantumVPN';

export const EnhancedSecurityTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Enhanced AI Security</h2>
        <p className="text-slate-300">
          Advanced AI-powered security features with behavioral biometrics and quantum-resistant protection.
        </p>
      </div>

      <div className="space-y-6">
        <BiometricAnalyzer />
        <ThreatVisualizer />
        <QuantumVPN />
      </div>
    </div>
  );
};
