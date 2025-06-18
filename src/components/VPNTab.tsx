
import React from 'react';
import { AIVPNCore } from './AIVPNCore';
import { VPNThreatMonitor } from './VPNThreatMonitor';

export const VPNTab = () => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
          AI-Powered VPN Shield
        </h2>
        <p className="text-slate-300">
          Military-grade encryption with AI threat protection, quantum-resistant security, and intelligent routing
        </p>
      </div>

      <div className="space-y-6">
        <AIVPNCore />
        <VPNThreatMonitor />
      </div>
    </div>
  );
};
