
import React from 'react';
import { ThreatMonitor } from './ThreatMonitor';
import { AIDetectionEngine } from './AIDetectionEngine';
import { PrivacyAuditor } from './PrivacyAuditor';

export const FeaturesTab = () => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
          Security Features
        </h2>
        <p className="text-slate-300">
          Comprehensive protection powered by advanced AI technology
        </p>
      </div>
      
      <div className="space-y-6">
        <ThreatMonitor />
        <AIDetectionEngine />
        <PrivacyAuditor />
      </div>
    </div>
  );
};
