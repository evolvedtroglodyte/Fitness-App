# Apple Fitness Design Patterns - Quick Reference Guide

A condensed, scannable reference for implementing Apple Fitness design patterns in FitTerminal.

---

## Activity Rings - At a Glance

### Colors (Standard)
```javascript
const RING_COLORS = {
  move: '#FF0055',     // Red
  exercise: '#00FF00', // Green
  stand: '#00D4FF'     // Cyan
};

// FitTerminal Adaptation
const TERMINAL_RINGS = {
  calories: '#FF6B35',  // Terminal Orange
  protein: '#4ECDC4',   // Cyan
  carbs: '#FFA726',     // Amber
  fat: '#F7B801'        // Yellow
};
```

### Dimensions
- Stroke width: 10-12px
- Gap between rings: 8-10px
- Outer margin: Same as gap
- Background: Pure black (#000000)

### Animation
```javascript
{
  type: "spring",
  stiffness: 300,
  damping: 20,
  duration: 1.0
}
```

---

## Typography Scale

### SF Font Sizes (iOS Standard)
```
Large Title:    34pt
Title 1:        28pt
Title 2:        22pt
Title 3:        20pt
Headline:       17pt
Body:           17pt (default)
Callout:        16pt
Subheadline:    15pt
Footnote:       13pt
Caption 1:      12pt
Caption 2:      11pt (minimum)
```

### FitTerminal Mapping
```css
.text-display {
  font-family: 'JetBrains Mono', monospace;
  font-size: 34px;
}

.text-heading {
  font-family: 'Inter', sans-serif;
  font-size: 22px;
}

.text-body {
  font-family: 'Inter', sans-serif;
  font-size: 17px;
  line-height: 1.5;
}

.text-caption {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  color: #A0A0A0;
}
```

---

## Spacing System (4pt Grid)

```javascript
const SPACING = {
  xxs: '4px',   // Inline elements
  xs: '8px',    // Related items
  s: '12px',    // List items
  m: '16px',    // Section padding
  l: '24px',    // Card spacing
  xl: '32px',   // Major sections
  xxl: '48px',  // Page margins
  xxxl: '64px'  // Hero spacing
};
```

### Touch Targets
- Minimum: 44x44pt
- Recommended: 48x48pt
- Spacing between: 8pt

---

## Color Palette

### Terminal Theme
```javascript
const TERMINAL_COLORS = {
  green: '#10B981',
  amber: '#F59E0B',
  red: '#EF4444',
  cyan: '#06B6D4'
};

const FITNESS_COLORS = {
  primary: '#FB923C',
  secondary: '#67E8F9',
  success: '#34D399',
  warning: '#FBBF24',
  error: '#F87171'
};

const DARK_THEME = {
  background: '#000000',
  surface: '#0A0A0A',
  surfaceLight: '#1A1A1A',
  text: '#F0F0F0',
  textMuted: '#A0A0A0',
  border: '#2A2A2A'
};
```

### Intensity Zones
```javascript
const INTENSITY = {
  resting: '#6E7B8B',
  warmup: '#FFA500',
  cardio: '#FF6B35',
  peak: '#FF0000',
  recovery: '#4ECDC4'
};
```

---

## Animations

### Spring Presets
```javascript
const SPRINGS = {
  gentle: { stiffness: 120, damping: 14 },
  wobbly: { stiffness: 180, damping: 12 },
  stiff: { stiffness: 300, damping: 20 },
  slow: { stiffness: 280, damping: 60 }
};
```

### Common Transitions
```javascript
// Button hover
{ scale: 1.05, transition: { duration: 0.2 } }

// Button press
{ scale: 0.95, transition: { duration: 0.1 } }

// Modal enter
{
  opacity: [0, 1],
  y: [20, 0],
  transition: { duration: 0.3 }
}

// Success
{
  scale: [1, 1.05, 1],
  transition: { duration: 0.3 }
}

// Error shake
{
  x: [0, -10, 10, -5, 5, 0],
  transition: { duration: 0.4 }
}
```

### Loading States
```javascript
// Skeleton shimmer
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
// Duration: 1.5s, infinite

// Spinner rotation
@keyframes spin {
  to { transform: rotate(360deg); }
}
// Duration: 1s, linear
```

---

## Celebration Patterns

### Ring Closure Animation
```javascript
const celebrateRing = {
  // 1. Ring glows
  scale: [1, 1.05, 1],
  filter: 'drop-shadow(0 0 20px currentColor)',

  // 2. Particles burst
  particles: {
    count: 20,
    spread: 360,
    velocity: 5,
    colors: [ringColor]
  },

  // 3. Checkmark appears
  checkmark: {
    scale: [0, 1.2, 1],
    opacity: [0, 1]
  },

  // Total duration: 2s
};
```

### Achievement Toast
```javascript
const achievementToast = {
  enter: {
    y: [-100, 0],
    opacity: [0, 1],
    scale: [0.9, 1]
  },
  exit: {
    y: [0, -100],
    opacity: [1, 0]
  },
  duration: 3000, // Auto-dismiss
};
```

---

## Interaction Patterns

### Gestures
```javascript
const GESTURES = {
  tap: 'select/activate',
  longPress: 'context menu (400ms)',
  swipeLeft: 'delete/next',
  swipeRight: 'back/complete',
  pullDown: 'refresh',
  pinch: 'zoom'
};
```

### Keyboard Shortcuts
```javascript
const SHORTCUTS = {
  // Navigation
  'Tab': 'Next section',
  'Shift+Tab': 'Previous section',
  'Space': 'Fullscreen toggle',
  'Esc': 'Exit/cancel',

  // Actions
  'Enter': 'Submit',
  'Cmd/Ctrl+S': 'Save',
  'Cmd/Ctrl+N': 'New entry',
  'Cmd/Ctrl+/': 'Search',

  // Vim-style (optional)
  'h/j/k/l': 'Navigate',
  'gg': 'Top',
  'G': 'Bottom'
};
```

### Haptic Feedback (Visual Alternatives)
```javascript
const HAPTIC_VISUAL = {
  selection: { scale: 0.98, duration: 50 },
  success: { glow: '0 0 20px #10B981', duration: 200 },
  error: { shake: true, borderColor: '#EF4444' },
  impact: { scale: [1, 1.1, 1], duration: 400 }
};
```

---

## Data Visualization

### Chart Types
- **Bar Chart**: Daily/weekly aggregates
- **Line Chart**: Trends over time (max 3 lines)
- **Ring Chart**: Goal progress, ratios
- **Sparkline**: Micro-trends in cards

### Chart Styling
```javascript
const CHART_STYLE = {
  fontFamily: 'JetBrains Mono',
  fontSize: 12,
  gridColor: '#1A1A1A',
  gridStyle: 'dotted',
  lineWidth: 2,
  pointRadius: 4,
  colors: {
    primary: '#10B981',
    secondary: '#06B6D4',
    accent: '#FF6B35'
  }
};
```

### Trend Indicators
```javascript
// Calculate trend
const trend = ((current - previous) / previous) * 100;

// Display
const TrendBadge = () => (
  <span className={trend > 0 ? 'text-green' : 'text-red'}>
    {trend > 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}%
  </span>
);
```

---

## Smart Recommendations

### Food Suggestions Algorithm
```javascript
const getFoodSuggestions = () => {
  const suggestions = [];

  // 1. Time-based (30% weight)
  const mealType = getMealType(currentHour);
  suggestions.push(...getMealFoods(mealType));

  // 2. Frequency (30% weight)
  suggestions.push(...topFoods(recentFoods, 5));

  // 3. Macro deficit (40% weight)
  if (proteinDeficit > 20) {
    suggestions.push(...highProteinFoods);
  }

  return dedupe(suggestions).slice(0, 5);
};
```

### Workout Recommendations
```javascript
const getWorkoutSuggestions = () => {
  // Pattern detection
  const dayOfWeek = new Date().getDay();
  const historicalPattern = getWorkoutPattern(dayOfWeek);

  // Recovery aware
  const lastWorkout = getLastWorkout();
  const daysSince = getDaysSince(lastWorkout);

  if (daysSince < 2 && lastWorkout.intensity === 'high') {
    return 'Active recovery (light cardio)';
  }

  return historicalPattern || 'Full body workout';
};
```

---

## Accessibility

### WCAG 2.1 AA Requirements
- Text contrast: 4.5:1 (normal), 3:1 (large)
- UI contrast: 3:1
- Touch targets: 44x44pt minimum
- Keyboard navigation: All features
- Focus indicators: Visible (2px outline)

### ARIA Labels
```jsx
<button
  aria-label="Close calorie tracker"
  aria-pressed={isExpanded}
>
  <X aria-hidden="true" />
</button>

<div
  role="progressbar"
  aria-valuenow={progress}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-label="Daily calorie goal progress"
/>
```

---

## Component Patterns

### Card Structure
```jsx
<div className="card">
  {/* Header */}
  <div className="card-header">
    <Icon />
    <h3>Title</h3>
    <TrendBadge />
  </div>

  {/* Body */}
  <div className="card-body">
    <div className="metric-large">2,847</div>
    <div className="metric-label">steps</div>
  </div>

  {/* Footer */}
  <div className="card-footer">
    <Sparkline data={weekData} />
  </div>
</div>
```

### Ring Component
```jsx
<svg width="200" height="200">
  {rings.map(ring => (
    <g key={ring.name}>
      {/* Background */}
      <circle
        cx="100"
        cy="100"
        r={ring.radius}
        stroke="#333"
        strokeWidth={ring.strokeWidth}
        fill="none"
      />
      {/* Progress */}
      <motion.circle
        cx="100"
        cy="100"
        r={ring.radius}
        stroke={ring.color}
        strokeWidth={ring.strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={`${progress} ${circumference}`}
        initial={{ strokeDasharray: '0 1000' }}
        animate={{ strokeDasharray }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
    </g>
  ))}
</svg>
```

### Input with Autocomplete
```jsx
<div className="terminal-input">
  <span className="prompt">$</span>
  <input
    value={input}
    onChange={e => setInput(e.target.value)}
    onKeyDown={handleKeyDown}
    placeholder="add food 2 eggs..."
  />
  <span className="cursor">_</span>

  {suggestions.length > 0 && (
    <div className="suggestions">
      {suggestions.map(s => (
        <div
          key={s.id}
          onClick={() => selectSuggestion(s)}
          className="suggestion-item"
        >
          {s.name}
        </div>
      ))}
    </div>
  )}
</div>
```

---

## Performance Targets

### Load Times
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.0s
- Largest Contentful Paint: < 2.5s

### Runtime
- Animation FPS: 60fps
- Input lag: < 100ms
- Scroll smoothness: 60fps
- Bundle size: < 250KB initial

### Optimization Techniques
```javascript
// 1. Code splitting
const TrendChart = lazy(() => import('./TrendChart'));

// 2. Memoization
const expensiveCalc = useMemo(
  () => calculateTrends(data),
  [data]
);

// 3. Debouncing
const debouncedSearch = useMemo(
  () => debounce(search, 300),
  []
);

// 4. Virtual scrolling (for long lists)
<VirtualList
  height={600}
  itemCount={items.length}
  itemSize={60}
/>
```

---

## Implementation Checklist

### Phase 1: Foundation
- [ ] Color system implemented
- [ ] Typography scale applied
- [ ] Spacing system (4pt grid)
- [ ] Dark mode support
- [ ] Basic animations (spring)

### Phase 2: Core Features
- [ ] Ring system with progress animation
- [ ] Data entry with autocomplete
- [ ] Basic keyboard shortcuts
- [ ] Card components
- [ ] Trend indicators

### Phase 3: Intelligence
- [ ] Smart food recommendations
- [ ] Workout pattern detection
- [ ] Contextual tips
- [ ] Adaptive goals
- [ ] Reminder system

### Phase 4: Delight
- [ ] Ring closure celebrations
- [ ] Achievement system
- [ ] Streak tracking
- [ ] Personal records
- [ ] Micro-interactions

### Phase 5: Polish
- [ ] Loading states
- [ ] Error handling
- [ ] Empty states
- [ ] Onboarding flow
- [ ] Accessibility audit

---

## Common Pitfalls

### ❌ Don't
- Use generic toasts for achievements (make them special!)
- Animate everything (restraint is key)
- Ignore keyboard users
- Use colors below 3:1 contrast
- Make touch targets smaller than 44pt
- Overload with notifications
- Skip loading states
- Forget error states

### ✅ Do
- Use spring physics for natural motion
- Provide immediate visual feedback
- Support both mouse and keyboard
- Test at largest text size
- Make celebrations feel earned
- Batch less important notifications
- Show skeleton screens
- Animate errors with shake

---

## Testing Checklist

### Functional
- [ ] All keyboard shortcuts work
- [ ] Touch targets are tappable
- [ ] Animations don't block interaction
- [ ] Data persists correctly
- [ ] Calculations are accurate

### Visual
- [ ] Contrast ratios pass WCAG AA
- [ ] Layout works at all breakpoints
- [ ] Dark mode colors are correct
- [ ] Typography scales properly
- [ ] Spacing is consistent

### Performance
- [ ] Animations run at 60fps
- [ ] No layout shifts
- [ ] Images are optimized
- [ ] Bundle is under target size
- [ ] No memory leaks

### Accessibility
- [ ] Screen reader tested
- [ ] Keyboard navigation complete
- [ ] Focus indicators visible
- [ ] ARIA labels present
- [ ] Color not sole indicator

---

## Resources

### Tools
- Figma (Design): https://www.figma.com
- Framer Motion (Animation): https://www.framer.com/motion
- WebAIM (Contrast): https://webaim.org/resources/contrastchecker
- Chrome DevTools (Performance)

### Inspiration
- Apple Fitness+ app
- Apple Health app
- Strava mobile app
- Strong workout tracker
- MyFitnessPal

### Documentation
- Apple HIG: https://developer.apple.com/design/human-interface-guidelines
- WCAG 2.1: https://www.w3.org/WAI/WCAG21/quickref
- Framer Motion Docs: https://www.framer.com/motion/introduction

---

## Quick Wins (Easy Improvements)

1. **Add ring glow on hover** (5 min)
   ```css
   .ring:hover {
     filter: drop-shadow(0 0 8px currentColor);
   }
   ```

2. **Improve button feedback** (10 min)
   ```jsx
   <motion.button
     whileHover={{ scale: 1.05 }}
     whileTap={{ scale: 0.95 }}
   />
   ```

3. **Add loading skeleton** (15 min)
   ```jsx
   {isLoading ? <Skeleton /> : <Content />}
   ```

4. **Implement keyboard shortcuts** (20 min)
   ```javascript
   useKeyboard('Space', () => toggleFullscreen());
   ```

5. **Add trend indicators** (15 min)
   ```jsx
   <TrendBadge value={percentChange} />
   ```

---

**Remember:** Apple's design excellence comes from obsessive attention to detail. Start with the fundamentals, then iterate relentlessly. Every pixel matters. Every animation counts. Every interaction should feel delightful.

Good luck! 💪
