
import React from 'react';
import { EnhancedVPN } from './EnhancedVPN';
import { AdvancedThreatScanner } from './AdvancedThreatScanner';

export const VPNTab = () => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
          Secure VPN & Traffic Analysis
        </h2>
        <p className="text-slate-300">
          Protect your connection with military-grade encryption and real-time threat scanning
        </p>
      </div>

      <EnhancedVPN />

      {/* VPN-integrated Threat Scanning */}
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-bold text-white mb-2">VPN Traffic Threat Analysis</h3>
          <p className="text-slate-300">
            Real-time URL scanning and APK analysis while connected to VPN
          </p>
        </div>
        <AdvancedThreatScanner />
      </div>
    </div>
  );
};
