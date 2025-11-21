import React from 'react';
import { Dumbbell } from 'lucide-react';
import { TerminalInput } from '../shared/TerminalInput';
import { Button } from '../shared/Button';

interface WorkoutInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  error?: string;
  isSubmitting?: boolean;
}

export const WorkoutInput: React.FC<WorkoutInputProps> = ({
  value,
  onChange,
  onSubmit,
  error,
  isSubmitting = false,
}) => {
  const suggestions = [
    'Push day: bench 3x8 @185, ohp 4x6 @95',
    'Pull day: pullups 4x8, rows 4x10',
    'Legs: squats 5x5 heavy, leg press 3x12',
    '30 min run',
    'Full body: squats, bench, rows, ohp',
  ];

  const relevantSuggestions = value.length > 2
    ? suggestions.filter(s => s.toLowerCase().includes(value.toLowerCase())).slice(0, 3)
    : [];

  return (
    <div className="space-y-3">
      <div className="flex space-x-2">
        <div className="flex-1">
          <label htmlFor="workout-input" className="sr-only">
            Log workout
          </label>
          <TerminalInput
            id="workout-input"
            value={value}
            onChange={onChange}
            onSubmit={onSubmit}
            placeholder="Enter workout (e.g., 'Push day: bench 3x8 @185lbs, ohp 4x6 @95lbs')"
            prompt="workout>"
            autoFocus
            suggestions={relevantSuggestions}
            onSuggestionSelect={(suggestion) => {
              onChange(suggestion);
            }}
          />
        </div>
        <Button
          onClick={onSubmit}
          variant="terminal"
          className="flex items-center space-x-2"
          aria-label="Log workout"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin">⏳</span>
              <span className="hidden sm:inline">Logging...</span>
            </>
          ) : (
            <>
              <Dumbbell className="w-4 h-4" />
              <span className="hidden sm:inline">Log</span>
            </>
          )}
        </Button>
      </div>

      {/* Error message */}
      {error && (
        <div className="text-sm text-fitness-error font-sans flex items-center space-x-2">
          <span>⚠</span>
          <span>{error}</span>
        </div>
      )}

      {/* Real-time parsing indicator */}
      {value.length > 3 && !error && (
        <div className="flex items-center space-x-2 text-xs text-fitness-calories">
          <span className="animate-pulse">●</span>
          <span className="font-sans">Parsing workout...</span>
        </div>
      )}
    </div>
  );
};