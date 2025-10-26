import React, { useState, useEffect } from 'react';
import { promptInstall, isInstalled } from '../utils/pwaUtils';
import soundManager from '../utils/soundManager';
const InstallPrompt = () => {
  const [canInstall, setCanInstall] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  useEffect(() => {
    if (isInstalled()) {
      setShowPrompt(false);
      return;
    }
    const handleInstallable = () => {
      setCanInstall(true);
    };
    const handleInstalled = () => {
      setShowPrompt(false);
      setCanInstall(false);
    };
    window.addEventListener('pwa-installable', handleInstallable);
    window.addEventListener('pwa-installed', handleInstalled);
    return () => {
      window.removeEventListener('pwa-installable', handleInstallable);
      window.removeEventListener('pwa-installed', handleInstalled);
    };
  }, []);
  const handleInstallClick = async () => {
    soundManager.playClick();
    const accepted = await promptInstall();
    if (accepted) {
      soundManager.playSuccess();
    }
  };
  const handleDismiss = () => {
    soundManager.playClick();
    setShowPrompt(false);
  };
  if (!canInstall || !showPrompt) {
    return null;
  }
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4 animate-slideUp">
      <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl shadow-2xl border border-purple-400/30 p-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 bg-white/20 p-3 rounded-xl">
            <span className="text-3xl">📱</span>
          </div>
          <div className="flex-1">
            <h3 className="text-white font-bold text-lg mb-1">
              Install GrowGame
            </h3>
            <p className="text-purple-100 text-sm mb-3">
              Install the app for offline play and quick access!
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleInstallClick}
                className="flex-1 bg-white text-purple-600 font-semibold py-2 px-4 rounded-lg hover:bg-purple-50 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Install
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2 text-white/80 hover:text-white font-medium transition-colors"
              >
                Later
              </button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-white/60 hover:text-white transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
export default InstallPrompt;
