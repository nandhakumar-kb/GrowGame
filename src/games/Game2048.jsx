import React, { useState, useEffect } from 'react';
import GameNavigation from '../components/GameNavigation';
import soundManager from '../utils/soundManager';

const Game2048 = ({ setPage, gamesList, currentGame }) => {
  const GRID_SIZE = 4;

  const createEmptyGrid = () => Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));

  const addRandomTile = (grid) => {
    const emptyCells = [];
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (grid[i][j] === 0) emptyCells.push({ i, j });
      }
    }
    if (emptyCells.length > 0) {
      const { i, j } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      grid[i][j] = Math.random() < 0.9 ? 2 : 4;
    }
    return grid;
  };

  const initGrid = () => {
    let grid = createEmptyGrid();
    grid = addRandomTile(grid);
    grid = addRandomTile(grid);
    return grid;
  };

  const [grid, setGrid] = useState(initGrid);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const getTileColor = (value) => {
    const colors = {
      0: 'bg-gray-700',
      2: 'bg-amber-200 text-gray-800',
      4: 'bg-amber-300 text-gray-800',
      8: 'bg-orange-400 text-white',
      16: 'bg-orange-500 text-white',
      32: 'bg-orange-600 text-white',
      64: 'bg-red-500 text-white',
      128: 'bg-yellow-400 text-white',
      256: 'bg-yellow-500 text-white',
      512: 'bg-yellow-600 text-white',
      1024: 'bg-amber-500 text-white',
      2048: 'bg-amber-600 text-white'
    };
    return colors[value] || 'bg-purple-600 text-white';
  };

  const moveLeft = (grid) => {
    let newGrid = grid.map(row => [...row]);
    let moved = false;
    let points = 0;

    for (let i = 0; i < GRID_SIZE; i++) {
      let row = newGrid[i].filter(val => val !== 0);
      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2;
          points += row[j];
          row.splice(j + 1, 1);
        }
      }
      while (row.length < GRID_SIZE) row.push(0);
      if (JSON.stringify(row) !== JSON.stringify(newGrid[i])) moved = true;
      newGrid[i] = row;
    }

    return { grid: newGrid, moved, points };
  };

  const rotate = (grid) => {
    return grid[0].map((_, i) => grid.map(row => row[i]).reverse());
  };

  const move = (direction) => {
    if (gameOver) return;

    let newGrid = grid.map(row => [...row]);
    let result;

    if (direction === 'left') {
      result = moveLeft(newGrid);
    } else if (direction === 'right') {
      newGrid = rotate(rotate(newGrid));
      result = moveLeft(newGrid);
      result.grid = rotate(rotate(result.grid));
    } else if (direction === 'up') {
      newGrid = rotate(rotate(rotate(newGrid)));
      result = moveLeft(newGrid);
      result.grid = rotate(result.grid);
    } else if (direction === 'down') {
      newGrid = rotate(newGrid);
      result = moveLeft(newGrid);
      result.grid = rotate(rotate(rotate(result.grid)));
    }

    if (result.moved) {
      soundManager.playClick();
      result.grid = addRandomTile(result.grid);
      setGrid(result.grid);
      setScore(prev => prev + result.points);
      
      if (result.points > 0) {
        soundManager.playCoin();
      }
      
      // Check for win
      const hasWon = result.grid.some(row => row.some(cell => cell === 2048));
      if (hasWon) {
        soundManager.playWin();
      }
      
      if (!canMove(result.grid)) {
        setGameOver(true);
        setHighScore(prev => Math.max(prev, score + result.points));
        soundManager.playLose();
      }
    }
  };

  const canMove = (grid) => {
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (grid[i][j] === 0) return true;
        if (j < GRID_SIZE - 1 && grid[i][j] === grid[i][j + 1]) return true;
        if (i < GRID_SIZE - 1 && grid[i][j] === grid[i + 1][j]) return true;
      }
    }
    return false;
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver) return;
      if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
        e.preventDefault();
        setIsPaused(prev => !prev);
        soundManager.playClick();
        return;
      }
      if (isPaused) return;
      if (e.key === 'ArrowLeft') { e.preventDefault(); move('left'); }
      if (e.key === 'ArrowRight') { e.preventDefault(); move('right'); }
      if (e.key === 'ArrowUp') { e.preventDefault(); move('up'); }
      if (e.key === 'ArrowDown') { e.preventDefault(); move('down'); }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [grid, gameOver, isPaused]);

  const resetGame = () => {
    setGrid(initGrid());
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-amber-900 to-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <GameNavigation currentGame={currentGame} setPage={setPage} gamesList={gamesList} />
        
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            🔢 <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">2048</span>
          </h2>
          <p className="text-gray-300 mb-4">Use Arrow Keys to merge tiles! | P: Pause</p>
          {isPaused && <div className="text-yellow-400 font-bold animate-pulse">⏸ PAUSED - Press P to Resume</div>}
          <div className="flex items-center justify-center gap-8">
            <div className="text-2xl font-bold text-amber-400">Score: {score}</div>
            <div className="text-xl font-semibold text-orange-400">🏆 Best: {highScore}</div>
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-5 rounded-2xl border-4 border-amber-500 shadow-2xl shadow-amber-500/30">
            <div className="grid grid-cols-4 gap-4">
              {grid.map((row, i) =>
                row.map((cell, j) => (
                  <div
                    key={`${i}-${j}`}
                    className={`w-40 h-40 flex items-center justify-center text-5xl font-bold rounded-xl transition-all duration-200 ${getTileColor(cell)}`}
                  >
                    {cell !== 0 && cell}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Mobile Controls */}
        <div className="flex justify-center mb-6 md:hidden">
          <div className="grid grid-cols-3 gap-3">
            <div></div>
            <button onClick={() => move('up')} className="bg-gradient-to-br from-amber-600 to-amber-700 text-white p-5 rounded-xl active:scale-95 transition-transform shadow-lg">
              <span className="text-2xl">⬆️</span>
            </button>
            <div></div>
            <button onClick={() => move('left')} className="bg-gradient-to-br from-amber-600 to-amber-700 text-white p-5 rounded-xl active:scale-95 transition-transform shadow-lg">
              <span className="text-2xl">⬅️</span>
            </button>
            <button onClick={resetGame} className="bg-gradient-to-br from-gray-600 to-gray-700 text-white p-5 rounded-xl active:scale-95 transition-transform shadow-lg">
              <span className="text-2xl">🔄</span>
            </button>
            <button onClick={() => move('right')} className="bg-gradient-to-br from-amber-600 to-amber-700 text-white p-5 rounded-xl active:scale-95 transition-transform shadow-lg">
              <span className="text-2xl">➡️</span>
            </button>
            <div></div>
            <button onClick={() => move('down')} className="bg-gradient-to-br from-amber-600 to-amber-700 text-white p-5 rounded-xl active:scale-95 transition-transform shadow-lg">
              <span className="text-2xl">⬇️</span>
            </button>
          </div>
        </div>

        {gameOver && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 max-w-md mx-4 border-4 border-amber-500 shadow-2xl shadow-amber-500/50 transform animate-scaleIn">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🎮</div>
                <h3 className="text-4xl font-bold text-white mb-2">Game Over!</h3>
                <p className="text-gray-400">No more moves!</p>
              </div>
              
              <div className="bg-gray-900/50 rounded-xl p-6 mb-6 border border-amber-500/30">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-400">Final Score</span>
                  <span className="text-3xl font-bold text-amber-400">{score}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">High Score</span>
                  <span className="text-2xl font-bold text-orange-400">🏆 {highScore}</span>
                </div>
              </div>

              <button
                onClick={resetGame}
                className="w-full py-4 px-6 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg shadow-amber-500/50 text-lg"
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

export default Game2048;
