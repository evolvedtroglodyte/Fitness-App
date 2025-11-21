import React, { useState } from 'react';
import { Activity, Play, Plus } from 'lucide-react';
import { useCardioStore, useUserStore } from '../../stores';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { TerminalInput } from '../shared/TerminalInput';
import { ActivityCard } from './ActivityCard';
import { StatsGrid } from './StatsGrid';
import type { CardioActivity } from '../../types';
import { formatDistance, formatDuration, calculateCardioCalories } from '../../utils/calculations';

interface CardioTrackerSectionProps {
  compact?: boolean;
}

export const CardioTrackerSection: React.FC<CardioTrackerSectionProps> = ({ compact = false }) => {
  const [input, setInput] = useState('');
  const [quickAddMode, setQuickAddMode] = useState(false);
  const activities = useCardioStore((state) => state.activities);
  const addActivity = useCardioStore((state) => state.addActivity);
  const removeActivity = useCardioStore((state) => state.removeActivity);
  const getWeeklyStats = useCardioStore((state) => state.getWeeklyStats);
  const preferences = useUserStore((state) => state.preferences);
  const weeklyStats = getWeeklyStats();

  const handleQuickAdd = () => {
    // Parse input like "5k run 25min" or "30 min bike"
    const lowerInput = input.toLowerCase();
    let type: CardioActivity['type'] = 'other';
    let distance = 0;
    let duration = 0;
    let name = '';

    // Detect activity type
    if (lowerInput.includes('run') || lowerInput.includes('jog')) {
      type = 'run';
      name = 'Morning Run';
    } else if (lowerInput.includes('bike') || lowerInput.includes('cycl')) {
      type = 'cycle';
      name = 'Bike Ride';
    } else if (lowerInput.includes('swim')) {
      type = 'swim';
      name = 'Swimming';
    } else if (lowerInput.includes('walk')) {
      type = 'walk';
      name = 'Walk';
    }

    // Extract distance (km or miles)
    const distanceMatch = lowerInput.match(/(\d+\.?\d*)\s*(k|km|mi|mile)/);
    if (distanceMatch) {
      const value = parseFloat(distanceMatch[1]);
      const unit = distanceMatch[2];
      if (unit === 'k' || unit === 'km') {
        distance = value * 1000; // Convert to meters
      } else {
        distance = value * 1609.34; // Convert miles to meters
      }
    }

    // Extract duration
    const durationMatch = lowerInput.match(/(\d+)\s*(min|minute|hr|hour)/);
    if (durationMatch) {
      const value = parseInt(durationMatch[1]);
      const unit = durationMatch[2];
      if (unit.startsWith('hr') || unit.startsWith('hour')) {
        duration = value * 3600;
      } else {
        duration = value * 60;
      }
    }

    if (duration > 0) {
      addActivity({
        type,
        name: name || 'Cardio Activity',
        distance,
        duration,
        calories: calculateCardioCalories(duration, type),
        pace: distance > 0 ? duration / (distance / 1000) : undefined,
      });
      setInput('');
      setQuickAddMode(false);
    }
  };

  // Sample Strava-like activities (mock data)
  const mockStravaActivities: Omit<CardioActivity, 'id' | 'timestamp'>[] = [
    {
      type: 'run',
      name: 'Morning Run',
      distance: 5000,
      duration: 1500,
      pace: 300,
      heartRate: { average: 145, max: 165 },
      elevationGain: 50,
      calories: 350,
    },
    {
      type: 'cycle',
      name: 'Evening Ride',
      distance: 15000,
      duration: 2700,
      pace: 180,
      heartRate: { average: 130, max: 155 },
      elevationGain: 120,
      calories: 450,
    },
  ];

  if (compact) {
    // Compact view for grid layout
    return (
      <div className="space-y-4">
        {/* Weekly stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="text-center">
            <div className="text-2xl font-bold font-sans text-fitness-secondary">
              {weeklyStats.count}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">activities</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold font-sans text-terminal-amber">
              {formatDistance(weeklyStats.distance, preferences.units)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">this week</div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="flex justify-around text-xs">
          <div>
            <span className="font-sans text-blue-500">Time:</span> {formatDuration(weeklyStats.duration)}
          </div>
          <div>
            <span className="font-sans text-orange-500">Cal:</span> {weeklyStats.calories}
          </div>
        </div>

        {/* Quick add */}
        <Button
          variant="terminal"
          size="sm"
          fullWidth
          onClick={() => setQuickAddMode(true)}
          className="flex items-center justify-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Log Activity</span>
        </Button>

        {/* Recent activities (last 2) */}
        <div className="space-y-1">
          {activities.slice(0, 2).map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-2 bg-gray-50 dark:bg-dark-surface-light rounded text-xs"
            >
              <div className="flex items-center space-x-2">
                <Activity className="w-3 h-3 text-fitness-secondary" />
                <span className="font-sans truncate">{activity.name}</span>
              </div>
              <span className="font-sans text-fitness-calories">
                {formatDistance(activity.distance, preferences.units)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Full view
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <StatsGrid stats={weeklyStats} units={preferences.units} />

      {/* Quick Add / Strava Connect */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text">
            Add Activity
          </h3>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              // TODO: Implement Strava OAuth
              console.log('Connect to Strava');
            }}
            className="flex items-center space-x-2"
          >
            <Activity className="w-4 h-4" />
            <span>Connect Strava</span>
          </Button>
        </div>

        {quickAddMode ? (
          <div className="space-y-4">
            <TerminalInput
              value={input}
              onChange={setInput}
              onSubmit={handleQuickAdd}
              placeholder="e.g., '5k run 25min' or '30 min bike'"
              prompt="activity>"
              autoFocus
            />
            <div className="flex space-x-2">
              <Button onClick={handleQuickAdd} variant="terminal">
                Add Activity
              </Button>
              <Button
                onClick={() => {
                  setQuickAddMode(false);
                  setInput('');
                }}
                variant="secondary"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setQuickAddMode(true)}
              className="flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Quick Add</span>
            </Button>
            {['Run', 'Bike', 'Swim', 'Walk'].map((activityType) => (
              <Button
                key={activityType}
                variant="secondary"
                size="sm"
                onClick={() => {
                  setInput(`${activityType.toLowerCase()} `);
                  setQuickAddMode(true);
                }}
                className="flex items-center justify-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>{activityType}</span>
              </Button>
            ))}
          </div>
        )}
      </Card>

      {/* Activities List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text">
            Recent Activities
          </h3>
          {activities.length > 0 && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {activities.length} total
            </span>
          )}
        </div>

        {activities.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <Activity className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-700 mb-4" />
              <div className="text-gray-400 dark:text-gray-600 font-sans">
                No activities logged
              </div>
              <div className="text-sm text-gray-400 dark:text-gray-600 mt-2">
                Start by adding your first workout or connect Strava
              </div>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                units={preferences.units}
                onRemove={() => removeActivity(activity.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Mock Strava Activities (for demo) */}
      {activities.length === 0 && (
        <Card>
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-dark-text">
            Sample Activities (Demo)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockStravaActivities.map((activity, index) => (
              <Button
                key={index}
                variant="secondary"
                onClick={() => addActivity(activity)}
                className="p-4 text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{activity.name}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      {formatDistance(activity.distance, preferences.units)} • {formatDuration(activity.duration)}
                    </div>
                  </div>
                  <Plus className="w-5 h-5 text-gray-400" />
                </div>
              </Button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};