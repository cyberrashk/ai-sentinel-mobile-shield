
import React from 'react';
import { EnhancedVPN } from './EnhancedVPN';

export const VPNTab = () => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
          Secure VPN & Traffic Analysis
        </h2>
        <p className="text-slate-300">
          Protect your connection with military-grade encryption and real-time traffic monitoring
        </p>
      </div>

      <EnhancedVPN />
    </div>
  );
};
