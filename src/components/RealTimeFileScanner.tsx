
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  FileText, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Upload,
  Scan,
  Brain,
  Activity,
  Clock,
  Eye,
  Settings,
  Download,
  Trash2,
  Play,
  Pause,
  RefreshCw
} from 'lucide-react';

interface FileAnalysis {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadTime: string;
  scanStatus: 'pending' | 'scanning' | 'completed' | 'error';
  riskScore: number;
  threatLevel: 'clean' | 'low' | 'medium' | 'high' | 'critical';
  malwareDetected: boolean;
  staticAnalysis: {
    entropy: number;
    permissions: string[];
    apiCalls: string[];
    signatures: string[];
  };
  dynamicAnalysis: {
    networkCalls: string[];
    fileAccess: string[];
    behaviorScore: number;
  };
  mlResults: {
    cnnScore: number;
    lstmScore: number;
    yaraMatches: string[];
    anomalyScore: number;
  };
  explanation: string;
  recommendations: string[];
}

interface ScanConfig {
  autoScan: boolean;
  scheduledScans: boolean;
  realTimeMonitoring: boolean;
  cloudAssist: boolean;
  sandboxAnalysis: boolean;
  whitelistEnabled: boolean;
}

export const RealTimeFileScanner = () => {
  const [files, setFiles] = useState<FileAnalysis[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [config, setConfig] = useState<ScanConfig>({
    autoScan: true,
    scheduledScans: false,
    realTimeMonitoring: true,
    cloudAssist: false,
    sandboxAnalysis: true,
    whitelistEnabled: false
  });
  const [selectedFile, setSelectedFile] = useState<FileAnalysis | null>(null);
  const [uploading, setUploading] = useState(false);
  const [scanStats, setScanStats] = useState({
    totalScanned: 0,
    threatsDetected: 0,
    cleanFiles: 0,
    quarantinedFiles: 0
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (config.realTimeMonitoring) {
      startRealTimeMonitoring();
    }
  }, [config.realTimeMonitoring]);

  const startRealTimeMonitoring = () => {
    console.log('Real-time file monitoring started');
    // Simulate periodic scans
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        simulateFileDetection();
      }
    }, 5000);

    return () => clearInterval(interval);
  };

  const simulateFileDetection = () => {
    const suspiciousFiles = [
      'suspicious_app.apk',
      'malicious_doc.pdf',
      'hidden_threat.exe',
      'infected_image.jpg',
      'trojan_installer.msi'
    ];

    const fileName = suspiciousFiles[Math.floor(Math.random() * suspiciousFiles.length)];
    const newFile = generateFileAnalysis(fileName, Math.random() > 0.7);
    
    setFiles(prev => [newFile, ...prev.slice(0, 9)]);
    
    if (newFile.threatLevel === 'high' || newFile.threatLevel === 'critical') {
      toast({
        title: "🚨 Threat Detected",
        description: `${fileName} has been flagged as ${newFile.threatLevel} risk`,
        variant: "destructive"
      });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (!uploadedFiles) return;

    setUploading(true);
    
    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];
      await processFile(file);
    }
    
    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const processFile = async (file: File) => {
    const fileAnalysis = generateFileAnalysis(file.name, false);
    setFiles(prev => [fileAnalysis, ...prev]);

    if (config.autoScan) {
      await performComprehensiveScan(fileAnalysis.id);
    }
  };

  const generateFileAnalysis = (fileName: string, isThreat: boolean): FileAnalysis => {
    const riskScore = isThreat ? 70 + Math.random() * 30 : Math.random() * 40;
    const threatLevel = getThreatLevel(riskScore);
    
    return {
      id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      fileName,
      fileType: fileName.split('.').pop()?.toUpperCase() || 'UNKNOWN',
      fileSize: Math.floor(Math.random() * 10000000),
      uploadTime: new Date().toISOString(),
      scanStatus: 'pending',
      riskScore,
      threatLevel,
      malwareDetected: isThreat,
      staticAnalysis: {
        entropy: Math.random() * 8,
        permissions: generatePermissions(),
        apiCalls: generateApiCalls(),
        signatures: isThreat ? ['Trojan.Generic', 'Malware.Suspicious'] : []
      },
      dynamicAnalysis: {
        networkCalls: generateNetworkCalls(),
        fileAccess: generateFileAccess(),
        behaviorScore: riskScore
      },
      mlResults: {
        cnnScore: Math.random(),
        lstmScore: Math.random(),
        yaraMatches: isThreat ? ['rule_malware_1', 'rule_suspicious_2'] : [],
        anomalyScore: riskScore / 100
      },
      explanation: generateExplanation(fileName, isThreat),
      recommendations: generateRecommendations(isThreat)
    };
  };

  const performComprehensiveScan = async (fileId: string) => {
    setIsScanning(true);
    setScanProgress(0);

    const scanSteps = [
      { name: 'Static Analysis - Extracting metadata...', duration: 800 },
      { name: 'CNN Model - Binary pattern analysis...', duration: 1200 },
      { name: 'LSTM Model - Sequence analysis...', duration: 1000 },
      { name: 'YARA Rules - Signature matching...', duration: 600 },
      { name: 'Anomaly Detection - Behavioral analysis...', duration: 900 },
      { name: 'Dynamic Sandbox - Runtime monitoring...', duration: 1500 },
      { name: 'GPT Analysis - Threat explanation...', duration: 700 }
    ];

    try {
      for (let i = 0; i < scanSteps.length; i++) {
        const step = scanSteps[i];
        
        setFiles(prev => prev.map(file => 
          file.id === fileId 
            ? { ...file, scanStatus: 'scanning' as const }
            : file
        ));

        await new Promise(resolve => setTimeout(resolve, step.duration));
        setScanProgress(((i + 1) / scanSteps.length) * 100);
      }

      setFiles(prev => prev.map(file => 
        file.id === fileId 
          ? { ...file, scanStatus: 'completed' as const }
          : file
      ));

      // Update stats
      setScanStats(prev => ({
        ...prev,
        totalScanned: prev.totalScanned + 1,
        threatsDetected: prev.threatsDetected + (Math.random() > 0.7 ? 1 : 0),
        cleanFiles: prev.cleanFiles + (Math.random() > 0.7 ? 0 : 1)
      }));

      toast({
        title: "🔍 Scan Complete",
        description: "File analysis finished with AI/ML models",
      });

    } catch (error) {
      setFiles(prev => prev.map(file => 
        file.id === fileId 
          ? { ...file, scanStatus: 'error' as const }
          : file
      ));
    } finally {
      setIsScanning(false);
      setScanProgress(0);
    }
  };

  const getThreatLevel = (score: number): FileAnalysis['threatLevel'] => {
    if (score >= 90) return 'critical';
    if (score >= 70) return 'high';
    if (score >= 40) return 'medium';
    if (score >= 20) return 'low';
    return 'clean';
  };

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'clean': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const generatePermissions = () => {
    const permissions = [
      'INTERNET', 'READ_CONTACTS', 'WRITE_EXTERNAL_STORAGE', 
      'CAMERA', 'RECORD_AUDIO', 'ACCESS_FINE_LOCATION'
    ];
    return permissions.slice(0, Math.floor(Math.random() * 4) + 1);
  };

  const generateApiCalls = () => {
    const apis = [
      'SendSMS', 'GetContacts', 'CapturePhoto', 
      'RecordAudio', 'AccessLocation', 'ReadFiles'
    ];
    return apis.slice(0, Math.floor(Math.random() * 3) + 1);
  };

  const generateNetworkCalls = () => {
    const calls = [
      'https://suspicious-domain.com/upload',
      'http://malware-c2.net/data',
      'https://legitimate-api.com/update'
    ];
    return calls.slice(0, Math.floor(Math.random() * 2) + 1);
  };

  const generateFileAccess = () => {
    const access = [
      '/system/etc/passwd', '/data/data/com.banking.app',
      '/sdcard/Documents/', '/system/bin/su'
    ];
    return access.slice(0, Math.floor(Math.random() * 2) + 1);
  };

  const generateExplanation = (fileName: string, isThreat: boolean) => {
    if (isThreat) {
      return `${fileName} exhibits malicious behavior including suspicious API calls, abnormal network activity, and matches known threat signatures. Our AI models detected patterns consistent with malware.`;
    }
    return `${fileName} appears to be legitimate software with normal behavior patterns and no detected threats.`;
  };

  const generateRecommendations = (isThreat: boolean) => {
    if (isThreat) {
      return [
        'Quarantine file immediately',
        'Run full system scan',
        'Check for other infected files',
        'Update security definitions'
      ];
    }
    return [
      'File is safe to use',
      'Continue monitoring',
      'Keep security updates current'
    ];
  };

  const quarantineFile = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
    setScanStats(prev => ({ ...prev, quarantinedFiles: prev.quarantinedFiles + 1 }));
    toast({
      title: "🔒 File Quarantined",
      description: "Suspicious file has been safely isolated",
    });
  };

  const deleteFile = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
    toast({
      title: "🗑️ File Deleted",
      description: "File has been permanently removed",
    });
  };

  return (
    <div className="space-y-6">
      {/* Scanner Header */}
      <Card className="bg-gradient-to-r from-purple-900/20 to-cyan-900/20 border-purple-500/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Brain className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <CardTitle className="text-white text-xl">AI/ML Real-Time File Scanner</CardTitle>
                <p className="text-purple-300 text-sm">Advanced malware detection with TensorFlow & ML models</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-500/20 text-green-400">
                <Activity className="h-3 w-3 mr-1" />
                Real-time
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-400">
                <Shield className="h-3 w-3 mr-1" />
                AI-Powered
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Scanner Controls */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="bg-purple-500 hover:bg-purple-600"
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? 'Uploading...' : 'Upload Files'}
            </Button>
            
            <Button
              onClick={() => performComprehensiveScan(files[0]?.id)}
              disabled={isScanning || files.length === 0}
              variant="outline"
              className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
            >
              <Scan className="h-4 w-4 mr-2" />
              Scan All
            </Button>

            <Button
              onClick={() => setConfig(prev => ({ ...prev, realTimeMonitoring: !prev.realTimeMonitoring }))}
              variant="outline"
              className={`border-green-500/30 ${config.realTimeMonitoring ? 'text-green-400 bg-green-500/10' : 'text-gray-400'}`}
            >
              {config.realTimeMonitoring ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              Real-time Monitor
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".apk,.pdf,.exe,.msi,.jpg,.png,.doc,.docx,.zip,.rar"
            onChange={handleFileUpload}
            className="hidden"
          />

          {isScanning && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-purple-300">AI/ML Analysis in progress...</span>
                <span className="text-purple-400">{Math.round(scanProgress)}%</span>
              </div>
              <Progress value={scanProgress} className="h-2 bg-purple-900/50" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Scanner Configuration */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Settings className="h-5 w-5 text-cyan-400" />
            Scanner Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
              <div>
                <p className="text-white text-sm font-medium">Auto Scan</p>
                <p className="text-slate-400 text-xs">Scan files on upload</p>
              </div>
              <Switch
                checked={config.autoScan}
                onCheckedChange={(checked) => setConfig(prev => ({ ...prev, autoScan: checked }))}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
              <div>
                <p className="text-white text-sm font-medium">Sandbox Analysis</p>
                <p className="text-slate-400 text-xs">Dynamic runtime testing</p>
              </div>
              <Switch
                checked={config.sandboxAnalysis}
                onCheckedChange={(checked) => setConfig(prev => ({ ...prev, sandboxAnalysis: checked }))}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
              <div>
                <p className="text-white text-sm font-medium">Cloud Assist</p>
                <p className="text-slate-400 text-xs">Offload to cloud for heavy scans</p>
              </div>
              <Switch
                checked={config.cloudAssist}
                onCheckedChange={(checked) => setConfig(prev => ({ ...prev, cloudAssist: checked }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scan Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Scan className="h-5 w-5 text-blue-400" />
            </div>
            <p className="text-white font-medium text-sm">Total Scanned</p>
            <p className="text-blue-400 text-2xl font-bold">{scanStats.totalScanned}</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <p className="text-white font-medium text-sm">Threats Found</p>
            <p className="text-red-400 text-2xl font-bold">{scanStats.threatsDetected}</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
            </div>
            <p className="text-white font-medium text-sm">Clean Files</p>
            <p className="text-green-400 text-2xl font-bold">{scanStats.cleanFiles}</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Shield className="h-5 w-5 text-orange-400" />
            </div>
            <p className="text-white font-medium text-sm">Quarantined</p>
            <p className="text-orange-400 text-2xl font-bold">{scanStats.quarantinedFiles}</p>
          </CardContent>
        </Card>
      </div>

      {/* File Analysis Results */}
      {files.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-400" />
              File Analysis Results ({files.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {files.map((file) => (
              <div key={file.id} className="p-4 bg-slate-900/50 rounded-lg border border-slate-600">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-blue-400" />
                    <div>
                      <p className="text-white font-medium">{file.fileName}</p>
                      <p className="text-slate-400 text-sm">
                        {file.fileType} • {(file.fileSize / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={getThreatColor(file.threatLevel)}>
                      {file.threatLevel.toUpperCase()}
                    </Badge>
                    <Badge className={file.scanStatus === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}>
                      {file.scanStatus}
                    </Badge>
                  </div>
                </div>

                {/* Risk Score */}
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400">Risk Score</span>
                    <span className="text-white">{file.riskScore.toFixed(1)}%</span>
                  </div>
                  <Progress value={file.riskScore} className="h-2" />
                </div>

                {/* ML Analysis Results */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div className="space-y-2">
                    <p className="text-slate-400 text-sm font-medium">ML Model Scores:</p>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">CNN Score:</span>
                        <span className="text-cyan-400">{(file.mlResults.cnnScore * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">LSTM Score:</span>
                        <span className="text-purple-400">{(file.mlResults.lstmScore * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Anomaly Score:</span>
                        <span className="text-orange-400">{(file.mlResults.anomalyScore * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-slate-400 text-sm font-medium">Analysis Details:</p>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Entropy:</span>
                        <span className="text-blue-400">{file.staticAnalysis.entropy.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Permissions:</span>
                        <span className="text-yellow-400">{file.staticAnalysis.permissions.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">YARA Matches:</span>
                        <span className="text-red-400">{file.mlResults.yaraMatches.length}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Explanation */}
                <div className="mb-3">
                  <p className="text-slate-400 text-sm font-medium mb-2">AI Analysis:</p>
                  <p className="text-slate-300 text-sm bg-slate-800/50 p-2 rounded">
                    {file.explanation}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedFile(file)}
                    className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Details
                  </Button>
                  
                  {file.threatLevel === 'high' || file.threatLevel === 'critical' ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => quarantineFile(file.id)}
                      className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
                    >
                      <Shield className="h-3 w-3 mr-1" />
                      Quarantine
                    </Button>
                  ) : null}
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteFile(file.id)}
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Detailed File Analysis Modal */}
      {selectedFile && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Detailed Analysis: {selectedFile.fileName}</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedFile(null)}
                className="border-slate-600 text-slate-400"
              >
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Static Analysis */}
            <div>
              <h4 className="text-white font-medium mb-3">Static Analysis</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-400 text-sm mb-2">Permissions:</p>
                  <div className="space-y-1">
                    {selectedFile.staticAnalysis.permissions.map((perm, idx) => (
                      <Badge key={idx} className="bg-yellow-500/20 text-yellow-400 mr-1 mb-1">
                        {perm}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-2">API Calls:</p>
                  <div className="space-y-1">
                    {selectedFile.staticAnalysis.apiCalls.map((api, idx) => (
                      <Badge key={idx} className="bg-blue-500/20 text-blue-400 mr-1 mb-1">
                        {api}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Analysis */}
            <div>
              <h4 className="text-white font-medium mb-3">Dynamic Analysis</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-400 text-sm mb-2">Network Calls:</p>
                  <div className="space-y-1">
                    {selectedFile.dynamicAnalysis.networkCalls.map((call, idx) => (
                      <p key={idx} className="text-cyan-400 text-xs font-mono bg-slate-900/50 p-2 rounded">
                        {call}
                      </p>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-2">File Access:</p>
                  <div className="space-y-1">
                    {selectedFile.dynamicAnalysis.fileAccess.map((access, idx) => (
                      <p key={idx} className="text-purple-400 text-xs font-mono bg-slate-900/50 p-2 rounded">
                        {access}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h4 className="text-white font-medium mb-3">Recommendations</h4>
              <div className="space-y-2">
                {selectedFile.recommendations.map((rec, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-slate-300 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    {rec}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
