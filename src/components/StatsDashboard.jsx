import React, { useState, useEffect } from 'react';
import soundManager from '../utils/soundManager';
const StatsDashboard = ({ onClose }) => {
  const [stats, setStats] = useState({
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
  useEffect(() => {
    loadStats();
  }, []);
  const loadStats = () => {
    try {
      const savedStats = localStorage.getItem('growgame-stats');
      if (savedStats) {
        setStats(JSON.parse(savedStats));
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m ${secs}s`;
  };
  const resetStats = () => {
    if (confirm('Are you sure you want to reset all statistics? This cannot be undone!')) {
      soundManager.playClick();
      localStorage.removeItem('growgame-stats');
      setStats({
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
      soundManager.playSuccess();
    }
  };
  const handleClose = () => {
    soundManager.playClick();
    onClose();
  };
  const gameNames = {
    snake: '🐍 Snake',
    tetris: '🧱 Tetris',
    tictactoe: '⭕ Tic-Tac-Toe',
    pong: '🏓 Pong',
    '2048': '🔢 2048',
    memory: '🧩 Memory Match',
    breakout: '🎯 Breakout'
  };
  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="stats-title"
      aria-describedby="stats-description"
    >
      <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-purple-500/30 animate-scaleIn">
        {}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            aria-label="Close statistics dashboard"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 id="stats-title" className="text-3xl font-bold text-white flex items-center gap-3">
            <span aria-hidden="true">📊</span> Statistics Dashboard
          </h2>
          <p id="stats-description" className="text-purple-100 mt-2">Your gaming journey at a glance</p>
        </div>
        {}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {}
          <section aria-label="Overall statistics">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-400/30 rounded-xl p-4">
                <div className="text-blue-400 text-sm font-semibold mb-1">Total Games</div>
                <div className="text-3xl font-bold text-white" aria-label={`${stats.totalGamesPlayed} total games played`}>{stats.totalGamesPlayed}</div>
              </div>
              <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-400/30 rounded-xl p-4">
                <div className="text-green-400 text-sm font-semibold mb-1">Total Playtime</div>
                <div className="text-3xl font-bold text-white" aria-label={`${formatTime(stats.totalPlaytime)} total playtime`}>{formatTime(stats.totalPlaytime)}</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-400/30 rounded-xl p-4">
                <div className="text-purple-400 text-sm font-semibold mb-1">Average Session</div>
              <div className="text-3xl font-bold text-white">
                {stats.totalGamesPlayed > 0 
                  ? formatTime(Math.floor(stats.totalPlaytime / stats.totalGamesPlayed))
                  : '0m 0s'
                }
              </div>
            </div>
          </div>
          </section>
          {}
          <section aria-label="Individual game statistics">
            <h3 className="text-xl font-bold text-white mb-4">Game Statistics</h3>
            <div className="space-y-4">
              {Object.entries(stats.gamesStats).map(([gameKey, gameStats]) => (
                <article key={gameKey} className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-bold text-white">{gameNames[gameKey]}</h4>
                    <span className="text-gray-400 text-sm" aria-label={`${gameStats.played} plays`}>{gameStats.played} plays</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3" role="list" aria-label={`Statistics for ${gameNames[gameKey]}`}>
                  {gameStats.highScore !== undefined && (
                    <div className="bg-gray-700/50 rounded-lg p-2">
                      <div className="text-gray-400 text-xs">High Score</div>
                      <div className="text-white font-bold">{gameStats.highScore}</div>
                    </div>
                  )}
                  {gameStats.totalScore !== undefined && (
                    <div className="bg-gray-700/50 rounded-lg p-2">
                      <div className="text-gray-400 text-xs">Total Score</div>
                      <div className="text-white font-bold">{gameStats.totalScore}</div>
                    </div>
                  )}
                  {gameStats.wins !== undefined && (
                    <div className="bg-gray-700/50 rounded-lg p-2">
                      <div className="text-gray-400 text-xs">Wins</div>
                      <div className="text-green-400 font-bold">{gameStats.wins}</div>
                    </div>
                  )}
                  {gameStats.losses !== undefined && (
                    <div className="bg-gray-700/50 rounded-lg p-2">
                      <div className="text-gray-400 text-xs">Losses</div>
                      <div className="text-red-400 font-bold">{gameStats.losses}</div>
                    </div>
                  )}
                  {gameStats.draws !== undefined && (
                    <div className="bg-gray-700/50 rounded-lg p-2">
                      <div className="text-gray-400 text-xs">Draws</div>
                      <div className="text-yellow-400 font-bold">{gameStats.draws}</div>
                    </div>
                  )}
                  {gameStats.bestMoves !== undefined && gameStats.bestMoves < 999 && (
                    <div className="bg-gray-700/50 rounded-lg p-2">
                      <div className="text-gray-400 text-xs">Best Moves</div>
                      <div className="text-white font-bold">{gameStats.bestMoves}</div>
                    </div>
                  )}
                  {gameStats.totalMoves !== undefined && (
                    <div className="bg-gray-700/50 rounded-lg p-2">
                      <div className="text-gray-400 text-xs">Total Moves</div>
                      <div className="text-white font-bold">{gameStats.totalMoves}</div>
                    </div>
                  )}
                </div>
              </article>
            ))}
            </div>
          </section>
          {}
          <div className="mt-6 flex gap-3">
            <button
              onClick={resetStats}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
              aria-label="Reset all statistics permanently"
            >
              Reset Statistics
            </button>
            <button
              onClick={handleClose}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
              aria-label="Close statistics dashboard"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default StatsDashboard;
