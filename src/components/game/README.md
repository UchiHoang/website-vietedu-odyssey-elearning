# Trạng Quỳnh Mini-Game - Integration Guide

## Overview
Production-ready educational mini-game featuring the character Trạng Quỳnh for Grade 2 Math. Built with React, TypeScript, and TailwindCSS.

## Installation

The game is already integrated into the project at route `/classroom/trangquynh`.

## Features

✅ Story-driven gameplay with cutscenes  
✅ Multiple-choice quiz system  
✅ XP rewards and progress tracking  
✅ Badge system for achievements  
✅ localStorage persistence  
✅ Responsive design (mobile-first)  
✅ Accessibility (ARIA, keyboard navigation)  
✅ Vietnamese localization  
✅ Confetti celebrations  
✅ Performance-based feedback  

## File Structure

```
src/
├── components/game/
│   ├── TrangQuynhMiniGame.tsx    # Main game container
│   ├── CutscenePlayer.tsx        # Cutscene display
│   ├── QuestionCard.tsx          # Question UI
│   ├── HudXpBar.tsx             # Progress HUD
│   └── BadgeModal.tsx           # Badge awards
├── hooks/
│   └── useGameEngine.ts         # Core game logic
├── utils/
│   └── storyLoader.ts           # JSON data loader
├── data/
│   ├── story.grade2.trangquynh.json
│   └── curriculum.grade2.json
└── pages/
    └── TrangQuynhGame.tsx       # Route page
```

## Usage

### 1. Access the Game

Navigate to `/classroom/trangquynh` to play the game.

### 2. Integration with Homepage

Add a link from your homepage:

```tsx
import { Link } from "react-router-dom";

<Link to="/classroom/trangquynh">
  <Button>Chơi mini-game Trạng Quỳnh</Button>
</Link>
```

### 3. Custom Event Handlers

The main component accepts callback props:

```tsx
<TrangQuynhMiniGame
  onExit={() => navigate("/")}
  onBadgeEarned={(badgeId) => console.log("Badge earned:", badgeId)}
  onXpChange={(totalXp, delta) => console.log("XP changed:", totalXp)}
/>
```

## Design System Integration

The game uses CSS variables from your homepage `index.css`. Make sure these are defined:

```css
:root {
  --primary: [hsl values];
  --secondary: [hsl values];
  --background: [hsl values];
  --foreground: [hsl values];
  --card: [hsl values];
  --muted-foreground: [hsl values];
}
```

All colors use HSL format and semantic tokens - no direct color values.

## Data Structure

### Story Format (story.grade2.trangquynh.json)

```json
{
  "meta": {
    "title": "Trạng Quỳnh đi thi",
    "locale": "vi"
  },
  "prologue": [...],
  "nodes": [
    {
      "id": "n1",
      "title": "Level title",
      "activityRef": "grade2.c1.l1.a1",
      "badgeOnComplete": "badge-id",
      "cutscene": [...]
    }
  ]
}
```

### Curriculum Format (curriculum.grade2.json)

```json
{
  "grade": 2,
  "chapters": [
    {
      "lessons": [
        {
          "id": "lesson-1",
          "questions": [
            {
              "question": "37 + 28 = ?",
              "options": ["55", "65", "75", "85"],
              "correctAnswer": 1,
              "explanation": "..."
            }
          ]
        }
      ]
    }
  ]
}
```

## Progress Persistence

Progress is saved to `localStorage` with key: `trangquynh_progress`

```typescript
interface GameProgress {
  currentNodeIndex: number;
  completedNodes: string[];
  totalXp: number;
  earnedBadges: string[];
}
```

### Server API (Optional)

To sync progress to a server, modify `useGameEngine.ts`:

```typescript
const saveProgressToServer = async (progress: GameProgress) => {
  await fetch('/api/game/progress', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(progress)
  });
};
```

## Customization

### Adding New Levels

1. Add nodes to `story.grade2.trangquynh.json`
2. Add questions to `curriculum.grade2.json`
3. Link via `activityRef`

### Custom Badges

1. Add badge images to `public/assets/user/badges/`
2. Update `getBadgeInfo()` in `storyLoader.ts`:

```typescript
export const getBadgeInfo = (badgeId: string) => {
  const badges = {
    "my-badge": {
      name: "Huy hiệu mới",
      icon: "/assets/user/badges/my-badge.png",
      description: "Mô tả"
    }
  };
  return badges[badgeId];
};
```

### Performance Thresholds

Modify in `TrangQuynhMiniGame.tsx`:

```typescript
if (correctRate >= 90) performance = "excellent";  // Change 90
else if (correctRate >= 70) performance = "good";  // Change 70
```

## Accessibility

- ✅ Keyboard navigation (Tab, Enter, Escape)
- ✅ ARIA labels and roles
- ✅ Screen reader support
- ✅ Focus management
- ✅ Large touch targets (min 44x44px)

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Lazy loading for routes
- Image preloading for assets
- Optimized re-renders with React hooks
- localStorage caching

## Testing

Run tests:
```bash
npm test
```

Basic test coverage includes:
- Component rendering
- User interactions
- State management
- Progress persistence

## Analytics Integration (Optional)

Add analytics tracking:

```typescript
// In TrangQuynhMiniGame.tsx
const handleAnswer = (isCorrect: boolean) => {
  analytics.track('question_answered', {
    nodeId: currentNode.id,
    isCorrect,
    timestamp: Date.now()
  });
  // ... rest of logic
};
```

## Troubleshooting

### Images not loading
- Check paths in JSON files
- Ensure assets are in `public/assets/user/`

### Progress not saving
- Check localStorage is enabled
- Check browser console for errors

### Colors look wrong
- Verify CSS variables in `index.css`
- Ensure HSL format (not RGB)

## Support

For issues or questions, check:
- Console logs for errors
- Network tab for asset loading
- localStorage in DevTools

## License

Original artwork only. See `legalNote` in story.grade2.trangquynh.json.
