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

// Common food database (mock data - in production, this would come from an API)
export const foodDatabase = [
  // Fruits
  { name: 'apple', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, serving: '1 medium' },
  { name: 'banana', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, serving: '1 medium' },
  { name: 'orange', calories: 62, protein: 1.2, carbs: 15, fat: 0.2, serving: '1 medium' },
  { name: 'strawberries', calories: 49, protein: 1, carbs: 12, fat: 0.5, serving: '1 cup' },
  { name: 'grapes', calories: 104, protein: 1.1, carbs: 27, fat: 0.2, serving: '1 cup' },
  { name: 'watermelon', calories: 46, protein: 0.9, carbs: 11.5, fat: 0.2, serving: '1 cup' },
  { name: 'blueberries', calories: 84, protein: 1, carbs: 21, fat: 0.5, serving: '1 cup' },

  // Proteins
  { name: 'eggs', calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3, serving: '1 large' },
  { name: 'egg', calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3, serving: '1 large' },
  { name: 'chicken breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, serving: '100g' },
  { name: 'chicken', calories: 165, protein: 31, carbs: 0, fat: 3.6, serving: '100g' },
  { name: 'salmon', calories: 208, protein: 28, carbs: 0, fat: 10, serving: '100g' },
  { name: 'turkey', calories: 135, protein: 30, carbs: 0, fat: 1, serving: '100g' },
  { name: 'tuna', calories: 128, protein: 28, carbs: 0, fat: 1, serving: '100g' },
  { name: 'beef', calories: 250, protein: 26, carbs: 0, fat: 15, serving: '100g' },
  { name: 'pork', calories: 242, protein: 27, carbs: 0, fat: 14, serving: '100g' },
  { name: 'shrimp', calories: 99, protein: 24, carbs: 0.2, fat: 0.3, serving: '100g' },
  { name: 'tofu', calories: 76, protein: 8, carbs: 1.9, fat: 4.8, serving: '100g' },

  // Grains & Carbs
  { name: 'rice', calories: 206, protein: 4.3, carbs: 45, fat: 0.4, serving: '1 cup cooked' },
  { name: 'pasta', calories: 220, protein: 8, carbs: 43, fat: 1.3, serving: '1 cup cooked' },
  { name: 'quinoa', calories: 222, protein: 8, carbs: 39, fat: 3.6, serving: '1 cup cooked' },
  { name: 'oatmeal', calories: 150, protein: 5, carbs: 27, fat: 3, serving: '1/2 cup dry' },
  { name: 'oats', calories: 150, protein: 5, carbs: 27, fat: 3, serving: '1/2 cup dry' },
  { name: 'bread', calories: 79, protein: 2.7, carbs: 15, fat: 0.9, serving: '1 slice' },
  { name: 'toast', calories: 79, protein: 2.7, carbs: 15, fat: 0.9, serving: '1 slice' },
  { name: 'bagel', calories: 289, protein: 11, carbs: 56, fat: 2, serving: '1 bagel' },
  { name: 'tortilla', calories: 150, protein: 4, carbs: 26, fat: 3.5, serving: '1 large' },
  { name: 'pancakes', calories: 227, protein: 6, carbs: 28, fat: 10, serving: '2 medium' },
  { name: 'waffles', calories: 218, protein: 6, carbs: 25, fat: 11, serving: '2 medium' },

  // Vegetables
  { name: 'broccoli', calories: 31, protein: 2.5, carbs: 6, fat: 0.4, serving: '1 cup' },
  { name: 'spinach', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, serving: '100g' },
  { name: 'carrots', calories: 52, protein: 1.2, carbs: 12, fat: 0.3, serving: '1 cup' },
  { name: 'tomato', calories: 22, protein: 1.1, carbs: 4.8, fat: 0.2, serving: '1 medium' },
  { name: 'cucumber', calories: 16, protein: 0.7, carbs: 3.6, fat: 0.1, serving: '1 cup' },
  { name: 'lettuce', calories: 5, protein: 0.5, carbs: 1, fat: 0.1, serving: '1 cup' },
  { name: 'sweet potato', calories: 86, protein: 1.6, carbs: 20, fat: 0.1, serving: '100g' },
  { name: 'potato', calories: 130, protein: 3, carbs: 30, fat: 0.2, serving: '1 medium' },

  // Dairy
  { name: 'milk', calories: 150, protein: 8, carbs: 12, fat: 8, serving: '1 cup' },
  { name: 'greek yogurt', calories: 100, protein: 17, carbs: 6, fat: 0.7, serving: '170g' },
  { name: 'yogurt', calories: 100, protein: 17, carbs: 6, fat: 0.7, serving: '170g' },
  { name: 'cheese', calories: 113, protein: 7, carbs: 1, fat: 9, serving: '1 slice' },
  { name: 'cheddar', calories: 113, protein: 7, carbs: 1, fat: 9, serving: '1 slice' },
  { name: 'butter', calories: 102, protein: 0.1, carbs: 0, fat: 11.5, serving: '1 tbsp' },
  { name: 'cream cheese', calories: 51, protein: 1, carbs: 0.8, fat: 5, serving: '1 tbsp' },

  // Nuts & Seeds
  { name: 'almonds', calories: 164, protein: 6, carbs: 6, fat: 14, serving: '1 oz' },
  { name: 'peanuts', calories: 161, protein: 7, carbs: 5, fat: 14, serving: '1 oz' },
  { name: 'peanut butter', calories: 188, protein: 8, carbs: 7, fat: 16, serving: '2 tbsp' },
  { name: 'walnuts', calories: 185, protein: 4.3, carbs: 3.9, fat: 18.5, serving: '1 oz' },
  { name: 'cashews', calories: 157, protein: 5, carbs: 9, fat: 12, serving: '1 oz' },

  // Other
  { name: 'avocado', calories: 320, protein: 4, carbs: 17, fat: 29, serving: '1 whole' },
  { name: 'olive oil', calories: 119, protein: 0, carbs: 0, fat: 13.5, serving: '1 tbsp' },
  { name: 'honey', calories: 64, protein: 0.1, carbs: 17, fat: 0, serving: '1 tbsp' },
  { name: 'sugar', calories: 49, protein: 0, carbs: 13, fat: 0, serving: '1 tbsp' },
  { name: 'coffee', calories: 2, protein: 0.3, carbs: 0, fat: 0, serving: '1 cup' },
  { name: 'protein shake', calories: 120, protein: 25, carbs: 3, fat: 1.5, serving: '1 scoop' },
  { name: 'protein bar', calories: 200, protein: 20, carbs: 22, fat: 7, serving: '1 bar' },
];

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