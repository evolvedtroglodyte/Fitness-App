// Food parsing utilities for intelligent input processing

interface ParsedFood {
  name: string;
  quantity?: number;
  unit?: string;
  calories?: number;
}

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Validate food input before parsing
export function validateFoodInput(input: string): ValidationResult {
  // Check if empty or whitespace only
  if (!input || !input.trim()) {
    return {
      isValid: false,
      error: 'Please enter a food item'
    };
  }

  const trimmed = input.trim();

  // Check minimum length
  if (trimmed.length < 2) {
    return {
      isValid: false,
      error: 'Food name must be at least 2 characters'
    };
  }

  // Check for mostly special characters (allow numbers for quantities, commas, letters, spaces, and common food chars)
  const validCharsPattern = /^[\w\s,.\-()]+$/;
  if (!validCharsPattern.test(trimmed)) {
    return {
      isValid: false,
      error: 'Please use only letters, numbers, and basic punctuation'
    };
  }

  // Check if input is only special characters or numbers
  const hasLetters = /[a-zA-Z]/.test(trimmed);
  if (!hasLetters) {
    return {
      isValid: false,
      error: 'Food name must contain at least some letters'
    };
  }

  // Check for excessive special characters
  const specialCharCount = (trimmed.match(/[^a-zA-Z0-9\s]/g) || []).length;
  if (specialCharCount > trimmed.length / 2) {
    return {
      isValid: false,
      error: 'Too many special characters. Please enter a valid food name'
    };
  }

  return { isValid: true };
}

// Food database - EMPTY for ChatGPT-only testing
// All food parsing will go through ChatGPT API
export const foodDatabase: Array<{
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving: string;
}> = [];

// Parse natural language food input
export function parseFoodInput(input: string): ParsedFood[] {
  const results: ParsedFood[] = [];
  const normalizedInput = input.toLowerCase();

  // Split by common separators
  const items = normalizedInput.split(/[,;]|\band\b|\bwith\b/);

  items.forEach(item => {
    const trimmedItem = item.trim();
    if (!trimmedItem) return;

    // Extract quantity if present (e.g., "2 eggs", "200g chicken")
    const quantityMatch = trimmedItem.match(/^(\d+\.?\d*)\s*(g|kg|oz|lbs?|cups?|tbsp|tsp|pieces?|slices?)?\s+(.+)/);

    let foodName = trimmedItem;
    let quantity = 1;
    let unit = '';

    if (quantityMatch) {
      quantity = parseFloat(quantityMatch[1]);
      unit = quantityMatch[2] || '';
      foodName = quantityMatch[3];
    }

    // Try to match against database
    const matchedFood = findFoodInDatabase(foodName);

    if (matchedFood) {
      // Calculate calories based on quantity
      let multiplier = quantity;

      // Adjust for units (simplified)
      if (unit === 'g' && matchedFood.serving.includes('100g')) {
        multiplier = quantity / 100;
      }

      results.push({
        name: matchedFood.name,
        quantity,
        unit,
        calories: Math.round(matchedFood.calories * multiplier),
      });
    } else {
      // Try to extract calories if specified (e.g., "custom meal 350cal")
      const caloriesMatch = trimmedItem.match(/(\d+)\s*(?:cal|calories|kcal)/);

      if (caloriesMatch) {
        const name = trimmedItem.replace(/\d+\s*(?:cal|calories|kcal)/, '').trim();
        results.push({
          name: name || 'custom food',
          calories: parseInt(caloriesMatch[1]),
        });
      } else {
        results.push({
          name: foodName,
          quantity,
          unit,
        });
      }
    }
  });

  return results;
}

// Fuzzy search for food in database
export function findFoodInDatabase(query: string) {
  const normalizedQuery = query.toLowerCase().trim();

  // Exact match
  let match = foodDatabase.find(food => food.name === normalizedQuery);
  if (match) return match;

  // Contains match
  match = foodDatabase.find(food => food.name.includes(normalizedQuery) || normalizedQuery.includes(food.name));
  if (match) return match;

  // Fuzzy match with Levenshtein distance
  const threshold = 2; // Maximum edit distance
  for (const food of foodDatabase) {
    if (levenshteinDistance(food.name, normalizedQuery) <= threshold) {
      return food;
    }
  }

  return null;
}

// Levenshtein distance for fuzzy matching
function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

// Search foods with fuzzy matching
export function searchFoods(query: string, limit = 10) {
  if (!query || query.length < 2) return [];

  const normalizedQuery = query.toLowerCase();
  const results: Array<typeof foodDatabase[0] & { score: number }> = [];

  foodDatabase.forEach(food => {
    // Calculate relevance score
    let score = 0;

    if (food.name === normalizedQuery) {
      score = 100;
    } else if (food.name.startsWith(normalizedQuery)) {
      score = 90;
    } else if (food.name.includes(normalizedQuery)) {
      score = 70;
    } else {
      const distance = levenshteinDistance(food.name, normalizedQuery);
      if (distance <= 3) {
        score = Math.max(0, 50 - distance * 10);
      }
    }

    if (score > 0) {
      results.push({ ...food, score });
    }
  });

  // Sort by score and return top results
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ score, ...food }) => food);
}