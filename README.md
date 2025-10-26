# GrowGame - Classic Arcade Collection

A modern web-based collection of 7 classic arcade games built with React, featuring PWA support, achievements, statistics tracking, and more.

## 🎮 Features

- **7 Classic Games**: Snake, Tetris, Tic-Tac-Toe, Pong, 2048, Memory Match, Breakout
- **Progressive Web App (PWA)**: Install and play offline
- **Sound Effects**: Interactive audio feedback
- **Achievements System**: 18+ unlockable achievements
- **Statistics Tracking**: Track your progress across all games
- **Settings**: Customize sound, volume, animations, and difficulty
- **Responsive Design**: Works on desktop and mobile devices
- **Keyboard Navigation**: Quick game switching with Ctrl+Arrow keys

## 📂 Project Structure

```
GrowGame/
├── docs/                    # Documentation
│   ├── README.md           # User guide
│   ├── DEVELOPER_GUIDE.md  # Developer documentation
│   └── TESTING_CHECKLIST.md # QA procedures
├── public/                  # Static assets
│   ├── assets/             # Images and media
│   │   ├── logo.png
│   │   └── Gpay.jpg
│   ├── manifest.json       # PWA manifest
│   └── sw.js              # Service worker
├── src/
│   ├── components/         # React components
│   │   ├── AchievementNotification.jsx
│   │   ├── AchievementsModal.jsx
│   │   ├── GameNavigation.jsx
│   │   ├── HomePage.jsx
│   │   ├── InstallPrompt.jsx
│   │   ├── Navbar.jsx
│   │   ├── SettingsPanel.jsx
│   │   └── StatsDashboard.jsx
│   ├── constants/          # Game constants
│   │   └── games.js
│   ├── context/            # React context
│   │   └── SettingsContext.jsx
│   ├── games/              # Game components
│   │   ├── Breakout.jsx
│   │   ├── Game2048.jsx
│   │   ├── MemoryMatch.jsx
│   │   ├── Pong.jsx
│   │   ├── Snake.jsx
│   │   ├── Tetris.jsx
│   │   └── TicTacToe.jsx
│   ├── hooks/              # Custom React hooks
│   │   ├── useGameLoop.js
│   │   ├── useHighScore.js
│   │   ├── useKeyPress.js
│   │   ├── useLocalStorage.js
│   │   └── index.js
│   ├── utils/              # Utility functions
│   │   ├── achievementsManager.js
│   │   ├── pwaUtils.js
│   │   ├── soundManager.js
│   │   └── statsManager.js
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── index.html              # HTML template
├── package.json            # Dependencies
├── tailwind.config.js      # Tailwind configuration
├── vite.config.js          # Vite configuration
└── .gitignore             # Git ignore rules
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd GrowGame
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Open browser at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 🎯 Games

### 1. Snake
- Grow by eating food
- Avoid walls and self-collision
- Speed increases with score

### 2. Tetris
- Clear lines by filling rows
- Rotate and position falling blocks
- Level up for faster gameplay

### 3. Tic-Tac-Toe
- Classic 3x3 grid game
- Play against yourself
- Track wins, losses, and draws

### 4. Pong
- Two-player paddle game
- First to 5 points wins
- Use W/S and Arrow keys

### 5. 2048
- Combine tiles to reach 2048
- Swipe in 4 directions
- Strategic number puzzle

### 6. Memory Match
- Match pairs of emojis
- Minimize moves to win
- Memory and concentration game

### 7. Breakout
- Break all bricks with ball
- Three lives per game
- Classic arcade action

## ⌨️ Controls

### Global
- **Home**: Click logo
- **Ctrl + ←/→**: Switch games
- **Esc**: Back to home

### Game-Specific
- **Snake**: Arrow keys, WASD
- **Tetris**: Arrow keys, Space (rotate)
- **Tic-Tac-Toe**: Mouse click
- **Pong**: W/S (left), ↑/↓ (right)
- **2048**: Arrow keys
- **Memory Match**: Mouse click
- **Breakout**: ←/→ arrows

## 🔧 Technology Stack

- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Web Audio API** - Sound effects
- **Service Workers** - PWA functionality
- **LocalStorage** - Data persistence

## 📱 PWA Features

- **Offline Play**: Works without internet
- **Install to Home Screen**: Native app-like experience
- **Auto Updates**: Background updates
- **Push Notifications**: Ready for future features

## 🏆 Achievements

Unlock 18+ achievements by:
- Playing games
- Reaching high scores
- Completing challenges
- Exploring all features

## 📊 Statistics

Track your gaming performance:
- Total games played
- Total playtime
- Per-game statistics
- High scores
- Win rates

## ⚙️ Settings

Customize your experience:
- **Sound**: Enable/disable audio
- **Volume**: Adjust audio levels
- **Dark Mode**: Toggle theme
- **Animations**: Control visual effects
- **Difficulty**: Adjust game speed

## 💝 Support

Support development via Google Pay using the QR code in the Donate section.

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions welcome! See `docs/DEVELOPER_GUIDE.md` for development guidelines.

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Enjoy playing! 🎮✨**
