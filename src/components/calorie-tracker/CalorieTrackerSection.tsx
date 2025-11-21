import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Coffee, Sparkles } from 'lucide-react';
import { useCalorieStore } from '../../stores';
import { TerminalInput } from '../shared/TerminalInput';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { FoodInput } from './FoodInput';
import { MacroRings } from './MacroRings';
import { FoodHistory } from './FoodHistory';
import { DailySummary } from './DailySummary';
import { parseFoodInput, searchFoods, validateFoodInput } from '../../utils/foodParser';
import { parseFoodWithChatGPT } from '../../services/chatgpt';

interface CalorieTrackerSectionProps {
  compact?: boolean;
}

export const CalorieTrackerSection: React.FC<CalorieTrackerSectionProps> = ({ compact = false }) => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUsingAI, setIsUsingAI] = useState(false);
  const [showClarification, setShowClarification] = useState(false);
  const [failedInput, setFailedInput] = useState('');
  const todaysFoods = useCalorieStore((state) => state.todaysFoods);
  const recentFoods = useCalorieStore((state) => state.recentFoods);
  const addFood = useCalorieStore((state) => state.addFood);
  const removeFood = useCalorieStore((state) => state.removeFood);
  const getTodaysNutrition = useCalorieStore((state) => state.getTodaysNutrition);
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
    setIsUsingAI(false);

    const parsedFoods = parseFoodInput(input);

    // Check if this is a manual calorie entry
    const hasManualCalories = parsedFoods.some(p => p.calories);

    if (hasManualCalories) {
      // Handle manual calorie entries (e.g., "custom meal 350cal")
      parsedFoods.forEach((parsed) => {
        if (parsed.calories) {
          addFood({
            name: parsed.name,
            calories: parsed.calories,
            protein: 0,
            carbs: 0,
            fat: 0,
            serving: '1 serving',
          });
        }
      });

      setInput('');
      setError('');
      setIsSubmitting(false);
      return;
    }

    // All food parsing goes through ChatGPT (no local database)
    // Call ChatGPT ONCE with the full input (not in a loop)
    setIsUsingAI(true);

    try {
      const aiResult = await parseFoodWithChatGPT(input);

      if (aiResult) {
        // Successfully parsed with ChatGPT
        addFood({
          name: aiResult.name,
          calories: aiResult.calories,
          protein: aiResult.protein,
          carbs: aiResult.carbs,
          fat: aiResult.fat,
          serving: aiResult.serving,
          source: aiResult.source, // Include source citation
        });

        // Show success indicator with source
        if (aiResult.source) {
          console.log(`✨ Parsed with AI (${aiResult.confidence} confidence) - Source: ${aiResult.source}`);
        } else {
          console.log(`✨ Parsed with AI (${aiResult.confidence} confidence):`, aiResult.name);
        }
      } else {
        // ChatGPT couldn't parse - ask for clarification
        setFailedInput(input);
        setShowClarification(true);
        setError('');
        setIsSubmitting(false);
        setIsUsingAI(false);
        return;
      }
    } catch (error) {
      // API error (likely missing API key or network issue)
      console.error('ChatGPT API error:', error);

      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(`ChatGPT API error: ${errorMessage}. Check your API key in .env file.`);
      setIsSubmitting(false);
      setIsUsingAI(false);
      return;
    }

    setIsUsingAI(false);
    setInput('');
    setError('');
    setIsSubmitting(false);
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setInput(suggestion);
    setSuggestions([]);
    handleAddFood();
  };

  const handleClarificationSubmit = async (clarification: string) => {
    if (!clarification.trim()) {
      setError('Please provide more details');
      return;
    }

    // Combine original input with clarification
    const enhancedInput = `${failedInput}. ${clarification}`;

    setShowClarification(false);
    setIsSubmitting(true);
    setIsUsingAI(true);

    try {
      const aiResult = await parseFoodWithChatGPT(enhancedInput);

      if (aiResult) {
        // Successfully parsed with additional context
        addFood({
          name: aiResult.name,
          calories: aiResult.calories,
          protein: aiResult.protein,
          carbs: aiResult.carbs,
          fat: aiResult.fat,
          serving: aiResult.serving,
          source: aiResult.source,
        });

        if (aiResult.source) {
          console.log(`✨ Parsed with AI after clarification (${aiResult.confidence} confidence) - Source: ${aiResult.source}`);
        } else {
          console.log(`✨ Parsed with AI after clarification (${aiResult.confidence} confidence):`, aiResult.name);
        }

        setInput('');
        setFailedInput('');
      } else {
        // Still couldn't parse - show final error
        setError(`Still couldn't recognize the food. Try using: "custom meal 350cal"`);
      }
    } catch (error) {
      console.error('ChatGPT API error on retry:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(`ChatGPT API error: ${errorMessage}`);
    }

    setIsSubmitting(false);
    setIsUsingAI(false);
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
          {isUsingAI && (
            <div className="mt-1 text-xs text-primary font-sans flex items-center space-x-1">
              <Sparkles className="w-3 h-3 animate-pulse" />
              <span>Analyzing with AI...</span>
            </div>
          )}
          {error && !isUsingAI && (
            <div className="mt-1 text-xs text-fitness-error font-sans">
              ⚠ {error}
            </div>
          )}
          {showClarification && (
            <div className="mt-2 p-2 bg-primary/10 dark:bg-primary/20 rounded">
              <div className="text-xs text-gray-700 dark:text-gray-300 mb-2">
                Couldn't recognize "{failedInput}". Add details:
              </div>
              <TerminalInput
                value={input}
                onChange={setInput}
                onSubmit={() => handleClarificationSubmit(input)}
                placeholder="e.g., brand name, size..."
                prompt=">"
              />
              <div className="mt-1 flex space-x-1">
                <button
                  onClick={() => handleClarificationSubmit(input)}
                  disabled={!input.trim()}
                  className="flex-1 px-2 py-1 text-xs bg-primary text-white rounded hover:bg-primary-dark disabled:opacity-50"
                >
                  Retry
                </button>
                <button
                  onClick={() => {
                    setShowClarification(false);
                    setInput('');
                    setFailedInput('');
                  }}
                  className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
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
        {isUsingAI && (
          <div className="mt-3 p-3 bg-primary/10 dark:bg-primary/20 rounded-lg">
            <div className="flex items-center space-x-2 text-sm text-primary font-sans">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>Analyzing food with AI...</span>
            </div>
          </div>
        )}

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

      {/* Clarification Prompt */}
      {showClarification && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-2">
                  Need More Details
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  I couldn't recognize "<span className="font-semibold text-gray-900 dark:text-dark-text">{failedInput}</span>".
                  Can you provide more details to help me understand?
                </p>
              </div>

              <div>
                <label htmlFor="clarification-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Additional details (e.g., brand name, preparation method, serving size):
                </label>
                <TerminalInput
                  id="clarification-input"
                  value={input}
                  onChange={setInput}
                  onSubmit={() => handleClarificationSubmit(input)}
                  placeholder="e.g., 'it's a McDonald's burger' or 'grilled chicken, about 6oz'"
                  prompt=">"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => handleClarificationSubmit(input)}
                  disabled={!input.trim() || isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? 'Retrying...' : 'Retry with Details'}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowClarification(false);
                    setInput('');
                    setFailedInput('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

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