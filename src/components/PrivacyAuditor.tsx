
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Camera, Mic, MapPin, Contact } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export const PrivacyAuditor = () => {
  const privacyData = [
    {
      category: 'Camera Access',
      apps: 12,
      risk: 'Medium',
      icon: Camera,
      percentage: 65
    },
    {
      category: 'Location Tracking',
      apps: 8,
      risk: 'High',
      icon: MapPin,
      percentage: 85
    },
    {
      category: 'Microphone Access',
      apps: 6,
      risk: 'Low',
      icon: Mic,
      percentage: 30
    },
    {
      category: 'Contact Access',
      apps: 15,
      risk: 'Medium',
      icon: Contact,
      percentage: 55
    }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'text-red-400 bg-red-500/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'Low': return 'text-green-400 bg-green-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <Card className="bg-white/5 backdrop-blur-lg border-white/10">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <Eye className="h-5 w-5 text-cyan-400" />
          <CardTitle className="text-white">Privacy Auditor</CardTitle>
        </div>
        <Badge className="bg-cyan-500/20 text-cyan-400">
          Score: 85/100
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {privacyData.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <item.icon className="h-4 w-4 text-slate-400" />
                <span className="text-white text-sm">{item.category}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-slate-400 text-sm">{item.apps} apps</span>
                <Badge className={getRiskColor(item.risk)}>
                  {item.risk}
                </Badge>
              </div>
            </div>
            <Progress value={item.percentage} className="h-1" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
