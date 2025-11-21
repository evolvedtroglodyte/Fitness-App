import React from 'react';
import { motion } from 'framer-motion';
import { Activity, MapPin, Clock, Flame, Calendar } from 'lucide-react';
import { formatDistance, formatDuration } from '../../utils/calculations';

interface StatsGridProps {
  stats: {
    distance: number;
    duration: number;
    calories: number;
    count: number;
  };
  units: 'imperial' | 'metric';
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats, units }) => {
  const statsData = [
    {
      label: 'Activities',
      value: stats.count.toString(),
      icon: Activity,
      color: 'text-fitness-secondary',
      bgColor: 'bg-fitness-secondary/10',
      subtext: 'this week',
    },
    {
      label: 'Distance',
      value: formatDistance(stats.distance, units),
      icon: MapPin,
      color: 'text-fitness-calories',
      bgColor: 'bg-fitness-success/10',
      subtext: 'total',
    },
    {
      label: 'Duration',
      value: formatDuration(stats.duration),
      icon: Clock,
      color: 'text-accent-orange',
      bgColor: 'bg-accent-orange/10',
      subtext: 'active time',
    },
    {
      label: 'Calories',
      value: stats.calories.toString(),
      icon: Flame,
      color: 'text-fitness-primary',
      bgColor: 'bg-fitness-primary/10',
      subtext: 'burned',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statsData.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white dark:bg-dark-surface rounded-lg p-4 border border-gray-200 dark:border-dark-border"
        >
          <div className="flex items-center justify-between mb-2">
            <div
              className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}
            >
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            {index === 0 && (
              <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-600" />
            )}
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold font-sans text-gray-900 dark:text-dark-text">
              {stat.value}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {stat.subtext}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};