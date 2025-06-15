
import React from 'react';
import { Header } from '../components/Header';
import { SecurityDashboard } from '../components/SecurityDashboard';
import { ThreatMonitor } from '../components/ThreatMonitor';
import { AIDetectionEngine } from '../components/AIDetectionEngine';
import { PrivacyAuditor } from '../components/PrivacyAuditor';
import { SecurityMetrics } from '../components/SecurityMetrics';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            AI Security Suite
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Advanced AI-powered mobile security with real-time threat detection, privacy auditing, and intelligent protection
          </p>
        </div>
        
        <SecurityDashboard />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ThreatMonitor />
          <AIDetectionEngine />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <PrivacyAuditor />
          <SecurityMetrics />
          <div className="lg:col-span-1">
            {/* Future component space */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
