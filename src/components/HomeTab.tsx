
import React from 'react';
import { SecurityDashboard } from './SecurityDashboard';
import { SecurityMetrics } from './SecurityMetrics';
import { AIMLScanner } from './AIMLScanner';
import { MobileThreatScanner } from './MobileThreatScanner';
import { AdvancedThreatScanner } from './AdvancedThreatScanner';

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
      
      {/* AI/ML Mobile Scanning Section */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">AI/ML Mobile Security Scanner</h2>
          <p className="text-slate-300">
            Comprehensive mobile threat detection using TensorFlow and Python-powered machine learning models
          </p>
        </div>
        
        <AIMLScanner />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MobileThreatScanner />
          <SecurityMetrics />
        </div>
      </div>

      {/* Advanced Enterprise Threat Scanner Section */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Enterprise APK & URL Threat Detection</h2>
          <p className="text-slate-300">
            Advanced AI-powered APK analysis and URL scanning with enterprise-grade threat intelligence
          </p>
        </div>
        
        <AdvancedThreatScanner />
      </div>
    </div>
  );
};
