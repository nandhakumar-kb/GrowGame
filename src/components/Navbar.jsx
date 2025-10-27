import React, { useState } from 'react';
import SettingsPanel from './SettingsPanel';
import StatsDashboard from './StatsDashboard';
import AchievementsModal from './AchievementsModal';
import FeedbackModal from './FeedbackModal';
import soundManager from '../utils/soundManager';

// Import logo image so Vite can process it
import logoImg from '/assets/logo.png';

const Navbar = ({ setPage }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const handleClick = () => {
    soundManager.init();
    soundManager.playClick();
  };
  return (
    <>
      <nav className="bg-gray-900 border-b border-purple-500/30 shadow-lg sticky top-0 z-50" role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={() => {
                handleClick();
                setPage('home');
              }}
              className="flex items-center gap-3 hover:scale-110 transition-transform duration-300"
              aria-label="Go to home page"
            >
              <img src={logoImg} alt="GrowGame Logo" className="h-10 w-10 object-contain" />
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                GrowGame
              </span>
            </button>
            <div className="flex items-center gap-2" role="toolbar" aria-label="Navigation actions">
              <button
                onClick={() => {
                  handleClick();
                  setShowAchievements(true);
                }}
                className="px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-semibold rounded-lg hover:scale-105 transition-all duration-300 shadow-lg shadow-yellow-500/30 flex items-center gap-2"
                title="Achievements"
                aria-label="View achievements"
              >
                <span className="text-lg" aria-hidden="true">🏆</span>
                <span className="hidden xl:inline">Achievements</span>
              </button>
              <button
                onClick={() => {
                  handleClick();
                  setShowStats(true);
                }}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-500/30 flex items-center gap-2"
                aria-label="View statistics"
                title="Statistics"
              >
                <span className="text-lg" aria-hidden="true">📊</span>
                <span className="hidden lg:inline">Stats</span>
              </button>
              <button
                onClick={() => {
                  handleClick();
                  setShowSettings(true);
                }}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-lg hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-500/30 flex items-center gap-2"
                title="Settings"
                aria-label="Open settings"
              >
                <span className="text-lg" aria-hidden="true">⚙️</span>
                <span className="hidden md:inline">Settings</span>
              </button>
              <button
                onClick={() => {
                  handleClick();
                  setShowFeedback(true);
                }}
                className="px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold rounded-lg hover:scale-105 transition-all duration-300 shadow-lg shadow-pink-500/30 flex items-center gap-2"
                title="Send Feedback"
                aria-label="Send feedback"
              >
                <span className="text-lg" aria-hidden="true">💬</span>
                <span className="hidden lg:inline">Feedback</span>
              </button>
              <button
                onClick={() => {
                  handleClick();
                  // Open GPay image directly - Vite will process the path
                  window.open('/assets/Gpay.jpg', '_blank');
                }}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:scale-105 transition-all duration-300 shadow-lg shadow-green-500/30 flex items-center gap-2"
                title="Support Developer"
                aria-label="Support with donation"
              >
                <span className="text-lg" aria-hidden="true">💝</span>
                <span className="hidden sm:inline">Donate</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}

      {showStats && <StatsDashboard onClose={() => setShowStats(false)} />}

      {showAchievements && <AchievementsModal onClose={() => setShowAchievements(false)} />}

      {showFeedback && <FeedbackModal isOpen={showFeedback} onClose={() => setShowFeedback(false)} />}
    </>
  );
};
export default Navbar;
