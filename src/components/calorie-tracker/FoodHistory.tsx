import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Edit2, Clock, ExternalLink } from 'lucide-react';
import type { Food } from '../../types';
import { formatRelativeTime } from '../../utils/calculations';
import { Card } from '../shared/Card';

interface FoodHistoryProps {
  foods: Food[];
  onRemove: (id: string) => void;
  onEdit?: (id: string, updates: Partial<Food>) => void;
}

export const FoodHistory: React.FC<FoodHistoryProps> = ({ foods, onRemove, onEdit }) => {
  if (foods.length === 0) {
    return (
      <Card>
        <div className="text-center py-8">
          <div className="text-gray-400 dark:text-gray-600 font-sans">
            No foods logged today
          </div>
          <div className="text-sm text-gray-400 dark:text-gray-600 mt-2">
            Start by adding your first meal
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text">
          Today's Food
        </h3>
        <div className="text-sm font-sans text-gray-500 dark:text-gray-400">
          {foods.length} items
        </div>
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {foods.map((food, index) => (
            <motion.div
              key={food.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              className="group flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-surface-light hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900 dark:text-dark-text">
                    {food.name}
                  </span>
                  {food.serving && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      ({food.serving})
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-4 mt-1 text-xs">
                  <span className="font-sans text-fitness-calories">
                    {food.calories} cal
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    P: {Math.round(food.protein)}g
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    C: {Math.round(food.carbs)}g
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    F: {Math.round(food.fat)}g
                  </span>
                  <span className="flex items-center space-x-1 text-gray-400 dark:text-gray-600">
                    <Clock className="w-3 h-3" />
                    <span>{formatRelativeTime(new Date(food.timestamp))}</span>
                  </span>
                  {food.source && (
                    <span className="flex items-center space-x-1 text-primary">
                      <ExternalLink className="w-3 h-3" />
                      <span className="font-medium">{food.source}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {onEdit && (
                  <button
                    onClick={() => onEdit(food.id, food)}
                    className="p-3 md:p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                    aria-label="Edit food"
                  >
                    <Edit2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>
                )}
                <button
                  onClick={() => onRemove(food.id)}
                  className="p-3 md:p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
                  aria-label="Remove food"
                >
                  <Trash2 className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-fitness-error" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Total summary */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between font-semibold">
          <span className="text-gray-900 dark:text-dark-text">Total</span>
          <div className="flex items-center space-x-4 text-sm">
            <span className="font-sans text-fitness-calories">
              {foods.reduce((sum, f) => sum + f.calories, 0)} cal
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              P: {Math.round(foods.reduce((sum, f) => sum + f.protein, 0))}g
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              C: {Math.round(foods.reduce((sum, f) => sum + f.carbs, 0))}g
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              F: {Math.round(foods.reduce((sum, f) => sum + f.fat, 0))}g
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};