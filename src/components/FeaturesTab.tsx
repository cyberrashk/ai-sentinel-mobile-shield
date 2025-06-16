
import React from 'react';
import { ThreatMonitor } from './ThreatMonitor';
import { AIDetectionEngine } from './AIDetectionEngine';
import { PrivacyAuditor } from './PrivacyAuditor';
import { SecurityScanner } from './SecurityScanner';
import { EnhancedAIDetectionEngine } from './EnhancedAIDetectionEngine';
import { SecurityScoreGame } from './SecurityScoreGame';
import { LiveAttackTimeline } from './LiveAttackTimeline';
import { EmergencyResponse } from './EmergencyResponse';

export const FeaturesTab = () => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
          AI-Powered Security Features
        </h2>
        <p className="text-slate-300">
          Advanced protection powered by next-generation AI technology
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <SecurityScoreGame />
          <EnhancedAIDetectionEngine />
          <EmergencyResponse />
        </div>
        
        <div className="space-y-6">
          <LiveAttackTimeline />
          <SecurityScanner />
          <ThreatMonitor />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AIDetectionEngine />
        <PrivacyAuditor />
      </div>
    </div>
  );
};
