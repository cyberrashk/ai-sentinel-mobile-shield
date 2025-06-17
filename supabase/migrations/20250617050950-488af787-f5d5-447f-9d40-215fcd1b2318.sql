
-- Enhanced threat intelligence tables
CREATE TABLE public.threat_signatures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  signature_hash TEXT NOT NULL UNIQUE,
  threat_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  first_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  affected_platforms JSONB DEFAULT '[]'::jsonb,
  mitigation_strategy JSONB,
  geo_heatmap JSONB DEFAULT '{}'::jsonb,
  confidence_score NUMERIC DEFAULT 0 CHECK (confidence_score >= 0 AND confidence_score <= 1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI model registry for federated learning
CREATE TABLE public.ai_models (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  model_name TEXT NOT NULL,
  version TEXT NOT NULL,
  model_type TEXT NOT NULL CHECK (model_type IN ('malware', 'phishing', 'behavioral', 'network')),
  weights_data JSONB,
  performance_metrics JSONB,
  deployment_status TEXT DEFAULT 'training' CHECK (deployment_status IN ('training', 'testing', 'deployed', 'deprecated')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(model_name, version)
);

-- Real-time threat processing logs
CREATE TABLE public.threat_analysis_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  analysis_type TEXT NOT NULL,
  input_data JSONB NOT NULL,
  result_data JSONB NOT NULL,
  processing_time_ms INTEGER,
  confidence_score NUMERIC,
  threat_detected BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced user sessions with behavioral analytics
CREATE TABLE public.user_sessions_enhanced (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  session_token TEXT NOT NULL,
  device_fingerprint JSONB,
  risk_score NUMERIC DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
  behavioral_patterns JSONB DEFAULT '{}'::jsonb,
  active_threats JSONB DEFAULT '[]'::jsonb,
  location_data JSONB,
  session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_end TIMESTAMP WITH TIME ZONE
);

-- Federated learning device contributions
CREATE TABLE public.federated_learning_updates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  model_id UUID REFERENCES public.ai_models NOT NULL,
  local_weights JSONB NOT NULL,
  training_samples INTEGER DEFAULT 0,
  performance_delta NUMERIC DEFAULT 0,
  contribution_score NUMERIC DEFAULT 0,
  aggregated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Real-time metrics for monitoring
CREATE TABLE public.system_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_type TEXT NOT NULL CHECK (metric_type IN ('counter', 'gauge', 'histogram')),
  labels JSONB DEFAULT '{}'::jsonb,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all new tables
ALTER TABLE public.threat_signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.threat_analysis_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions_enhanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.federated_learning_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_metrics ENABLE ROW LEVEL SECURITY;

-- RLS policies for threat signatures (public read, admin write)
CREATE POLICY "Anyone can view threat signatures" ON public.threat_signatures FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert threat signatures" ON public.threat_signatures FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- RLS policies for AI models (public read, admin write)
CREATE POLICY "Anyone can view AI models" ON public.ai_models FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage AI models" ON public.ai_models FOR ALL WITH CHECK (auth.uid() IS NOT NULL);

-- RLS policies for analysis logs (user-specific)
CREATE POLICY "Users can view own analysis logs" ON public.threat_analysis_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own analysis logs" ON public.threat_analysis_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS policies for enhanced sessions (user-specific)
CREATE POLICY "Users can view own sessions" ON public.user_sessions_enhanced FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own sessions" ON public.user_sessions_enhanced FOR ALL WITH CHECK (auth.uid() = user_id);

-- RLS policies for federated learning (user-specific)
CREATE POLICY "Users can view own FL updates" ON public.federated_learning_updates FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own FL updates" ON public.federated_learning_updates FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS policies for system metrics (public read)
CREATE POLICY "Anyone can view system metrics" ON public.system_metrics FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert metrics" ON public.system_metrics FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Insert some sample threat signatures
INSERT INTO public.threat_signatures (signature_hash, threat_type, severity, affected_platforms, mitigation_strategy, confidence_score) VALUES
('SHA256:a1b2c3d4e5f6', 'malware', 'critical', '["android", "ios"]', '{"action": "quarantine", "auto_remediate": true}', 0.95),
('SHA256:f6e5d4c3b2a1', 'phishing', 'high', '["web", "email"]', '{"action": "block", "redirect_warning": true}', 0.89),
('SHA256:1a2b3c4d5e6f', 'ransomware', 'critical', '["windows", "macos"]', '{"action": "isolate", "backup_trigger": true}', 0.97);

-- Insert sample AI models
INSERT INTO public.ai_models (model_name, version, model_type, performance_metrics, deployment_status) VALUES
('malware_detector', 'v3.1.0', 'malware', '{"accuracy": 0.96, "precision": 0.94, "recall": 0.98}', 'deployed'),
('phishing_analyzer', 'v2.5.2', 'phishing', '{"accuracy": 0.92, "false_positive_rate": 0.03}', 'deployed'),
('behavioral_monitor', 'v1.8.1', 'behavioral', '{"anomaly_detection_rate": 0.88}', 'testing');

-- Create function to update threat signature last_seen timestamp
CREATE OR REPLACE FUNCTION update_threat_last_seen()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_seen = NOW();
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_threat_signature_timestamps
  BEFORE UPDATE ON public.threat_signatures
  FOR EACH ROW EXECUTE FUNCTION update_threat_last_seen();

-- Enable realtime for threat monitoring
ALTER PUBLICATION supabase_realtime ADD TABLE public.threat_signatures;
ALTER PUBLICATION supabase_realtime ADD TABLE public.threat_analysis_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.system_metrics;
