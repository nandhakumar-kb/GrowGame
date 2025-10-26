import React, { useState, useEffect } from 'react';
import soundManager from '../utils/soundManager';

const Leaderboard = ({ onClose, gameName }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const LEADERBOARD_KEY = `growgame-leaderboard-${gameName}`;

  useEffect(() => {
    loadLeaderboard();
  }, [gameName]);

  const loadLeaderboard = () => {
    try {
      const saved = localStorage.getItem(LEADERBOARD_KEY);
      if (saved) {
        setLeaderboard(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    }
  };

  const handleClose = () => {
    soundManager.playClick();
    onClose();
  };

  const clearLeaderboard = () => {
    if (confirm('Clear all scores for this game? This cannot be undone!')) {
      try {
        localStorage.removeItem(LEADERBOARD_KEY);
        setLeaderboard([]);
        soundManager.playSuccess();
      } catch (error) {
        console.error('Failed to clear leaderboard:', error);
      }
    }
  };

  const gameNames = {
    snake: '🐍 Snake',
    tetris: '🧱 Tetris',
    tictactoe: '⭕ Tic-Tac-Toe',
    pong: '🏓 Pong',
    '2048': '🔢 2048',
    memory: '🎴 Memory Match',
    breakout: '🧱 Breakout'
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden border-4 border-yellow-500 shadow-2xl shadow-yellow-500/50">
        <div className="bg-gradient-to-r from-yellow-600 to-orange-600 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🏆</span>
            <div>
              <h2 className="text-3xl font-bold text-white">Top Scores</h2>
              <p className="text-yellow-100">{gameNames[gameName] || gameName}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:text-yellow-200 transition-colors text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {leaderboard.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎮</div>
              <p className="text-gray-400 text-lg">No scores yet!</p>
              <p className="text-gray-500">Play some games to see scores here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {leaderboard.map((entry, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
                    index === 0
                      ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500'
                      : index === 1
                      ? 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-2 border-gray-400'
                      : index === 2
                      ? 'bg-gradient-to-r from-orange-600/20 to-orange-700/20 border-2 border-orange-600'
                      : 'bg-gray-800/50 border border-gray-700'
                  }`}
                >
                  <div className="text-3xl font-bold w-12 text-center">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-white">{entry.score}</span>
                      <span className="text-sm text-gray-400">{formatDate(entry.date)}</span>
                    </div>
                    {entry.level && (
                      <div className="text-sm text-gray-400">Level: {entry.level}</div>
                    )}
                    {entry.moves && (
                      <div className="text-sm text-gray-400">Moves: {entry.moves}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 bg-gray-900/50 border-t border-gray-700 flex gap-3">
          <button
            onClick={clearLeaderboard}
            className="flex-1 py-3 px-6 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50"
            disabled={leaderboard.length === 0}
          >
            🗑️ Clear Scores
          </button>
          <button
            onClick={handleClose}
            className="flex-1 py-3 px-6 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
