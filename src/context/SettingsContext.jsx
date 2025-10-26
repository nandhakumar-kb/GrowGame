import React, { createContext, useContext, useState, useEffect } from 'react';
import soundManager from '../utils/soundManager';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [soundEnabled, setSoundEnabled] = useState(() => {
    return !soundManager.getMuted();
  });

  const [volume, setVolume] = useState(() => {
    return soundManager.getVolume();
  });

  const [showAnimations, setShowAnimations] = useState(() => {
    const saved = localStorage.getItem('showAnimations');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [difficulty, setDifficulty] = useState(() => {
    return localStorage.getItem('difficulty') || 'normal';
  });

  // Persist settings
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('showAnimations', JSON.stringify(showAnimations));
  }, [showAnimations]);

  useEffect(() => {
    localStorage.setItem('difficulty', difficulty);
  }, [difficulty]);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  
  const toggleSound = () => {
    const newState = soundManager.toggleMute();
    setSoundEnabled(!newState);
  };

  const updateVolume = (newVolume) => {
    soundManager.setVolume(newVolume);
    setVolume(newVolume);
  };

  const toggleAnimations = () => setShowAnimations(!showAnimations);

  const updateDifficulty = (newDifficulty) => setDifficulty(newDifficulty);

  const value = {
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
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
