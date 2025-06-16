
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Star, Zap, Shield, Target } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

export const SecurityScoreGame = () => {
  const [securityScore, setSecurityScore] = useState(2847);
  const [level, setLevel] = useState(12);
  const [xpToNextLevel, setXpToNextLevel] = useState(1230);
  const [totalXpNeeded] = useState(2000);
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: '1',
      name: 'Threat Hunter',
      description: 'Detect 50 threats',
      icon: <Target className="h-4 w-4" />,
      unlocked: true,
      progress: 50,
      maxProgress: 50
    },
    {
      id: '2',
      name: 'Security Sentinel',
      description: 'Maintain 90%+ security score for 7 days',
      icon: <Shield className="h-4 w-4" />,
      unlocked: false,
      progress: 5,
      maxProgress: 7
    },
    {
      id: '3',
      name: 'Quantum Guardian',
      description: 'Block quantum-resistant attacks',
      icon: <Zap className="h-4 w-4" />,
      unlocked: false,
      progress: 2,
      maxProgress: 10
    }
  ]);

  useEffect(() => {
    // Simulate real-time score updates
    const scoreInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        const increase = Math.floor(Math.random() * 50) + 10;
        setSecurityScore(prev => Math.min(prev + increase, 3000));
        setXpToNextLevel(prev => Math.max(prev - increase, 0));
      }
    }, 10000);

    return () => clearInterval(scoreInterval);
  }, []);

  const getScoreGrade = (score: number) => {
    if (score >= 2800) return { grade: 'S+', color: 'text-purple-400', bg: 'bg-purple-500/20' };
    if (score >= 2400) return { grade: 'S', color: 'text-blue-400', bg: 'bg-blue-500/20' };
    if (score >= 2000) return { grade: 'A', color: 'text-green-400', bg: 'bg-green-500/20' };
    if (score >= 1600) return { grade: 'B', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    return { grade: 'C', color: 'text-red-400', bg: 'bg-red-500/20' };
  };

  const scoreGrade = getScoreGrade(securityScore);
  const levelProgress = ((totalXpNeeded - xpToNextLevel) / totalXpNeeded) * 100;

  return (
    <Card className="bg-gradient-to-br from-slate-800/50 to-purple-900/20 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-400" />
          Security Score
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Score Display */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-4">
            <div className={`px-4 py-2 rounded-lg ${scoreGrade.bg}`}>
              <span className={`text-2xl font-bold ${scoreGrade.color}`}>
                {scoreGrade.grade}
              </span>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">{securityScore.toLocaleString()}</div>
              <div className="text-sm text-slate-400">Security Points</div>
            </div>
          </div>
        </div>

        {/* Level Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-white text-sm">Level {level}</span>
            <span className="text-slate-400 text-sm">{xpToNextLevel} XP to Level {level + 1}</span>
          </div>
          <Progress value={levelProgress} className="h-3" />
        </div>

        {/* Recent Achievements */}
        <div className="space-y-3">
          <h4 className="text-white font-medium flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-400" />
            Achievements
          </h4>
          <div className="space-y-2">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-3 rounded-lg border ${
                  achievement.unlocked
                    ? 'bg-green-500/10 border-green-500/20'
                    : 'bg-slate-900/50 border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={achievement.unlocked ? 'text-green-400' : 'text-slate-400'}>
                      {achievement.icon}
                    </div>
                    <span className={`text-sm font-medium ${
                      achievement.unlocked ? 'text-green-400' : 'text-white'
                    }`}>
                      {achievement.name}
                    </span>
                  </div>
                  {achievement.unlocked && (
                    <Badge className="bg-green-500/20 text-green-400">
                      Unlocked
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-slate-400 mb-2">
                  {achievement.description}
                </div>
                {!achievement.unlocked && (
                  <div className="flex items-center gap-2">
                    <Progress 
                      value={(achievement.progress / achievement.maxProgress) * 100} 
                      className="h-1 flex-1"
                    />
                    <span className="text-xs text-slate-400">
                      {achievement.progress}/{achievement.maxProgress}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
