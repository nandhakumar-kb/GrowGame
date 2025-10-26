class LeaderboardManager {
  constructor() {
    this.maxEntries = 10;
  }

  getLeaderboardKey(gameName) {
    return `growgame-leaderboard-${gameName}`;
  }

  getLeaderboard(gameName) {
    try {
      const key = this.getLeaderboardKey(gameName);
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
      return [];
    }
  }

  addScore(gameName, scoreData) {
    try {
      const key = this.getLeaderboardKey(gameName);
      let leaderboard = this.getLeaderboard(gameName);

      const entry = {
        score: scoreData.score,
        date: Date.now(),
        level: scoreData.level,
        moves: scoreData.moves,
      };

      leaderboard.push(entry);
      leaderboard.sort((a, b) => b.score - a.score);
      leaderboard = leaderboard.slice(0, this.maxEntries);

      localStorage.setItem(key, JSON.stringify(leaderboard));

      const rank = leaderboard.findIndex(e => 
        e.score === entry.score && e.date === entry.date
      ) + 1;

      return {
        rank,
        isTopScore: rank === 1,
        isTop3: rank <= 3,
        isTop10: rank <= 10
      };
    } catch (error) {
      console.error('Failed to add score:', error);
      return null;
    }
  }

  clearLeaderboard(gameName) {
    try {
      const key = this.getLeaderboardKey(gameName);
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Failed to clear leaderboard:', error);
      return false;
    }
  }

  isTopScore(gameName, score) {
    const leaderboard = this.getLeaderboard(gameName);
    if (leaderboard.length === 0) return true;
    return score > leaderboard[0].score;
  }

  isTop10Score(gameName, score) {
    const leaderboard = this.getLeaderboard(gameName);
    if (leaderboard.length < this.maxEntries) return true;
    return score > leaderboard[leaderboard.length - 1].score;
  }
}

export default new LeaderboardManager();
