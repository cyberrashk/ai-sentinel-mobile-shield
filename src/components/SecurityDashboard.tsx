
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, AlertTriangle, CheckCircle, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const SecurityDashboard = () => {
  const securityStats = [
    {
      title: 'Threats Blocked',
      value: '1,247',
      change: '+12%',
      icon: Shield,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10'
    },
    {
      title: 'Active Scans',
      value: '24',
      change: 'Real-time',
      icon: Activity,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10'
    },
    {
      title: 'Privacy Score',
      value: '98%',
      change: '+5%',
      icon: CheckCircle,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-400/10'
    },
    {
      title: 'Risk Level',
      value: 'Low',
      change: 'Stable',
      icon: AlertTriangle,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {securityStats.map((stat, index) => (
        <Card key={index} className="bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">{stat.title}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                <Badge variant="secondary" className="mt-2 bg-white/10 text-slate-300">
                  {stat.change}
                </Badge>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
