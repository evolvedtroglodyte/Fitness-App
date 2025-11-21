// Calculation utilities for FitTerminal

// Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor equation
export function calculateBMR(
  weight: number, // in kg
  height: number, // in cm
  age: number,
  gender: 'male' | 'female'
): number {
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
}

// Calculate TDEE (Total Daily Energy Expenditure)
export function calculateTDEE(bmr: number, activityLevel: number): number {
  // Activity levels:
  // 1.2 = Sedentary (little or no exercise)
  // 1.375 = Lightly active (1-3 days/week)
  // 1.55 = Moderately active (3-5 days/week)
  // 1.725 = Very active (6-7 days/week)
  // 1.9 = Extra active (very hard exercise/physical job)
  return bmr * activityLevel;
}

// Calculate macro targets based on calories and percentages
export function calculateMacros(
  calories: number,
  proteinPercentage: number,
  carbsPercentage: number,
  fatPercentage: number
): {
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
} {
  // 1g protein = 4 calories
  // 1g carbs = 4 calories
  // 1g fat = 9 calories

  const proteinCalories = (calories * proteinPercentage) / 100;
  const carbsCalories = (calories * carbsPercentage) / 100;
  const fatCalories = (calories * fatPercentage) / 100;

  return {
    proteinGrams: Math.round(proteinCalories / 4),
    carbsGrams: Math.round(carbsCalories / 4),
    fatGrams: Math.round(fatCalories / 9),
  };
}

// Format duration (seconds) to human-readable string
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs > 0 ? `${secs}s` : ''}`.trim();
  } else {
    return `${secs}s`;
  }
}

// Format distance (meters) to human-readable string
export function formatDistance(meters: number, units: 'imperial' | 'metric' = 'imperial'): string {
  if (units === 'imperial') {
    const miles = meters / 1609.34;
    return `${miles.toFixed(2)} mi`;
  } else {
    const kilometers = meters / 1000;
    return `${kilometers.toFixed(2)} km`;
  }
}

// Calculate pace (seconds per km or mile)
export function calculatePace(
  distance: number, // in meters
  duration: number, // in seconds
  units: 'imperial' | 'metric' = 'imperial'
): string {
  const distanceInUnit = units === 'imperial' ? distance / 1609.34 : distance / 1000;
  if (distanceInUnit === 0) return '0:00';

  const paceSeconds = duration / distanceInUnit;
  const paceMinutes = Math.floor(paceSeconds / 60);
  const paceRemainingSeconds = Math.round(paceSeconds % 60);

  return `${paceMinutes}:${paceRemainingSeconds.toString().padStart(2, '0')}`;
}

// Calculate calories burned during cardio
export function calculateCardioCalories(
  duration: number, // in seconds
  activityType: 'run' | 'cycle' | 'swim' | 'walk' | 'other',
  weight: number = 70 // in kg
): number {
  // MET (Metabolic Equivalent of Task) values
  const metValues = {
    run: 10, // Running at 6 mph
    cycle: 8, // Cycling at moderate pace
    swim: 8, // Swimming laps
    walk: 3.5, // Walking at 3.5 mph
    other: 5, // General moderate activity
  };

  const met = metValues[activityType];
  const hours = duration / 3600;

  // Calories = MET × weight (kg) × time (hours)
  return Math.round(met * weight * hours);
}

// Calculate percentage of goal
export function calculatePercentage(current: number, target: number): number {
  if (target === 0) return 0;
  return Math.min(100, Math.round((current / target) * 100));
}

// Format large numbers with K, M suffixes
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  } else {
    return num.toString();
  }
}

// Convert between units
export function convertWeight(value: number, from: 'lbs' | 'kg', to: 'lbs' | 'kg'): number {
  if (from === to) return value;

  if (from === 'lbs' && to === 'kg') {
    return value / 2.20462;
  } else {
    return value * 2.20462;
  }
}

// Calculate heart rate zones
export function calculateHeartRateZones(maxHeartRate: number): {
  zone1: [number, number]; // 50-60%
  zone2: [number, number]; // 60-70%
  zone3: [number, number]; // 70-80%
  zone4: [number, number]; // 80-90%
  zone5: [number, number]; // 90-100%
} {
  return {
    zone1: [Math.round(maxHeartRate * 0.5), Math.round(maxHeartRate * 0.6)],
    zone2: [Math.round(maxHeartRate * 0.6), Math.round(maxHeartRate * 0.7)],
    zone3: [Math.round(maxHeartRate * 0.7), Math.round(maxHeartRate * 0.8)],
    zone4: [Math.round(maxHeartRate * 0.8), Math.round(maxHeartRate * 0.9)],
    zone5: [Math.round(maxHeartRate * 0.9), maxHeartRate],
  };
}

// Estimate max heart rate (220 - age)
export function estimateMaxHeartRate(age: number): number {
  return 220 - age;
}

// Calculate workout intensity based on volume
export function calculateIntensity(
  currentVolume: number,
  maxVolume: number
): 'light' | 'moderate' | 'heavy' {
  const percentage = (currentVolume / maxVolume) * 100;

  if (percentage < 60) return 'light';
  if (percentage < 85) return 'moderate';
  return 'heavy';
}

// Get greeting based on time of day
export function getTimeOfDayGreeting(): string {
  const hour = new Date().getHours();

  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 21) return 'Good evening';
  return 'Good night';
}

// Check if date is today
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

// Check if date is this week
export function isThisWeek(date: Date): boolean {
  const now = new Date();
  const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);

  return date >= weekStart && date < weekEnd;
}

// Format relative time
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'just now';
}