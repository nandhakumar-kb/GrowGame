# GrowGame - Developer Reference Guide

## 📁 Project Structure

```
src/
├── components/          # UI Components
│   ├── Navbar.jsx                  # Navigation bar with all buttons
│   ├── HomePage.jsx                # Game selection home page
│   ├── GameNavigation.jsx          # Back/Next game navigation
│   ├── SettingsPanel.jsx           # Settings modal UI
│   ├── StatsDashboard.jsx          # Statistics display
│   ├── AchievementsModal.jsx       # Achievements browser
│   ├── InstallPrompt.jsx           # PWA install prompt
│   └── AchievementNotification.jsx # Achievement unlock toast
│
├── games/              # Game Components (7 games)
│   ├── Snake.jsx
│   ├── Tetris.jsx
│   ├── TicTacToe.jsx
│   ├── Pong.jsx
│   ├── Game2048.jsx
│   ├── MemoryMatch.jsx
│   └── Breakout.jsx
│
├── hooks/              # Custom React Hooks
│   ├── useLocalStorage.js    # Persistent state hook
│   ├── useKeyPress.js        # Keyboard event handler
│   ├── useHighScore.js       # High score management
│   ├── useGameLoop.js        # Game loop with FPS control
│   └── index.js              # Barrel exports
│
├── utils/              # Utility Modules
│   ├── soundManager.js        # Audio system (10 sounds)
│   ├── statsManager.js        # Statistics tracking
│   ├── achievementsManager.js # Achievement system (18 achievements)
│   └── pwaUtils.js            # PWA helpers
│
├── context/            # React Context
│   └── SettingsContext.jsx    # Global settings provider
│
├── constants/          # Configuration
│   └── games.js               # GAMES_LIST array
│
├── App.jsx            # Main app component
├── main.jsx           # Entry point
└── index.css          # Global styles

public/
├── manifest.json      # PWA manifest
├── sw.js             # Service worker
├── logo.png          # App icon
└── Gpay.jpg          # Donation QR code
```

## 🎯 Key Features Implemented

### 1. Custom Hooks System
```javascript
import { useLocalStorage, useKeyPress, useHighScore, useGameLoop } from './hooks';

// Usage examples:
const [value, setValue] = useLocalStorage('key', defaultValue);
useKeyPress({ 'ArrowUp': handleUp, 'ArrowDown': handleDown });
const [highScore, updateHighScore] = useHighScore('gameName');
useGameLoop(gameFunction, fps);
```

### 2. Sound Manager
```javascript
import soundManager from './utils/soundManager';

// 10 available sounds:
soundManager.playClick();      // UI clicks
soundManager.playSuccess();    // Positive actions
soundManager.playError();      // Mistakes
soundManager.playEat();        // Collection
soundManager.playCoin();       // Scoring
soundManager.playPowerUp();    // Level ups
soundManager.playJump();       // Movement
soundManager.playHit();        // Collisions
soundManager.playWin();        // Victory
soundManager.playLose();       // Game over

// Controls:
soundManager.setVolume(0.5);   // 0-1
soundManager.toggleMute();
soundManager.init();           // Initialize on user interaction
```

### 3. Statistics Manager
```javascript
import statsManager from './utils/statsManager';

// Record game sessions:
statsManager.recordScoreGame('snake', 150);
statsManager.recordWinLossGame('pong', true);
statsManager.recordDrawGame('tictactoe');
statsManager.recordMovesGame('memory', 18);

// Get stats:
const stats = statsManager.getStats();
const gameStats = statsManager.getGameStats('snake');
```

### 4. Achievements Manager
```javascript
import achievementsManager from './utils/achievementsManager';

// Get achievements:
const all = achievementsManager.getAllAchievements();
const unlocked = achievementsManager.getUnlockedAchievements();

// Check achievements (auto-called by statsManager):
const newUnlocks = achievementsManager.checkAchievements(stats);

// Progress:
const progress = achievementsManager.getProgress();
// Returns: { unlocked: 5, total: 18, percentage: 28 }
```

### 5. Settings Context
```javascript
import { useSettings } from './context/SettingsContext';

function MyComponent() {
  const { 
    darkMode, toggleDarkMode,
    soundEnabled, toggleSound,
    volume, setVolume,
    showAnimations, toggleAnimations,
    difficulty, setDifficulty
  } = useSettings();
  
  return <div>...</div>;
}
```

### 6. PWA Utilities
```javascript
import { 
  register, 
  isInstalled, 
  promptInstall,
  requestNotificationPermission 
} from './utils/pwaUtils';

// Check if installed:
if (isInstalled()) {
  console.log('App is installed!');
}

// Trigger install:
const accepted = await promptInstall();
```

## 🎮 Game Integration Pattern

Each game should:

1. **Import required utilities:**
```javascript
import soundManager from '../utils/soundManager';
import statsManager from '../utils/statsManager';
import { useHighScore } from '../hooks';
```

2. **Play sounds on events:**
```javascript
// On score
soundManager.playCoin();

// On collision
soundManager.playHit();

// On game over
soundManager.playLose();
```

3. **Record stats at game end:**
```javascript
useEffect(() => {
  if (gameOver) {
    statsManager.recordScoreGame('snake', score);
  }
}, [gameOver]);
```

## 📊 Component Communication

### Global State Flow:
```
SettingsContext
    ↓
  App.jsx
    ↓
All Components (via useSettings hook)
```

### Event-Based Communication:
```javascript
// Achievement unlocked event
window.addEventListener('achievement-unlocked', (event) => {
  const { achievement } = event.detail;
  // Handle unlock
});

// PWA installable event
window.addEventListener('pwa-installable', (event) => {
  // Show install prompt
});
```

## 🎨 UI/UX Guidelines

### Color Schemes:
- **Settings**: Purple gradient (#9333ea → #a855f7)
- **Statistics**: Blue gradient (#2563eb → #3b82f6)
- **Achievements**: Yellow/Gold gradient (#ca8a04 → #ea580c)
- **Donation**: Green gradient (#10b981 → #059669)
- **Install**: Purple gradient (brand colors)

### Animation Classes (already in index.css):
- `animate-fadeIn` - Fade in effect
- `animate-scaleIn` - Scale up with fade
- `animate-slideUp/Down/Left/Right` - Directional slides
- `animate-glow` - Pulsing glow effect
- `animate-float` - Floating animation
- `animate-bounce` - Bounce effect
- `animate-pulse` - Pulsing effect
- `animate-shimmer` - Shine effect

## 📱 PWA Configuration

### Service Worker Caching:
The service worker automatically caches:
- `/` (root)
- `/index.html`
- `/logo.png`
- `/Gpay.jpg`
- `/manifest.json`
- All imported JS/CSS (via Vite build)

### Manifest Configuration:
- Name: "GrowGame - Arcade Collection"
- Theme: Purple (#9333ea)
- Display: Standalone
- Icons: 192x192, 512x512

## 🔧 Development Commands

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📈 Achievement Tracking

Achievements are checked automatically after every game session. They're based on:
- Games played count
- High scores
- Win/loss records
- Playtime
- Special conditions

## 🎯 Best Practices

1. **Always initialize soundManager on user interaction**
2. **Use statsManager to record every game session**
3. **Check achievements are triggered via statsManager**
4. **Use custom hooks for common patterns**
5. **Keep components modular and reusable**
6. **Follow the established naming conventions**
7. **Test PWA features in production build**

## 🚀 Deployment Checklist

- [ ] Update manifest.json with correct URLs
- [ ] Replace placeholder icons with proper 192x192 and 512x512 icons
- [ ] Test service worker in production build
- [ ] Verify install prompt works on mobile
- [ ] Test offline functionality
- [ ] Check all achievements unlock correctly
- [ ] Verify sound effects work across browsers
- [ ] Test on various screen sizes
- [ ] Optimize images (logo.png, Gpay.jpg)
- [ ] Set up analytics (if needed)

## 📝 Future Enhancement Ideas

1. **Multiplayer**: Add online multiplayer for competitive games
2. **Leaderboards**: Global high score leaderboards
3. **Daily Challenges**: Special daily game modes
4. **More Games**: Expand the collection
5. **Themes**: Additional color themes beyond dark mode
6. **Tournaments**: Timed competitions with prizes
7. **Social**: Share achievements on social media
8. **Cloud Sync**: Backup stats and progress to cloud
9. **Mobile App**: Native iOS/Android versions
10. **Accessibility**: Enhanced keyboard navigation and screen reader support

---

**Built with**: React 18.3, Vite 5.3, Tailwind CSS 3.4, Web Audio API

**Last Updated**: October 26, 2025
