
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThreatIntelligenceDashboard } from './ThreatIntelligenceDashboard';
import { FederatedLearningDashboard } from './FederatedLearningDashboard';
import { 
  Database, 
  Brain, 
  Activity, 
  Server,
  Cloud,
  Network
} from 'lucide-react';

type DashboardView = 'overview' | 'threat-intel' | 'federated-learning';

export const BackendDashboard = () => {
  const [activeView, setActiveView] = useState<DashboardView>('overview');

  const renderActiveView = () => {
    switch (activeView) {
      case 'threat-intel':
        return <ThreatIntelligenceDashboard />;
      case 'federated-learning':
        return <FederatedLearningDashboard />;
      default:
        return <OverviewDashboard />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setActiveView('overview')}
              variant={activeView === 'overview' ? 'default' : 'outline'}
              className="flex items-center gap-2"
            >
              <Server className="h-4 w-4" />
              Overview
            </Button>
            <Button
              onClick={() => setActiveView('threat-intel')}
              variant={activeView === 'threat-intel' ? 'default' : 'outline'}
              className="flex items-center gap-2"
            >
              <Database className="h-4 w-4" />
              Threat Intelligence
            </Button>
            <Button
              onClick={() => setActiveView('federated-learning')}
              variant={activeView === 'federated-learning' ? 'default' : 'outline'}
              className="flex items-center gap-2"
            >
              <Brain className="h-4 w-4" />
              Federated Learning
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      {renderActiveView()}
    </div>
  );
};

const OverviewDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Architecture Overview */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Cloud className="h-6 w-6 text-blue-400" />
            Backend Architecture Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* API Gateway */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Network className="h-5 w-5 text-green-400" />
                <h3 className="text-white font-medium">Edge Functions</h3>
                <Badge className="bg-green-500/20 text-green-400">Active</Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Threat Analysis</span>
                  <span className="text-green-400">✓ Deployed</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Federated Learning</span>
                  <span className="text-green-400">✓ Deployed</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Authentication</span>
                  <span className="text-green-400">✓ Active</span>
                </div>
              </div>
            </div>

            {/* Database */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-400" />
                <h3 className="text-white font-medium">Database</h3>
                <Badge className="bg-blue-500/20 text-blue-400">Supabase</Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Threat Signatures</span>
                  <span className="text-blue-400">✓ Ready</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">AI Models</span>
                  <span className="text-blue-400">✓ Ready</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Analytics Logs</span>
                  <span className="text-blue-400">✓ Ready</span>
                </div>
              </div>
            </div>

            {/* AI Services */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-400" />
                <h3 className="text-white font-medium">AI Services</h3>
                <Badge className="bg-purple-500/20 text-purple-400">Simulated</Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Malware Detection</span>
                  <span className="text-purple-400">✓ Ready</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Phishing Analysis</span>
                  <span className="text-purple-400">✓ Ready</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Behavioral Monitor</span>
                  <span className="text-purple-400">✓ Ready</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Implementation Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Implemented Services</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <h4 className="text-green-400 font-medium mb-1">✓ Threat Analysis Pipeline</h4>
                <p className="text-slate-300 text-sm">
                  Supabase Edge Function simulating AWS Lambda threat processing with static, dynamic, and behavioral analysis.
                </p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <h4 className="text-green-400 font-medium mb-1">✓ Federated Learning Controller</h4>
                <p className="text-slate-300 text-sm">
                  Edge Function managing model updates, aggregation, and distribution with contribution scoring.
                </p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <h4 className="text-green-400 font-medium mb-1">✓ Real-time Database</h4>
                <p className="text-slate-300 text-sm">
                  Comprehensive schema for threat intelligence, AI models, and analytics with RLS policies.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Architecture Mapping</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <h4 className="text-blue-400 font-medium mb-1">AWS Lambda → Supabase Edge Functions</h4>
                <p className="text-slate-300 text-sm">
                  Serverless threat analysis with TypeScript instead of Python.
                </p>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <h4 className="text-blue-400 font-medium mb-1">MongoDB Atlas → Supabase PostgreSQL</h4>
                <p className="text-slate-300 text-sm">
                  Time-series threat data with JSONB columns for flexible schema.
                </p>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <h4 className="text-blue-400 font-medium mb-1">TensorFlow Serving → Mock AI Endpoints</h4>
                <p className="text-slate-300 text-sm">
                  Simulated ML inference with realistic threat detection algorithms.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="h-6 w-6 text-cyan-400" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="bg-blue-500 hover:bg-blue-600 h-auto py-4 flex-col gap-2">
              <Database className="h-6 w-6" />
              <span>View Threat Intel</span>
            </Button>
            <Button className="bg-purple-500 hover:bg-purple-600 h-auto py-4 flex-col gap-2">
              <Brain className="h-6 w-6" />
              <span>Manage AI Models</span>
            </Button>
            <Button className="bg-green-500 hover:bg-green-600 h-auto py-4 flex-col gap-2">
              <Activity className="h-6 w-6" />
              <span>System Metrics</span>
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600 h-auto py-4 flex-col gap-2">
              <Network className="h-6 w-6" />
              <span>Edge Functions</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
