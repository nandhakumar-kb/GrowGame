// Achievements system for GrowGame

const ACHIEVEMENTS = {
  // Beginner achievements
  firstGame: {
    id: 'firstGame',
    title: 'First Steps',
    description: 'Play your first game',
    icon: '🎮',
    category: 'beginner',
    requirement: 1,
    type: 'gamesPlayed'
  },
  gameExplorer: {
    id: 'gameExplorer',
    title: 'Game Explorer',
    description: 'Try all 7 games',
    icon: '🗺️',
    category: 'beginner',
    requirement: 7,
    type: 'uniqueGames'
  },
  
  // Snake achievements
  snakeNovice: {
    id: 'snakeNovice',
    title: 'Snake Novice',
    description: 'Score 50 points in Snake',
    icon: '🐍',
    category: 'snake',
    requirement: 50,
    type: 'snakeScore'
  },
  snakeMaster: {
    id: 'snakeMaster',
    title: 'Snake Master',
    description: 'Score 200 points in Snake',
    icon: '🏆',
    category: 'snake',
    requirement: 200,
    type: 'snakeScore'
  },
  
  // Tetris achievements
  tetrisBuilder: {
    id: 'tetrisBuilder',
    title: 'Tetris Builder',
    description: 'Clear 10 lines in Tetris',
    icon: '🧱',
    category: 'tetris',
    requirement: 10,
    type: 'tetrisLines'
  },
  tetrisExpert: {
    id: 'tetrisExpert',
    title: 'Tetris Expert',
    description: 'Reach level 5 in Tetris',
    icon: '⭐',
    category: 'tetris',
    requirement: 5,
    type: 'tetrisLevel'
  },
  
  // Tic-Tac-Toe achievements
  ticTacWinner: {
    id: 'ticTacWinner',
    title: 'Tic-Tac Winner',
    description: 'Win 5 Tic-Tac-Toe games',
    icon: '⭕',
    category: 'tictactoe',
    requirement: 5,
    type: 'tictactoeWins'
  },
  
  // Pong achievements
  pongChampion: {
    id: 'pongChampion',
    title: 'Pong Champion',
    description: 'Win 3 Pong matches',
    icon: '🏓',
    category: 'pong',
    requirement: 3,
    type: 'pongWins'
  },
  
  // 2048 achievements
  puzzle2048: {
    id: 'puzzle2048',
    title: '2048 Achiever',
    description: 'Reach 2048 tile',
    icon: '🔢',
    category: '2048',
    requirement: 2048,
    type: '2048Tile'
  },
  puzzle1024: {
    id: 'puzzle1024',
    title: 'Halfway There',
    description: 'Reach 1024 tile',
    icon: '📈',
    category: '2048',
    requirement: 1024,
    type: '2048Tile'
  },
  
  // Memory Match achievements
  memorySharp: {
    id: 'memorySharp',
    title: 'Sharp Memory',
    description: 'Complete Memory Match in 20 moves or less',
    icon: '🧩',
    category: 'memory',
    requirement: 20,
    type: 'memoryMoves'
  },
  
  // Breakout achievements
  breakoutDestroyer: {
    id: 'breakoutDestroyer',
    title: 'Brick Destroyer',
    description: 'Score 500 points in Breakout',
    icon: '🎯',
    category: 'breakout',
    requirement: 500,
    type: 'breakoutScore'
  },
  
  // Milestone achievements
  dedicated: {
    id: 'dedicated',
    title: 'Dedicated Player',
    description: 'Play 50 games total',
    icon: '💪',
    category: 'milestone',
    requirement: 50,
    type: 'gamesPlayed'
  },
  veteran: {
    id: 'veteran',
    title: 'Veteran Gamer',
    description: 'Play 100 games total',
    icon: '🎖️',
    category: 'milestone',
    requirement: 100,
    type: 'gamesPlayed'
  },
  marathoner: {
    id: 'marathoner',
    title: 'Marathon Player',
    description: 'Play for 1 hour total',
    icon: '⏱️',
    category: 'milestone',
    requirement: 3600,
    type: 'playtime'
  },
  
  // Special achievements
  perfectionist: {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: 'Get high score in all games',
    icon: '✨',
    category: 'special',
    requirement: 7,
    type: 'allHighScores'
  },
  earlyBird: {
    id: 'earlyBird',
    title: 'Early Bird',
    description: 'Play within first week of installing',
    icon: '🐦',
    category: 'special',
    requirement: 1,
    type: 'earlyAdopter'
  }
};

class AchievementsManager {
  constructor() {
    this.achievementsKey = 'growgame-achievements';
    this.unlockedKey = 'growgame-unlocked';
    this.installDateKey = 'growgame-install-date';
    this.init();
  }

  init() {
    // Set install date if not set
    if (!localStorage.getItem(this.installDateKey)) {
      localStorage.setItem(this.installDateKey, Date.now().toString());
    }

    // Initialize unlocked achievements
    if (!localStorage.getItem(this.unlockedKey)) {
      localStorage.setItem(this.unlockedKey, JSON.stringify([]));
    }
  }

  getAllAchievements() {
    return ACHIEVEMENTS;
  }

  getUnlockedAchievements() {
    try {
      const unlocked = localStorage.getItem(this.unlockedKey);
      return unlocked ? JSON.parse(unlocked) : [];
    } catch (error) {
      console.error('Failed to load unlocked achievements:', error);
      return [];
    }
  }

  isUnlocked(achievementId) {
    const unlocked = this.getUnlockedAchievements();
    return unlocked.includes(achievementId);
  }

  unlockAchievement(achievementId) {
    if (this.isUnlocked(achievementId)) {
      return false; // Already unlocked
    }

    const unlocked = this.getUnlockedAchievements();
    unlocked.push(achievementId);
    
    try {
      localStorage.setItem(this.unlockedKey, JSON.stringify(unlocked));
      
      // Trigger achievement unlock event
      const achievement = ACHIEVEMENTS[achievementId];
      const event = new CustomEvent('achievement-unlocked', {
        detail: { achievement }
      });
      window.dispatchEvent(event);
      
      return true; // Newly unlocked
    } catch (error) {
      console.error('Failed to unlock achievement:', error);
      return false;
    }
  }

  checkAchievements(stats) {
    const newlyUnlocked = [];

    // Check each achievement
    Object.keys(ACHIEVEMENTS).forEach(key => {
      if (this.isUnlocked(key)) return;

      const achievement = ACHIEVEMENTS[key];
      let shouldUnlock = false;

      switch (achievement.type) {
        case 'gamesPlayed':
          shouldUnlock = stats.totalGamesPlayed >= achievement.requirement;
          break;

        case 'uniqueGames':
          const uniqueGames = Object.values(stats.gamesStats).filter(g => g.played > 0).length;
          shouldUnlock = uniqueGames >= achievement.requirement;
          break;

        case 'snakeScore':
          shouldUnlock = stats.gamesStats.snake?.highScore >= achievement.requirement;
          break;

        case 'tetrisLines':
          shouldUnlock = stats.gamesStats.tetris?.linesCleared >= achievement.requirement;
          break;

        case 'tetrisLevel':
          shouldUnlock = stats.gamesStats.tetris?.maxLevel >= achievement.requirement;
          break;

        case 'tictactoeWins':
          shouldUnlock = stats.gamesStats.tictactoe?.wins >= achievement.requirement;
          break;

        case 'pongWins':
          shouldUnlock = stats.gamesStats.pong?.wins >= achievement.requirement;
          break;

        case '2048Tile':
          shouldUnlock = stats.gamesStats['2048']?.maxTile >= achievement.requirement;
          break;

        case 'memoryMoves':
          const bestMoves = stats.gamesStats.memory?.bestMoves;
          shouldUnlock = bestMoves && bestMoves <= achievement.requirement && bestMoves < 999;
          break;

        case 'breakoutScore':
          shouldUnlock = stats.gamesStats.breakout?.highScore >= achievement.requirement;
          break;

        case 'playtime':
          shouldUnlock = stats.totalPlaytime >= achievement.requirement;
          break;

        case 'allHighScores':
          const gamesWithScores = ['snake', 'tetris', '2048', 'breakout'];
          const hasAllScores = gamesWithScores.every(game => 
            stats.gamesStats[game]?.highScore > 0
          );
          shouldUnlock = hasAllScores;
          break;

        case 'earlyAdopter':
          const installDate = parseInt(localStorage.getItem(this.installDateKey) || '0');
          const daysSinceInstall = (Date.now() - installDate) / (1000 * 60 * 60 * 24);
          shouldUnlock = daysSinceInstall <= 7;
          break;
      }

      if (shouldUnlock) {
        if (this.unlockAchievement(key)) {
          newlyUnlocked.push(achievement);
        }
      }
    });

    return newlyUnlocked;
  }

  getProgress() {
    const total = Object.keys(ACHIEVEMENTS).length;
    const unlocked = this.getUnlockedAchievements().length;
    return {
      unlocked,
      total,
      percentage: Math.round((unlocked / total) * 100)
    };
  }

  resetAll() {
    localStorage.setItem(this.unlockedKey, JSON.stringify([]));
  }
}

// Export singleton instance
const achievementsManager = new AchievementsManager();
export default achievementsManager;
