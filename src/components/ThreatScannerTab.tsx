
import React from 'react';
import { AdvancedThreatScanner } from './AdvancedThreatScanner';
import { RealTimeFileScanner } from './RealTimeFileScanner';

export const ThreatScannerTab = () => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
          Enterprise APK & URL Threat Scanner
        </h2>
        <p className="text-slate-300">
          Advanced AI-powered APK analysis, URL scanning, and real-time file threat detection with enterprise-grade intelligence
        </p>
      </div>

      {/* Real-Time File Scanner */}
      <RealTimeFileScanner />

      {/* APK & URL Scanner */}
      <AdvancedThreatScanner />
    </div>
  );
};
