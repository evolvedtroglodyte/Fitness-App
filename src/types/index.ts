// Core type definitions for FitTerminal

// Calorie Tracker Types
export interface Food {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving?: string;
  timestamp: Date;
}

export interface DailyNutrition {
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  consumedCalories: number;
  consumedProtein: number;
  consumedCarbs: number;
  consumedFat: number;
}

export interface MacroGoals {
  calories: number;
  proteinPercentage: number;
  carbsPercentage: number;
  fatPercentage: number;
}

// Cardio Tracker Types
export interface CardioActivity {
  id: string;
  type: 'run' | 'cycle' | 'swim' | 'walk' | 'other';
  name: string;
  distance: number; // in meters
  duration: number; // in seconds
  pace?: number; // seconds per km
  heartRate?: {
    average: number;
    max: number;
  };
  elevationGain?: number; // in meters
  calories?: number;
  timestamp: Date;
  stravaId?: string;
}

export interface CardioStats {
  weeklyDistance: number;
  weeklyDuration: number;
  weeklyCalories: number;
  activitiesCount: number;
}

// Fitness Logger Types
export interface Exercise {
  id: string;
  name: string;
  sets?: number;
  reps?: number;
  weight?: number; // in lbs or kg based on user preference
  duration?: number; // in seconds for timed exercises
  notes?: string;
}

export interface Workout {
  id: string;
  name: string;
  type: 'push' | 'pull' | 'legs' | 'cardio' | 'full-body' | 'other';
  exercises: Exercise[];
  duration: number; // in seconds
  timestamp: Date;
  notes?: string;
}

export interface PersonalRecord {
  exerciseName: string;
  value: number;
  unit: 'lbs' | 'kg' | 'reps' | 'seconds';
  date: Date;
}

// User Preferences
export interface UserPreferences {
  units: 'imperial' | 'metric';
  theme: 'light' | 'dark' | 'system';
  macroGoals: MacroGoals;
  weeklyWorkoutGoal: number;
  dailyCalorieGoal: number;
}

// App State
export interface AppSection {
  id: 'calorie' | 'cardio' | 'fitness';
  title: string;
  isFullscreen: boolean;
}