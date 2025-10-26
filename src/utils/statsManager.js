// Statistics tracking utility for GrowGame
import achievementsManager from './achievementsManager';

class StatsManager {
  constructor() {
    this.statsKey = 'growgame-stats';
    this.sessionStart = Date.now();
    this.initStats();
  }

  initStats() {
    const stats = this.getStats();
    if (!stats) {
      this.saveStats({
        totalGamesPlayed: 0,
        totalPlaytime: 0,
        gamesStats: {
          snake: { played: 0, highScore: 0, totalScore: 0 },
          tetris: { played: 0, highScore: 0, totalScore: 0 },
          tictactoe: { played: 0, wins: 0, losses: 0, draws: 0 },
          pong: { played: 0, wins: 0, losses: 0 },
          '2048': { played: 0, highScore: 0, totalScore: 0 },
          memory: { played: 0, bestMoves: 999, totalMoves: 0 },
          breakout: { played: 0, highScore: 0, totalScore: 0 }
        }
      });
    }
  }

  getStats() {
    try {
      const stats = localStorage.getItem(this.statsKey);
      return stats ? JSON.parse(stats) : null;
    } catch (error) {
      console.error('Failed to load stats:', error);
      return null;
    }
  }

  saveStats(stats) {
    try {
      localStorage.setItem(this.statsKey, JSON.stringify(stats));
    } catch (error) {
      console.error('Failed to save stats:', error);
    }
  }

  // Record a game session
  recordGame(game, data = {}) {
    const stats = this.getStats();
    if (!stats) return;

    // Increment total games played
    stats.totalGamesPlayed += 1;

    // Update playtime (calculate session time)
    const sessionTime = Math.floor((Date.now() - this.sessionStart) / 1000);
    stats.totalPlaytime += sessionTime;
    this.sessionStart = Date.now(); // Reset for next game

    // Update game-specific stats
    if (stats.gamesStats[game]) {
      stats.gamesStats[game].played += 1;

      // Update based on game type
      if (data.score !== undefined) {
        stats.gamesStats[game].totalScore = (stats.gamesStats[game].totalScore || 0) + data.score;
        if (data.score > (stats.gamesStats[game].highScore || 0)) {
          stats.gamesStats[game].highScore = data.score;
        }
      }

      if (data.win !== undefined) {
        stats.gamesStats[game].wins = (stats.gamesStats[game].wins || 0) + (data.win ? 1 : 0);
        stats.gamesStats[game].losses = (stats.gamesStats[game].losses || 0) + (data.win ? 0 : 1);
      }

      if (data.draw) {
        stats.gamesStats[game].draws = (stats.gamesStats[game].draws || 0) + 1;
      }

      if (data.moves !== undefined) {
        stats.gamesStats[game].totalMoves = (stats.gamesStats[game].totalMoves || 0) + data.moves;
        if (data.moves < (stats.gamesStats[game].bestMoves || 999)) {
          stats.gamesStats[game].bestMoves = data.moves;
        }
      }
    }

    this.saveStats(stats);
    
    // Check for achievements after updating stats
    achievementsManager.checkAchievements(stats);
  }

  // Quick methods for common game types
  recordScoreGame(game, score) {
    this.recordGame(game, { score });
  }

  recordWinLossGame(game, won) {
    this.recordGame(game, { win: won });
  }

  recordDrawGame(game) {
    this.recordGame(game, { draw: true });
  }

  recordMovesGame(game, moves) {
    this.recordGame(game, { moves });
  }

  // Get specific game stats
  getGameStats(game) {
    const stats = this.getStats();
    return stats?.gamesStats[game] || null;
  }

  // Reset all statistics
  resetAll() {
    this.initStats();
  }
}

// Export singleton instance
const statsManager = new StatsManager();
export default statsManager;
