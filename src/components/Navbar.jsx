import React, { useState } from 'react';
import SettingsPanel from './SettingsPanel';
import StatsDashboard from './StatsDashboard';
import AchievementsModal from './AchievementsModal';
import FeedbackModal from './FeedbackModal';
import soundManager from '../utils/soundManager';

// Import images so Vite can process them
import logoImg from '/assets/logo.png';
import gpayImg from '/assets/Gpay.jpg';

const Navbar = ({ setPage }) => {
  const [showDonation, setShowDonation] = useState(false);
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
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={() => {
                handleClick();
                setPage('home');
              }}
              className="flex items-center gap-2 sm:gap-3 hover:scale-110 transition-transform duration-300 flex-shrink-0"
              aria-label="Go to home page"
            >
              <img src={logoImg} alt="GrowGame Logo" className="h-8 w-8 sm:h-10 sm:w-10 object-contain" />
              <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                GrowGame
              </span>
            </button>
            <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto" role="toolbar" aria-label="Navigation actions">
              <button
                onClick={() => {
                  handleClick();
                  setShowAchievements(true);
                }}
                className="px-2 sm:px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-semibold rounded-lg hover:scale-105 transition-all duration-300 shadow-lg shadow-yellow-500/30 flex items-center gap-1 sm:gap-2 whitespace-nowrap"
                title="Achievements"
                aria-label="View achievements"
              >
                <span className="text-base sm:text-lg" aria-hidden="true">🏆</span>
                <span className="hidden xl:inline">Achievements</span>
              </button>
              <button
                onClick={() => {
                  handleClick();
                  setShowStats(true);
                }}
                className="px-2 sm:px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-500/30 flex items-center gap-1 sm:gap-2 whitespace-nowrap"
                aria-label="View statistics"
                title="Statistics"
              >
                <span className="text-base sm:text-lg" aria-hidden="true">📊</span>
                <span className="hidden lg:inline">Stats</span>
              </button>
              <button
                onClick={() => {
                  handleClick();
                  setShowSettings(true);
                }}
                className="px-2 sm:px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-lg hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-500/30 flex items-center gap-1 sm:gap-2 whitespace-nowrap"
                title="Settings"
                aria-label="Open settings"
              >
                <span className="text-base sm:text-lg" aria-hidden="true">⚙️</span>
                <span className="hidden md:inline">Settings</span>
              </button>
              <button
                onClick={() => {
                  handleClick();
                  setShowFeedback(true);
                }}
                className="px-2 sm:px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold rounded-lg hover:scale-105 transition-all duration-300 shadow-lg shadow-pink-500/30 flex items-center gap-1 sm:gap-2 whitespace-nowrap"
                title="Send Feedback"
                aria-label="Send feedback"
              >
                <span className="text-base sm:text-lg" aria-hidden="true">💬</span>
                <span className="hidden lg:inline">Feedback</span>
              </button>
              <button
                onClick={() => {
                  handleClick();
                  setShowDonation(true);
                }}
                className="px-2 sm:px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:scale-105 transition-all duration-300 shadow-lg shadow-green-500/30 flex items-center gap-1 sm:gap-2 whitespace-nowrap"
                title="Support Developer"
                aria-label="Support with donation"
              >
                <span className="text-base sm:text-lg" aria-hidden="true">💝</span>
                <span className="hidden sm:inline text-sm sm:text-base">Donate</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}

      {showStats && <StatsDashboard onClose={() => setShowStats(false)} />}

      {showAchievements && <AchievementsModal onClose={() => setShowAchievements(false)} />}

      {showFeedback && <FeedbackModal isOpen={showFeedback} onClose={() => setShowFeedback(false)} />}

      {showDonation && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[60] animate-fadeIn px-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-4 sm:p-6 md:p-8 max-w-md w-full mx-4 border-4 border-green-500 shadow-2xl shadow-green-500/50 transform animate-scaleIn max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-4 sm:mb-6">
              <div className="text-4xl sm:text-6xl mb-3 sm:mb-4 animate-bounce">🙏</div>
              <h3 className="text-2xl sm:text-4xl font-bold text-white mb-2">Support Development</h3>
              <p className="text-sm sm:text-base text-gray-400">Your support helps keep GrowGame free and awesome!</p>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 border border-green-500/30">
              <h4 className="text-base sm:text-xl font-bold text-green-400 mb-3 sm:mb-4 text-center">Scan to Donate via Google Pay</h4>
              <div className="flex justify-center mb-3 sm:mb-4">
                <img 
                  src={gpayImg} 
                  alt="Google Pay QR Code" 
                  className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 object-contain rounded-lg border-2 border-green-500/50 shadow-lg"
                />
              </div>
              <p className="text-gray-300 text-center text-xs sm:text-sm">
                Scan this QR code with any UPI app
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={() => setShowDonation(false)}
                className="w-full py-2 sm:py-3 px-4 sm:px-6 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg text-sm sm:text-base"
              >
                Close
              </button>
              <button
                onClick={() => window.open(gpayImg, '_blank')}
                className="w-full py-2 sm:py-3 px-4 sm:px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg shadow-green-500/50 text-sm sm:text-base"
              >
                View Full Size
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default Navbar;
