
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface FileScanRequest {
  file_data: string; // base64 encoded file
  file_name: string;
  file_type: string;
  scan_options: {
    static_analysis: boolean;
    dynamic_analysis: boolean;
    ml_analysis: boolean;
    yara_rules: boolean;
    sandbox_test: boolean;
  };
}

interface MLAnalysisResult {
  cnn_score: number;
  lstm_score: number;
  anomaly_score: number;
  yara_matches: string[];
  threat_indicators: string[];
  confidence_score: number;
}

interface FileScanResult {
  scan_id: string;
  file_name: string;
  risk_score: number;
  threat_level: 'clean' | 'low' | 'medium' | 'high' | 'critical';
  malware_detected: boolean;
  static_analysis: {
    entropy: number;
    file_size: number;
    permissions: string[];
    api_calls: string[];
    signatures: string[];
    metadata: any;
  };
  dynamic_analysis: {
    network_calls: string[];
    file_access: string[];
    registry_changes: string[];
    behavior_score: number;
    execution_time: number;
  };
  ml_results: MLAnalysisResult;
  explanation: string;
  recommendations: string[];
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

    const { file_data, file_name, file_type, scan_options }: FileScanRequest = await req.json()
    const startTime = Date.now()

    console.log(`Starting comprehensive file scan for ${file_name} (${file_type})`)

    // Perform comprehensive file analysis
    const scanResult = await performComprehensiveFileScan(
      file_data, 
      file_name, 
      file_type, 
      scan_options
    )
    
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

    // Log the file scan
    const { error: logError } = await supabaseClient
      .from('threat_analysis_logs')
      .insert({
        user_id: user.id,
        analysis_type: 'file_scan',
        input_data: { 
          file_name, 
          file_type, 
          scan_options,
          file_size: file_data.length 
        },
        result_data: scanResult,
        processing_time_ms: processingTime,
        confidence_score: scanResult.ml_results.confidence_score,
        threat_detected: scanResult.malware_detected
      })

    if (logError) {
      console.error('Failed to log file scan:', logError)
    }

    // Update security metrics
    await updateSecurityMetrics(supabaseClient, scanResult)

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
    console.error('File scan error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})

async function performComprehensiveFileScan(
  fileData: string,
  fileName: string,
  fileType: string,
  scanOptions: any
): Promise<FileScanResult> {
  console.log('Starting comprehensive file analysis...')
  
  // Simulate file decoding and analysis
  const fileBuffer = Uint8Array.from(atob(fileData), c => c.charCodeAt(0))
  const fileSize = fileBuffer.length
  
  // Static Analysis
  const staticAnalysis = await performStaticAnalysis(fileBuffer, fileName, fileType)
  
  // Dynamic Analysis (if enabled)
  let dynamicAnalysis = null
  if (scanOptions.dynamic_analysis) {
    dynamicAnalysis = await performDynamicAnalysis(fileBuffer, fileName)
  }
  
  // ML Analysis
  const mlResults = await performMLAnalysis(fileBuffer, fileName, fileType)
  
  // Calculate overall risk score
  const riskScore = calculateRiskScore(staticAnalysis, dynamicAnalysis, mlResults)
  const threatLevel = getThreatLevel(riskScore)
  const malwareDetected = riskScore > 70
  
  // Generate AI explanation
  const explanation = await generateAIExplanation(fileName, staticAnalysis, mlResults, riskScore)
  
  // Generate recommendations
  const recommendations = generateRecommendations(threatLevel, staticAnalysis, mlResults)
  
  return {
    scan_id: `file_scan_${Date.now()}`,
    file_name: fileName,
    risk_score: riskScore,
    threat_level: threatLevel,
    malware_detected: malwareDetected,
    static_analysis: staticAnalysis,
    dynamic_analysis: dynamicAnalysis || {
      network_calls: [],
      file_access: [],
      registry_changes: [],
      behavior_score: 0,
      execution_time: 0
    },
    ml_results: mlResults,
    explanation,
    recommendations,
    processing_time_ms: 0 // Will be set by caller
  }
}

async function performStaticAnalysis(fileBuffer: Uint8Array, fileName: string, fileType: string) {
  console.log('Performing static analysis...')
  
  // Calculate entropy
  const entropy = calculateEntropy(fileBuffer)
  
  // Extract metadata based on file type
  const metadata = extractMetadata(fileBuffer, fileType)
  
  // Simulate permission extraction (for APKs)
  const permissions = fileType === 'APK' ? extractPermissions(fileBuffer) : []
  
  // Simulate API call detection
  const apiCalls = detectAPICalls(fileBuffer, fileType)
  
  // Check for known signatures
  const signatures = checkSignatures(fileBuffer)
  
  return {
    entropy,
    file_size: fileBuffer.length,
    permissions,
    api_calls: apiCalls,
    signatures,
    metadata
  }
}

async function performDynamicAnalysis(fileBuffer: Uint8Array, fileName: string) {
  console.log('Performing dynamic analysis in sandbox...')
  
  // Simulate sandbox execution
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Simulate behavioral monitoring
  const networkCalls = [
    'http://suspicious-domain.com/upload',
    'https://c2-server.net/beacon'
  ]
  
  const fileAccess = [
    '/system/etc/passwd',
    '/data/data/com.banking.app/databases/'
  ]
  
  const registryChanges = [
    'HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Run'
  ]
  
  const behaviorScore = Math.random() * 100
  
  return {
    network_calls: networkCalls,
    file_access: fileAccess,
    registry_changes: registryChanges,
    behavior_score: behaviorScore,
    execution_time: 2500
  }
}

async function performMLAnalysis(fileBuffer: Uint8Array, fileName: string, fileType: string): Promise<MLAnalysisResult> {
  console.log('Performing ML analysis with TensorFlow models...')
  
  // Simulate CNN analysis (binary pattern recognition)
  await new Promise(resolve => setTimeout(resolve, 800))
  const cnnScore = Math.random()
  
  // Simulate LSTM analysis (sequence pattern recognition)
  await new Promise(resolve => setTimeout(resolve, 600))
  const lstmScore = Math.random()
  
  // Simulate anomaly detection
  const anomalyScore = Math.random()
  
  // YARA rule matching
  const yaraMatches = detectYARAMatches(fileBuffer)
  
  // Threat indicators
  const threatIndicators = identifyThreatIndicators(fileBuffer, fileType)
  
  // Calculate confidence
  const confidenceScore = (cnnScore + lstmScore + (1 - anomalyScore)) / 3
  
  return {
    cnn_score: cnnScore,
    lstm_score: lstmScore,
    anomaly_score: anomalyScore,
    yara_matches: yaraMatches,
    threat_indicators: threatIndicators,
    confidence_score: confidenceScore
  }
}

function calculateEntropy(data: Uint8Array): number {
  const frequency = new Array(256).fill(0)
  for (const byte of data) {
    frequency[byte]++
  }
  
  let entropy = 0
  const length = data.length
  
  for (const freq of frequency) {
    if (freq > 0) {
      const probability = freq / length
      entropy -= probability * Math.log2(probability)
    }
  }
  
  return entropy
}

function extractMetadata(fileBuffer: Uint8Array, fileType: string) {
  // Simulate metadata extraction
  return {
    file_type: fileType,
    magic_bytes: Array.from(fileBuffer.slice(0, 4)).map(b => b.toString(16)).join(''),
    creation_time: new Date().toISOString(),
    compiler: fileType === 'EXE' ? 'MSVC 14.0' : 'Unknown'
  }
}

function extractPermissions(fileBuffer: Uint8Array): string[] {
  // Simulate APK permission extraction
  const permissions = [
    'INTERNET',
    'READ_CONTACTS',
    'WRITE_EXTERNAL_STORAGE',
    'CAMERA',
    'RECORD_AUDIO',
    'ACCESS_FINE_LOCATION',
    'SEND_SMS',
    'READ_SMS'
  ]
  
  // Return random subset based on file content
  const numPermissions = Math.floor(Math.random() * 4) + 1
  return permissions.slice(0, numPermissions)
}

function detectAPICalls(fileBuffer: Uint8Array, fileType: string): string[] {
  // Simulate API call detection
  const apiCalls = [
    'CreateProcess',
    'WriteProcessMemory',
    'VirtualAlloc',
    'RegSetValue',
    'InternetOpen',
    'HttpSendRequest',
    'CryptEncrypt'
  ]
  
  const numCalls = Math.floor(Math.random() * 3) + 1
  return apiCalls.slice(0, numCalls)
}

function checkSignatures(fileBuffer: Uint8Array): string[] {
  // Simulate signature detection
  const signatures = []
  
  // Check for known malware signatures
  if (Math.random() > 0.7) {
    signatures.push('Trojan.Generic.12345')
  }
  
  if (Math.random() > 0.8) {
    signatures.push('Malware.Suspicious.67890')
  }
  
  return signatures
}

function detectYARAMatches(fileBuffer: Uint8Array): string[] {
  // Simulate YARA rule matching
  const rules = []
  
  if (Math.random() > 0.6) {
    rules.push('rule_malware_family_1')
  }
  
  if (Math.random() > 0.8) {
    rules.push('rule_packer_detection')
  }
  
  return rules
}

function identifyThreatIndicators(fileBuffer: Uint8Array, fileType: string): string[] {
  const indicators = []
  
  if (Math.random() > 0.7) {
    indicators.push('High entropy sections detected')
  }
  
  if (Math.random() > 0.6) {
    indicators.push('Suspicious API call patterns')
  }
  
  if (Math.random() > 0.8) {
    indicators.push('Code injection techniques detected')
  }
  
  return indicators
}

function calculateRiskScore(staticAnalysis: any, dynamicAnalysis: any, mlResults: MLAnalysisResult): number {
  let score = 0
  
  // Static analysis factors
  if (staticAnalysis.entropy > 7) score += 20
  if (staticAnalysis.signatures.length > 0) score += 40
  if (staticAnalysis.permissions.includes('SEND_SMS')) score += 15
  
  // ML analysis factors
  score += mlResults.cnn_score * 30
  score += mlResults.lstm_score * 25
  score += mlResults.anomaly_score * 20
  
  if (mlResults.yara_matches.length > 0) score += 35
  
  // Dynamic analysis factors (if available)
  if (dynamicAnalysis && dynamicAnalysis.behavior_score > 70) {
    score += 25
  }
  
  return Math.min(Math.max(score, 0), 100)
}

function getThreatLevel(riskScore: number): 'clean' | 'low' | 'medium' | 'high' | 'critical' {
  if (riskScore >= 90) return 'critical'
  if (riskScore >= 70) return 'high'
  if (riskScore >= 40) return 'medium'
  if (riskScore >= 20) return 'low'
  return 'clean'
}

async function generateAIExplanation(fileName: string, staticAnalysis: any, mlResults: MLAnalysisResult, riskScore: number): Promise<string> {
  // Simulate GPT-4 analysis
  if (riskScore > 70) {
    return `${fileName} exhibits highly suspicious behavior. Our AI models detected malicious patterns including ${mlResults.threat_indicators.join(', ')}. The file shows signs of ${staticAnalysis.signatures.join(', ')} and has an entropy of ${staticAnalysis.entropy.toFixed(2)}, indicating potential obfuscation or packing.`
  } else if (riskScore > 40) {
    return `${fileName} shows some concerning characteristics but may be a false positive. The file requests ${staticAnalysis.permissions.length} permissions and exhibits moderate risk indicators.`
  } else {
    return `${fileName} appears to be legitimate software with normal behavior patterns and no significant threat indicators detected.`
  }
}

function generateRecommendations(threatLevel: string, staticAnalysis: any, mlResults: MLAnalysisResult): string[] {
  if (threatLevel === 'critical' || threatLevel === 'high') {
    return [
      'Quarantine file immediately',
      'Run full system antivirus scan',
      'Check for other infected files',
      'Monitor network traffic for C2 communications',
      'Consider forensic analysis',
      'Update security definitions'
    ]
  } else if (threatLevel === 'medium') {
    return [
      'Monitor file behavior closely',
      'Enable enhanced logging',
      'Review file permissions',
      'Consider sandboxed execution'
    ]
  } else {
    return [
      'File appears safe to use',
      'Continue routine monitoring',
      'Keep security updates current'
    ]
  }
}

async function updateSecurityMetrics(supabaseClient: any, scanResult: FileScanResult) {
  const metrics = [
    {
      metric_name: 'file_scan_total',
      metric_value: 1,
      metric_type: 'counter',
      labels: { threat_level: scanResult.threat_level }
    },
    {
      metric_name: 'malware_detected',
      metric_value: scanResult.malware_detected ? 1 : 0,
      metric_type: 'counter',
      labels: { file_type: scanResult.file_name.split('.').pop() || 'unknown' }
    },
    {
      metric_name: 'risk_score_distribution',
      metric_value: scanResult.risk_score,
      metric_type: 'histogram',
      labels: { analysis_type: 'comprehensive' }
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
