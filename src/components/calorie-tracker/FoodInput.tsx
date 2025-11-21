import React from 'react';
import { Plus } from 'lucide-react';
import { TerminalInput } from '../shared/TerminalInput';
import { Button } from '../shared/Button';

interface FoodInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  suggestions?: string[];
  onSuggestionSelect?: (suggestion: string) => void;
  error?: string;
  isSubmitting?: boolean;
}

export const FoodInput: React.FC<FoodInputProps> = ({
  value,
  onChange,
  onSubmit,
  suggestions = [],
  onSuggestionSelect,
  error,
  isSubmitting = false,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex space-x-2">
        <div className="flex-1">
          <label htmlFor="food-input" className="sr-only">
            Add food entry
          </label>
          <TerminalInput
            id="food-input"
            value={value}
            onChange={onChange}
            onSubmit={onSubmit}
            placeholder="Enter food (e.g., '2 eggs, toast with butter' or 'chicken breast 200g')"
            prompt="food>"
            autoFocus
            suggestions={suggestions}
            onSuggestionSelect={onSuggestionSelect}
          />
        </div>
        <Button
          onClick={onSubmit}
          variant="terminal"
          className="flex items-center space-x-2"
          aria-label="Add food entry"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin">⏳</span>
              <span className="hidden sm:inline">Adding...</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add</span>
            </>
          )}
        </Button>
      </div>
      {error && (
        <div className="text-sm text-fitness-error font-sans flex items-center space-x-2">
          <span>⚠</span>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};