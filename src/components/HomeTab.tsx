
import React from 'react';
import { SecurityDashboard } from './SecurityDashboard';
import { SecurityMetrics } from './SecurityMetrics';

export const HomeTab = () => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
          AI Security Suite
        </h1>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
          Advanced AI-powered mobile security with real-time threat detection, privacy auditing, and intelligent protection
        </p>
      </div>
      
      <SecurityDashboard />
      <SecurityMetrics />
    </div>
  );
};
