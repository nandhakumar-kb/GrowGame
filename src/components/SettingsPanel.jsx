import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import soundManager from '../utils/soundManager';

const SettingsPanel = ({ onClose }) => {
  const { 
    darkMode, 
    toggleDarkMode, 
    soundEnabled, 
    toggleSound,
    volume,
    updateVolume,
    showAnimations,
    toggleAnimations,
    difficulty,
    updateDifficulty
  } = useSettings();

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    updateVolume(newVolume);
  };

  const handleDifficultyChange = (e) => {
    updateDifficulty(e.target.value);
    soundManager.playClick();
  };

  const handleToggleSound = () => {
    toggleSound();
    if (soundEnabled) {
      soundManager.playClick();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[70] animate-fadeIn px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
      aria-describedby="settings-description"
    >
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-4 sm:p-6 md:p-8 max-w-md w-full mx-4 border-4 border-purple-500 shadow-2xl shadow-purple-500/50 transform animate-scaleIn max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6">
          <div className="text-4xl sm:text-6xl mb-3 sm:mb-4" aria-hidden="true">⚙️</div>
          <h3 id="settings-title" className="text-2xl sm:text-4xl font-bold text-white mb-2">Settings</h3>
          <p id="settings-description" className="text-sm sm:text-base text-gray-400">Customize your gaming experience</p>
        </div>

        {/* Settings Options */}
        <div className="space-y-3 sm:space-y-6 mb-4 sm:mb-6" role="group" aria-label="Settings options">
          {/* Dark Mode */}
          <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl border border-purple-500/30">
            <div className="flex items-center gap-3">
              <span className="text-2xl" aria-hidden="true">{darkMode ? '🌙' : '☀️'}</span>
              <div>
                <div className="text-white font-semibold" id="dark-mode-label">Dark Mode</div>
                <div className="text-gray-400 text-sm">Toggle theme</div>
              </div>
            </div>
            <button
              onClick={() => {
                toggleDarkMode();
                soundManager.playClick();
              }}
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                darkMode ? 'bg-purple-600' : 'bg-gray-600'
              }`}
              role="switch"
              aria-checked={darkMode}
              aria-labelledby="dark-mode-label"
            >
              <div
                className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                  darkMode ? 'translate-x-8' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Sound */}
          <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl border border-purple-500/30">
            <div className="flex items-center gap-3">
              <span className="text-2xl" aria-hidden="true">{soundEnabled ? '🔊' : '🔇'}</span>
              <div>
                <div className="text-white font-semibold" id="sound-label">Sound Effects</div>
                <div className="text-gray-400 text-sm">Game audio</div>
              </div>
            </div>
            <button
              onClick={handleToggleSound}
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                soundEnabled ? 'bg-green-600' : 'bg-gray-600'
              }`}
              role="switch"
              aria-checked={soundEnabled}
              aria-labelledby="sound-label"
            >
              <div
                className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                  soundEnabled ? 'translate-x-8' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Volume */}
          {soundEnabled && (
            <div className="p-4 bg-gray-900/50 rounded-xl border border-purple-500/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl" aria-hidden="true">🎵</span>
                <div>
                  <div className="text-white font-semibold" id="volume-label">Volume</div>
                  <div className="text-gray-400 text-sm" aria-live="polite">{Math.round(volume * 100)}%</div>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                aria-labelledby="volume-label"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(volume * 100)}
                aria-valuetext={`${Math.round(volume * 100)} percent`}
              />
            </div>
          )}

          {/* Animations */}
          <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl border border-purple-500/30">
            <div className="flex items-center gap-3">
              <span className="text-2xl" aria-hidden="true">✨</span>
              <div>
                <div className="text-white font-semibold" id="animations-label">Animations</div>
                <div className="text-gray-400 text-sm">Visual effects</div>
              </div>
            </div>
            <button
              onClick={() => {
                toggleAnimations();
                soundManager.playClick();
              }}
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                showAnimations ? 'bg-cyan-600' : 'bg-gray-600'
              }`}
              role="switch"
              aria-checked={showAnimations}
              aria-labelledby="animations-label"
            >
              <div
                className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                  showAnimations ? 'translate-x-8' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Difficulty */}
          <div className="p-4 bg-gray-900/50 rounded-xl border border-purple-500/30">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl" aria-hidden="true">🎯</span>
              <div>
                <div className="text-white font-semibold">
                  <label htmlFor="difficulty-select">Difficulty</label>
                </div>
                <div className="text-gray-400 text-sm">Game challenge level</div>
              </div>
            </div>
            <select
              id="difficulty-select"
              value={difficulty}
              onChange={handleDifficultyChange}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-purple-500/30 focus:outline-none focus:border-purple-500"
              aria-label="Select game difficulty level"
            >
              <option value="easy">🟢 Easy</option>
              <option value="normal">🟡 Normal</option>
              <option value="hard">🔴 Hard</option>
              <option value="expert">💀 Expert</option>
            </select>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="w-full py-2 sm:py-4 px-4 sm:px-6 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-500/50 text-sm sm:text-base"
          aria-label="Save settings and close panel"
        >
          Save & Close
        </button>
      </div>
    </div>
  );
};

export default SettingsPanel;
