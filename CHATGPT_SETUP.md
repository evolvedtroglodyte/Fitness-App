# ChatGPT Food Parsing Setup Guide

## Overview

FitTerminal now includes intelligent AI-powered food parsing using ChatGPT (GPT-4-turbo). When you enter a food that's not in the local database, the app will automatically use ChatGPT to analyze and parse the nutritional information.

## Features

- **5 Specialized AI Prompts** for different food parsing scenarios:
  1. **Simple Food Parser**: Single items (e.g., "apple", "2 eggs")
  2. **Complex Meal Decomposer**: Multi-component dishes (e.g., "chicken burrito bowl with rice, beans, salsa")
  3. **Brand Recognition**: Restaurant/packaged foods (e.g., "McDonald's Big Mac", "Chipotle bowl")
  4. **Quantity Converter**: Smart unit conversion (e.g., "8oz steak", "2 cups rice")
  5. **Meal Suggester**: Handles uncertain inputs with alternatives

- **Smart Caching**: All ChatGPT responses are cached in localStorage for 7 days
- **Cost Optimization**: Local database checked first, ChatGPT only as fallback
- **Strict Error Handling**: Won't add food if parsing fails

## Setup Instructions

### Step 1: Get Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Give it a name (e.g., "FitTerminal")
5. Copy the API key (starts with `sk-...`)

**Important**: Keep this key secure! Never share it or commit it to version control.

### Step 2: Add API Key to .env File

1. Open the `.env` file in the project root (already created)
2. Replace `your_api_key_here` with your actual API key:

```env
VITE_OPENAI_API_KEY=sk-your-actual-api-key-here
```

3. Save the file
4. Restart the dev server if it's running:
   ```bash
   # Stop the server (Ctrl+C) and restart
   npm run dev
   ```

### Step 3: Test the Integration

Try entering foods that aren't in the local database:

**Simple Foods:**
- "kiwi" (not in database)
- "tilapia" (not in database)
- "croissant" (not in database)

**Complex Meals:**
- "chicken burrito bowl with rice, black beans, cheese, and guacamole"
- "caesar salad with grilled chicken"
- "turkey sandwich with lettuce and tomato"

**Brand Foods:**
- "Chipotle chicken bowl"
- "McDonald's Big Mac"
- "Starbucks grande latte"

**Quantity Conversions:**
- "8oz ribeye steak"
- "3 cups cooked pasta"
- "200g grilled salmon"

### How It Works

1. **Local Database First**: The app checks the built-in database (66 common foods)
2. **Manual Calories**: You can still use "custom meal 350cal" syntax
3. **ChatGPT Fallback**: If not found, ChatGPT analyzes the food
4. **Smart Caching**: Response is cached for instant re-use
5. **AI Indicator**: You'll see "Analyzing with AI..." when ChatGPT is processing

### Cost Considerations

- **GPT-4-turbo pricing**: ~$0.01 per 1,000 tokens
- **Average food query**: ~100-200 tokens (~$0.002 per query)
- **Caching**: Repeated queries are FREE (served from localStorage)
- **Estimated cost**: ~$0.02-0.05 per day for typical use

### Troubleshooting

**Error: "OpenAI API key not found"**
- Check that `.env` file exists in project root
- Verify the key is on a line starting with `VITE_OPENAI_API_KEY=`
- Make sure there are no quotes around the key
- Restart the dev server after adding the key

**Error: API request failed**
- Check your OpenAI account has credits
- Verify your API key is valid and active
- Check your internet connection
- View browser console for detailed error messages

**Food not being parsed correctly**
- Try being more specific (e.g., "grilled chicken breast" instead of "meat")
- Include quantities for better accuracy (e.g., "2 slices pizza")
- For brands, include the full name (e.g., "McDonald's Quarter Pounder")

### Privacy & Security

- **API Key**: Stored locally in `.env` (excluded from git)
- **Food Data**: Cached locally in browser localStorage
- **No Server**: All data stays on your device
- **OpenAI Privacy**: Data sent to OpenAI follows their [privacy policy](https://openai.com/policies/privacy-policy)

### Cache Management

The app automatically manages the cache, but you can:

- **View cache stats**: Check browser console for cache info
- **Clear cache**: Clear browser localStorage or wait 7 days for auto-expiry
- **Manual cleanup**: Old entries are automatically removed after 7 days

### Example Outputs

**Input**: "Chipotle chicken bowl"
```json
{
  "name": "Chipotle Chicken Bowl",
  "calories": 650,
  "protein": 42g,
  "carbs": 70g,
  "fat": 21g,
  "serving": "1 bowl",
  "confidence": "high"
}
```

**Input**: "8oz grilled salmon"
```json
{
  "name": "Grilled Salmon",
  "calories": 468,
  "protein": 63g,
  "carbs": 0g,
  "fat": 22g,
  "serving": "8 oz",
  "confidence": "high"
}
```

## Support

If you encounter issues:
1. Check the browser console for detailed error messages
2. Verify your OpenAI API key is valid
3. Try a different food description
4. Fall back to manual entry: "custom meal 500cal"

## Future Enhancements

- Image recognition (upload food photos)
- Meal photo analysis
- Barcode scanning
- Recipe breakdown
- Restaurant menu integration
