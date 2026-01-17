import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, Target, Calendar } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { MemoryConcept } from '@/hooks/useMemoryConcepts';

interface MemoryStatsProps {
  concepts: MemoryConcept[];
  weeklyStats: { totalReviews: number; correctReviews: number };
}

const MemoryStats = ({ concepts, weeklyStats }: MemoryStatsProps) => {
  // Calculate stats
  const dangerCount = concepts.filter(c => c.memory_strength < 40).length;
  const warningCount = concepts.filter(c => c.memory_strength >= 40 && c.memory_strength < 70).length;
  const solidCount = concepts.filter(c => c.memory_strength >= 70).length;
  
  const pieData = [
    { name: 'Solide', value: solidCount, color: 'hsl(var(--success))' },
    { name: 'À revoir', value: warningCount, color: 'hsl(var(--xp))' },
    { name: 'En danger', value: dangerCount, color: 'hsl(var(--destructive))' },
  ].filter(d => d.value > 0);

  const successRate = weeklyStats.totalReviews > 0 
    ? Math.round((weeklyStats.correctReviews / weeklyStats.totalReviews) * 100)
    : 0;

  if (concepts.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-2xl p-4 space-y-4"
    >
      <h3 className="font-semibold text-foreground flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-primary" />
        Statistiques
      </h3>

      <div className="grid grid-cols-2 gap-4">
        {/* Pie Chart */}
        <div className="flex flex-col items-center">
          <ResponsiveContainer width={100} height={100}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={25}
                outerRadius={45}
                paddingAngle={2}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <p className="text-xs text-muted-foreground mt-1">Répartition</p>
        </div>

        {/* Legend */}
        <div className="flex flex-col justify-center space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success" />
            <span className="text-sm text-muted-foreground">Solide ({solidCount})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-xp" />
            <span className="text-sm text-muted-foreground">À revoir ({warningCount})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-destructive" />
            <span className="text-sm text-muted-foreground">Danger ({dangerCount})</span>
          </div>
        </div>
      </div>

      {/* Weekly stats */}
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Calendar className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">{weeklyStats.totalReviews}</p>
            <p className="text-xs text-muted-foreground">Révisions / 7j</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
            <Target className="w-4 h-4 text-success" />
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">{successRate}%</p>
            <p className="text-xs text-muted-foreground">Taux de succès</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MemoryStats;
