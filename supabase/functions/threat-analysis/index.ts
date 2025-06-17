
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ThreatAnalysisRequest {
  analysis_type: 'static' | 'dynamic' | 'behavioral';
  input_data: {
    apk_metadata?: any;
    runtime_events?: any;
    url_data?: any;
    behavioral_patterns?: any;
  };
}

interface ThreatAnalysisResult {
  risk_score: number;
  threat_detected: boolean;
  threat_types: string[];
  confidence_score: number;
  mitigation_recommendations: string[];
  processing_time_ms: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { analysis_type, input_data }: ThreatAnalysisRequest = await req.json()
    const startTime = Date.now()

    // Simulate AI model inference
    const result = await simulateAIAnalysis(analysis_type, input_data)
    const processingTime = Date.now() - startTime

    // Get user from auth header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      throw new Error('Authentication failed')
    }

    // Log the analysis
    const { error: logError } = await supabaseClient
      .from('threat_analysis_logs')
      .insert({
        user_id: user.id,
        analysis_type,
        input_data,
        result_data: result,
        processing_time_ms: processingTime,
        confidence_score: result.confidence_score,
        threat_detected: result.threat_detected
      })

    if (logError) {
      console.error('Failed to log analysis:', logError)
    }

    // Update system metrics
    await updateSystemMetrics(supabaseClient, analysis_type, result)

    return new Response(
      JSON.stringify({ ...result, processing_time_ms: processingTime }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})

async function simulateAIAnalysis(
  analysisType: string,
  inputData: any
): Promise<ThreatAnalysisResult> {
  // Simulate different AI model responses based on analysis type
  const baseLatency = Math.random() * 500 + 100 // 100-600ms

  await new Promise(resolve => setTimeout(resolve, baseLatency))

  switch (analysisType) {
    case 'static':
      return simulateStaticAnalysis(inputData)
    case 'dynamic':
      return simulateDynamicAnalysis(inputData)
    case 'behavioral':
      return simulateBehavioralAnalysis(inputData)
    default:
      throw new Error(`Unknown analysis type: ${analysisType}`)
  }
}

function simulateStaticAnalysis(inputData: any): ThreatAnalysisResult {
  const permissions = inputData.apk_metadata?.permissions || []
  const suspiciousPermissions = [
    'READ_SMS', 'SEND_SMS', 'ACCESS_FINE_LOCATION', 
    'RECORD_AUDIO', 'CAMERA', 'READ_CONTACTS'
  ]

  const suspiciousCount = permissions.filter((p: string) => 
    suspiciousPermissions.includes(p)
  ).length

  const riskScore = Math.min(suspiciousCount * 0.15 + Math.random() * 0.3, 1.0)
  const threatDetected = riskScore > 0.7

  return {
    risk_score: riskScore,
    threat_detected: threatDetected,
    threat_types: threatDetected ? ['malware', 'privacy_risk'] : [],
    confidence_score: 0.85 + Math.random() * 0.1,
    mitigation_recommendations: threatDetected ? [
      'Quarantine application',
      'Block network access',
      'Alert user'
    ] : ['Continue monitoring'],
    processing_time_ms: 0 // Will be set by caller
  }
}

function simulateDynamicAnalysis(inputData: any): ThreatAnalysisResult {
  const events = inputData.runtime_events || []
  const networkCalls = events.filter((e: any) => e.type === 'network').length
  const fileAccess = events.filter((e: any) => e.type === 'file_access').length

  const riskScore = Math.min((networkCalls * 0.1 + fileAccess * 0.05) + Math.random() * 0.4, 1.0)
  const threatDetected = riskScore > 0.6

  return {
    risk_score: riskScore,
    threat_detected: threatDetected,
    threat_types: threatDetected ? ['behavioral_anomaly', 'data_exfiltration'] : [],
    confidence_score: 0.78 + Math.random() * 0.15,
    mitigation_recommendations: threatDetected ? [
      'Isolate process',
      'Block network traffic',
      'Forensic analysis'
    ] : ['Normal behavior detected'],
    processing_time_ms: 0
  }
}

function simulateBehavioralAnalysis(inputData: any): ThreatAnalysisResult {
  const patterns = inputData.behavioral_patterns || {}
  const typingSpeed = patterns.typing_speed || 50
  const locationDelta = patterns.location_delta || 0
  const appUsage = patterns.app_usage_pattern || []

  // Anomaly detection simulation
  const typingAnomaly = Math.abs(typingSpeed - 50) / 50
  const locationAnomaly = Math.min(locationDelta / 1000, 1.0)
  const usageAnomaly = appUsage.length > 10 ? 0.3 : 0.1

  const riskScore = (typingAnomaly + locationAnomaly + usageAnomaly) / 3
  const threatDetected = riskScore > 0.5

  return {
    risk_score: riskScore,
    threat_detected: threatDetected,
    threat_types: threatDetected ? ['account_takeover', 'anomalous_behavior'] : [],
    confidence_score: 0.72 + Math.random() * 0.2,
    mitigation_recommendations: threatDetected ? [
      'Request additional authentication',
      'Limit account access',
      'Security review'
    ] : ['Normal user behavior'],
    processing_time_ms: 0
  }
}

async function updateSystemMetrics(supabaseClient: any, analysisType: string, result: ThreatAnalysisResult) {
  const metrics = [
    {
      metric_name: 'threat_analysis_total',
      metric_value: 1,
      metric_type: 'counter',
      labels: { analysis_type: analysisType }
    },
    {
      metric_name: 'threat_detection_rate',
      metric_value: result.threat_detected ? 1 : 0,
      metric_type: 'gauge',
      labels: { analysis_type: analysisType }
    },
    {
      metric_name: 'risk_score_distribution',
      metric_value: result.risk_score,
      metric_type: 'histogram',
      labels: { analysis_type: analysisType }
    }
  ]

  for (const metric of metrics) {
    await supabaseClient.from('system_metrics').insert(metric)
  }
}
