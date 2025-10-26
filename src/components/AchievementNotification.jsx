import React, { useState, useEffect } from 'react';
import soundManager from '../utils/soundManager';
const AchievementNotification = () => {
  const [achievement, setAchievement] = useState(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const handleAchievementUnlock = (event) => {
      const { achievement } = event.detail;
      setAchievement(achievement);
      setVisible(true);
      soundManager.playSuccess();
      setTimeout(() => {
        setVisible(false);
      }, 5000);
    };
    window.addEventListener('achievement-unlocked', handleAchievementUnlock);
    return () => {
      window.removeEventListener('achievement-unlocked', handleAchievementUnlock);
    };
  }, []);
  const handleDismiss = () => {
    soundManager.playClick();
    setVisible(false);
  };
  if (!visible || !achievement) {
    return null;
  }
  return (
    <div className="fixed top-20 right-6 z-[70] max-w-sm animate-slideLeft">
      <div className="bg-gradient-to-br from-yellow-500 via-amber-500 to-orange-500 rounded-2xl shadow-2xl border-2 border-yellow-300 p-4 relative overflow-hidden">
        {}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        <div className="relative">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 text-5xl animate-bounce">
              {achievement.icon}
            </div>
            <div className="flex-1">
              <div className="text-white font-bold text-xs uppercase tracking-wider mb-1">
                🏆 Achievement Unlocked!
              </div>
              <h3 className="text-white font-bold text-lg mb-1">
                {achievement.title}
              </h3>
              <p className="text-yellow-100 text-sm">
                {achievement.description}
              </p>
            </div>
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 text-white/80 hover:text-white transition-colors"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AchievementNotification;
