# 🎮 GrowGame - Classic Arcade Collection

> A modern, feature-rich Progressive Web App featuring 7 classic arcade games with achievements, statistics tracking, and offline support.

![React](https://img.shields.io/badge/React-18.3-blue)
![Vite](https://img.shields.io/badge/Vite-5.3-purple)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-cyan)
![PWA](https://img.shields.io/badge/PWA-Ready-green)

---

## ✨ Features

### 🎮 **7 Classic Games**
- **Snake** - Classic snake game with smooth controls
- **Tetris** - Block puzzle with line clearing
- **Tic-Tac-Toe** - Two-player strategy game
- **Pong** - Classic paddle game
- **2048** - Number merging puzzle
- **Memory Match** - Card matching game
- **Breakout** - Brick-breaking arcade action

### 🔊 **Audio System**
- 10 unique sound effects
- Volume control (0-100%)
- Mute functionality
- Per-action sound feedback

### ⚙️ **Settings**
- Sound enable/disable
- Volume slider
- Animation controls
- Difficulty selection
- Persistent preferences

### 📊 **Statistics Dashboard**
- Total games played
- Playtime tracking
- Per-game statistics
- High score tracking
- Win/loss records

### 🏆 **Achievements System**
- 18 unlockable achievements
- 6 categories (Beginner, Snake, Tetris, etc.)
- Progress tracking
- Real-time unlock notifications

### 📱 **Progressive Web App**
- Installable on any device
- Offline functionality
- Service worker caching
- Home screen shortcuts
- Native app experience

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd GrowGame

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development

The app will be available at `http://localhost:5173`

---

## 📂 Project Structure

```
GrowGame/
├── public/
│   ├── manifest.json        # PWA manifest
│   ├── sw.js               # Service worker
│   ├── logo.png            # App icon
│   └── Gpay.jpg            # Donation QR
│
├── src/
│   ├── components/         # UI components (8 files)
│   ├── games/             # Game implementations (7 files)
│   ├── hooks/             # Custom React hooks (4 hooks)
│   ├── utils/             # Utilities (sound, stats, achievements, PWA)
│   ├── context/           # React Context (settings)
│   ├── constants/         # Configuration
│   ├── App.jsx            # Main component
│   └── main.jsx           # Entry point
│
├── DEVELOPER_GUIDE.md     # Technical documentation
├── TESTING_CHECKLIST.md   # QA checklist
└── README.md              # This file
```

---

## 🎯 Key Technologies

- **React 18.3** - UI framework
- **Vite 5.3** - Build tool and dev server
- **Tailwind CSS 3.4** - Utility-first CSS
- **Web Audio API** - Sound effects system
- **Service Workers** - Offline functionality
- **LocalStorage** - Data persistence

---

## 🎮 How to Play

### Navigation
- Click game cards on home page to start
- Use **Back** button to return home
- Use **Prev/Next** buttons to switch games
- Keyboard: `Ctrl + ←/→` for game navigation

### Game Controls
- **Snake**: Arrow keys to move
- **Tetris**: Arrow keys (↓ drop, ↑ rotate, ←/→ move)
- **Tic-Tac-Toe**: Click cells to play
- **Pong**: W/S for left paddle, ↑/↓ for right
- **2048**: Arrow keys to slide tiles
- **Memory Match**: Click cards to flip
- **Breakout**: ←/→ to move paddle, Space to start

---

## 🏆 Achievements

Unlock 18 achievements across 6 categories:

- 🎮 **Beginner**: First game, all games tried
- 🐍 **Snake**: Score milestones
- 🧱 **Tetris**: Line clearing, level progression
- ⭕ **Tic-Tac-Toe, Pong, 2048**: Win conditions
- 🧩 **Memory, Breakout**: Performance goals
- ⭐ **Milestones**: Play count, playtime
- ✨ **Special**: Unique achievements

---

## 📱 Installing as PWA

### Desktop (Chrome/Edge)
1. Click install icon in address bar
2. Or use three-dot menu → "Install GrowGame"

### Mobile (iOS Safari)
1. Tap Share button
2. Scroll and tap "Add to Home Screen"

### Mobile (Android Chrome)
1. Tap three-dot menu
2. Tap "Install app" or "Add to Home screen"

---

## 🔧 Configuration

### Customizing the App

**Sounds**: Edit `src/utils/soundManager.js`
- Add/modify sound effects
- Adjust frequencies and durations

**Achievements**: Edit `src/utils/achievementsManager.js`
- Add new achievements
- Modify unlock conditions

**Games**: Add new games in `src/games/`
- Follow existing game patterns
- Update `src/constants/games.js`

**Styling**: Modify `src/index.css`
- Custom animations
- Color schemes
- Utility classes

---

## 📊 Statistics Tracking

The app automatically tracks:
- Total games played
- Playtime per session
- High scores per game
- Win/loss records
- Achievement progress

All data stored locally in browser's LocalStorage.

---

## 🔐 Privacy

- ✅ No external API calls
- ✅ All data stored locally
- ✅ No user tracking
- ✅ No cookies
- ✅ No analytics (by default)
- ✅ Works completely offline

---

## 🎨 Customization

### Themes
Modify color gradients in components:
- Purple: Settings
- Blue: Statistics
- Yellow/Gold: Achievements
- Green: Donation

### Sounds
Replace or add sounds in `soundManager.js`:
```javascript
playCustomSound() {
  this.playSound(frequency, duration, type);
}
```

### Games
Add new games:
1. Create game component in `src/games/`
2. Add to `GAMES_LIST` in `src/constants/games.js`
3. Add route in `App.jsx`
4. Add achievements in `achievementsManager.js`

---

## 🐛 Troubleshooting

### Sounds Not Playing
- Ensure user has interacted with page first
- Check browser sound permissions
- Verify volume not muted in settings

### PWA Not Installing
- Requires HTTPS (except localhost)
- Check manifest.json is accessible
- Verify service worker registered

### Stats Not Saving
- Check browser LocalStorage not disabled
- Clear cache and reload
- Check for localStorage quota errors

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly (use TESTING_CHECKLIST.md)
5. Submit a pull request

---

## 📝 License

MIT License - feel free to use for personal or commercial projects.

---

## 💝 Support

If you enjoy GrowGame, consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting features
- 💰 Supporting via the in-app donation button

---

## 📞 Contact

- **Issues**: [GitHub Issues](your-repo-url/issues)
- **Email**: your-email@example.com
- **Website**: your-website.com

---

## 🎉 Acknowledgments

Built with modern web technologies and best practices:
- React team for the amazing framework
- Vite team for lightning-fast tooling
- Tailwind CSS for utility-first styling
- Web standards for PWA capabilities

---

## 📈 Roadmap

Future enhancements:
- [ ] Multiplayer support
- [ ] Global leaderboards
- [ ] Daily challenges
- [ ] More games
- [ ] Cloud save sync
- [ ] Social sharing
- [ ] Mobile native apps

---

## 🏅 Version History

### v1.0.0 (Current)
- ✅ 7 classic games
- ✅ Sound system
- ✅ Settings panel
- ✅ PWA support
- ✅ Statistics dashboard
- ✅ 18 achievements
- ✅ Full offline support

---

**Made with ❤️ and React**

Enjoy playing GrowGame! 🎮✨
