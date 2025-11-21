import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Target, Flame } from 'lucide-react';
import type { DailyNutrition } from '../../types';
import { getTimeOfDayGreeting } from '../../utils/calculations';

interface DailySummaryProps {
  nutrition: DailyNutrition;
}

export const DailySummary: React.FC<DailySummaryProps> = ({ nutrition }) => {
  const remaining = nutrition.targetCalories - nutrition.consumedCalories;
  const percentageConsumed = (nutrition.consumedCalories / nutrition.targetCalories) * 100;
  const isOverGoal = remaining < 0;

  const getStatusColor = () => {
    if (isOverGoal) return 'text-fitness-error';
    if (percentageConsumed > 80) return 'text-fitness-warning';
    if (percentageConsumed > 50) return 'text-terminal-amber';
    return 'text-fitness-success';
  };

  const getStatusMessage = () => {
    if (isOverGoal) return 'Over daily goal';
    if (percentageConsumed > 90) return 'Almost at goal';
    if (percentageConsumed > 75) return 'On track';
    if (percentageConsumed > 50) return 'Good progress';
    return 'Keep going!';
  };

  return (
    <div className="bg-white dark:bg-dark-surface rounded-lg p-6 border border-gray-200 dark:border-dark-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text">
          {getTimeOfDayGreeting()}
        </h3>
        <Flame className="w-5 h-5 text-fitness-primary" />
      </div>

      {/* Main calorie display */}
      <div className="text-center mb-6">
        <motion.div
          className="text-5xl font-bold font-sans"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <span className={getStatusColor()}>{nutrition.consumedCalories}</span>
          <span className="text-gray-400 dark:text-gray-600 text-3xl"> / </span>
          <span className="text-gray-700 dark:text-gray-300 text-3xl">
            {nutrition.targetCalories}
          </span>
        </motion.div>
        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">calories</div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${
              isOverGoal
                ? 'bg-fitness-error'
                : percentageConsumed > 80
                ? 'bg-fitness-warning'
                : 'bg-fitness-success'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, percentageConsumed)}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        <div className="mt-1 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{Math.round(percentageConsumed)}% consumed</span>
          <span>{getStatusMessage()}</span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 dark:bg-dark-surface-light rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Remaining</span>
            {isOverGoal ? (
              <TrendingUp className="w-4 h-4 text-fitness-error" />
            ) : (
              <TrendingDown className="w-4 h-4 text-fitness-success" />
            )}
          </div>
          <div className="mt-1 text-xl font-bold font-sans text-gray-900 dark:text-dark-text">
            {Math.abs(remaining)}
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-dark-surface-light rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Goal</span>
            <Target className="w-4 h-4 text-fitness-primary" />
          </div>
          <div className="mt-1 text-xl font-bold font-sans text-gray-900 dark:text-dark-text">
            {nutrition.targetCalories}
          </div>
        </div>
      </div>

      {/* Quick macro summary */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between text-sm">
          <div className="text-center">
            <div className="font-sans font-semibold text-blue-500">
              {Math.round(nutrition.consumedProtein)}g
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Protein</div>
          </div>
          <div className="text-center">
            <div className="font-sans font-semibold text-orange-500">
              {Math.round(nutrition.consumedCarbs)}g
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Carbs</div>
          </div>
          <div className="text-center">
            <div className="font-sans font-semibold text-yellow-500">
              {Math.round(nutrition.consumedFat)}g
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Fat</div>
          </div>
        </div>
      </div>
    </div>
  );
};