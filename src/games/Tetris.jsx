import React, { useState, useEffect, useCallback } from 'react';
import GameNavigation from '../components/GameNavigation';
import soundManager from '../utils/soundManager';
import { useSettings } from '../context/SettingsContext';

const TetrisGame = ({ setPage, gamesList, currentGame }) => {
  const { difficulty } = useSettings();
  const ROWS = 22;
  const COLS = 12;
  const CELL_SIZE = 38;

  const getDropSpeed = (currentLevel) => {
    const baseSpeeds = { easy: 1200, normal: 1000, hard: 700 };
    const baseSpeed = baseSpeeds[difficulty] || 1000;
    return Math.max(100, baseSpeed - (currentLevel - 1) * 50);
  };

  const TETROMINOES = {
    I: { shape: [[1, 1, 1, 1]], color: 'bg-cyan-500' },
    O: { shape: [[1, 1], [1, 1]], color: 'bg-yellow-500' },
    T: { shape: [[0, 1, 0], [1, 1, 1]], color: 'bg-purple-500' },
    S: { shape: [[0, 1, 1], [1, 1, 0]], color: 'bg-green-500' },
    Z: { shape: [[1, 1, 0], [0, 1, 1]], color: 'bg-red-500' },
    J: { shape: [[1, 0, 0], [1, 1, 1]], color: 'bg-blue-500' },
    L: { shape: [[0, 0, 1], [1, 1, 1]], color: 'bg-orange-500' }
  };

  const createEmptyBoard = () => Array(ROWS).fill(null).map(() => Array(COLS).fill(null));

  const [board, setBoard] = useState(createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [linesCleared, setLinesCleared] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [nextPiece, setNextPiece] = useState(null);

  const getRandomPiece = () => {
    const pieces = Object.keys(TETROMINOES);
    const randomPiece = pieces[Math.floor(Math.random() * pieces.length)];
    return { ...TETROMINOES[randomPiece], type: randomPiece };
  };

  const rotatePiece = (piece) => {
    const rotated = piece[0].map((_, i) => piece.map(row => row[i]).reverse());
    return rotated;
  };

  const checkCollision = (piece, pos, boardState) => {
    for (let y = 0; y < piece.length; y++) {
      for (let x = 0; x < piece[y].length; x++) {
        if (piece[y][x]) {
          const newX = pos.x + x;
          const newY = pos.y + y;
          if (newX < 0 || newX >= COLS || newY >= ROWS) return true;
          if (newY >= 0 && boardState[newY][newX]) return true;
        }
      }
    }
    return false;
  };

  const mergePiece = () => {
    const newBoard = board.map(row => [...row]);
    currentPiece.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          const boardY = position.y + y;
          const boardX = position.x + x;
          if (boardY >= 0 && boardY < ROWS && boardX >= 0 && boardX < COLS) {
            newBoard[boardY][boardX] = currentPiece.color;
          }
        }
      });
    });
    return newBoard;
  };

  const clearLines = (boardState) => {
    let cleared = 0;
    const newBoard = boardState.filter(row => {
      if (row.every(cell => cell !== null)) {
        cleared++;
        return false;
      }
      return true;
    });

    while (newBoard.length < ROWS) {
      newBoard.unshift(Array(COLS).fill(null));
    }

    if (cleared > 0) {
      soundManager.playCoin();
      const points = cleared === 1 ? 100 : cleared === 2 ? 300 : cleared === 3 ? 500 : 800;
      setScore(prev => prev + points);
      setLinesCleared(prev => {
        const newLines = prev + cleared;
        setLevel(Math.floor(newLines / 10) + 1);
        if (newLines % 10 === 0) {
          soundManager.playPowerUp();
        }
        return newLines;
      });
    }

    return newBoard;
  };

  const spawnNewPiece = () => {
    const piece = nextPiece || getRandomPiece();
    const newPos = { x: Math.floor(COLS / 2) - 1, y: 0 };
    
    if (checkCollision(piece.shape, newPos, board)) {
      setGameOver(true);
      setHighScore(prev => Math.max(prev, score));
      soundManager.playLose();
      return;
    }

    setCurrentPiece(piece);
    setPosition(newPos);
    setNextPiece(getRandomPiece());
  };

  const moveDown = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return;

    const newPos = { x: position.x, y: position.y + 1 };

    if (checkCollision(currentPiece.shape, newPos, board)) {
      soundManager.playHit();
      const mergedBoard = mergePiece();
      const clearedBoard = clearLines(mergedBoard);
      setBoard(clearedBoard);
      spawnNewPiece();
    } else {
      setPosition(newPos);
    }
  }, [currentPiece, position, board, gameOver, isPaused]);

  const moveHorizontal = (direction) => {
    if (!currentPiece || gameOver || isPaused) return;

    const newPos = { x: position.x + direction, y: position.y };
    if (!checkCollision(currentPiece.shape, newPos, board)) {
      setPosition(newPos);
      soundManager.playClick();
    }
  };

  const rotate = () => {
    if (!currentPiece || gameOver || isPaused) return;

    const rotated = rotatePiece(currentPiece.shape);
    if (!checkCollision(rotated, position, board)) {
      setCurrentPiece({ ...currentPiece, shape: rotated });
      soundManager.playClick();
    }
  };

  const drop = () => {
    if (!currentPiece || gameOver || isPaused) return;

    let newPos = { ...position };
    while (!checkCollision(currentPiece.shape, { x: newPos.x, y: newPos.y + 1 }, board)) {
      newPos.y++;
    }
    setPosition(newPos);
  };

  useEffect(() => {
    if (!currentPiece && !gameOver) {
      spawnNewPiece();
    }
  }, [currentPiece, gameOver]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameOver) return;

      switch (e.key) {
        case 'ArrowLeft':
          moveHorizontal(-1);
          break;
        case 'ArrowRight':
          moveHorizontal(1);
          break;
        case 'ArrowDown':
          moveDown();
          break;
        case 'ArrowUp':
          rotate();
          break;
        case ' ':
          e.preventDefault();
          drop();
          break;
        case 'p':
          setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPiece, position, board, gameOver]);

  useEffect(() => {
    const speed = getDropSpeed(level);
    const gameLoop = setInterval(moveDown, speed);
    return () => clearInterval(gameLoop);
  }, [moveDown, level, difficulty]);

  const resetGame = () => {
    setBoard(createEmptyBoard());
    setCurrentPiece(null);
    setNextPiece(null);
    setPosition({ x: 0, y: 0 });
    setScore(0);
    setLevel(1);
    setLinesCleared(0);
    setGameOver(false);
    setIsPaused(false);
  };

  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);

    if (currentPiece) {
      currentPiece.shape.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell) {
            const boardY = position.y + y;
            const boardX = position.x + x;
            if (boardY >= 0 && boardY < ROWS && boardX >= 0 && boardX < COLS) {
              displayBoard[boardY][boardX] = currentPiece.color;
            }
          }
        });
      });
    }

    return displayBoard;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <GameNavigation currentGame={currentGame} setPage={setPage} gamesList={gamesList} />
        
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            🟦 <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Tetris</span>
          </h2>
          <p className="text-gray-300 mb-4">Arrow Keys: Move/Rotate | Space: Drop | P: Pause</p>
          {isPaused && <div className="text-yellow-400 font-bold animate-pulse">⏸ PAUSED</div>}
        </div>

        <div className="flex justify-center gap-6 flex-wrap mb-6">
          {/* Main Game Board */}
          <div className="flex flex-col items-center">
            <div 
              className="relative bg-gradient-to-br from-gray-950 to-gray-900 border-4 border-cyan-500 rounded-xl shadow-2xl shadow-cyan-500/30 overflow-hidden"
              style={{ width: COLS * CELL_SIZE, height: ROWS * CELL_SIZE }}
            >
              {renderBoard().map((row, y) =>
                row.map((cell, x) => (
                  <div
                    key={`${y}-${x}`}
                    className={`absolute border border-gray-800/50 transition-all duration-150 ${cell || 'bg-gray-900/50'}`}
                    style={{
                      left: x * CELL_SIZE,
                      top: y * CELL_SIZE,
                      width: CELL_SIZE,
                      height: CELL_SIZE,
                      boxShadow: cell ? '0 0 10px rgba(0,0,0,0.5)' : 'none'
                    }}
                  />
                ))
              )}
            </div>
          </div>

          {/* Stats Panel */}
          <div className="flex flex-col gap-4">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border-2 border-cyan-500/30 shadow-lg min-w-[200px]">
              <h3 className="text-xl font-bold text-white mb-4 border-b border-cyan-500/30 pb-2">📊 Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Score</span>
                  <span className="text-2xl font-bold text-cyan-400">{score}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Level</span>
                  <span className="text-xl font-bold text-blue-400">{level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Lines</span>
                  <span className="text-xl font-bold text-green-400">{linesCleared}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">High Score</span>
                  <span className="text-lg font-bold text-yellow-400">{highScore}</span>
                </div>
              </div>
            </div>

            {/* Next Piece Preview */}
            {nextPiece && (
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border-2 border-purple-500/30 shadow-lg">
                <h3 className="text-xl font-bold text-white mb-4 border-b border-purple-500/30 pb-2">🔮 Next</h3>
                <div className="flex justify-center items-center h-24">
                  <div className="relative" style={{ width: '80px', height: '80px' }}>
                    {nextPiece.shape.map((row, y) =>
                      row.map((cell, x) =>
                        cell ? (
                          <div
                            key={`${y}-${x}`}
                            className={`absolute ${nextPiece.color} rounded-sm`}
                            style={{
                              left: x * 18 + 10,
                              top: y * 18 + 10,
                              width: 16,
                              height: 16
                            }}
                          />
                        ) : null
                      )
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Controls */}
        <div className="flex justify-center gap-3 mb-6 md:hidden">
          <button onClick={() => moveHorizontal(-1)} className="bg-gradient-to-br from-gray-700 to-gray-800 text-white p-4 rounded-xl active:scale-95 transition-transform shadow-lg border border-cyan-500/30">
            <span className="text-2xl">⬅️</span>
          </button>
          <button onClick={rotate} className="bg-gradient-to-br from-purple-600 to-purple-700 text-white p-4 rounded-xl active:scale-95 transition-transform shadow-lg">
            <span className="text-2xl">🔄</span>
          </button>
          <button onClick={() => moveHorizontal(1)} className="bg-gradient-to-br from-gray-700 to-gray-800 text-white p-4 rounded-xl active:scale-95 transition-transform shadow-lg border border-cyan-500/30">
            <span className="text-2xl">➡️</span>
          </button>
          <button onClick={moveDown} className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-4 rounded-xl active:scale-95 transition-transform shadow-lg">
            <span className="text-2xl">⬇️</span>
          </button>
          <button onClick={drop} className="bg-gradient-to-br from-cyan-600 to-cyan-700 text-white p-4 rounded-xl active:scale-95 transition-transform shadow-lg">
            <span className="text-2xl">💨</span>
          </button>
        </div>

        {gameOver && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 max-w-md mx-4 border-4 border-cyan-500 shadow-2xl shadow-cyan-500/50 transform animate-scaleIn">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4 animate-bounce">🎮</div>
                <h3 className="text-4xl font-bold text-white mb-2">Game Over!</h3>
                <p className="text-gray-400">The blocks have reached the top!</p>
              </div>
              
              <div className="bg-gray-900/50 rounded-xl p-6 mb-6 border border-cyan-500/30">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-400">Final Score</span>
                  <span className="text-3xl font-bold text-cyan-400">{score}</span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-400">Level Reached</span>
                  <span className="text-2xl font-semibold text-blue-400">{level}</span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-400">Lines Cleared</span>
                  <span className="text-2xl font-semibold text-green-400">{linesCleared}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">High Score</span>
                  <span className="text-2xl font-bold text-yellow-400">🏆 {highScore}</span>
                </div>
              </div>

              <button
                onClick={resetGame}
                className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg shadow-cyan-500/50 text-lg"
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

export default TetrisGame;
