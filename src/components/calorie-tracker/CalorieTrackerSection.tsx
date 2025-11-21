import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, Search, Coffee } from 'lucide-react';
import { useCalorieStore, useUserStore } from '../../stores';
import { TerminalInput } from '../shared/TerminalInput';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { FoodInput } from './FoodInput';
import { MacroRings } from './MacroRings';
import { FoodHistory } from './FoodHistory';
import { DailySummary } from './DailySummary';
import { parseFoodInput, searchFoods, findFoodInDatabase, validateFoodInput } from '../../utils/foodParser';
import type { Food } from '../../types';

interface CalorieTrackerSectionProps {
  compact?: boolean;
}

export const CalorieTrackerSection: React.FC<CalorieTrackerSectionProps> = ({ compact = false }) => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const todaysFoods = useCalorieStore((state) => state.todaysFoods);
  const recentFoods = useCalorieStore((state) => state.recentFoods);
  const addFood = useCalorieStore((state) => state.addFood);
  const removeFood = useCalorieStore((state) => state.removeFood);
  const getTodaysNutrition = useCalorieStore((state) => state.getTodaysNutrition);
  const preferences = useUserStore((state) => state.preferences);
  const [nutrition, setNutrition] = useState(() => getTodaysNutrition());

  useEffect(() => {
    setNutrition(getTodaysNutrition());
  }, [todaysFoods, getTodaysNutrition]);

  // Generate suggestions based on input
  useEffect(() => {
    // Clear error when user types
    if (error) setError('');

    if (input.length >= 2) {
      const searchResults = searchFoods(input, 5);
      setSuggestions(searchResults.map(f => f.name));
    } else {
      setSuggestions([]);
    }
  }, [input]);

  const handleAddFood = async () => {
    // Validate input first
    const validation = validateFoodInput(input);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid input');
      return;
    }

    setIsSubmitting(true);

    // Simulate async operation for better UX
    await new Promise(resolve => setTimeout(resolve, 300));

    const parsedFoods = parseFoodInput(input);

    parsedFoods.forEach((parsed) => {
      const foodData = findFoodInDatabase(parsed.name);

      if (foodData) {
        // Calculate based on quantity if provided
        const multiplier = parsed.quantity || 1;
        addFood({
          name: parsed.name,
          calories: Math.round(foodData.calories * multiplier),
          protein: Math.round(foodData.protein * multiplier),
          carbs: Math.round(foodData.carbs * multiplier),
          fat: Math.round(foodData.fat * multiplier),
          serving: parsed.quantity ? `${parsed.quantity} ${parsed.unit || 'serving'}` : foodData.serving,
        });
      } else if (parsed.calories) {
        // Custom food with specified calories
        addFood({
          name: parsed.name,
          calories: parsed.calories,
          protein: 0,
          carbs: 0,
          fat: 0,
          serving: '1 serving',
        });
      } else {
        // Unknown food - show error with suggestions
        const similarFoods = searchFoods(parsed.name, 3);
        if (similarFoods.length > 0) {
          const suggestions = similarFoods.map(f => f.name).join(', ');
          setError(`Food "${parsed.name}" not found. Did you mean: ${suggestions}?`);
        } else {
          setError(`Food "${parsed.name}" not recognized. Try: "2 eggs", "chicken breast 200g", or "custom meal 350cal"`);
        }
        setIsSubmitting(false);
        return; // Don't add unknown foods
      }
    });

    setInput('');
    setError('');
    setIsSubmitting(false);
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setInput(suggestion);
    setSuggestions([]);
    handleAddFood();
  };

  // Quick add presets
  const quickAddPresets = [
    { name: 'Breakfast', calories: 350, icon: Coffee },
    { name: 'Lunch', calories: 600, icon: Coffee },
    { name: 'Dinner', calories: 700, icon: Coffee },
    { name: 'Snack', calories: 200, icon: Coffee },
  ];

  if (compact) {
    // Compact view for grid layout
    return (
      <div className="space-y-4">
        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="text-center">
            <div className="text-2xl font-bold font-sans text-fitness-calories">
              {nutrition.consumedCalories}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">calories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold font-sans text-terminal-amber">
              {nutrition.targetCalories - nutrition.consumedCalories}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">remaining</div>
          </div>
        </div>

        {/* Mini macro display */}
        <div className="flex justify-around text-xs">
          <div>
            <span className="font-sans text-blue-500">P:</span> {Math.round(nutrition.consumedProtein)}g
          </div>
          <div>
            <span className="font-sans text-orange-500">C:</span> {Math.round(nutrition.consumedCarbs)}g
          </div>
          <div>
            <span className="font-sans text-yellow-500">F:</span> {Math.round(nutrition.consumedFat)}g
          </div>
        </div>

        {/* Quick input */}
        <div>
          <label htmlFor="food-input-compact" className="sr-only">
            Add food entry
          </label>
          <TerminalInput
            id="food-input-compact"
            value={input}
            onChange={setInput}
            onSubmit={handleAddFood}
            placeholder="add food..."
            prompt=">"
          />
          {error && (
            <div className="mt-1 text-xs text-fitness-error font-sans">
              ⚠ {error}
            </div>
          )}
        </div>

        {/* Recent foods (last 3) */}
        <div className="space-y-1">
          {todaysFoods.slice(0, 3).map((food) => (
            <div
              key={food.id}
              className="flex items-center justify-between p-2 bg-gray-50 dark:bg-dark-surface-light rounded text-xs"
            >
              <span className="font-sans truncate">{food.name}</span>
              <span className="font-sans text-fitness-calories">{food.calories}cal</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Full view
  return (
    <div className="space-y-6">
      {/* Daily Summary and Macro Rings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DailySummary nutrition={nutrition} />
        <MacroRings nutrition={nutrition} />
      </div>

      {/* Food Input */}
      <Card>
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-dark-text">Add Food</h3>
        <FoodInput
          value={input}
          onChange={setInput}
          onSubmit={handleAddFood}
          suggestions={suggestions}
          onSuggestionSelect={handleSuggestionSelect}
          error={error}
          isSubmitting={isSubmitting}
        />

        {/* Quick Add Presets */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
          {quickAddPresets.map((preset) => (
            <Button
              key={preset.name}
              variant="secondary"
              size="sm"
              onClick={() => {
                addFood({
                  name: preset.name,
                  calories: preset.calories,
                  protein: preset.calories * 0.1,
                  carbs: preset.calories * 0.5,
                  fat: preset.calories * 0.05,
                  serving: '1 meal',
                });
              }}
              className="flex items-center justify-center space-x-2"
            >
              <preset.icon className="w-4 h-4" />
              <span>{preset.name}</span>
              <span className="text-xs text-gray-500">({preset.calories}cal)</span>
            </Button>
          ))}
        </div>
      </Card>

      {/* Food History */}
      <FoodHistory
        foods={todaysFoods}
        onRemove={removeFood}
        onEdit={(id, updates) => {
          // TODO: Implement edit functionality
          console.log('Edit food:', id, updates);
        }}
      />

      {/* Recent Foods */}
      {recentFoods.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-dark-text">
            Recent Foods
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {recentFoods.slice(0, 6).map((food, index) => (
              <button
                key={index}
                onClick={() => {
                  addFood({
                    name: food.name,
                    calories: food.calories,
                    protein: food.protein,
                    carbs: food.carbs,
                    fat: food.fat,
                    serving: food.serving,
                  });
                }}
                className="p-2 text-left bg-gray-50 dark:bg-dark-surface-light hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
              >
                <div className="font-sans text-sm truncate">{food.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {food.calories} cal
                </div>
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};