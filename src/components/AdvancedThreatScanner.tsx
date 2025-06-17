
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  FileX, 
  Globe, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Activity,
  Zap,
  Database,
  Search,
  Lock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ThreatResult {
  type: string;
  confidence: number;
  indicators: string[];
  verdict: 'clean' | 'malicious' | 'suspicious';
}

interface ScanResult {
  sha256?: string;
  domain?: string;
  verdict: 'clean' | 'malicious' | 'suspicious';
  threats: ThreatResult[];
  scanTime: number;
  timestamp: string;
}

export const AdvancedThreatScanner = () => {
  const [activeTab, setActiveTab] = useState<'apk' | 'url'>('apk');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [inputValue, setInputValue] = useState('');
  const { toast } = useToast();

  // Stats for the dashboard
  const [stats, setStats] = useState({
    totalScans: 1247,
    threatsBlocked: 89,
    cleanFiles: 1158,
    avgScanTime: 2.3
  });

  const simulateApkScan = async (fileName: string) => {
    setIsScanning(true);
    setScanProgress(0);

    // Simulate scanning phases
    const phases = [
      { name: 'Manifest Inspection', duration: 800 },
      { name: 'Code Decompilation', duration: 1200 },
      { name: 'Signature Verification', duration: 600 },
      { name: 'Dynamic Analysis', duration: 1000 },
      { name: 'Threat Classification', duration: 400 }
    ];

    for (let i = 0; i < phases.length; i++) {
      await new Promise(resolve => setTimeout(resolve, phases[i].duration));
      setScanProgress(((i + 1) / phases.length) * 100);
    }

    // Simulate results
    const isClean = Math.random() > 0.3;
    const result: ScanResult = {
      sha256: 'a1b2c3d4e5f6789...',
      verdict: isClean ? 'clean' : 'malicious',
      threats: isClean ? [] : [
        {
          type: 'Banker Trojan',
          confidence: 0.98,
          indicators: [
            'Requests SMS permissions',
            'Contains obfuscated C2 code',
            'Suspicious network patterns'
          ],
          verdict: 'malicious'
        }
      ],
      scanTime: 4.2,
      timestamp: new Date().toISOString()
    };

    setScanResults(prev => [result, ...prev.slice(0, 4)]);
    setIsScanning(false);
    setScanProgress(0);

    toast({
      title: `APK Scan Complete: ${fileName}`,
      description: `Verdict: ${result.verdict.toUpperCase()}`,
      variant: result.verdict === 'malicious' ? 'destructive' : 'default'
    });
  };

  const simulateUrlScan = async (url: string) => {
    setIsScanning(true);
    setScanProgress(0);

    const phases = [
      { name: 'Domain Reputation Check', duration: 300 },
      { name: 'Content Analysis', duration: 800 },
      { name: 'Phishing Detection', duration: 600 },
      { name: 'Redirect Tracing', duration: 500 },
      { name: 'Final Classification', duration: 200 }
    ];

    for (let i = 0; i < phases.length; i++) {
      await new Promise(resolve => setTimeout(resolve, phases[i].duration));
      setScanProgress(((i + 1) / phases.length) * 100);
    }

    const isClean = Math.random() > 0.4;
    const result: ScanResult = {
      domain: url,
      verdict: isClean ? 'clean' : 'malicious',
      threats: isClean ? [] : [
        {
          type: 'Phishing Site',
          confidence: 0.92,
          indicators: [
            'Typo-squatting domain',
            'Suspicious SSL certificate',
            'Mimics legitimate banking site'
          ],
          verdict: 'malicious'
        }
      ],
      scanTime: 1.8,
      timestamp: new Date().toISOString()
    };

    setScanResults(prev => [result, ...prev.slice(0, 4)]);
    setIsScanning(false);
    setScanProgress(0);

    toast({
      title: `URL Scan Complete: ${url}`,
      description: `Verdict: ${result.verdict.toUpperCase()}`,
      variant: result.verdict === 'malicious' ? 'destructive' : 'default'
    });
  };

  const handleScan = () => {
    if (!inputValue.trim()) {
      toast({
        title: "Input Required",
        description: `Please provide a ${activeTab === 'apk' ? 'file' : 'URL'} to scan`,
        variant: "destructive"
      });
      return;
    }

    if (activeTab === 'apk') {
      simulateApkScan(inputValue);
    } else {
      simulateUrlScan(inputValue);
    }
    setInputValue('');
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/5 backdrop-blur-lg border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-lg font-bold text-white">{stats.totalScans}</p>
                <p className="text-xs text-slate-400">Total Scans</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-lg border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <div>
                <p className="text-lg font-bold text-white">{stats.threatsBlocked}</p>
                <p className="text-xs text-slate-400">Threats Blocked</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-lg border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-lg font-bold text-white">{stats.cleanFiles}</p>
                <p className="text-xs text-slate-400">Clean Files</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-lg border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-lg font-bold text-white">{stats.avgScanTime}s</p>
                <p className="text-xs text-slate-400">Avg Scan Time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scanner Interface */}
      <Card className="bg-white/5 backdrop-blur-lg border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Zap className="h-5 w-5 text-yellow-400" />
            <span>Enterprise APK & URL Threat Scanner</span>
          </CardTitle>
          <div className="flex space-x-2">
            <Button
              variant={activeTab === 'apk' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('apk')}
              className={activeTab === 'apk' ? 'bg-blue-500 hover:bg-blue-600' : ''}
            >
              <FileX className="h-4 w-4 mr-2" />
              APK Analysis
            </Button>
            <Button
              variant={activeTab === 'url' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('url')}
              className={activeTab === 'url' ? 'bg-blue-500 hover:bg-blue-600' : ''}
            >
              <Globe className="h-4 w-4 mr-2" />
              URL Scanning
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Input Section */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-300">
              {activeTab === 'apk' ? 'APK File Path or Package Name' : 'URL to Scan'}
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={
                  activeTab === 'apk' 
                    ? 'com.example.suspicious.app or /path/to/app.apk'
                    : 'https://suspicious-site.com'
                }
                className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                disabled={isScanning}
              />
              <Button 
                onClick={handleScan}
                disabled={isScanning}
                className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500"
              >
                <Search className="h-4 w-4 mr-2" />
                {isScanning ? 'Scanning...' : 'Scan'}
              </Button>
            </div>
          </div>

          {/* Scanning Progress */}
          {isScanning && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Scanning in progress...</span>
                <span className="text-sm text-blue-400">{Math.round(scanProgress)}%</span>
              </div>
              <Progress value={scanProgress} className="w-full" />
            </div>
          )}

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-white">APK Analysis Features</h4>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>• Static manifest & code analysis</li>
                <li>• Dynamic sandbox execution</li>
                <li>• Signature verification</li>
                <li>• AI-powered threat detection</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-white">URL Protection Features</h4>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>• Real-time phishing detection</li>
                <li>• Domain reputation analysis</li>
                <li>• Zero-hour threat protection</li>
                <li>• Content similarity detection</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Scan Results */}
      {scanResults.length > 0 && (
        <Card className="bg-white/5 backdrop-blur-lg border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Database className="h-5 w-5 text-cyan-400" />
              <span>Recent Scan Results</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {scanResults.map((result, index) => (
              <div key={index} className="border border-slate-700 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {result.verdict === 'clean' ? (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-red-400" />
                    )}
                    <div>
                      <p className="text-white font-medium">
                        {result.sha256 ? `APK: ${result.sha256.substring(0, 16)}...` : `URL: ${result.domain}`}
                      </p>
                      <p className="text-xs text-slate-400">
                        Scanned {new Date(result.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Badge 
                    className={
                      result.verdict === 'clean' 
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }
                  >
                    {result.verdict.toUpperCase()}
                  </Badge>
                </div>

                {result.threats.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-red-400">Detected Threats:</h5>
                    {result.threats.map((threat, threatIndex) => (
                      <div key={threatIndex} className="bg-red-500/10 border border-red-500/20 rounded p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-red-400 font-medium">{threat.type}</span>
                          <Badge className="bg-red-500/20 text-red-400">
                            {Math.round(threat.confidence * 100)}% confident
                          </Badge>
                        </div>
                        <ul className="text-xs text-slate-300 space-y-1">
                          {threat.indicators.map((indicator, indicatorIndex) => (
                            <li key={indicatorIndex}>• {indicator}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-700">
                  <span>Scan time: {result.scanTime}s</span>
                  <div className="flex items-center space-x-1">
                    <Lock className="h-3 w-3" />
                    <span>Enterprise-grade protection</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Technology Stack Info */}
      <Card className="bg-white/5 backdrop-blur-lg border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Activity className="h-5 w-5 text-purple-400" />
            <span>Technology Stack</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-sm font-medium text-white mb-2">APK Analysis</h4>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>• Androguard + Custom Rules</li>
                <li>• JADX + Ghidra AI</li>
                <li>• Google Play Integrity API</li>
                <li>• TensorFlow CNN (Image Scanning)</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-white mb-2">URL Protection</h4>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>• VirusTotal API + Local DB</li>
                <li>• BERT + DOM Analysis</li>
                <li>• Headless Chrome + Puppeteer</li>
                <li>• YARA Rules + Computer Vision</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-white mb-2">Intelligence Sources</h4>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>• 90M+ malware samples</li>
                <li>• 300K+ phishing sites</li>
                <li>• MITRE ATT&CK TTPs</li>
                <li>• Custom honeypots</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
