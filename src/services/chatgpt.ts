// ChatGPT-powered food parsing service with specialized prompts
// Uses GPT-4-turbo for accurate nutritional information extraction

interface ChatGPTFoodResponse {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving: string;
  confidence: 'high' | 'medium' | 'low';
  source?: string; // Optional source citation (e.g., "Chipotle Nutrition Calculator")
}

interface CachedResponse {
  response: ChatGPTFoodResponse;
  timestamp: number;
}

const CACHE_KEY = 'chatgpt_food_cache';
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

// Get API key from environment
const getAPIKey = (): string => {
  const key = import.meta.env.VITE_OPENAI_API_KEY;
  if (!key) {
    throw new Error('OpenAI API key not found. Please add VITE_OPENAI_API_KEY to your .env file');
  }
  return key;
};

// Cache management
export const getCachedResponse = (query: string): ChatGPTFoodResponse | null => {
  try {
    const cache = localStorage.getItem(CACHE_KEY);
    if (!cache) return null;

    const cacheData: Record<string, CachedResponse> = JSON.parse(cache);
    const normalizedQuery = query.toLowerCase().trim();
    const cached = cacheData[normalizedQuery];

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.response;
    }

    // Clean up expired cache entry
    if (cached) {
      delete cacheData[normalizedQuery];
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    }

    return null;
  } catch (error) {
    console.error('Error reading cache:', error);
    return null;
  }
};

export const setCachedResponse = (query: string, response: ChatGPTFoodResponse): void => {
  try {
    const cache = localStorage.getItem(CACHE_KEY);
    const cacheData: Record<string, CachedResponse> = cache ? JSON.parse(cache) : {};
    const normalizedQuery = query.toLowerCase().trim();

    cacheData[normalizedQuery] = {
      response,
      timestamp: Date.now(),
    };

    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Error writing cache:', error);
  }
};

// Specialized prompts for different scenarios

const PROMPT_SIMPLE_FOOD = `You are a nutrition expert. Parse the user's food input and return ONLY a JSON object with nutritional information.

Rules:
- Return ONLY valid JSON, no explanations
- If you can't determine the food, return {"error": "Could not parse food"}
- Use standard serving sizes
- Be accurate with nutritional values
- Set confidence: "high" if certain, "medium" if estimated, "low" if guessing
- Optionally include "source" field if using specific nutrition database (e.g., "USDA FoodData Central")

Format:
{
  "name": "food name",
  "calories": number,
  "protein": number (grams),
  "carbs": number (grams),
  "fat": number (grams),
  "serving": "serving size",
  "confidence": "high" | "medium" | "low",
  "source": "optional source name"
}

User input: `;

const PROMPT_COMPLEX_MEAL = `You are a nutrition expert. Break down this complex meal into its components and calculate total nutrition.

Rules:
- Identify all major components (protein, grains, vegetables, toppings, etc.)
- Calculate combined nutritional values
- Use realistic portion sizes for a typical meal
- Return ONLY valid JSON, no explanations
- If unsure, return {"error": "Could not parse meal"}

Format:
{
  "name": "meal description",
  "calories": total_number,
  "protein": total_grams,
  "carbs": total_grams,
  "fat": total_grams,
  "serving": "1 meal/bowl/plate",
  "confidence": "high" | "medium" | "low",
  "components": ["component1", "component2", ...]
}

User input: `;

const PROMPT_BRAND_RECOGNITION = `You are a nutrition expert with knowledge of restaurant and packaged food nutrition.

Rules:
- Recognize brand names and restaurant chains
- Use official nutritional information when possible
- Account for typical preparation methods
- Return ONLY valid JSON, no explanations
- If you don't know the exact item, return {"error": "Brand/item not recognized"}
- IMPORTANT: Include "source" field with the brand's nutrition source (e.g., "Chipotle Nutrition Calculator", "McDonald's Official Nutrition", "USDA FoodData Central")

Format:
{
  "name": "Brand Item Name",
  "calories": number,
  "protein": number (grams),
  "carbs": number (grams),
  "fat": number (grams),
  "serving": "1 item/serving",
  "confidence": "high" | "medium" | "low",
  "source": "Brand Name Nutrition Calculator/Website"
}

User input: `;

const PROMPT_QUANTITY_CONVERTER = `You are a nutrition expert. Convert the quantity/units and calculate accurate nutrition.

Rules:
- Handle various units: oz, lbs, g, kg, cups, tbsp, tsp, pieces, slices
- Convert to standard serving and adjust nutritional values
- Be mathematically precise
- Return ONLY valid JSON, no explanations
- If quantity is unclear, return {"error": "Could not parse quantity"}

Format:
{
  "name": "food name",
  "calories": adjusted_number,
  "protein": adjusted_grams,
  "carbs": adjusted_grams,
  "fat": adjusted_grams,
  "serving": "converted serving size",
  "confidence": "high" | "medium" | "low",
  "originalQuantity": "what user entered"
}

User input: `;

const PROMPT_MEAL_SUGGESTER = `You are a helpful nutrition expert. The user's input is unclear. Provide your best guess OR suggest alternatives.

Rules:
- If you can make a reasonable guess, provide nutrition for that
- If too uncertain, return suggestions in error message
- Return ONLY valid JSON, no explanations
- Be helpful but honest about uncertainty

Format (if you can guess):
{
  "name": "best guess food name",
  "calories": number,
  "protein": number (grams),
  "carbs": number (grams),
  "fat": number (grams),
  "serving": "serving size",
  "confidence": "low",
  "note": "Assumed this is..."
}

Format (if too uncertain):
{
  "error": "Could not determine food. Did you mean: suggestion1, suggestion2, suggestion3?"
}

User input: `;

// Determine which prompt to use based on input characteristics
const selectPrompt = (input: string): string => {
  const normalizedInput = input.toLowerCase();

  // Brand/restaurant detection
  const brands = [
    'mcdonalds', "mcdonald's", 'burger king', 'chipotle', 'starbucks',
    'subway', 'taco bell', 'kfc', 'wendy\'s', 'chick-fil-a',
    'panera', 'dominos', "domino's", 'pizza hut', 'dunkin'
  ];
  if (brands.some(brand => normalizedInput.includes(brand))) {
    return PROMPT_BRAND_RECOGNITION;
  }

  // Quantity/unit detection
  const hasQuantity = /\d+\s*(oz|lbs?|g|kg|cups?|tbsp|tsp|pieces?|slices?)/.test(normalizedInput);
  if (hasQuantity) {
    return PROMPT_QUANTITY_CONVERTER;
  }

  // Complex meal detection (multiple components)
  const complexIndicators = ['with', 'and', 'bowl', 'plate', 'burrito', 'salad', 'sandwich', 'wrap'];
  if (complexIndicators.some(indicator => normalizedInput.includes(indicator))) {
    return PROMPT_COMPLEX_MEAL;
  }

  // Very short or unclear input
  if (input.trim().length < 4) {
    return PROMPT_MEAL_SUGGESTER;
  }

  // Default to simple food parser
  return PROMPT_SIMPLE_FOOD;
};

// Main ChatGPT API call
export const parseFoodWithChatGPT = async (input: string): Promise<ChatGPTFoodResponse | null> => {
  // Check cache first
  const cached = getCachedResponse(input);
  if (cached) {
    console.log('Using cached ChatGPT response for:', input);
    return cached;
  }

  try {
    const apiKey = getAPIKey();
    const selectedPrompt = selectPrompt(input);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o', // Latest GPT-4 model (faster and better than gpt-4-turbo-preview)
        messages: [
          {
            role: 'system',
            content: 'You are a precise nutrition expert. Always return valid JSON only, no additional text.',
          },
          {
            role: 'user',
            content: selectedPrompt + input,
          },
        ],
        temperature: 0.3, // Lower temperature for more consistent, factual responses
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      // Try to get error details
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.error?.message) {
          errorMessage = errorData.error.message;
        }
      } catch {
        // If we can't parse JSON, try to get text
        try {
          const errorText = await response.text();
          if (errorText && !errorText.startsWith('<')) {
            errorMessage = errorText.substring(0, 200);
          }
        } catch {}
      }
      console.error('OpenAI API error:', errorMessage);
      throw new Error(errorMessage);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error('No content in ChatGPT response');
      return null;
    }

    // Parse JSON response
    let parsed;
    try {
      // Strip markdown code blocks if present (```json ... ``` or ```...```)
      let cleanedContent = content.trim();

      // Remove ```json and ``` markers
      if (cleanedContent.startsWith('```')) {
        // Remove opening ```json or ```
        cleanedContent = cleanedContent.replace(/^```(?:json)?\s*\n?/, '');
        // Remove closing ```
        cleanedContent = cleanedContent.replace(/\n?```\s*$/, '');
        cleanedContent = cleanedContent.trim();
      }

      parsed = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error('Failed to parse ChatGPT response as JSON:', content);
      console.error('Parse error:', parseError);
      return null;
    }

    // Check for error response
    if (parsed.error) {
      console.error('ChatGPT parsing error:', parsed.error);
      return null;
    }

    // Validate response structure
    if (
      typeof parsed.name !== 'string' ||
      typeof parsed.calories !== 'number' ||
      typeof parsed.protein !== 'number' ||
      typeof parsed.carbs !== 'number' ||
      typeof parsed.fat !== 'number' ||
      typeof parsed.serving !== 'string'
    ) {
      console.error('Invalid response structure from ChatGPT');
      return null;
    }

    const foodResponse: ChatGPTFoodResponse = {
      name: parsed.name,
      calories: Math.round(parsed.calories),
      protein: Math.round(parsed.protein * 10) / 10, // Round to 1 decimal
      carbs: Math.round(parsed.carbs * 10) / 10,
      fat: Math.round(parsed.fat * 10) / 10,
      serving: parsed.serving,
      confidence: parsed.confidence || 'medium',
      source: parsed.source, // Include source if provided by ChatGPT
    };

    // Cache successful response
    setCachedResponse(input, foodResponse);

    return foodResponse;
  } catch (error) {
    console.error('Error calling ChatGPT API:', error);
    return null;
  }
};

// Utility to clear old cache entries
export const cleanCache = (): void => {
  try {
    const cache = localStorage.getItem(CACHE_KEY);
    if (!cache) return;

    const cacheData: Record<string, CachedResponse> = JSON.parse(cache);
    const now = Date.now();
    let cleaned = 0;

    Object.keys(cacheData).forEach((key) => {
      if (now - cacheData[key].timestamp >= CACHE_DURATION) {
        delete cacheData[key];
        cleaned++;
      }
    });

    if (cleaned > 0) {
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      console.log(`Cleaned ${cleaned} expired cache entries`);
    }
  } catch (error) {
    console.error('Error cleaning cache:', error);
  }
};

// Get cache statistics
export const getCacheStats = (): { count: number; size: string } => {
  try {
    const cache = localStorage.getItem(CACHE_KEY);
    if (!cache) return { count: 0, size: '0 KB' };

    const cacheData: Record<string, CachedResponse> = JSON.parse(cache);
    const count = Object.keys(cacheData).length;
    const size = new Blob([cache]).size;
    const sizeKB = (size / 1024).toFixed(2);

    return { count, size: `${sizeKB} KB` };
  } catch (error) {
    return { count: 0, size: '0 KB' };
  }
};
