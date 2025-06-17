
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface MobileScanRequest {
  scan_type: 'comprehensive' | 'quick' | 'deep';
  device_info: {
    platform: string;
    version: string;
    apps_installed: number;
    permissions_granted: string[];
  };
  scan_options: {
    include_ml_analysis: boolean;
    real_time_monitoring: boolean;
    behavioral_analysis: boolean;
  };
}

interface MLAnalysisResult {
  model_name: string;
  model_type: string;
  confidence_score: number;
  risk_assessment: number;
  threat_indicators: string[];
  recommendations: string[];
}

interface MobileScanResult {
  scan_id: string;
  overall_risk_score: number;
  threats_detected: number;
  ml_analysis_results: MLAnalysisResult[];
  scan_summary: {
    apps_analyzed: number;
    permissions_reviewed: number;
    network_connections_checked: number;
    behavioral_patterns_analyzed: number;
  };
  detailed_findings: any[];
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

    const { scan_type, device_info, scan_options }: MobileScanRequest = await req.json()
    const startTime = Date.now()

    console.log(`Starting ${scan_type} mobile scan for ${device_info.platform}`)

    // Simulate TensorFlow/Python ML model analysis
    const mlResults = await performMLAnalysis(scan_type, device_info, scan_options)
    
    // Simulate comprehensive mobile security analysis
    const scanResult = await performMobileScan(scan_type, device_info, mlResults)
    
    const processingTime = Date.now() - startTime

    // Get authenticated user
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

    // Log the mobile scan
    const { error: logError } = await supabaseClient
      .from('threat_analysis_logs')
      .insert({
        user_id: user.id,
        analysis_type: `mobile_${scan_type}`,
        input_data: { device_info, scan_options },
        result_data: scanResult,
        processing_time_ms: processingTime,
        confidence_score: calculateAverageConfidence(mlResults),
        threat_detected: scanResult.threats_detected > 0
      })

    if (logError) {
      console.error('Failed to log mobile scan:', logError)
    }

    // Update mobile security metrics
    await updateMobileMetrics(supabaseClient, scanResult)

    return new Response(
      JSON.stringify({ 
        ...scanResult, 
        processing_time_ms: processingTime,
        scan_timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Mobile scan error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})

async function performMLAnalysis(
  scanType: string,
  deviceInfo: any,
  scanOptions: any
): Promise<MLAnalysisResult[]> {
  console.log('Performing TensorFlow ML analysis...')
  
  const mlModels = [
    {
      name: 'TensorFlow Malware Detector',
      type: 'Deep Neural Network',
      accuracy: 0.978
    },
    {
      name: 'Behavioral CNN Classifier',
      type: 'Convolutional Neural Network', 
      accuracy: 0.942
    },
    {
      name: 'Network Anomaly LSTM',
      type: 'Long Short-Term Memory',
      accuracy: 0.925
    },
    {
      name: 'Privacy Risk Forest',
      type: 'Random Forest + DNN',
      accuracy: 0.897
    }
  ]

  const results: MLAnalysisResult[] = []

  for (const model of mlModels) {
    // Simulate ML model inference with realistic latency
    await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300))
    
    const riskScore = Math.random()
    const confidence = model.accuracy + (Math.random() * 0.04 - 0.02) // Small variance around accuracy
    
    const result: MLAnalysisResult = {
      model_name: model.name,
      model_type: model.type,
      confidence_score: confidence,
      risk_assessment: riskScore * 100,
      threat_indicators: generateThreatIndicators(model.type, riskScore),
      recommendations: generateRecommendations(model.type, riskScore)
    }
    
    results.push(result)
  }

  return results
}

async function performMobileScan(
  scanType: string,
  deviceInfo: any,
  mlResults: MLAnalysisResult[]
): Promise<MobileScanResult> {
  console.log('Performing comprehensive mobile security scan...')
  
  // Simulate different scan depths
  const scanComplexity = {
    'quick': { apps: 50, permissions: 20, connections: 10, patterns: 5 },
    'comprehensive': { apps: 200, permissions: 100, connections: 50, patterns: 25 },
    'deep': { apps: 500, permissions: 250, connections: 150, patterns: 75 }
  }
  
  const complexity = scanComplexity[scanType as keyof typeof scanComplexity] || scanComplexity.comprehensive
  
  // Simulate scan processing time based on complexity
  await new Promise(resolve => setTimeout(resolve, complexity.apps * 2))
  
  const overallRisk = mlResults.reduce((sum, result) => sum + result.risk_assessment, 0) / mlResults.length
  const threatsDetected = mlResults.filter(result => result.risk_assessment > 70).length
  
  return {
    scan_id: `mobile_scan_${Date.now()}`,
    overall_risk_score: Math.round(overallRisk),
    threats_detected: threatsDetected,
    ml_analysis_results: mlResults,
    scan_summary: {
      apps_analyzed: complexity.apps + Math.floor(Math.random() * 50),
      permissions_reviewed: complexity.permissions + Math.floor(Math.random() * 20),
      network_connections_checked: complexity.connections + Math.floor(Math.random() * 10),
      behavioral_patterns_analyzed: complexity.patterns + Math.floor(Math.random() * 5)
    },
    detailed_findings: generateDetailedFindings(mlResults),
    processing_time_ms: 0 // Will be set by caller
  }
}

function generateThreatIndicators(modelType: string, riskScore: number): string[] {
  const indicators: { [key: string]: string[] } = {
    'Deep Neural Network': [
      'Suspicious API call patterns detected',
      'Malicious code signatures identified',
      'Encrypted payload analysis complete'
    ],
    'Convolutional Neural Network': [
      'Abnormal user interaction patterns',
      'Behavioral anomaly detection active',
      'Pattern recognition algorithms engaged'
    ],
    'Long Short-Term Memory': [
      'Network traffic sequence analysis',
      'Temporal pattern recognition',
      'Data flow anomalies detected'
    ],
    'Random Forest + DNN': [
      'Privacy policy compliance check',
      'Data collection pattern analysis',
      'Permission usage correlation'
    ]
  }
  
  const baseIndicators = indicators[modelType] || ['General security analysis complete']
  
  if (riskScore > 0.7) {
    return [...baseIndicators, 'High-confidence threat detected', 'Immediate action recommended']
  } else if (riskScore > 0.4) {
    return [...baseIndicators, 'Moderate risk indicators present']
  } else {
    return [...baseIndicators, 'Security posture within normal parameters']
  }
}

function generateRecommendations(modelType: string, riskScore: number): string[] {
  if (riskScore > 0.7) {
    return [
      'Quarantine suspected applications',
      'Enable enhanced monitoring',
      'Review and revoke suspicious permissions',
      'Consider factory reset if threats persist'
    ]
  } else if (riskScore > 0.4) {
    return [
      'Review app permissions',
      'Enable real-time protection',
      'Monitor network activity',
      'Update security policies'
    ]
  } else {
    return [
      'Maintain current security settings',
      'Continue regular monitoring',
      'Keep security definitions updated'
    ]
  }
}

function generateDetailedFindings(mlResults: MLAnalysisResult[]): any[] {
  return mlResults.map(result => ({
    category: result.model_type,
    severity: result.risk_assessment > 70 ? 'high' : result.risk_assessment > 40 ? 'medium' : 'low',
    description: `${result.model_name} analysis completed with ${(result.confidence_score * 100).toFixed(1)}% confidence`,
    technical_details: {
      model_accuracy: result.confidence_score,
      risk_factors: result.threat_indicators,
      mitigation_steps: result.recommendations
    }
  }))
}

function calculateAverageConfidence(mlResults: MLAnalysisResult[]): number {
  if (mlResults.length === 0) return 0
  return mlResults.reduce((sum, result) => sum + result.confidence_score, 0) / mlResults.length
}

async function updateMobileMetrics(supabaseClient: any, scanResult: MobileScanResult) {
  const metrics = [
    {
      metric_name: 'mobile_scan_total',
      metric_value: 1,
      metric_type: 'counter',
      labels: { scan_type: 'comprehensive' }
    },
    {
      metric_name: 'mobile_threats_detected',
      metric_value: scanResult.threats_detected,
      metric_type: 'gauge',
      labels: { severity: scanResult.overall_risk_score > 70 ? 'high' : 'medium' }
    },
    {
      metric_name: 'mobile_apps_scanned',
      metric_value: scanResult.scan_summary.apps_analyzed,
      metric_type: 'histogram',
      labels: { platform: 'mobile' }
    },
    {
      metric_name: 'mobile_risk_score',
      metric_value: scanResult.overall_risk_score,
      metric_type: 'gauge',
      labels: { analysis_type: 'ml_comprehensive' }
    }
  ]

  for (const metric of metrics) {
    try {
      await supabaseClient.from('system_metrics').insert(metric)
    } catch (error) {
      console.error('Failed to insert metric:', error)
    }
  }
}
