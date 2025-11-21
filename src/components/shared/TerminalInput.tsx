import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TerminalInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  prompt?: string;
  autoFocus?: boolean;
  suggestions?: string[];
  onSuggestionSelect?: (suggestion: string) => void;
  id?: string;
  ariaLabel?: string;
}

export const TerminalInput: React.FC<TerminalInputProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder = 'Enter command...',
  prompt = '>',
  autoFocus = false,
  suggestions = [],
  onSuggestionSelect,
  id,
  ariaLabel,
}) => {
  const [showCursor, setShowCursor] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Blinking cursor effect
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (selectedSuggestion >= 0 && suggestions[selectedSuggestion]) {
        onSuggestionSelect?.(suggestions[selectedSuggestion]);
        setSelectedSuggestion(-1);
      } else {
        onSubmit?.();
      }
    } else if (e.key === 'ArrowUp' && suggestions.length > 0) {
      e.preventDefault();
      setSelectedSuggestion((prev) =>
        prev <= 0 ? suggestions.length - 1 : prev - 1
      );
    } else if (e.key === 'ArrowDown' && suggestions.length > 0) {
      e.preventDefault();
      setSelectedSuggestion((prev) =>
        prev >= suggestions.length - 1 ? 0 : prev + 1
      );
    } else if (e.key === 'Escape') {
      setSelectedSuggestion(-1);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center space-x-2 p-3 md:p-2 bg-light-surface dark:bg-dark-surface rounded-xl modern-border">
        <span className="input-prompt select-none">{prompt}</span>
        <input
          ref={inputRef}
          type="text"
          id={id}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setSelectedSuggestion(-1);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          aria-label={ariaLabel}
          className="flex-1 modern-input text-dark-text dark:text-dark-text bg-transparent outline-none placeholder-gray-500 dark:placeholder-dark-text-tertiary"
        />
        {showCursor && isFocused && (
          <span className="input-prompt animate-cursor-blink">█</span>
        )}
      </div>

      {/* Suggestions dropdown */}
      {suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute z-10 w-full mt-1 bg-white dark:bg-dark-surface rounded-xl modern-border shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => {
                onSuggestionSelect?.(suggestion);
                setSelectedSuggestion(-1);
              }}
              onMouseEnter={() => setSelectedSuggestion(index)}
              className={`w-full text-left px-4 py-3 md:py-2 text-sm hover:bg-gray-100 dark:hover:bg-dark-surface-light transition-colors ${
                selectedSuggestion === index
                  ? 'bg-gray-100 dark:bg-dark-surface-light text-primary font-semibold'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              {suggestion}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
};