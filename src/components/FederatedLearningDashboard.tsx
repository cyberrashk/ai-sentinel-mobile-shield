
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Brain, 
  Users, 
  TrendingUp, 
  Download, 
  Upload,
  Network,
  Activity,
  Cpu
} from 'lucide-react';

interface FederatedUpdate {
  id: string;
  model_id: string;
  local_weights: any;
  training_samples: number;
  performance_delta: number;
  contribution_score: number;
  aggregated: boolean;
  created_at: string;
}

interface AIModel {
  id: string;
  model_name: string;
  version: string;
  model_type: string;
  weights_data: any;
  performance_metrics: any;
  deployment_status: string;
  updated_at: string;
}

export const FederatedLearningDashboard = () => {
  const [federatedUpdates, setFederatedUpdates] = useState<FederatedUpdate[]>([]);
  const [aiModels, setAIModels] = useState<AIModel[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchFederatedUpdates();
    fetchAIModels();
  }, []);

  const fetchFederatedUpdates = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('federated_learning_updates')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching federated updates:', error);
      return;
    }

    setFederatedUpdates(data || []);
  };

  const fetchAIModels = async () => {
    const { data, error } = await supabase
      .from('ai_models')
      .select('*')
      .eq('deployment_status', 'deployed')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching AI models:', error);
      return;
    }

    setAIModels(data || []);
  };

  const simulateLocalTraining = async (modelName: string) => {
    setIsTraining(true);
    
    try {
      // Simulate local training process
      const trainingSamples = Math.floor(Math.random() * 1000) + 500;
      const accuracyImprovement = (Math.random() - 0.5) * 0.1; // -5% to +5%
      
      // Simulate training time
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Generate mock local weights
      const localWeights = {
        layer_1: Array.from({length: 10}, () => Math.random()),
        layer_2: Array.from({length: 5}, () => Math.random()),
        timestamp: Date.now()
      };

      const performanceMetrics = {
        accuracy_improvement: accuracyImprovement,
        loss_reduction: Math.random() * 0.1,
        training_time: 3000
      };

      // Submit to federated learning edge function
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const response = await fetch('/functions/v1/federated-learning', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          model_name: modelName,
          local_weights: localWeights,
          training_samples: trainingSamples,
          performance_metrics: performanceMetrics
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Training submission failed');
      }

      toast({
        title: "Local Training Complete",
        description: `Contribution Score: ${result.contribution_score.toFixed(3)} | Pending Updates: ${result.pending_updates}`,
      });

      // Refresh updates
      fetchFederatedUpdates();

    } catch (error) {
      console.error('Training error:', error);
      toast({
        title: "Training Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsTraining(false);
    }
  };

  const downloadGlobalModel = async (modelName: string) => {
    setIsDownloading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`/functions/v1/federated-learning?model_name=${modelName}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      const model = await response.json();

      if (!response.ok) {
        throw new Error(model.error || 'Download failed');
      }

      toast({
        title: "Model Downloaded",
        description: `${model.model_name} v${model.version} downloaded successfully`,
      });

      // Simulate model deployment locally
      console.log('Downloaded model:', model);

    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const calculateAggregationProgress = (modelId: string) => {
    const modelUpdates = federatedUpdates.filter(u => u.model_id === modelId);
    const aggregatedCount = modelUpdates.filter(u => u.aggregated).length;
    const totalCount = modelUpdates.length;
    return totalCount > 0 ? (aggregatedCount / totalCount) * 100 : 0;
  };

  const getModelTypeIcon = (type: string) => {
    switch (type) {
      case 'malware': return <Brain className="h-4 w-4" />;
      case 'phishing': return <Network className="h-4 w-4" />;
      case 'behavioral': return <Activity className="h-4 w-4" />;
      default: return <Cpu className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Federated Learning Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">My Contributions</p>
                <p className="text-2xl font-bold text-blue-400">{federatedUpdates.length}</p>
              </div>
              <Upload className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Aggregated</p>
                <p className="text-2xl font-bold text-green-400">
                  {federatedUpdates.filter(u => u.aggregated).length}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Score</p>
                <p className="text-2xl font-bold text-purple-400">
                  {federatedUpdates.reduce((sum, u) => sum + u.contribution_score, 0).toFixed(2)}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Available Models</p>
                <p className="text-2xl font-bold text-cyan-400">{aiModels.length}</p>
              </div>
              <Download className="h-8 w-8 text-cyan-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Model Training Interface */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-400" />
            Federated Learning Models
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {aiModels.map((model) => (
              <div key={model.id} className="p-4 bg-slate-900/50 rounded-lg border border-slate-600">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getModelTypeIcon(model.model_type)}
                    <span className="text-white font-medium">{model.model_name}</span>
                  </div>
                  <Badge className="bg-blue-500/20 text-blue-400">
                    v{model.version}
                  </Badge>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="text-sm text-slate-400">
                    Type: {model.model_type}
                  </div>
                  {model.performance_metrics && (
                    <div className="space-y-1">
                      {Object.entries(model.performance_metrics).slice(0, 2).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-xs">
                          <span className="text-slate-500 capitalize">{key.replace('_', ' ')}</span>
                          <span className="text-slate-300">
                            {typeof value === 'number' ? (value * 100).toFixed(1) + '%' : String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={() => simulateLocalTraining(model.model_name)}
                    disabled={isTraining}
                    className="w-full bg-green-500 hover:bg-green-600"
                    size="sm"
                  >
                    {isTraining ? 'Training...' : 'Start Local Training'}
                  </Button>
                  <Button
                    onClick={() => downloadGlobalModel(model.model_name)}
                    disabled={isDownloading}
                    variant="outline"
                    className="w-full"
                    size="sm"
                  >
                    {isDownloading ? 'Downloading...' : 'Download Latest'}
                  </Button>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Aggregation Progress</span>
                    <span>{calculateAggregationProgress(model.id).toFixed(0)}%</span>
                  </div>
                  <Progress value={calculateAggregationProgress(model.id)} className="h-1" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* My Contributions */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Upload className="h-6 w-6 text-green-400" />
            My Training Contributions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {federatedUpdates.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              No training contributions yet. Start training a model to see your contributions here.
            </div>
          ) : (
            federatedUpdates.map((update) => {
              const model = aiModels.find(m => m.id === update.model_id);
              return (
                <div key={update.id} className="p-4 bg-slate-900/50 rounded-lg border border-slate-600">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">
                        {model?.model_name || 'Unknown Model'}
                      </span>
                      <Badge className={update.aggregated ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}>
                        {update.aggregated ? 'Aggregated' : 'Pending'}
                      </Badge>
                    </div>
                    <span className="text-slate-400 text-sm">
                      Score: {update.contribution_score.toFixed(3)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500">Training Samples</span>
                      <div className="text-white">{update.training_samples.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">Performance Δ</span>
                      <div className={`${update.performance_delta >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {update.performance_delta >= 0 ? '+' : ''}{(update.performance_delta * 100).toFixed(2)}%
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500">Submitted</span>
                      <div className="text-white">{new Date(update.created_at).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">Model Type</span>
                      <div className="text-white capitalize">{model?.model_type || 'Unknown'}</div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
};
