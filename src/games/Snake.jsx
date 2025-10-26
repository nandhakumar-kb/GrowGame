import React, { useState, useEffect, useCallback, useRef } from 'react';
import GameNavigation from '../components/GameNavigation';
import soundManager from '../utils/soundManager';
import { useSettings } from '../context/SettingsContext';

const SnakeGame = ({ setPage, gamesList, currentGame }) => {
  const { difficulty } = useSettings();
  const GRID_SIZE = 30;
  const CELL_SIZE = 30;
  const INITIAL_SNAKE = [{ x: 15, y: 15 }];
  const INITIAL_DIRECTION = { x: 1, y: 0 };

  const getInitialSpeed = () => {
    const speeds = { easy: 200, normal: 150, hard: 100 };
    return speeds[difficulty] || 150;
  };

  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState(getInitialSpeed);
  const [isPaused, setIsPaused] = useState(false);
  const directionRef = useRef(INITIAL_DIRECTION);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
    setFood(newFood);
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setGameOver(false);
    setGameStarted(false);
    setScore(0);
    setSpeed(getInitialSpeed());
    setIsPaused(false);
    generateFood();
  };

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused || !gameStarted) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: head.x + directionRef.current.x,
        y: head.y + directionRef.current.y
      };

      // Check wall collision
      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        setGameOver(true);
        setHighScore(prev => Math.max(prev, score));
        soundManager.playLose();
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        setHighScore(prev => Math.max(prev, score));
        soundManager.playLose();
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        soundManager.playEat();
        setScore(prev => {
          const newScore = prev + 10;
          // Increase speed every 50 points
          if (newScore % 50 === 0) {
            setSpeed(s => Math.max(50, s - 20));
            soundManager.playPowerUp();
          }
          return newScore;
        });
        generateFood();
        return newSnake;
      }

      newSnake.pop();
      return newSnake;
    });
  }, [gameOver, isPaused, gameStarted, food, generateFood, score]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!gameStarted && !gameOver && (e.key === ' ' || e.key.startsWith('Arrow'))) {
        e.preventDefault();
        setGameStarted(true);
        soundManager.playClick();
        return;
      }
      
      if (gameOver) return;
      
      const key = e.key;
      const currentDir = directionRef.current;

      if (key === 'ArrowUp' && currentDir.y === 0) {
        directionRef.current = { x: 0, y: -1 };
        setDirection({ x: 0, y: -1 });
        soundManager.playClick();
      } else if (key === 'ArrowDown' && currentDir.y === 0) {
        directionRef.current = { x: 0, y: 1 };
        setDirection({ x: 0, y: 1 });
        soundManager.playClick();
      } else if (key === 'ArrowLeft' && currentDir.x === 0) {
        directionRef.current = { x: -1, y: 0 };
        setDirection({ x: -1, y: 0 });
        soundManager.playClick();
      } else if (key === 'ArrowRight' && currentDir.x === 0) {
        directionRef.current = { x: 1, y: 0 };
        setDirection({ x: 1, y: 0 });
        soundManager.playClick();
      } else if (key === ' ') {
        e.preventDefault();
        setIsPaused(prev => !prev);
        soundManager.playClick();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameOver, gameStarted]);

  useEffect(() => {
    const gameLoop = setInterval(moveSnake, speed);
    return () => clearInterval(gameLoop);
  }, [moveSnake, speed]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <GameNavigation currentGame={currentGame} setPage={setPage} gamesList={gamesList} />
        
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            🐍 <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">Snake Game</span>
          </h2>
          <p className="text-gray-300 mb-4">Use Arrow Keys to move | Space to Pause</p>
          <div className="flex items-center justify-center gap-8 mb-2">
            <div className="text-2xl font-bold text-green-400">Score: {score}</div>
            <div className="text-xl font-semibold text-yellow-400">🏆 Best: {highScore}</div>
            <div className="text-lg text-gray-400">Speed: {Math.round((150 - speed) / 10) + 1}x</div>
          </div>
          <div className="flex justify-center gap-2 mb-4">
            <span className="px-3 py-1 bg-green-500/20 border border-green-500 rounded-full text-green-400 text-sm">
              Length: {snake.length}
            </span>
            {isPaused && <span className="px-3 py-1 bg-yellow-500/20 border border-yellow-500 rounded-full text-yellow-400 text-sm animate-pulse">⏸ PAUSED</span>}
            {!gameStarted && !gameOver && <span className="px-3 py-1 bg-blue-500/20 border border-blue-500 rounded-full text-blue-400 text-sm animate-pulse">Press any key to start</span>}
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <div 
            className="relative bg-gradient-to-br from-gray-900 to-gray-800 border-4 border-green-500 rounded-xl shadow-2xl overflow-hidden"
            style={{ width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE }}
          >
            {/* Grid pattern */}
            {Array.from({ length: GRID_SIZE }).map((_, y) =>
              Array.from({ length: GRID_SIZE }).map((_, x) => (
                <div
                  key={`${x}-${y}`}
                  className="absolute border border-gray-800/30"
                  style={{
                    left: x * CELL_SIZE,
                    top: y * CELL_SIZE,
                    width: CELL_SIZE,
                    height: CELL_SIZE
                  }}
                />
              ))
            )}
            {/* Snake */}
            {snake.map((segment, index) => (
              <div
                key={index}
                className={`absolute rounded-sm transition-all duration-75 ${
                  index === 0 
                    ? 'bg-gradient-to-br from-green-400 to-green-500 shadow-lg shadow-green-500/50' 
                    : 'bg-gradient-to-br from-green-500 to-green-600'
                }`}
                style={{
                  left: segment.x * CELL_SIZE,
                  top: segment.y * CELL_SIZE,
                  width: CELL_SIZE - 2,
                  height: CELL_SIZE - 2,
                  zIndex: snake.length - index
                }}
              >
                {index === 0 && (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
            ))}
            {/* Food with glow effect */}
            <div
              className="absolute rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow-lg shadow-red-500/50 animate-pulse"
              style={{
                left: food.x * CELL_SIZE + 1,
                top: food.y * CELL_SIZE + 1,
                width: CELL_SIZE - 4,
                height: CELL_SIZE - 4
              }}
            >
              <div className="absolute inset-0 rounded-full bg-white/30 animate-ping"></div>
            </div>
          </div>
        </div>

        {/* Mobile Controls */}
        <div className="flex justify-center mb-6 md:hidden">
          <div className="grid grid-cols-3 gap-3">
            <div></div>
            <button
              onClick={() => {
                if (!gameStarted) setGameStarted(true);
                if (directionRef.current.y === 0) {
                  directionRef.current = { x: 0, y: -1 };
                  setDirection({ x: 0, y: -1 });
                }
              }}
              className="bg-gradient-to-br from-gray-700 to-gray-800 text-white p-5 rounded-xl active:scale-95 transition-transform shadow-lg border border-green-500/30 hover:border-green-500"
            >
              <span className="text-2xl">⬆️</span>
            </button>
            <div></div>
            <button
              onClick={() => {
                if (!gameStarted) setGameStarted(true);
                if (directionRef.current.x === 0) {
                  directionRef.current = { x: -1, y: 0 };
                  setDirection({ x: -1, y: 0 });
                }
              }}
              className="bg-gradient-to-br from-gray-700 to-gray-800 text-white p-5 rounded-xl active:scale-95 transition-transform shadow-lg border border-green-500/30 hover:border-green-500"
            >
              <span className="text-2xl">⬅️</span>
            </button>
            <button
              onClick={() => {
                if (gameStarted) setIsPaused(prev => !prev);
              }}
              className="bg-gradient-to-br from-yellow-600 to-yellow-700 text-white p-5 rounded-xl active:scale-95 transition-transform shadow-lg border border-yellow-400/30"
            >
              <span className="text-2xl">{isPaused ? '▶️' : '⏸️'}</span>
            </button>
            <button
              onClick={() => {
                if (!gameStarted) setGameStarted(true);
                if (directionRef.current.x === 0) {
                  directionRef.current = { x: 1, y: 0 };
                  setDirection({ x: 1, y: 0 });
                }
              }}
              className="bg-gradient-to-br from-gray-700 to-gray-800 text-white p-5 rounded-xl active:scale-95 transition-transform shadow-lg border border-green-500/30 hover:border-green-500"
            >
              <span className="text-2xl">➡️</span>
            </button>
            <div></div>
            <button
              onClick={() => {
                if (!gameStarted) setGameStarted(true);
                if (directionRef.current.y === 0) {
                  directionRef.current = { x: 0, y: 1 };
                  setDirection({ x: 0, y: 1 });
                }
              }}
              className="bg-gradient-to-br from-gray-700 to-gray-800 text-white p-5 rounded-xl active:scale-95 transition-transform shadow-lg border border-green-500/30 hover:border-green-500"
            >
              <span className="text-2xl">⬇️</span>
            </button>
          </div>
        </div>

        {/* Game Over Modal */}
        {gameOver && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 max-w-md mx-4 border-4 border-red-500 shadow-2xl shadow-red-500/50 transform animate-scaleIn">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4 animate-bounce">💀</div>
                <h3 className="text-4xl font-bold text-white mb-2">Game Over!</h3>
                <p className="text-gray-400">The snake bit itself!</p>
              </div>
              
              <div className="bg-gray-900/50 rounded-xl p-6 mb-6 border border-green-500/30">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-400">Final Score</span>
                  <span className="text-3xl font-bold text-green-400">{score}</span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-400">Snake Length</span>
                  <span className="text-2xl font-semibold text-emerald-400">{snake.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">High Score</span>
                  <span className="text-2xl font-bold text-yellow-400">🏆 {highScore}</span>
                </div>
              </div>

              <button
                onClick={resetGame}
                className="w-full py-4 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg shadow-green-500/50 text-lg"
              >
                🔄 Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SnakeGame;
