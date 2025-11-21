import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Food,
  CardioActivity,
  Workout,
  UserPreferences,
  DailyNutrition
} from '../types';

// Calorie Store
interface CalorieStore {
  foods: Food[];
  todaysFoods: Food[];
  recentFoods: Food[];
  addFood: (food: Omit<Food, 'id' | 'timestamp'>) => void;
  removeFood: (id: string) => void;
  updateFood: (id: string, food: Partial<Food>) => void;
  getTodaysNutrition: () => DailyNutrition;
  clearToday: () => void;
}

export const useCalorieStore = create<CalorieStore>()(
  persist(
    (set, get) => ({
      foods: [],
      todaysFoods: [],
      recentFoods: [],

      addFood: (foodData) => {
        const food: Food = {
          ...foodData,
          id: crypto.randomUUID(),
          timestamp: new Date(),
        };

        set((state) => ({
          foods: [...state.foods, food],
          todaysFoods: [...state.todaysFoods, food],
          recentFoods: [food, ...state.recentFoods.slice(0, 9)],
        }));
      },

      removeFood: (id) => {
        set((state) => ({
          foods: state.foods.filter(f => f.id !== id),
          todaysFoods: state.todaysFoods.filter(f => f.id !== id),
        }));
      },

      updateFood: (id, updates) => {
        set((state) => ({
          foods: state.foods.map(f => f.id === id ? { ...f, ...updates } : f),
          todaysFoods: state.todaysFoods.map(f => f.id === id ? { ...f, ...updates } : f),
        }));
      },

      getTodaysNutrition: () => {
        const { todaysFoods } = get();
        const userPrefs = useUserStore.getState()?.preferences || {
          dailyCalorieGoal: 2000,
          macroGoals: {
            calories: 2000,
            proteinPercentage: 30,
            carbsPercentage: 40,
            fatPercentage: 30,
          },
        };

        const totals = todaysFoods.reduce(
          (acc, food) => ({
            consumedCalories: acc.consumedCalories + food.calories,
            consumedProtein: acc.consumedProtein + food.protein,
            consumedCarbs: acc.consumedCarbs + food.carbs,
            consumedFat: acc.consumedFat + food.fat,
          }),
          { consumedCalories: 0, consumedProtein: 0, consumedCarbs: 0, consumedFat: 0 }
        );

        const targetCalories = userPrefs.dailyCalorieGoal;
        const targetProtein = (targetCalories * userPrefs.macroGoals.proteinPercentage / 100) / 4;
        const targetCarbs = (targetCalories * userPrefs.macroGoals.carbsPercentage / 100) / 4;
        const targetFat = (targetCalories * userPrefs.macroGoals.fatPercentage / 100) / 9;

        return {
          targetCalories,
          targetProtein,
          targetCarbs,
          targetFat,
          ...totals,
        };
      },

      clearToday: () => {
        set({ todaysFoods: [] });
      },
    }),
    {
      name: 'calorie-storage',
    }
  )
);

// Cardio Store
interface CardioStore {
  activities: CardioActivity[];
  addActivity: (activity: Omit<CardioActivity, 'id' | 'timestamp'>) => void;
  removeActivity: (id: string) => void;
  updateActivity: (id: string, activity: Partial<CardioActivity>) => void;
  getWeeklyStats: () => {
    distance: number;
    duration: number;
    calories: number;
    count: number;
  };
}

export const useCardioStore = create<CardioStore>()(
  persist(
    (set, get) => ({
      activities: [],

      addActivity: (activityData) => {
        const activity: CardioActivity = {
          ...activityData,
          id: crypto.randomUUID(),
          timestamp: new Date(),
        };

        set((state) => ({
          activities: [activity, ...state.activities],
        }));
      },

      removeActivity: (id) => {
        set((state) => ({
          activities: state.activities.filter(a => a.id !== id),
        }));
      },

      updateActivity: (id, updates) => {
        set((state) => ({
          activities: state.activities.map(a => a.id === id ? { ...a, ...updates } : a),
        }));
      },

      getWeeklyStats: () => {
        const { activities } = get();
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);

        const weeklyActivities = activities.filter(
          a => new Date(a.timestamp) > weekAgo
        );

        return weeklyActivities.reduce(
          (acc, activity) => ({
            distance: acc.distance + activity.distance,
            duration: acc.duration + activity.duration,
            calories: acc.calories + (activity.calories || 0),
            count: acc.count + 1,
          }),
          { distance: 0, duration: 0, calories: 0, count: 0 }
        );
      },
    }),
    {
      name: 'cardio-storage',
    }
  )
);

// Fitness Store
interface FitnessStore {
  workouts: Workout[];
  addWorkout: (workout: Omit<Workout, 'id' | 'timestamp'>) => void;
  removeWorkout: (id: string) => void;
  updateWorkout: (id: string, workout: Partial<Workout>) => void;
  getPersonalRecords: () => Map<string, number>;
}

export const useFitnessStore = create<FitnessStore>()(
  persist(
    (set, get) => ({
      workouts: [],

      addWorkout: (workoutData) => {
        const workout: Workout = {
          ...workoutData,
          id: crypto.randomUUID(),
          timestamp: new Date(),
        };

        set((state) => ({
          workouts: [workout, ...state.workouts],
        }));
      },

      removeWorkout: (id) => {
        set((state) => ({
          workouts: state.workouts.filter(w => w.id !== id),
        }));
      },

      updateWorkout: (id, updates) => {
        set((state) => ({
          workouts: state.workouts.map(w => w.id === id ? { ...w, ...updates } : w),
        }));
      },

      getPersonalRecords: () => {
        const { workouts } = get();
        const records = new Map<string, number>();

        workouts.forEach(workout => {
          workout.exercises.forEach(exercise => {
            if (exercise.weight) {
              const current = records.get(exercise.name) || 0;
              if (exercise.weight > current) {
                records.set(exercise.name, exercise.weight);
              }
            }
          });
        });

        return records;
      },
    }),
    {
      name: 'fitness-storage',
    }
  )
);

// User Preferences Store
interface UserStore {
  preferences: UserPreferences;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  toggleTheme: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      preferences: {
        units: 'imperial',
        theme: 'dark',
        macroGoals: {
          calories: 2000,
          proteinPercentage: 30,
          carbsPercentage: 40,
          fatPercentage: 30,
        },
        weeklyWorkoutGoal: 4,
        dailyCalorieGoal: 2000,
      },

      updatePreferences: (prefs) => {
        set((state) => ({
          preferences: { ...state.preferences, ...prefs },
        }));
      },

      toggleTheme: () => {
        const { preferences } = get();
        const themes: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system'];
        const currentIndex = themes.indexOf(preferences.theme);
        const nextTheme = themes[(currentIndex + 1) % themes.length];

        set((state) => ({
          preferences: { ...state.preferences, theme: nextTheme },
        }));

        // Apply theme to document
        if (nextTheme === 'dark' ||
            (nextTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
    }),
    {
      name: 'user-preferences',
    }
  )
);

// UI Store (non-persisted)
interface UIStore {
  fullscreenSection: 'calorie' | 'cardio' | 'fitness' | null;
  setFullscreen: (section: 'calorie' | 'cardio' | 'fitness' | null) => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  fullscreenSection: null,
  setFullscreen: (section) => set({ fullscreenSection: section }),
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
}));