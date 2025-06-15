
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Cpu, Battery } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export const SecurityMetrics = () => {
  const metrics = [
    {
      label: 'CPU Usage',
      value: 12,
      icon: Cpu,
      color: 'text-blue-400'
    },
    {
      label: 'Battery Impact',
      value: 3,
      icon: Battery,
      color: 'text-green-400'
    },
    {
      label: 'Network Activity',
      value: 28,
      icon: TrendingUp,
      color: 'text-cyan-400'
    }
  ];

  return (
    <Card className="bg-white/5 backdrop-blur-lg border-white/10">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5 text-purple-400" />
          <CardTitle className="text-white">Performance Metrics</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {metrics.map((metric, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <metric.icon className={`h-4 w-4 ${metric.color}`} />
                <span className="text-white text-sm">{metric.label}</span>
              </div>
              <span className="text-slate-400 text-sm">{metric.value}%</span>
            </div>
            <Progress value={metric.value} className="h-2" />
          </div>
        ))}
        
        <div className="pt-4 border-t border-white/10">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400">97.3%</p>
            <p className="text-slate-400 text-sm">Overall Efficiency</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
