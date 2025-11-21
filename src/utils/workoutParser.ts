// Workout parsing utilities for natural language input

import type { Exercise, Workout } from '../types';

interface ParsedExercise {
  name: string;
  sets?: number;
  reps?: number;
  weight?: number;
  duration?: number;
  unit?: 'lbs' | 'kg' | 'min' | 'sec';
}

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Validate workout input before parsing
export function validateWorkoutInput(input: string): ValidationResult {
  // Check if empty or whitespace only
  if (!input || !input.trim()) {
    return {
      isValid: false,
      error: 'Please enter a workout'
    };
  }

  const trimmed = input.trim();

  // Check minimum length
  if (trimmed.length < 3) {
    return {
      isValid: false,
      error: 'Workout description must be at least 3 characters'
    };
  }

  // Check for valid characters (allow letters, numbers, spaces, and common punctuation)
  const validCharsPattern = /^[\w\s,.\-:@()]+$/;
  if (!validCharsPattern.test(trimmed)) {
    return {
      isValid: false,
      error: 'Please use only letters, numbers, and basic punctuation'
    };
  }

  // Check if input has at least some letters
  const hasLetters = /[a-zA-Z]/.test(trimmed);
  if (!hasLetters) {
    return {
      isValid: false,
      error: 'Workout must contain at least some letters'
    };
  }

  // Check for excessive special characters
  const specialCharCount = (trimmed.match(/[^a-zA-Z0-9\s]/g) || []).length;
  if (specialCharCount > trimmed.length / 2) {
    return {
      isValid: false,
      error: 'Too many special characters. Please enter a valid workout'
    };
  }

  return { isValid: true };
}

// Common exercise names and their variations
const exerciseAliases: Record<string, string[]> = {
  'bench press': ['bench', 'bp', 'bench press', 'barbell bench'],
  'overhead press': ['ohp', 'overhead press', 'military press', 'shoulder press'],
  'squat': ['squat', 'squats', 'back squat', 'front squat'],
  'deadlift': ['deadlift', 'dl', 'deads', 'deadlifts'],
  'pull up': ['pullup', 'pull up', 'pullups', 'pull-up'],
  'push up': ['pushup', 'push up', 'pushups', 'push-up'],
  'dumbbell curl': ['curl', 'curls', 'bicep curl', 'db curl'],
  'tricep extension': ['tricep', 'triceps', 'tricep extension'],
  'leg press': ['leg press', 'legpress'],
  'leg curl': ['leg curl', 'hamstring curl'],
  'leg extension': ['leg extension', 'quad extension'],
  'lat pulldown': ['lat pulldown', 'pulldown', 'lat pull'],
  'row': ['row', 'rows', 'barbell row', 'db row'],
  'dip': ['dip', 'dips', 'tricep dip'],
  'plank': ['plank', 'planks'],
  'crunch': ['crunch', 'crunches', 'ab crunch'],
  'running': ['run', 'running', 'jog', 'jogging'],
  'cycling': ['bike', 'cycling', 'biking', 'cycle'],
  'walking': ['walk', 'walking'],
  'rowing': ['row', 'rowing', 'erg'],
};

// Workout type keywords
const workoutTypeKeywords = {
  push: ['push', 'chest', 'shoulder', 'tricep'],
  pull: ['pull', 'back', 'bicep', 'lat'],
  legs: ['leg', 'legs', 'quad', 'hamstring', 'glute', 'calf'],
  cardio: ['cardio', 'run', 'bike', 'swim', 'walk', 'hiit'],
  'full-body': ['full body', 'fullbody', 'total body'],
};

// Parse natural language workout input
export function parseWorkoutInput(input: string): {
  type: Workout['type'];
  exercises: ParsedExercise[];
  name?: string;
} {
  const normalizedInput = input.toLowerCase();

  // Detect workout type
  let workoutType: Workout['type'] = 'other';
  for (const [type, keywords] of Object.entries(workoutTypeKeywords)) {
    if (keywords.some(keyword => normalizedInput.includes(keyword))) {
      workoutType = type as Workout['type'];
      break;
    }
  }

  // Extract workout name if specified (e.g., "Push day:" or "Morning workout:")
  let workoutName: string | undefined;
  const nameMatch = normalizedInput.match(/^([^:]+):/);
  if (nameMatch) {
    workoutName = nameMatch[1].trim();
  }

  // Parse exercises
  const exercises: ParsedExercise[] = [];

  // Split by common exercise separators
  const exerciseStrings = normalizedInput.split(/[,;]|\band\b/);

  exerciseStrings.forEach(exerciseStr => {
    const trimmed = exerciseStr.trim();
    if (!trimmed) return;

    // Pattern: "exercise sets x reps @ weight" or "exercise duration"
    const patterns = [
      // Sets x Reps @ Weight (e.g., "bench 3x8 @185lbs")
      /(.+?)\s+(\d+)\s*x\s*(\d+)\s*(?:@|at)?\s*(\d+)\s*(lbs?|kg)?/i,
      // Sets x Reps (e.g., "pushups 3x20")
      /(.+?)\s+(\d+)\s*x\s*(\d+)/i,
      // Duration (e.g., "30 min run" or "plank 60 sec")
      /(\d+)\s*(min|minute|sec|second)s?\s+(.+)/i,
      // Duration after exercise (e.g., "run 30 min")
      /(.+?)\s+(\d+)\s*(min|minute|sec|second)s?/i,
      // Just exercise name with "heavy" or "light" (e.g., "squats heavy")
      /(.+?)\s+(heavy|light|medium)/i,
    ];

    let parsed = false;

    for (const pattern of patterns) {
      const match = trimmed.match(pattern);
      if (match) {
        if (pattern === patterns[0]) {
          // Sets x Reps @ Weight
          exercises.push({
            name: normalizeExerciseName(match[1]),
            sets: parseInt(match[2]),
            reps: parseInt(match[3]),
            weight: parseInt(match[4]),
            unit: (match[5] as 'lbs' | 'kg') || 'lbs',
          });
          parsed = true;
        } else if (pattern === patterns[1]) {
          // Sets x Reps
          exercises.push({
            name: normalizeExerciseName(match[1]),
            sets: parseInt(match[2]),
            reps: parseInt(match[3]),
          });
          parsed = true;
        } else if (pattern === patterns[2]) {
          // Duration (number first)
          const duration = parseInt(match[1]);
          const unit = match[2];
          exercises.push({
            name: normalizeExerciseName(match[3]),
            duration: unit.startsWith('min') ? duration * 60 : duration,
          });
          parsed = true;
        } else if (pattern === patterns[3]) {
          // Duration (exercise first)
          const duration = parseInt(match[2]);
          const unit = match[3];
          exercises.push({
            name: normalizeExerciseName(match[1]),
            duration: unit.startsWith('min') ? duration * 60 : duration,
          });
          parsed = true;
        } else if (pattern === patterns[4]) {
          // Exercise with intensity
          exercises.push({
            name: normalizeExerciseName(match[1]),
            sets: match[2] === 'heavy' ? 5 : match[2] === 'light' ? 3 : 4,
            reps: match[2] === 'heavy' ? 5 : match[2] === 'light' ? 12 : 8,
          });
          parsed = true;
        }
        break;
      }
    }

    // If no pattern matched, just add the exercise name
    if (!parsed && trimmed.length > 2) {
      const cleanName = trimmed.replace(/^-\s*/, '').trim();
      if (cleanName) {
        exercises.push({
          name: normalizeExerciseName(cleanName),
        });
      }
    }
  });

  return {
    type: workoutType,
    exercises,
    name: workoutName,
  };
}

// Normalize exercise names using aliases
function normalizeExerciseName(name: string): string {
  const normalized = name.trim().toLowerCase();

  // Check against aliases
  for (const [canonical, aliases] of Object.entries(exerciseAliases)) {
    if (aliases.includes(normalized)) {
      return canonical;
    }
  }

  // Capitalize first letter of each word
  return normalized
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Convert parsed exercises to Exercise type
export function convertToExercises(parsedExercises: ParsedExercise[]): Exercise[] {
  return parsedExercises.map((parsed, index) => ({
    id: crypto.randomUUID(),
    name: parsed.name,
    sets: parsed.sets,
    reps: parsed.reps,
    weight: parsed.weight,
    duration: parsed.duration,
  }));
}

// Format exercise for display
export function formatExercise(exercise: Exercise): string {
  let result = exercise.name;

  if (exercise.sets && exercise.reps) {
    result += ` ${exercise.sets}x${exercise.reps}`;
    if (exercise.weight) {
      result += ` @ ${exercise.weight}lbs`;
    }
  } else if (exercise.duration) {
    const minutes = Math.floor(exercise.duration / 60);
    const seconds = exercise.duration % 60;
    if (minutes > 0) {
      result += ` ${minutes} min`;
      if (seconds > 0) {
        result += ` ${seconds} sec`;
      }
    } else {
      result += ` ${seconds} sec`;
    }
  }

  return result;
}

// Calculate total workout volume
export function calculateVolume(exercises: Exercise[]): number {
  return exercises.reduce((total, exercise) => {
    if (exercise.sets && exercise.reps && exercise.weight) {
      return total + (exercise.sets * exercise.reps * exercise.weight);
    }
    return total;
  }, 0);
}

// Example workout templates
export const workoutTemplates = {
  'push': [
    { name: 'Bench Press', sets: 4, reps: 8 },
    { name: 'Overhead Press', sets: 3, reps: 10 },
    { name: 'Dumbbell Fly', sets: 3, reps: 12 },
    { name: 'Tricep Extension', sets: 3, reps: 15 },
  ],
  'pull': [
    { name: 'Pull Up', sets: 4, reps: 8 },
    { name: 'Barbell Row', sets: 4, reps: 10 },
    { name: 'Lat Pulldown', sets: 3, reps: 12 },
    { name: 'Dumbbell Curl', sets: 3, reps: 15 },
  ],
  'legs': [
    { name: 'Squat', sets: 5, reps: 5 },
    { name: 'Deadlift', sets: 4, reps: 6 },
    { name: 'Leg Press', sets: 3, reps: 12 },
    { name: 'Leg Curl', sets: 3, reps: 15 },
  ],
};