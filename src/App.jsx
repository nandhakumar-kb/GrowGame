import React, { useState, useEffect, lazy, Suspense } from 'react';
import { SettingsProvider } from './context/SettingsContext';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import InstallPrompt from './components/InstallPrompt';
import AchievementNotification from './components/AchievementNotification';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import { GAMES_LIST } from './constants/games';
import soundManager from './utils/soundManager';

const SnakeGame = lazy(() => import('./games/Snake'));
const TetrisGame = lazy(() => import('./games/Tetris'));
const TicTacToeGame = lazy(() => import('./games/TicTacToe'));
const PongGame = lazy(() => import('./games/Pong'));
const Game2048 = lazy(() => import('./games/Game2048'));
const MemoryMatchGame = lazy(() => import('./games/MemoryMatch'));
const BreakoutGame = lazy(() => import('./games/Breakout'));

function App() {
  const [page, setPage] = useState('home');

  useEffect(() => {
    soundManager.init();
  }, []);

  return (
    <ErrorBoundary onReset={() => setPage('home')}>
      <SettingsProvider>
        <div className="min-h-screen bg-gray-900 text-white font-sans">
          <Navbar setPage={setPage} />
          
          {page === 'home' && <HomePage setPage={setPage} />}
          
          <Suspense fallback={<LoadingSpinner message="Loading Game..." />}>
            {page === 'snake' && <SnakeGame setPage={setPage} gamesList={GAMES_LIST} currentGame="snake" />}
            {page === 'tetris' && <TetrisGame setPage={setPage} gamesList={GAMES_LIST} currentGame="tetris" />}
            {page === 'tictactoe' && <TicTacToeGame setPage={setPage} gamesList={GAMES_LIST} currentGame="tictactoe" />}
            {page === 'pong' && <PongGame setPage={setPage} gamesList={GAMES_LIST} currentGame="pong" />}
            {page === '2048' && <Game2048 setPage={setPage} gamesList={GAMES_LIST} currentGame="2048" />}
            {page === 'memory' && <MemoryMatchGame setPage={setPage} gamesList={GAMES_LIST} currentGame="memory" />}
            {page === 'breakout' && <BreakoutGame setPage={setPage} gamesList={GAMES_LIST} currentGame="breakout" />}
          </Suspense>
          
          <InstallPrompt />
          <AchievementNotification />
        </div>
      </SettingsProvider>
    </ErrorBoundary>
  );
}

export default App;
