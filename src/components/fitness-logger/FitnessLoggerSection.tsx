import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, Plus, Calendar, TrendingUp, Trophy, Target, Trash2, Edit2 } from 'lucide-react';
import { useFitnessStore, useUserStore } from '../../stores';
import { TerminalInput } from '../shared/TerminalInput';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { WorkoutInput } from './WorkoutInput';
import { ExerciseList } from './ExerciseList';
import { parseWorkoutInput, convertToExercises, formatExercise, calculateVolume, validateWorkoutInput } from '../../utils/workoutParser';
import type { Workout, Exercise } from '../../types';

interface FitnessLoggerSectionProps {
  compact?: boolean;
}

export const FitnessLoggerSection: React.FC<FitnessLoggerSectionProps> = ({ compact = false }) => {
  const [input, setInput] = useState('');
  const [parsedExercises, setParsedExercises] = useState<Exercise[]>([]);
  const [workoutName, setWorkoutName] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const workouts = useFitnessStore((state) => state.workouts);
  const addWorkout = useFitnessStore((state) => state.addWorkout);
  const removeWorkout = useFitnessStore((state) => state.removeWorkout);
  const getPersonalRecords = useFitnessStore((state) => state.getPersonalRecords);
  const preferences = useUserStore((state) => state.preferences);
  const personalRecords = getPersonalRecords();

  // Parse input in real-time
  useEffect(() => {
    // Clear error when user types
    if (error) setError('');

    if (input.length > 3) {
      const parsed = parseWorkoutInput(input);
      setParsedExercises(convertToExercises(parsed.exercises));
      setWorkoutName(parsed.name || `${parsed.type} Workout`);
      setShowPreview(true);
    } else {
      setParsedExercises([]);
      setShowPreview(false);
    }
  }, [input]);

  const handleLogWorkout = async () => {
    // Validate input first
    const validation = validateWorkoutInput(input);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid input');
      return;
    }

    if (parsedExercises.length === 0) {
      setError('No exercises found in input');
      return;
    }

    setIsSubmitting(true);

    // Simulate async operation for better UX
    await new Promise(resolve => setTimeout(resolve, 300));

    const parsed = parseWorkoutInput(input);
    const duration = Math.floor(Math.random() * 3600 + 1800); // Mock duration

    addWorkout({
      name: workoutName,
      type: parsed.type,
      exercises: parsedExercises,
      duration,
      notes: input,
    });

    setInput('');
    setParsedExercises([]);
    setShowPreview(false);
    setError('');
    setIsSubmitting(false);
  };

  // Calculate weekly stats
  const weeklyWorkouts = workouts.filter((w) => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(w.timestamp) > weekAgo;
  });

  const totalVolume = weeklyWorkouts.reduce(
    (sum, workout) => sum + calculateVolume(workout.exercises),
    0
  );

  if (compact) {
    // Compact view for grid layout
    return (
      <div className="space-y-4">
        {/* Weekly stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="text-center">
            <div className="text-2xl font-bold font-sans text-fitness-calories">
              {weeklyWorkouts.length}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">workouts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold font-sans text-terminal-amber">
              {personalRecords.size}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">PRs</div>
          </div>
        </div>

        {/* Quick input */}
        <div>
          <label htmlFor="workout-input-compact" className="sr-only">
            Log workout
          </label>
          <TerminalInput
            id="workout-input-compact"
            value={input}
            onChange={setInput}
            onSubmit={handleLogWorkout}
            placeholder="log workout..."
            prompt=">"
          />
          {error && (
            <div className="mt-1 text-xs text-fitness-error font-sans">
              ⚠ {error}
            </div>
          )}
        </div>

        {/* Recent workouts (last 2) */}
        <div className="space-y-1">
          {workouts.slice(0, 2).map((workout) => (
            <div
              key={workout.id}
              className="flex items-center justify-between p-2 bg-gray-50 dark:bg-dark-surface-light rounded text-xs group"
            >
              <div className="flex items-center space-x-2 flex-1 truncate">
                <Dumbbell className="w-3 h-3 text-fitness-calories" />
                <span className="font-sans truncate">{workout.name}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-gray-500 dark:text-gray-400 mr-1">
                  {workout.exercises.length} ex
                </span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setInput(workout.notes || '')}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-dark-surface rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Edit workout"
                >
                  <Edit2 className="w-3 h-3 text-primary" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    if (window.confirm(`Delete "${workout.name}"?`)) {
                      removeWorkout(workout.id);
                    }
                  }}
                  className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Delete workout"
                >
                  <Trash2 className="w-3 h-3 text-fitness-error" />
                </motion.button>
              </div>
            </div>
          ))}
        </div>

        {/* Quick templates */}
        <div className="grid grid-cols-3 gap-1">
          {['Push', 'Pull', 'Legs'].map((type) => (
            <Button
              key={type}
              variant="secondary"
              size="sm"
              onClick={() => setInput(`${type} day: `)}
              className="text-xs min-h-[44px]"
            >
              {type}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  // Full view
  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold font-sans text-fitness-calories">
                {weeklyWorkouts.length}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">This Week</div>
            </div>
            <Calendar className="w-5 h-5 text-gray-400 dark:text-gray-600" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold font-sans text-terminal-amber">
                {workouts.length}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Total Workouts</div>
            </div>
            <Dumbbell className="w-5 h-5 text-gray-400 dark:text-gray-600" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold font-sans text-fitness-primary">
                {personalRecords.size}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Personal Records</div>
            </div>
            <Trophy className="w-5 h-5 text-gray-400 dark:text-gray-600" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold font-sans text-fitness-secondary">
                {totalVolume > 0 ? `${Math.round(totalVolume / 1000)}K` : '0'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Weekly Volume</div>
            </div>
            <TrendingUp className="w-5 h-5 text-gray-400 dark:text-gray-600" />
          </div>
        </Card>
      </div>

      {/* Workout Input */}
      <Card>
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-dark-text">
          Log Workout
        </h3>
        <WorkoutInput
          value={input}
          onChange={setInput}
          onSubmit={handleLogWorkout}
          error={error}
          isSubmitting={isSubmitting}
        />

        {/* Quick Templates */}
        <div className="mt-4">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Quick Templates:</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {['Push Day', 'Pull Day', 'Leg Day', 'Full Body'].map((template) => (
              <Button
                key={template}
                variant="secondary"
                size="sm"
                onClick={() => {
                  const type = template.toLowerCase().replace(' day', '');
                  setInput(`${template}: `);
                }}
                className="flex items-center justify-center space-x-2"
              >
                <Dumbbell className="w-4 h-4" />
                <span>{template}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Example inputs */}
        <div className="mt-4 p-3 bg-gray-50 dark:bg-dark-surface-light rounded-lg">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Examples:</div>
          <div className="space-y-1 text-xs font-sans text-gray-600 dark:text-gray-400">
            <div>• Push day: bench 3x8 @185, ohp 4x6 @95</div>
            <div>• Legs: squats 5x5 heavy, leg press 3x12</div>
            <div>• 30 min run, 10 min rowing</div>
          </div>
        </div>
      </Card>

      {/* Preview parsed workout */}
      {showPreview && parsedExercises.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card terminal>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-fitness-calories">
                Preview: {workoutName}
              </h4>
              <Button
                variant="terminal"
                size="sm"
                onClick={handleLogWorkout}
                className="flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Save Workout</span>
              </Button>
            </div>
            <ExerciseList exercises={parsedExercises} showPRs personalRecords={personalRecords} />
          </Card>
        </motion.div>
      )}

      {/* Recent Workouts */}
      {workouts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text">
            Recent Workouts
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workouts.slice(0, 4).map((workout) => (
              <Card key={workout.id} hoverable>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Dumbbell className="w-4 h-4 text-fitness-calories" />
                      <h4 className="font-semibold text-gray-900 dark:text-dark-text">
                        {workout.name}
                      </h4>
                      <span className="px-2 py-0.5 bg-gray-100 dark:bg-dark-surface-light rounded text-xs text-gray-600 dark:text-gray-400">
                        {workout.type}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm">
                      {workout.exercises.slice(0, 3).map((exercise) => (
                        <div key={exercise.id} className="font-sans text-gray-600 dark:text-gray-400">
                          • {formatExercise(exercise)}
                        </div>
                      ))}
                      {workout.exercises.length > 3 && (
                        <div className="text-xs text-gray-500 dark:text-gray-500">
                          +{workout.exercises.length - 3} more exercises
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(workout.timestamp).toLocaleDateString()}
                    </div>
                    <div className="flex items-center space-x-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setInput(workout.notes || '');
                        }}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-dark-surface-light rounded transition-colors"
                        aria-label="Edit workout"
                      >
                        <Edit2 className="w-4 h-4 text-primary" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Delete "${workout.name}"?`)) {
                            removeWorkout(workout.id);
                          }
                        }}
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                        aria-label="Delete workout"
                      >
                        <Trash2 className="w-4 h-4 text-fitness-error" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Personal Records */}
      {personalRecords.size > 0 && (
        <Card>
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-dark-text flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span>Personal Records</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Array.from(personalRecords.entries()).slice(0, 6).map(([exercise, weight]) => (
              <div key={exercise} className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-3">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {exercise}
                </div>
                <div className="text-xl font-bold font-sans text-gray-900 dark:text-dark-text">
                  {weight} lbs
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};