
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Brain, 
  Activity, 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  Network,
  Zap,
  Database
} from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

// Use the actual database types from Supabase
type ThreatSignature = Tables<'threat_signatures'>;
type SystemMetric = Tables<'system_metrics'>;
type AIModel = Tables<'ai_models'>;

export const ThreatIntelligenceDashboard = () => {
  const [threatSignatures, setThreatSignatures] = useState<ThreatSignature[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([]);
  const [aiModels, setAIModels] = useState<AIModel[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchThreatSignatures();
    fetchSystemMetrics();
    fetchAIModels();
    setupRealTimeSubscriptions();
  }, []);

  const fetchThreatSignatures = async () => {
    const { data, error } = await supabase
      .from('threat_signatures')
      .select('*')
      .order('last_seen', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching threat signatures:', error);
      return;
    }

    setThreatSignatures(data || []);
  };

  const fetchSystemMetrics = async () => {
    const { data, error } = await supabase
      .from('system_metrics')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching system metrics:', error);
      return;
    }

    setSystemMetrics(data || []);
  };

  const fetchAIModels = async () => {
    const { data, error } = await supabase
      .from('ai_models')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching AI models:', error);
      return;
    }

    setAIModels(data || []);
  };

  const setupRealTimeSubscriptions = () => {
    // Subscribe to threat signatures
    const threatChannel = supabase
      .channel('threat_signatures_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'threat_signatures'
      }, (payload) => {
        console.log('Threat signature update:', payload);
        fetchThreatSignatures();
      })
      .subscribe();

    // Subscribe to system metrics
    const metricsChannel = supabase
      .channel('system_metrics_changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'system_metrics'
      }, (payload) => {
        console.log('New metric:', payload);
        setSystemMetrics(prev => [payload.new as SystemMetric, ...prev.slice(0, 49)]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(threatChannel);
      supabase.removeChannel(metricsChannel);
    };
  };

  const runThreatAnalysis = async (analysisType: string) => {
    setIsAnalyzing(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const mockData = {
        static: {
          apk_metadata: {
            permissions: ['READ_SMS', 'ACCESS_FINE_LOCATION', 'INTERNET'],
            package_name: 'com.example.test'
          }
        },
        dynamic: {
          runtime_events: [
            { type: 'network', destination: 'suspicious-domain.com' },
            { type: 'file_access', path: '/data/sensitive' }
          ]
        },
        behavioral: {
          behavioral_patterns: {
            typing_speed: 120,
            location_delta: 500,
            app_usage_pattern: ['banking', 'social', 'finance']
          }
        }
      };

      const response = await fetch('/functions/v1/threat-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          analysis_type: analysisType,
          input_data: mockData[analysisType as keyof typeof mockData]
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Analysis failed');
      }

      toast({
        title: `${analysisType.charAt(0).toUpperCase() + analysisType.slice(1)} Analysis Complete`,
        description: `Risk Score: ${(result.risk_score * 100).toFixed(1)}% | Threat: ${result.threat_detected ? 'Detected' : 'None'}`,
        variant: result.threat_detected ? "destructive" : "default"
      });

      // Refresh metrics after analysis
      setTimeout(() => {
        fetchSystemMetrics();
      }, 1000);

    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getModelStatusColor = (status: string) => {
    switch (status) {
      case 'deployed': return 'bg-green-500/20 text-green-400';
      case 'testing': return 'bg-yellow-500/20 text-yellow-400';
      case 'training': return 'bg-blue-500/20 text-blue-400';
      case 'deprecated': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const calculateThreatDetectionRate = () => {
    const detectionMetrics = systemMetrics.filter(m => m.metric_name === 'threat_detection_rate');
    if (detectionMetrics.length === 0) return 0;
    const average = detectionMetrics.reduce((sum, m) => sum + m.metric_value, 0) / detectionMetrics.length;
    return (average * 100).toFixed(1);
  };

  const calculateAverageRiskScore = () => {
    const riskMetrics = systemMetrics.filter(m => m.metric_name === 'risk_score_distribution');
    if (riskMetrics.length === 0) return 0;
    const average = riskMetrics.reduce((sum, m) => sum + m.metric_value, 0) / riskMetrics.length;
    return (average * 100).toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Threat Detection Rate</p>
                <p className="text-2xl font-bold text-green-400">{calculateThreatDetectionRate()}%</p>
              </div>
              <Shield className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Avg Risk Score</p>
                <p className="text-2xl font-bold text-orange-400">{calculateAverageRiskScore()}%</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Active Models</p>
                <p className="text-2xl font-bold text-blue-400">{aiModels.filter(m => m.deployment_status === 'deployed').length}</p>
              </div>
              <Brain className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Signatures</p>
                <p className="text-2xl font-bold text-purple-400">{threatSignatures.length}</p>
              </div>
              <Database className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Analysis Controls */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="h-6 w-6 text-yellow-400" />
            AI Threat Analysis Pipeline
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => runThreatAnalysis('static')}
              disabled={isAnalyzing}
              className="bg-blue-500 hover:bg-blue-600"
            >
              {isAnalyzing ? 'Analyzing...' : 'Run Static Analysis'}
            </Button>
            <Button
              onClick={() => runThreatAnalysis('dynamic')}
              disabled={isAnalyzing}
              className="bg-green-500 hover:bg-green-600"
            >
              {isAnalyzing ? 'Analyzing...' : 'Run Dynamic Analysis'}
            </Button>
            <Button
              onClick={() => runThreatAnalysis('behavioral')}
              disabled={isAnalyzing}
              className="bg-purple-500 hover:bg-purple-600"
            >
              {isAnalyzing ? 'Analyzing...' : 'Run Behavioral Analysis'}
            </Button>
          </div>
          {isAnalyzing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-slate-400">
                <span>Processing threat analysis...</span>
                <span>AI Model Inference</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Threat Signatures */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-red-400" />
              Latest Threat Signatures
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {threatSignatures.map((threat) => (
              <div key={threat.id} className="p-4 bg-slate-900/50 rounded-lg border border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge className={getSeverityColor(threat.severity)}>
                      {threat.severity.toUpperCase()}
                    </Badge>
                    <span className="text-white font-medium">{threat.threat_type}</span>
                  </div>
                  <span className="text-slate-400 text-sm">
                    {threat.confidence_score ? (threat.confidence_score * 100).toFixed(1) : 0}%
                  </span>
                </div>
                <p className="text-slate-400 text-sm mb-2">
                  Hash: {threat.signature_hash}
                </p>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>First: {threat.first_seen ? new Date(threat.first_seen).toLocaleDateString() : 'N/A'}</span>
                  <span>Last: {threat.last_seen ? new Date(threat.last_seen).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="mt-2">
                  <div className="flex flex-wrap gap-1">
                    {(Array.isArray(threat.affected_platforms) ? threat.affected_platforms : []).map((platform, index) => (
                      <Badge key={index} className="bg-slate-700 text-slate-300 text-xs">
                        {String(platform)}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* AI Models Status */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Brain className="h-6 w-6 text-cyan-400" />
              AI Model Registry
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {aiModels.map((model) => (
              <div key={model.id} className="p-4 bg-slate-900/50 rounded-lg border border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Network className="h-4 w-4 text-cyan-400" />
                    <span className="text-white font-medium">{model.model_name}</span>
                    <span className="text-slate-400 text-sm">v{model.version}</span>
                  </div>
                  <Badge className={getModelStatusColor(model.deployment_status || 'unknown')}>
                    {model.deployment_status || 'unknown'}
                  </Badge>
                </div>
                <div className="text-slate-400 text-sm mb-2">
                  Type: {model.model_type}
                </div>
                {model.performance_metrics && typeof model.performance_metrics === 'object' && (
                  <div className="space-y-1">
                    {Object.entries(model.performance_metrics).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-xs">
                        <span className="text-slate-500 capitalize">{key.replace('_', ' ')}</span>
                        <span className="text-slate-300">
                          {typeof value === 'number' ? (value * 100).toFixed(1) + '%' : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="text-xs text-slate-500 mt-2">
                  Updated: {model.updated_at ? new Date(model.updated_at).toLocaleString() : 'N/A'}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Real-time Metrics */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="h-6 w-6 text-green-400" />
            Real-time System Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="text-white font-medium">Analysis Count</h4>
              <div className="text-2xl font-bold text-blue-400">
                {systemMetrics.filter(m => m.metric_name === 'threat_analysis_total').length}
              </div>
              <div className="text-xs text-slate-400">Total analyses performed</div>
            </div>
            <div className="space-y-2">
              <h4 className="text-white font-medium">Detection Rate</h4>
              <div className="text-2xl font-bold text-green-400">
                {calculateThreatDetectionRate()}%
              </div>
              <div className="text-xs text-slate-400">Threats successfully detected</div>
            </div>
            <div className="space-y-2">
              <h4 className="text-white font-medium">Avg Risk Score</h4>
              <div className="text-2xl font-bold text-orange-400">
                {calculateAverageRiskScore()}%
              </div>
              <div className="text-xs text-slate-400">Average risk assessment</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
