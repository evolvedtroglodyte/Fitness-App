import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Weight } from 'lucide-react';
import type { Exercise } from '../../types';
import { formatExercise } from '../../utils/workoutParser';

interface ExerciseListProps {
  exercises: Exercise[];
  showPRs?: boolean;
  personalRecords?: Map<string, number>;
}

export const ExerciseList: React.FC<ExerciseListProps> = ({
  exercises,
  showPRs = false,
  personalRecords,
}) => {
  const isPR = (exercise: Exercise): boolean => {
    if (!showPRs || !personalRecords || !exercise.weight) return false;
    const currentPR = personalRecords.get(exercise.name) || 0;
    return exercise.weight > currentPR;
  };

  if (exercises.length === 0) {
    return (
      <div className="text-center py-4 text-gray-400 dark:text-gray-600 font-sans">
        No exercises parsed yet
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {exercises.map((exercise, index) => (
        <motion.div
          key={exercise.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className={`flex items-center justify-between p-3 rounded-lg ${
            isPR(exercise)
              ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-300 dark:border-yellow-700'
              : 'bg-gray-50 dark:bg-dark-surface-light'
          }`}
        >
          <div className="flex items-center space-x-3">
            {isPR(exercise) ? (
              <Trophy className="w-5 h-5 text-yellow-500" />
            ) : (
              <Weight className="w-5 h-5 text-gray-400 dark:text-gray-600" />
            )}
            <div>
              <div className="font-medium text-gray-900 dark:text-dark-text">
                {exercise.name}
                {isPR(exercise) && (
                  <span className="ml-2 text-xs text-yellow-600 dark:text-yellow-400 font-bold">
                    NEW PR! 🎉
                  </span>
                )}
              </div>
              <div className="text-sm font-sans text-gray-600 dark:text-gray-400">
                {formatExercise(exercise)}
              </div>
            </div>
          </div>

          {exercise.weight && personalRecords && (
            <div className="text-right">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                PR: {personalRecords.get(exercise.name) || 0} lbs
              </div>
              {exercise.weight > (personalRecords.get(exercise.name) || 0) && (
                <div className="flex items-center space-x-1 text-xs text-green-600 dark:text-green-400">
                  <TrendingUp className="w-3 h-3" />
                  <span>+{exercise.weight - (personalRecords.get(exercise.name) || 0)} lbs</span>
                </div>
              )}
            </div>
          )}
        </motion.div>
      ))}

      {/* Volume summary */}
      {exercises.some(e => e.weight) && (
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Total Volume:</span>
            <span className="font-sans font-semibold text-gray-900 dark:text-dark-text">
              {exercises.reduce((total, ex) => {
                if (ex.sets && ex.reps && ex.weight) {
                  return total + (ex.sets * ex.reps * ex.weight);
                }
                return total;
              }, 0).toLocaleString()} lbs
            </span>
          </div>
        </div>
      )}
    </div>
  );
};