import React, { useState, useEffect } from 'react';
import achievementsManager from '../utils/achievementsManager';
import soundManager from '../utils/soundManager';
const AchievementsModal = ({ onClose }) => {
  const [achievements, setAchievements] = useState([]);
  const [unlockedIds, setUnlockedIds] = useState([]);
  const [filter, setFilter] = useState('all');
  const [progress, setProgress] = useState({ unlocked: 0, total: 0, percentage: 0 });
  useEffect(() => {
    loadAchievements();
  }, []);
  const loadAchievements = () => {
    const allAchievements = achievementsManager.getAllAchievements();
    const unlocked = achievementsManager.getUnlockedAchievements();
    const progressData = achievementsManager.getProgress();
    setAchievements(Object.values(allAchievements));
    setUnlockedIds(unlocked);
    setProgress(progressData);
  };
  const handleClose = () => {
    soundManager.playClick();
    onClose();
  };
  const handleFilterChange = (newFilter) => {
    soundManager.playClick();
    setFilter(newFilter);
  };
  const categories = [
    { id: 'all', label: 'All', icon: '🏆' },
    { id: 'beginner', label: 'Beginner', icon: '🎮' },
    { id: 'snake', label: 'Snake', icon: '🐍' },
    { id: 'tetris', label: 'Tetris', icon: '🧱' },
    { id: 'tictactoe', label: 'Tic-Tac-Toe', icon: '⭕' },
    { id: 'pong', label: 'Pong', icon: '🏓' },
    { id: '2048', label: '2048', icon: '🔢' },
    { id: 'memory', label: 'Memory', icon: '🧩' },
    { id: 'breakout', label: 'Breakout', icon: '🎯' },
    { id: 'milestone', label: 'Milestones', icon: '⭐' },
    { id: 'special', label: 'Special', icon: '✨' }
  ];
  const filteredAchievements = filter === 'all'
    ? achievements
    : achievements.filter(a => a.category === filter);
  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="achievements-title"
      aria-describedby="achievements-description"
    >
      <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden border border-yellow-500/30 animate-scaleIn">
        {}
        <div className="bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600 p-6 relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            aria-label="Close achievements modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 id="achievements-title" className="text-3xl font-bold text-white flex items-center gap-3 mb-4">
            <span aria-hidden="true">🏆</span> Achievements
          </h2>
          {}
          <div className="bg-gray-900/50 rounded-xl p-4" role="status" aria-live="polite">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-semibold">Overall Progress</span>
              <span className="text-yellow-300 font-bold" aria-label={`${progress.unlocked} out of ${progress.total} achievements unlocked`}>
                {progress.unlocked} / {progress.total}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden" role="progressbar" aria-valuenow={progress.percentage} aria-valuemin={0} aria-valuemax={100} aria-label="Overall achievement progress">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full transition-all duration-500 flex items-center justify-center text-xs font-bold text-white"
                style={{ width: `${progress.percentage}%` }}
              >
                {progress.percentage > 15 && `${progress.percentage}%`}
              </div>
            </div>
          </div>
        </div>
        {}
        <nav className="bg-gray-800/50 border-b border-gray-700 p-4 overflow-x-auto" aria-label="Achievement category filters">
          <div className="flex gap-2 min-w-max" role="tablist">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleFilterChange(cat.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
                  filter === cat.id
                    ? 'bg-yellow-500 text-white scale-105'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                role="tab"
                aria-selected={filter === cat.id}
                aria-label={`Filter by ${cat.label} achievements`}
              >
                <span aria-hidden="true">{cat.icon}</span>
                <span className="whitespace-nowrap">{cat.label}</span>
              </button>
            ))}
          </div>
        </nav>
        {}
        <section className="p-6 overflow-y-auto max-h-[calc(90vh-280px)]" aria-label={`${filter === 'all' ? 'All' : filter} achievements`} id="achievements-description">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" role="list">
            {filteredAchievements.map(achievement => {
              const isUnlocked = unlockedIds.includes(achievement.id);
              return (
                <article
                  key={achievement.id}
                  role="listitem"
                  className={`relative rounded-xl p-4 border-2 transition-all duration-300 ${
                    isUnlocked
                      ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/50 hover:scale-105'
                      : 'bg-gray-800/50 border-gray-700 opacity-60'
                  }`}
                  aria-label={`${achievement.title} - ${isUnlocked ? 'Unlocked' : 'Locked'} - ${achievement.description}`}
                >
                  {}
                  {!isUnlocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
                      <span className="text-4xl" aria-hidden="true">🔒</span>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 text-4xl" aria-hidden="true">
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-bold text-lg mb-1 ${
                        isUnlocked ? 'text-yellow-400' : 'text-gray-400'
                      }`}>
                        {achievement.title}
                      </h3>
                      <p className={`text-sm ${
                        isUnlocked ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        {achievement.description}
                      </p>
                      {isUnlocked && (
                        <div className="mt-2 inline-block bg-green-500/20 border border-green-500/50 rounded-full px-3 py-1">
                          <span className="text-green-400 text-xs font-bold">✓ Unlocked</span>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          {filteredAchievements.length === 0 && (
            <div className="text-center py-12" role="status">
              <div className="text-6xl mb-4" aria-hidden="true">🔍</div>
              <p className="text-gray-400 text-lg">No achievements in this category</p>
            </div>
          )}
        </section>
        {}
        <div className="bg-gray-800/50 border-t border-gray-700 p-4">
          <button
            onClick={handleClose}
            className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
            aria-label="Close achievements modal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
export default AchievementsModal;
