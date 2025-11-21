import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Monitor, Maximize2, Home } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useUIStore } from '../../stores';
import { useGlobalKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { CalorieTrackerSection } from '../calorie-tracker/CalorieTrackerSection';
import { CardioTrackerSection } from '../cardio-tracker/CardioTrackerSection';
import { FitnessLoggerSection } from '../fitness-logger/FitnessLoggerSection';
import { Button } from '../shared/Button';

export const MainLayout: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const fullscreenSection = useUIStore((state) => state.fullscreenSection);
  const setFullscreen = useUIStore((state) => state.setFullscreen);
  const [focusedSection, setFocusedSection] = useState<'calorie' | 'cardio' | 'fitness' | null>(null);

  // Global keyboard shortcuts
  useGlobalKeyboardShortcuts(
    undefined, // onSave
    undefined, // onUndo
    undefined, // onSearch
    (section) => setFullscreen(section), // onFullscreen
    (direction) => {
      // Navigate between sections
      const sections = ['calorie', 'cardio', 'fitness'] as const;
      const currentIndex = focusedSection ? sections.indexOf(focusedSection) : -1;

      if (direction === 'right') {
        const nextIndex = (currentIndex + 1) % sections.length;
        setFocusedSection(sections[nextIndex]);
      } else {
        const prevIndex = currentIndex - 1 < 0 ? sections.length - 1 : currentIndex - 1;
        setFocusedSection(sections[prevIndex]);
      }
    }
  );

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="w-5 h-5" />;
      case 'dark':
        return <Moon className="w-5 h-5" />;
      case 'system':
        return <Monitor className="w-5 h-5" />;
    }
  };

  const handleSectionClick = (section: 'calorie' | 'cardio' | 'fitness') => {
    if (fullscreenSection === section) {
      setFullscreen(null);
    } else {
      setFullscreen(section);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-dark-background transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-dark-border bg-white dark:bg-dark-surface">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold font-sans text-primary dark:text-primary">
                FitTerminal
              </h1>
              <span className="text-sm text-gray-500 dark:text-dark-text-tertiary">v1.0.0</span>
            </div>

            <div className="flex items-center space-x-4">
              {/* Keyboard shortcuts hint */}
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500 dark:text-dark-text-secondary">
                <span>Tab: Navigate</span>
                <span>•</span>
                <span>Space: Fullscreen</span>
                <span>•</span>
                <span>Esc: Exit</span>
              </div>

              {/* Theme toggle */}
              <Button
                variant="secondary"
                size="sm"
                onClick={toggleTheme}
                className="flex items-center space-x-2"
                aria-label={`Current theme: ${theme}. Click to toggle theme`}
              >
                {getThemeIcon()}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {!fullscreenSection ? (
            // Grid layout
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {/* Calorie Tracker */}
              <div
                data-section="calorie"
                className={`section-container ${
                  focusedSection === 'calorie' ? 'ring-2 ring-fitness-primary' : ''
                }`}
                onMouseEnter={() => setFocusedSection('calorie')}
                onMouseLeave={() => setFocusedSection(null)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-dark-text">
                    Calorie Tracker
                  </h2>
                  <button
                    onClick={() => handleSectionClick('calorie')}
                    className="p-3 md:p-1 hover:bg-gray-100 dark:hover:bg-dark-surface-light rounded transition-colors"
                    aria-label="Toggle fullscreen for Calorie Tracker"
                  >
                    <Maximize2 className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
                <CalorieTrackerSection compact />
              </div>

              {/* Cardio Tracker */}
              <div
                data-section="cardio"
                className={`section-container ${
                  focusedSection === 'cardio' ? 'ring-2 ring-fitness-secondary' : ''
                }`}
                onMouseEnter={() => setFocusedSection('cardio')}
                onMouseLeave={() => setFocusedSection(null)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-dark-text">
                    Cardio Tracker
                  </h2>
                  <button
                    onClick={() => handleSectionClick('cardio')}
                    className="p-3 md:p-1 hover:bg-gray-100 dark:hover:bg-dark-surface-light rounded transition-colors"
                    aria-label="Toggle fullscreen for Cardio Tracker"
                  >
                    <Maximize2 className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
                <CardioTrackerSection compact />
              </div>

              {/* Fitness Logger */}
              <div
                data-section="fitness"
                className={`section-container ${
                  focusedSection === 'fitness' ? 'ring-2 ring-secondary' : ''
                }`}
                onMouseEnter={() => setFocusedSection('fitness')}
                onMouseLeave={() => setFocusedSection(null)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-dark-text">
                    Fitness Logger
                  </h2>
                  <button
                    onClick={() => handleSectionClick('fitness')}
                    className="p-3 md:p-1 hover:bg-gray-100 dark:hover:bg-dark-surface-light rounded transition-colors"
                    aria-label="Toggle fullscreen for Fitness Logger"
                  >
                    <Maximize2 className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
                <FitnessLoggerSection compact />
              </div>
            </motion.div>
          ) : (
            // Fullscreen section
            <motion.div
              key="fullscreen"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fullscreen-section"
            >
              <div className="h-screen flex flex-col">
                {/* Breadcrumb navigation */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-dark-border bg-white dark:bg-dark-surface">
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-gray-500 dark:text-dark-text-secondary">FitTerminal</span>
                    <span className="text-gray-400 dark:text-gray-600">/</span>
                    <span className="text-primary font-semibold">
                      {fullscreenSection === 'calorie' && 'Calorie Tracker'}
                      {fullscreenSection === 'cardio' && 'Cardio Tracker'}
                      {fullscreenSection === 'fitness' && 'Fitness Logger'}
                    </span>
                  </div>
                  <motion.button
                    onClick={() => setFullscreen(null)}
                    className="p-3 md:p-2 hover:bg-gray-100 dark:hover:bg-dark-surface-light rounded transition-colors group"
                    aria-label="Exit fullscreen and return to dashboard"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <motion.div
                      initial={{ opacity: 0.7 }}
                      whileHover={{ opacity: 1, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Home className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-primary dark:group-hover:text-primary transition-colors" />
                    </motion.div>
                  </motion.button>
                </div>

                {/* Content area */}
                <div className="flex-1 overflow-y-auto p-6">
                  {fullscreenSection === 'calorie' && <CalorieTrackerSection />}
                  {fullscreenSection === 'cardio' && <CardioTrackerSection />}
                  {fullscreenSection === 'fitness' && <FitnessLoggerSection />}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};