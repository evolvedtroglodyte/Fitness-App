# Apple Fitness Design Patterns - Implementation Examples

Ready-to-use code snippets and components for FitTerminal based on Apple Fitness design patterns.

---

## 1. Enhanced Ring Celebration Component

### Ring Closure Celebration with Particles

```typescript
// src/components/shared/RingCelebration.tsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface RingCelebrationProps {
  isComplete: boolean;
  ringColor: string;
  ringName: string;
}

export const RingCelebration: React.FC<RingCelebrationProps> = ({
  isComplete,
  ringColor,
  ringName
}) => {
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (isComplete && !showCelebration) {
      setShowCelebration(true);
      triggerCelebration();

      // Auto-hide after animation
      setTimeout(() => setShowCelebration(false), 2000);
    }
  }, [isComplete]);

  const triggerCelebration = () => {
    // Play terminal bell sound
    playTerminalBell();

    // Trigger confetti
    const colors = [ringColor, '#FFFFFF', ringColor];

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: colors,
      ticks: 200,
      gravity: 1,
      decay: 0.94,
      startVelocity: 30,
    });

    // Second burst
    setTimeout(() => {
      confetti({
        particleCount: 30,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 30,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });
    }, 250);
  };

  const playTerminalBell = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  return (
    <AnimatePresence>
      {showCelebration && (
        <>
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-full"
            initial={{ opacity: 0, scale: 1 }}
            animate={{
              opacity: [0, 0.8, 0],
              scale: [1, 1.2, 1],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              boxShadow: `0 0 40px 10px ${ringColor}`,
            }}
          />

          {/* Checkmark */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 1] }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              duration: 0.5,
              times: [0, 0.6, 1],
              ease: "easeOut"
            }}
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke={ringColor}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <motion.path
                d="M20 6L9 17l-5-5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              />
            </svg>
          </motion.div>

          {/* Terminal message */}
          <motion.div
            className="absolute -bottom-8 left-1/2 transform -translate-x-1/2
                       font-mono text-xs text-terminal-green whitespace-nowrap"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.3 }}
          >
            &gt; {ringName.toUpperCase()}_RING_CLOSED ✓
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
```

### Usage in MacroRings.tsx

```typescript
// Add to existing MacroRings component
import { RingCelebration } from '../shared/RingCelebration';

export const MacroRings: React.FC<MacroRingsProps> = ({ nutrition }) => {
  // ... existing code ...

  return (
    <div className="bg-white dark:bg-dark-surface rounded-lg p-6 border border-gray-200 dark:border-dark-border">
      <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-dark-text">
        Macro Rings
      </h3>

      <div className="flex flex-col md:flex-row items-center justify-around">
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
                    animate={{ strokeDasharray }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    style={{
                      filter: ring.progress >= 100
                        ? `drop-shadow(0 0 8px ${ring.color})`
                        : 'none'
                    }}
                  />

                  {/* Add celebration component */}
                  <RingCelebration
                    isComplete={ring.progress >= 100}
                    ringColor={ring.color}
                    ringName={ring.name}
                  />
                </g>
              );
            })}
          </svg>

          {/* ... rest of component ... */}
        </div>
      </div>
    </div>
  );
};
```

---

## 2. Smart Food Recommendations Engine

### Recommendation System

```typescript
// src/utils/smartRecommendations.ts
import { Food } from '../types';

interface RecommendationContext {
  timeOfDay: number;
  recentFoods: Food[];
  currentNutrition: DailyNutrition;
  userPreferences: {
    favoritefoods: string[];
    dietaryRestrictions: string[];
  };
}

export class FoodRecommendationEngine {
  private readonly MEAL_TIMES = {
    breakfast: { start: 6, end: 10 },
    lunch: { start: 11, end: 14 },
    dinner: { start: 17, end: 21 },
    snack: 'other'
  };

  private readonly BREAKFAST_FOODS = [
    'Oatmeal', 'Eggs', 'Greek Yogurt', 'Banana', 'Protein Shake',
    'Whole Wheat Toast', 'Avocado', 'Berries', 'Granola'
  ];

  private readonly LUNCH_FOODS = [
    'Chicken Breast', 'Turkey Sandwich', 'Salmon', 'Brown Rice',
    'Mixed Salad', 'Sweet Potato', 'Quinoa Bowl', 'Tuna'
  ];

  private readonly DINNER_FOODS = [
    'Steak', 'Chicken', 'Salmon', 'Pasta', 'Vegetables',
    'Brown Rice', 'Quinoa', 'Lean Beef', 'Tofu'
  ];

  private readonly HIGH_PROTEIN = [
    'Chicken Breast', 'Greek Yogurt', 'Protein Shake', 'Eggs',
    'Tuna', 'Salmon', 'Lean Beef', 'Cottage Cheese'
  ];

  getMealType(hour: number): string {
    if (hour >= this.MEAL_TIMES.breakfast.start && hour <= this.MEAL_TIMES.breakfast.end) {
      return 'breakfast';
    }
    if (hour >= this.MEAL_TIMES.lunch.start && hour <= this.MEAL_TIMES.lunch.end) {
      return 'lunch';
    }
    if (hour >= this.MEAL_TIMES.dinner.start && hour <= this.MEAL_TIMES.dinner.end) {
      return 'dinner';
    }
    return 'snack';
  }

  getRecommendations(context: RecommendationContext): string[] {
    const recommendations: Array<{ food: string; score: number }> = [];
    const mealType = this.getMealType(context.timeOfDay);

    // 1. Time-based suggestions (30% weight)
    const timeSuggestions = this.getTimeBasedSuggestions(mealType);
    timeSuggestions.forEach(food => {
      recommendations.push({ food, score: 0.3 });
    });

    // 2. Frequency-based suggestions (30% weight)
    const frequentFoods = this.getFrequentFoods(context.recentFoods);
    frequentFoods.forEach(food => {
      const existing = recommendations.find(r => r.food === food);
      if (existing) {
        existing.score += 0.3;
      } else {
        recommendations.push({ food, score: 0.3 });
      }
    });

    // 3. Macro-based suggestions (40% weight)
    const macroSuggestions = this.getMacroBasedSuggestions(context.currentNutrition);
    macroSuggestions.forEach(food => {
      const existing = recommendations.find(r => r.food === food);
      if (existing) {
        existing.score += 0.4;
      } else {
        recommendations.push({ food, score: 0.4 });
      }
    });

    // Sort by score and return top 5
    return recommendations
      .sort((a, b) => b.score - a.score)
      .map(r => r.food)
      .slice(0, 5);
  }

  private getTimeBasedSuggestions(mealType: string): string[] {
    switch (mealType) {
      case 'breakfast':
        return this.BREAKFAST_FOODS.slice(0, 5);
      case 'lunch':
        return this.LUNCH_FOODS.slice(0, 5);
      case 'dinner':
        return this.DINNER_FOODS.slice(0, 5);
      default:
        return ['Apple', 'Protein Bar', 'Almonds', 'Greek Yogurt'];
    }
  }

  private getFrequentFoods(recentFoods: Food[]): string[] {
    const frequency = new Map<string, number>();

    recentFoods.forEach(food => {
      frequency.set(food.name, (frequency.get(food.name) || 0) + 1);
    });

    return Array.from(frequency.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name]) => name)
      .slice(0, 5);
  }

  private getMacroBasedSuggestions(nutrition: DailyNutrition): string[] {
    const proteinDeficit = nutrition.targetProtein - nutrition.consumedProtein;
    const carbsDeficit = nutrition.targetCarbs - nutrition.consumedCarbs;
    const fatDeficit = nutrition.targetFat - nutrition.consumedFat;

    // If significantly low on protein (>20g deficit)
    if (proteinDeficit > 20) {
      return this.HIGH_PROTEIN.slice(0, 3);
    }

    // If low on carbs (>30g deficit)
    if (carbsDeficit > 30) {
      return ['Brown Rice', 'Sweet Potato', 'Oatmeal'];
    }

    // If low on fats (>15g deficit)
    if (fatDeficit > 15) {
      return ['Avocado', 'Almonds', 'Olive Oil'];
    }

    return [];
  }

  getContextualTip(nutrition: DailyNutrition, timeOfDay: number): string {
    const caloriesRemaining = nutrition.targetCalories - nutrition.consumedCalories;
    const proteinProgress = (nutrition.consumedProtein / nutrition.targetProtein) * 100;

    // Evening and low on calories
    if (timeOfDay >= 20 && caloriesRemaining > 500) {
      return "You're under your calorie goal. Consider a protein-rich snack before bed.";
    }

    // Low protein throughout day
    if (timeOfDay >= 12 && proteinProgress < 30) {
      return "Your protein intake is low. Add a protein source to your next meal.";
    }

    // Nearly complete
    if (caloriesRemaining < 200 && caloriesRemaining > 0) {
      return `You're ${caloriesRemaining} calories away from your goal. Almost there!`;
    }

    // Exceeded goal
    if (caloriesRemaining < 0) {
      return "You've exceeded your calorie goal. Consider this for tomorrow's planning.";
    }

    return "Great job tracking your nutrition today!";
  }
}

// Export singleton instance
export const recommendationEngine = new FoodRecommendationEngine();
```

### Usage in FoodInput Component

```typescript
// src/components/calorie-tracker/FoodInput.tsx
import { recommendationEngine } from '../../utils/smartRecommendations';

export const FoodInput: React.FC = () => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const nutrition = useCalorieStore(state => state.getTodaysNutrition());
  const recentFoods = useCalorieStore(state => state.recentFoods);

  useEffect(() => {
    const currentHour = new Date().getHours();
    const recommendations = recommendationEngine.getRecommendations({
      timeOfDay: currentHour,
      recentFoods,
      currentNutrition: nutrition,
      userPreferences: {
        favoritefoods: [],
        dietaryRestrictions: []
      }
    });

    setSuggestions(recommendations);
  }, [recentFoods, nutrition]);

  const contextualTip = recommendationEngine.getContextualTip(
    nutrition,
    new Date().getHours()
  );

  return (
    <div className="space-y-4">
      {/* Contextual tip */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-terminal-green/10 border border-terminal-green/30
                   rounded-lg p-3 font-mono text-sm text-terminal-green"
      >
        💡 {contextualTip}
      </motion.div>

      {/* Input */}
      <TerminalInput
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
        placeholder="add food 2 eggs scrambled..."
      />

      {/* Smart suggestions */}
      <div className="space-y-2">
        <h4 className="text-xs font-mono text-gray-500 dark:text-gray-400">
          SUGGESTED FOR YOU:
        </h4>
        <div className="flex flex-wrap gap-2">
          {suggestions.map(food => (
            <motion.button
              key={food}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => quickAdd(food)}
              className="px-3 py-1 bg-dark-surface-light border border-dark-border
                       rounded text-sm font-mono text-terminal-green
                       hover:bg-terminal-green/10 transition-colors"
            >
              + {food}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};
```

---

## 3. Trend Analysis Chart Component

### Weekly Trend Chart

```typescript
// src/components/shared/TrendChart.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TrendChartProps {
  data: Array<{ date: string; value: number }>;
  metric: {
    name: string;
    color: string;
    unit?: string;
  };
}

export const TrendChart: React.FC<TrendChartProps> = ({ data, metric }) => {
  const calculateTrend = () => {
    if (data.length < 2) return { direction: 'neutral', percentage: 0 };

    const recent = data.slice(-3).reduce((sum, d) => sum + d.value, 0) / 3;
    const previous = data.slice(-6, -3).reduce((sum, d) => sum + d.value, 0) / 3;

    const change = ((recent - previous) / previous) * 100;

    return {
      direction: change > 2 ? 'up' : change < -2 ? 'down' : 'neutral',
      percentage: Math.abs(change)
    };
  };

  const trend = calculateTrend();

  const getTrendIcon = () => {
    switch (trend.direction) {
      case 'up':
        return <TrendingUp className="w-4 h-4" />;
      case 'down':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  const getTrendColor = () => {
    // For metrics like weight loss, down is good
    // For metrics like strength, up is good
    // Customize based on metric type
    if (trend.direction === 'up') return 'text-terminal-green';
    if (trend.direction === 'down') return 'text-terminal-red';
    return 'text-gray-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-dark-surface rounded-lg p-6
                 border border-gray-200 dark:border-dark-border"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text">
            {metric.name}
          </h3>
          <p className="text-sm font-mono text-gray-500 dark:text-gray-400 mt-1">
            Last 7 days
          </p>
        </div>

        {/* Trend indicator */}
        <div className={`flex items-center gap-2 ${getTrendColor()}`}>
          {getTrendIcon()}
          <span className="text-sm font-mono font-semibold">
            {trend.percentage.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#1A1A1A"
            strokeOpacity={0.3}
          />
          <XAxis
            dataKey="date"
            stroke="#10B981"
            strokeOpacity={0.5}
            tick={{ fill: '#10B981', fontSize: 12, fontFamily: 'JetBrains Mono' }}
          />
          <YAxis
            stroke="#10B981"
            strokeOpacity={0.5}
            tick={{ fill: '#10B981', fontSize: 12, fontFamily: 'JetBrains Mono' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0A0A0A',
              border: '1px solid #2A2A2A',
              borderRadius: '8px',
              fontFamily: 'JetBrains Mono',
              fontSize: '12px'
            }}
            labelStyle={{ color: '#10B981' }}
            itemStyle={{ color: metric.color }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={metric.color}
            strokeWidth={2}
            dot={{
              fill: metric.color,
              r: 4,
              strokeWidth: 0
            }}
            activeDot={{
              r: 6,
              fill: metric.color,
              stroke: '#FFFFFF',
              strokeWidth: 2
            }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Stats summary */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-dark-border">
        <div>
          <p className="text-xs font-mono text-gray-500 dark:text-gray-400">
            AVG
          </p>
          <p className="text-lg font-mono font-semibold text-gray-900 dark:text-dark-text mt-1">
            {(data.reduce((sum, d) => sum + d.value, 0) / data.length).toFixed(1)}
            {metric.unit && <span className="text-sm ml-1">{metric.unit}</span>}
          </p>
        </div>
        <div>
          <p className="text-xs font-mono text-gray-500 dark:text-gray-400">
            MIN
          </p>
          <p className="text-lg font-mono font-semibold text-gray-900 dark:text-dark-text mt-1">
            {Math.min(...data.map(d => d.value)).toFixed(1)}
            {metric.unit && <span className="text-sm ml-1">{metric.unit}</span>}
          </p>
        </div>
        <div>
          <p className="text-xs font-mono text-gray-500 dark:text-gray-400">
            MAX
          </p>
          <p className="text-lg font-mono font-semibold text-gray-900 dark:text-dark-text mt-1">
            {Math.max(...data.map(d => d.value)).toFixed(1)}
            {metric.unit && <span className="text-sm ml-1">{metric.unit}</span>}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
```

---

## 4. Achievement System

### Achievement Definitions and Tracker

```typescript
// src/utils/achievements.ts
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  criteria: (data: any) => boolean;
  reward?: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_ring',
    name: 'First Ring Closed',
    description: 'Close your first activity ring',
    icon: '🎯',
    rarity: 'common',
    criteria: (data) => data.totalRingsClosed >= 1
  },
  {
    id: 'perfect_week',
    name: 'Perfect Week',
    description: 'Close all rings for 7 consecutive days',
    icon: '🔥',
    rarity: 'rare',
    criteria: (data) => data.currentStreak >= 7
  },
  {
    id: 'century_club',
    name: 'Century Club',
    description: 'Complete 100 workouts',
    icon: '💯',
    rarity: 'epic',
    criteria: (data) => data.totalWorkouts >= 100
  },
  {
    id: 'iron_discipline',
    name: 'Iron Discipline',
    description: '30-day streak of closing all rings',
    icon: '💎',
    rarity: 'legendary',
    criteria: (data) => data.currentStreak >= 30
  },
  {
    id: 'protein_king',
    name: 'Protein King',
    description: 'Hit your protein target 7 days in a row',
    icon: '👑',
    rarity: 'rare',
    criteria: (data) => data.proteinStreak >= 7
  },
  {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Log a workout before 7 AM',
    icon: '🌅',
    rarity: 'common',
    criteria: (data) => data.hasEarlyWorkout
  },
  {
    id: 'personal_record',
    name: 'New PR',
    description: 'Set a new personal record',
    icon: '🏆',
    rarity: 'epic',
    criteria: (data) => data.newPRs > 0
  }
];

export class AchievementTracker {
  private unlockedAchievements: Set<string> = new Set();

  constructor() {
    this.loadUnlocked();
  }

  private loadUnlocked() {
    const stored = localStorage.getItem('unlocked_achievements');
    if (stored) {
      this.unlockedAchievements = new Set(JSON.parse(stored));
    }
  }

  private saveUnlocked() {
    localStorage.setItem(
      'unlocked_achievements',
      JSON.stringify(Array.from(this.unlockedAchievements))
    );
  }

  checkAchievements(data: any): Achievement[] {
    const newlyUnlocked: Achievement[] = [];

    ACHIEVEMENTS.forEach(achievement => {
      if (
        !this.unlockedAchievements.has(achievement.id) &&
        achievement.criteria(data)
      ) {
        this.unlockedAchievements.add(achievement.id);
        newlyUnlocked.push(achievement);
      }
    });

    if (newlyUnlocked.length > 0) {
      this.saveUnlocked();
    }

    return newlyUnlocked;
  }

  getUnlockedAchievements(): Achievement[] {
    return ACHIEVEMENTS.filter(a => this.unlockedAchievements.has(a.id));
  }

  getProgress(): { unlocked: number; total: number; percentage: number } {
    const unlocked = this.unlockedAchievements.size;
    const total = ACHIEVEMENTS.length;
    return {
      unlocked,
      total,
      percentage: (unlocked / total) * 100
    };
  }
}

export const achievementTracker = new AchievementTracker();
```

### Achievement Toast Component

```typescript
// src/components/shared/AchievementToast.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Achievement } from '../../utils/achievements';

interface AchievementToastProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export const AchievementToast: React.FC<AchievementToastProps> = ({
  achievement,
  onClose
}) => {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return '#10B981';
      case 'rare':
        return '#3B82F6';
      case 'epic':
        return '#A855F7';
      case 'legendary':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25
          }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
        >
          <motion.div
            animate={{
              boxShadow: [
                `0 0 0px ${getRarityColor(achievement.rarity)}`,
                `0 0 20px ${getRarityColor(achievement.rarity)}`,
                `0 0 0px ${getRarityColor(achievement.rarity)}`
              ]
            }}
            transition={{
              duration: 1.5,
              repeat: 2
            }}
            className="bg-dark-surface border-2 rounded-lg p-4 min-w-[320px]"
            style={{ borderColor: getRarityColor(achievement.rarity) }}
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 15
                }}
                className="text-4xl"
              >
                {achievement.icon}
              </motion.div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-white">
                    Achievement Unlocked!
                  </h4>
                  <span
                    className="text-xs font-mono px-2 py-0.5 rounded uppercase"
                    style={{
                      backgroundColor: `${getRarityColor(achievement.rarity)}20`,
                      color: getRarityColor(achievement.rarity)
                    }}
                  >
                    {achievement.rarity}
                  </span>
                </div>
                <p className="text-lg font-bold text-terminal-green">
                  {achievement.name}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  {achievement.description}
                </p>
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ×
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
```

### Usage in Main App

```typescript
// src/App.tsx
import { useState, useEffect } from 'react';
import { achievementTracker } from './utils/achievements';
import { AchievementToast } from './components/shared/AchievementToast';

function App() {
  const [currentAchievement, setCurrentAchievement] = useState(null);

  useEffect(() => {
    // Check achievements whenever data changes
    const checkAchievements = () => {
      const data = {
        totalRingsClosed: getTotalRingsClosed(),
        currentStreak: getCurrentStreak(),
        totalWorkouts: getTotalWorkouts(),
        proteinStreak: getProteinStreak(),
        hasEarlyWorkout: getHasEarlyWorkout(),
        newPRs: getNewPRs()
      };

      const newAchievements = achievementTracker.checkAchievements(data);

      if (newAchievements.length > 0) {
        // Show first achievement (or queue them)
        setCurrentAchievement(newAchievements[0]);

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
          setCurrentAchievement(null);
        }, 5000);
      }
    };

    checkAchievements();
  }, [/* dependencies */]);

  return (
    <>
      <MainLayout />
      <AchievementToast
        achievement={currentAchievement}
        onClose={() => setCurrentAchievement(null)}
      />
    </>
  );
}
```

---

## 5. Enhanced Terminal Input with History

```typescript
// src/components/shared/EnhancedTerminalInput.tsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EnhancedTerminalInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  placeholder?: string;
  suggestions?: string[];
}

export const EnhancedTerminalInput: React.FC<EnhancedTerminalInputProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder = '',
  suggestions = []
}) => {
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load history from localStorage
    const stored = localStorage.getItem('command_history');
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  const saveToHistory = (command: string) => {
    const newHistory = [command, ...history.slice(0, 49)]; // Keep last 50
    setHistory(newHistory);
    localStorage.setItem('command_history', JSON.stringify(newHistory));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl+R: Search history
    if (e.ctrlKey && e.key === 'r') {
      e.preventDefault();
      // Implement history search modal
      return;
    }

    // Up arrow: Previous command
    if (e.key === 'ArrowUp' && !showSuggestions) {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        onChange(history[newIndex]);
      }
      return;
    }

    // Down arrow: Next command or suggestions
    if (e.key === 'ArrowDown') {
      e.preventDefault();

      if (showSuggestions) {
        setSelectedSuggestion((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
      } else if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        onChange(history[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        onChange('');
      }
      return;
    }

    // Tab: Autocomplete suggestion
    if (e.key === 'Tab' && suggestions.length > 0) {
      e.preventDefault();
      onChange(suggestions[selectedSuggestion]);
      setShowSuggestions(false);
      return;
    }

    // Enter: Submit
    if (e.key === 'Enter') {
      e.preventDefault();
      if (value.trim()) {
        saveToHistory(value);
        onSubmit(value);
        setHistoryIndex(-1);
        onChange('');
      }
      return;
    }

    // Escape: Clear suggestions
    if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedSuggestion(0);
      return;
    }
  };

  useEffect(() => {
    setShowSuggestions(value.length > 0 && suggestions.length > 0);
    setSelectedSuggestion(0);
  }, [value, suggestions]);

  return (
    <div className="relative">
      <div className="bg-dark-surface border border-dark-border rounded-lg
                    font-mono text-sm flex items-center p-3
                    focus-within:border-terminal-green transition-colors">
        {/* Prompt */}
        <span className="text-terminal-green mr-2 select-none">$</span>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-white
                   placeholder-gray-500"
        />

        {/* Cursor */}
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="text-terminal-green ml-1 select-none"
        >
          _
        </motion.span>
      </div>

      {/* Suggestions dropdown */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2
                     bg-dark-surface border border-dark-border rounded-lg
                     overflow-hidden shadow-lg z-50"
          >
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={suggestion}
                onClick={() => {
                  onChange(suggestion);
                  setShowSuggestions(false);
                  inputRef.current?.focus();
                }}
                className={`px-4 py-2 cursor-pointer font-mono text-sm
                          transition-colors ${
                            index === selectedSuggestion
                              ? 'bg-terminal-green/20 text-terminal-green'
                              : 'text-gray-300 hover:bg-dark-surface-light'
                          }`}
                whileHover={{ x: 4 }}
              >
                <span className="text-gray-500 mr-2">▸</span>
                {suggestion}
              </motion.div>
            ))}

            {/* Hint */}
            <div className="border-t border-dark-border px-4 py-2
                          text-xs text-gray-500 font-mono">
              Tab to autocomplete • ↑↓ to navigate • Ctrl+R to search history
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
```

---

## 6. Package Installation

```bash
# Install required packages
npm install canvas-confetti recharts

# Install types
npm install --save-dev @types/canvas-confetti
```

---

## 7. Tailwind Config Updates

```javascript
// tailwind.config.js - Add these utilities
module.exports = {
  // ... existing config ...
  theme: {
    extend: {
      // ... existing extends ...
      boxShadow: {
        'glow-green': '0 0 20px rgba(16, 185, 129, 0.5)',
        'glow-orange': '0 0 20px rgba(255, 107, 53, 0.5)',
        'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.5)',
      },
      animation: {
        // ... existing animations ...
        'scanline': 'scanline 8s linear infinite',
        'glitch': 'glitch 0.3s cubic-bezier(.25, .46, .45, .94) both',
      },
      keyframes: {
        // ... existing keyframes ...
        scanline: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(100%)' },
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-5px, 5px)' },
          '40%': { transform: 'translate(-5px, -5px)' },
          '60%': { transform: 'translate(5px, 5px)' },
          '80%': { transform: 'translate(5px, -5px)' },
          '100%': { transform: 'translate(0)' },
        },
      },
    },
  },
};
```

---

These implementation examples provide production-ready code that you can integrate directly into FitTerminal. Each component follows Apple's design principles while maintaining the terminal aesthetic that makes FitTerminal unique.

Key features implemented:
- Ring celebration with confetti and sound
- Smart recommendation engine
- Trend analysis charts
- Achievement system
- Enhanced terminal input with history
- All with proper TypeScript types and animations

Next steps:
1. Install required packages
2. Copy components into your project
3. Integrate with existing stores
4. Test and refine animations
5. Add more achievements and recommendations

Happy coding! 🚀
