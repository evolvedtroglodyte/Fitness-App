import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { DailyNutrition } from '../../types';

interface MacroRingsProps {
  nutrition: DailyNutrition;
}

export const MacroRings: React.FC<MacroRingsProps> = ({ nutrition }) => {
  const [celebratingRing, setCelebratingRing] = useState<string | null>(null);
  const calculateProgress = (consumed: number, target: number) => {
    if (target <= 0) return 0;
    return Math.min(100, (consumed / target) * 100);
  };

  const proteinProgress = calculateProgress(nutrition.consumedProtein, nutrition.targetProtein);
  const carbsProgress = calculateProgress(nutrition.consumedCarbs, nutrition.targetCarbs);
  const fatProgress = calculateProgress(nutrition.consumedFat, nutrition.targetFat);
  const calorieProgress = calculateProgress(nutrition.consumedCalories, nutrition.targetCalories);

  const rings = [
    {
      name: 'Calories',
      progress: calorieProgress,
      consumed: nutrition.consumedCalories,
      target: nutrition.targetCalories,
      color: '#FF6B35',
      radius: 80,
      strokeWidth: 12,
    },
    {
      name: 'Protein',
      progress: proteinProgress,
      consumed: Math.round(nutrition.consumedProtein),
      target: Math.round(nutrition.targetProtein),
      color: '#4ECDC4',
      radius: 65,
      strokeWidth: 10,
      unit: 'g',
    },
    {
      name: 'Carbs',
      progress: carbsProgress,
      consumed: Math.round(nutrition.consumedCarbs),
      target: Math.round(nutrition.targetCarbs),
      color: '#FFA726',
      radius: 50,
      strokeWidth: 10,
      unit: 'g',
    },
    {
      name: 'Fat',
      progress: fatProgress,
      consumed: Math.round(nutrition.consumedFat),
      target: Math.round(nutrition.targetFat),
      color: '#F7B801',
      radius: 35,
      strokeWidth: 10,
      unit: 'g',
    },
  ];

  // Detect goal completion and trigger celebration
  useEffect(() => {
    rings.forEach((ring) => {
      if (ring.progress >= 100 && celebratingRing !== ring.name) {
        setCelebratingRing(ring.name);
        setTimeout(() => setCelebratingRing(null), 3000);
      }
    });
  }, [calorieProgress, proteinProgress, carbsProgress, fatProgress]);

  return (
    <div className="bg-white dark:bg-dark-surface rounded-lg p-6 border border-gray-200 dark:border-dark-border">
      <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-dark-text">
        Macro Rings
      </h3>

      <div className="flex flex-col md:flex-row items-center justify-around">
        {/* Rings SVG */}
        <div className="relative">
          <svg width="200" height="200" className="transform -rotate-90">
            {rings.map((ring) => {
              const circumference = 2 * Math.PI * ring.radius;
              const strokeDasharray = `${(ring.progress / 100) * circumference} ${circumference}`;

              return (
                <g key={ring.name}>
                  {/* Background ring */}
                  <circle
                    cx="100"
                    cy="100"
                    r={ring.radius}
                    stroke="currentColor"
                    strokeWidth={ring.strokeWidth}
                    fill="none"
                    className="text-gray-200 dark:text-gray-700"
                  />
                  {/* Progress ring */}
                  <motion.circle
                    cx="100"
                    cy="100"
                    r={ring.radius}
                    stroke={ring.color}
                    strokeWidth={ring.strokeWidth}
                    fill="none"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: '0 1000' }}
                    animate={{
                      strokeDasharray,
                      filter: celebratingRing === ring.name
                        ? ['drop-shadow(0 0 0px ' + ring.color + ')', 'drop-shadow(0 0 10px ' + ring.color + ')', 'drop-shadow(0 0 0px ' + ring.color + ')']
                        : 'drop-shadow(0 0 0px ' + ring.color + ')',
                    }}
                    transition={{
                      strokeDasharray: { duration: 1, ease: 'easeOut' },
                      filter: { duration: 0.5, repeat: celebratingRing === ring.name ? Infinity : 0 },
                    }}
                  />
                </g>
              );
            })}
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center transform rotate-90">
            <div className="text-center">
              <div className="text-2xl font-bold font-sans text-gray-900 dark:text-dark-text">
                {Math.round(calorieProgress)}%
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Daily Goal</div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 md:mt-0 space-y-3">
          {rings.map((ring) => (
            <div key={ring.name} className="flex items-center space-x-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: ring.color }}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {ring.name}
                  </span>
                  <span className="text-sm font-sans text-gray-900 dark:text-dark-text">
                    {ring.consumed}/{ring.target}{ring.unit || ''}
                  </span>
                </div>
                <div className="mt-1 w-32 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: ring.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${ring.progress}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Celebration message */}
      <AnimatePresence>
        {celebratingRing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-4 p-3 bg-gradient-to-r from-fitness-success/20 to-fitness-success/10 rounded-xl border border-fitness-success/30"
          >
            <div className="flex items-center space-x-3">
              <motion.span
                className="text-2xl"
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                🎉
              </motion.span>
              <div>
                <div className="font-semibold text-fitness-success">
                  {celebratingRing} Goal Complete!
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Great job hitting your target!
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};