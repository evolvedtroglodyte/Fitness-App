import React from 'react';
import { motion } from 'framer-motion';
import { Activity, MapPin, Heart, TrendingUp, Clock, Trash2, Calendar } from 'lucide-react';
import type { CardioActivity } from '../../types';
import { formatDistance, formatDuration, calculatePace, formatRelativeTime } from '../../utils/calculations';

interface ActivityCardProps {
  activity: CardioActivity;
  units: 'imperial' | 'metric';
  onRemove: () => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity, units, onRemove }) => {
  const getActivityIcon = () => {
    switch (activity.type) {
      case 'run':
        return '🏃';
      case 'cycle':
        return '🚴';
      case 'swim':
        return '🏊';
      case 'walk':
        return '🚶';
      default:
        return '💪';
    }
  };

  const getActivityColor = () => {
    switch (activity.type) {
      case 'run':
        return 'from-orange-500 to-red-500';
      case 'cycle':
        return 'from-blue-500 to-cyan-500';
      case 'swim':
        return 'from-cyan-500 to-blue-500';
      case 'walk':
        return 'from-green-500 to-emerald-500';
      default:
        return 'from-purple-500 to-pink-500';
    }
  };

  const pace = activity.distance > 0
    ? calculatePace(activity.distance, activity.duration, units)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="activity-card group"
    >
      {/* Header with gradient */}
      <div className={`h-1 bg-gradient-to-r ${getActivityColor()} rounded-t-lg`} />

      <div className="p-4">
        {/* Title and Icon */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getActivityIcon()}</span>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-dark-text">
                {activity.name}
              </h4>
              <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                <Calendar className="w-3 h-3" />
                <span>{formatRelativeTime(new Date(activity.timestamp))}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onRemove}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-3 md:p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
            aria-label="Remove activity"
          >
            <Trash2 className="w-4 h-4 text-gray-400 hover:text-fitness-error" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Distance */}
          {activity.distance > 0 && (
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-gray-400 dark:text-gray-600" />
              <div>
                <div className="font-sans font-semibold text-sm text-gray-900 dark:text-dark-text">
                  {formatDistance(activity.distance, units)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Distance</div>
              </div>
            </div>
          )}

          {/* Duration */}
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-400 dark:text-gray-600" />
            <div>
              <div className="font-sans font-semibold text-sm text-gray-900 dark:text-dark-text">
                {formatDuration(activity.duration)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Duration</div>
            </div>
          </div>

          {/* Pace */}
          {pace && (
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-gray-400 dark:text-gray-600" />
              <div>
                <div className="font-sans font-semibold text-sm text-gray-900 dark:text-dark-text">
                  {pace}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  /{units === 'imperial' ? 'mi' : 'km'}
                </div>
              </div>
            </div>
          )}

          {/* Heart Rate */}
          {activity.heartRate && (
            <div className="flex items-center space-x-2">
              <Heart className="w-4 h-4 text-gray-400 dark:text-gray-600" />
              <div>
                <div className="font-sans font-semibold text-sm text-gray-900 dark:text-dark-text">
                  {activity.heartRate.average}
                  <span className="text-xs text-gray-500"> / {activity.heartRate.max}</span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Avg / Max</div>
              </div>
            </div>
          )}

          {/* Elevation */}
          {activity.elevationGain !== undefined && activity.elevationGain > 0 && (
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-gray-400 dark:text-gray-600" />
              <div>
                <div className="font-sans font-semibold text-sm text-gray-900 dark:text-dark-text">
                  {units === 'imperial'
                    ? `${Math.round(activity.elevationGain * 3.28084)} ft`
                    : `${activity.elevationGain} m`}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Elevation</div>
              </div>
            </div>
          )}

          {/* Calories */}
          {activity.calories && (
            <div className="flex items-center space-x-2">
              <span className="text-base">🔥</span>
              <div>
                <div className="font-sans font-semibold text-sm text-gray-900 dark:text-dark-text">
                  {activity.calories}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Calories</div>
              </div>
            </div>
          )}
        </div>

        {/* Strava indicator (if connected) */}
        {activity.stravaId && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
              <Activity className="w-3 h-3" />
              <span>Synced from Strava</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};