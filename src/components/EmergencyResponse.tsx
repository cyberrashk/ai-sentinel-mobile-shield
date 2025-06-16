
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Lock, Shield, Wifi, Database, Power } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface EmergencyAction {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  severity: 'medium' | 'high' | 'critical';
  enabled: boolean;
  action: () => void;
}

export const EmergencyResponse = () => {
  const [lockdownActive, setLockdownActive] = useState(false);
  const [activeActions, setActiveActions] = useState<string[]>([]);
  const { toast } = useToast();

  const executeEmergencyAction = (actionId: string, actionName: string) => {
    setActiveActions(prev => [...prev, actionId]);
    
    toast({
      title: "🚨 Emergency Action Executed",
      description: `${actionName} has been activated`,
      variant: "destructive",
    });

    // Simulate action duration
    setTimeout(() => {
      setActiveActions(prev => prev.filter(id => id !== actionId));
      toast({
        title: "✅ Action Complete",
        description: `${actionName} has been successfully executed`,
      });
    }, 3000);
  };

  const emergencyActions: EmergencyAction[] = [
    {
      id: 'full-lockdown',
      name: 'Full System Lockdown',
      description: 'Immediately lock all access and connections',
      icon: <Lock className="h-4 w-4" />,
      severity: 'critical',
      enabled: !lockdownActive,
      action: () => {
        setLockdownActive(true);
        executeEmergencyAction('full-lockdown', 'Full System Lockdown');
        setTimeout(() => setLockdownActive(false), 10000);
      }
    },
    {
      id: 'isolate-network',
      name: 'Network Isolation',
      description: 'Disconnect from all external networks',
      icon: <Wifi className="h-4 w-4" />,
      severity: 'high',
      enabled: true,
      action: () => executeEmergencyAction('isolate-network', 'Network Isolation')
    },
    {
      id: 'data-protection',
      name: 'Data Protection Mode',
      description: 'Encrypt and secure all sensitive data',
      icon: <Database className="h-4 w-4" />,
      severity: 'medium',
      enabled: true,
      action: () => executeEmergencyAction('data-protection', 'Data Protection Mode')
    },
    {
      id: 'ai-countermeasures',
      name: 'AI Countermeasures',
      description: 'Deploy autonomous defensive AI agents',
      icon: <Shield className="h-4 w-4" />,
      severity: 'high',
      enabled: true,
      action: () => executeEmergencyAction('ai-countermeasures', 'AI Countermeasures')
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 hover:bg-red-600';
      case 'high': return 'bg-orange-500 hover:bg-orange-600';
      case 'medium': return 'bg-yellow-500 hover:bg-yellow-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-red-400" />
            Emergency Response
          </CardTitle>
          {lockdownActive && (
            <Badge className="bg-red-500/20 text-red-400 animate-pulse">
              LOCKDOWN ACTIVE
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Power className="h-4 w-4 text-red-400" />
            <span className="text-red-400 font-medium text-sm">Critical Actions</span>
          </div>
          <p className="text-xs text-slate-300">
            These actions will immediately secure your system but may disrupt normal operations.
            Use only in case of confirmed security incidents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {emergencyActions.map((action) => (
            <div
              key={action.id}
              className="p-4 bg-slate-900/50 rounded-lg border border-slate-600"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="text-slate-400">
                  {action.icon}
                </div>
                <span className="text-white text-sm font-medium">{action.name}</span>
              </div>
              
              <p className="text-xs text-slate-400 mb-3">
                {action.description}
              </p>
              
              <Button
                onClick={action.action}
                disabled={!action.enabled || activeActions.includes(action.id)}
                className={`w-full text-white ${getSeverityColor(action.severity)}`}
                size="sm"
              >
                {activeActions.includes(action.id) ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Executing...
                  </div>
                ) : (
                  `Execute ${action.severity.toUpperCase()}`
                )}
              </Button>
            </div>
          ))}
        </div>

        <div className="text-xs text-slate-500 text-center">
          Emergency actions are logged and can be reviewed in the security audit trail
        </div>
      </CardContent>
    </Card>
  );
};
