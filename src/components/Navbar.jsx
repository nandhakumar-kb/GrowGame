import React, { useState } from 'react';
import SettingsPanel from './SettingsPanel';
import StatsDashboard from './StatsDashboard';
import AchievementsModal from './AchievementsModal';
import soundManager from '../utils/soundManager';
const Navbar = ({ setPage }) => {
  const [showDonation, setShowDonation] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
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
              <img src="/assets/logo.png" alt="GrowGame Logo" className="h-10 w-10 object-contain" />
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
                  setShowDonation(true);
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

      {showDonation && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[60] animate-fadeIn px-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 max-w-md w-full mx-4 border-4 border-green-500 shadow-2xl shadow-green-500/50 transform animate-scaleIn">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4 animate-bounce">🙏</div>
              <h3 className="text-4xl font-bold text-white mb-2">Support Development</h3>
              <p className="text-gray-400">Your support helps keep GrowGame free and awesome!</p>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-6 mb-6 border border-green-500/30">
              <h4 className="text-xl font-bold text-green-400 mb-4 text-center">Scan to Donate via Google Pay</h4>
              <div className="flex justify-center mb-4">
                <img 
                  src="/assets/Gpay.jpg" 
                  alt="Google Pay QR Code" 
                  className="w-64 h-64 object-contain rounded-lg border-2 border-green-500/50 shadow-lg"
                />
              </div>
              <p className="text-gray-300 text-center text-sm">
                Scan this QR code with any UPI app
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDonation(false)}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Close
              </button>
              <button
                onClick={() => window.open('/assets/Gpay.jpg', '_blank')}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg shadow-green-500/50"
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
