import React, { useState, useEffect, useRef } from 'react';
import GameNavigation from '../components/GameNavigation';
import soundManager from '../utils/soundManager';
import { useSettings } from '../context/SettingsContext';

const BreakoutGame = ({ setPage, gamesList, currentGame }) => {
  const { difficulty } = useSettings();
  
  const CANVAS_WIDTH = 1000;
  const CANVAS_HEIGHT = 700;
  const PADDLE_WIDTH = 130;
  const PADDLE_HEIGHT = 22;
  const BALL_SIZE = 16;
  const BRICK_ROWS = 7;
  const BRICK_COLS = 10;
  const BRICK_WIDTH = 95;
  const BRICK_HEIGHT = 30;

  const getDifficultySettings = () => {
    switch(difficulty) {
      case 'easy':
        return { ballSpeed: 2, paddleSpeed: 10, paddleWidth: 140 };
      case 'normal':
        return { ballSpeed: 2.5, paddleSpeed: 8, paddleWidth: 120 };
      case 'hard':
        return { ballSpeed: 3.5, paddleSpeed: 7, paddleWidth: 100 };
      case 'expert':
        return { ballSpeed: 4.5, paddleSpeed: 6, paddleWidth: 80 };
      default:
        return { ballSpeed: 2.5, paddleSpeed: 8, paddleWidth: 120 };
    }
  };

  const canvasRef = useRef(null);
  const [paddleX, setPaddleX] = useState(CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2);
  const [ballPos, setBallPos] = useState({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 40 });
  const [ballVel, setBallVel] = useState({ x: 2.5, y: -2.5 });
  const [bricks, setBricks] = useState([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const gameLoopRef = useRef(null);
  const keysPressed = useRef({});

  const createBricks = () => {
    const newBricks = [];
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];
    for (let row = 0; row < BRICK_ROWS; row++) {
      for (let col = 0; col < BRICK_COLS; col++) {
        newBricks.push({
          x: col * (BRICK_WIDTH + 5) + 35,
          y: row * (BRICK_HEIGHT + 5) + 50,
          active: true,
          color: colors[row]
        });
      }
    }
    return newBricks;
  };

  const resetGame = () => {
    const diffSettings = getDifficultySettings();
    setPaddleX(CANVAS_WIDTH / 2 - diffSettings.paddleWidth / 2);
    setBallPos({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 40 });
    setBallVel({ 
      x: (Math.random() > 0.5 ? 1 : -1) * diffSettings.ballSpeed, 
      y: -diffSettings.ballSpeed 
    });
    setBricks(createBricks());
    setScore(0);
    setLives(3);
    setGameStarted(false);
    setGameOver(false);
    setGameWon(false);
  };

  useEffect(() => {
    setBricks(createBricks());
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      keysPressed.current[e.key] = true;
      if (!gameStarted && !gameOver && e.key === ' ') {
        e.preventDefault();
        setGameStarted(true);
      }
    };

    const handleKeyUp = (e) => {
      keysPressed.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameStarted, gameOver]);

  useEffect(() => {
    if (!gameStarted || gameOver || gameWon) return;

    const gameLoop = () => {
      const diffSettings = getDifficultySettings();
      
      // Move paddle
      if (keysPressed.current['ArrowLeft']) {
        setPaddleX(prev => Math.max(0, prev - diffSettings.paddleSpeed));
      }
      if (keysPressed.current['ArrowRight']) {
        setPaddleX(prev => Math.min(CANVAS_WIDTH - diffSettings.paddleWidth, prev + diffSettings.paddleSpeed));
      }

      // Move ball
      setBallPos(prev => {
        let newX = prev.x + ballVel.x;
        let newY = prev.y + ballVel.y;
        let newVelX = ballVel.x;
        let newVelY = ballVel.y;

        // Wall collisions
        if (newX <= 0 || newX >= CANVAS_WIDTH - BALL_SIZE) {
          newVelX = -newVelX;
          newX = newX <= 0 ? 0 : CANVAS_WIDTH - BALL_SIZE;
          soundManager.playHit();
        }
        if (newY <= 0) {
          newVelY = -newVelY;
          newY = 0;
          soundManager.playHit();
        }

        // Paddle collision
        const diffSettings = getDifficultySettings();
        if (newY + BALL_SIZE >= CANVAS_HEIGHT - PADDLE_HEIGHT - 5 &&
            newY <= CANVAS_HEIGHT - PADDLE_HEIGHT &&
            newX + BALL_SIZE >= paddleX &&
            newX <= paddleX + diffSettings.paddleWidth) {
          newVelY = -Math.abs(newVelY);
          const hitPos = (newX - paddleX) / diffSettings.paddleWidth - 0.5;
          newVelX += hitPos * 2;
          newY = CANVAS_HEIGHT - PADDLE_HEIGHT - BALL_SIZE - 5;
          soundManager.playHit();
        }

        // Brick collisions
        setBricks(prevBricks => {
          return prevBricks.map(brick => {
            if (brick.active &&
                newX + BALL_SIZE > brick.x &&
                newX < brick.x + BRICK_WIDTH &&
                newY + BALL_SIZE > brick.y &&
                newY < brick.y + BRICK_HEIGHT) {
              newVelY = -newVelY;
              setScore(prev => prev + 10);
              soundManager.playCoin();
              return { ...brick, active: false };
            }
            return brick;
          });
        });

        // Ball fell
        if (newY > CANVAS_HEIGHT) {
          soundManager.playError();
          setLives(prev => {
            const newLives = prev - 1;
            if (newLives <= 0) {
              setGameOver(true);
              setHighScore(prev => Math.max(prev, score));
              soundManager.playLose();
            } else {
              // Reset ball position
              setBallPos({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 40 });
              setBallVel({ x: 2.5, y: -2.5 });
              setGameStarted(false);
            }
            return newLives;
          });
          return prev;
        }

        setBallVel({ x: newVelX, y: newVelY });
        return { x: newX, y: newY };
      });

      // Check win condition
      if (bricks.every(b => !b.active)) {
        setGameWon(true);
        setHighScore(prev => Math.max(prev, score));
        soundManager.playWin();
      }

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameStarted, gameOver, gameWon, paddleX, ballVel, bricks, score, difficulty]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const diffSettings = getDifficultySettings();
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#0f0f1e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw bricks
    bricks.forEach(brick => {
      if (brick.active) {
        ctx.fillStyle = brick.color;
        ctx.fillRect(brick.x, brick.y, BRICK_WIDTH, BRICK_HEIGHT);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(brick.x, brick.y, BRICK_WIDTH, BRICK_HEIGHT);
      }
    });

    // Draw paddle
    const paddleGradient = ctx.createLinearGradient(paddleX, 0, paddleX + diffSettings.paddleWidth, 0);
    paddleGradient.addColorStop(0, '#4ECDC4');
    paddleGradient.addColorStop(1, '#45B7D1');
    ctx.fillStyle = paddleGradient;
    ctx.fillRect(paddleX, CANVAS_HEIGHT - PADDLE_HEIGHT - 5, diffSettings.paddleWidth, PADDLE_HEIGHT);

    // Draw ball
    ctx.fillStyle = '#FFE66D';
    ctx.beginPath();
    ctx.arc(ballPos.x + BALL_SIZE / 2, ballPos.y + BALL_SIZE / 2, BALL_SIZE / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#FFF';
    ctx.lineWidth = 2;
    ctx.stroke();

  }, [paddleX, ballPos, bricks]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-lime-900 to-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <GameNavigation currentGame={currentGame} setPage={setPage} gamesList={gamesList} />
        
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            🧱 <span className="bg-gradient-to-r from-lime-400 to-green-500 bg-clip-text text-transparent">Breakout</span>
          </h2>
          <p className="text-gray-300 mb-4">←/→ to move paddle | Space to start!</p>
          <div className="flex items-center justify-center gap-8">
            <div className="text-2xl font-bold text-lime-400">Score: {score}</div>
            <div className="text-xl font-semibold text-red-400">❤️ Lives: {lives}</div>
            <div className="text-xl font-semibold text-green-400">🏆 Best: {highScore}</div>
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              className="border-4 border-lime-500 rounded-xl shadow-2xl shadow-lime-500/30"
            />
            {!gameStarted && !gameOver && !gameWon && lives > 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-xl">
                <div className="text-center text-white animate-slideUp">
                  <div className="text-6xl mb-4 animate-bounce">🧱</div>
                  <p className="text-2xl font-bold mb-2">Press Space to Launch!</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {(gameOver || gameWon) && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 max-w-md mx-4 border-4 border-lime-500 shadow-2xl shadow-lime-500/50 transform animate-scaleIn">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">{gameWon ? '🎉' : '😢'}</div>
                <h3 className="text-4xl font-bold text-white mb-2">
                  {gameWon ? 'You Won!' : 'Game Over!'}
                </h3>
                <p className="text-gray-400">
                  {gameWon ? 'All bricks destroyed!' : 'Better luck next time!'}
                </p>
              </div>
              
              <div className="bg-gray-900/50 rounded-xl p-6 mb-6 border border-lime-500/30">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-400">Final Score</span>
                  <span className="text-3xl font-bold text-lime-400">{score}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">High Score</span>
                  <span className="text-2xl font-bold text-green-400">🏆 {highScore}</span>
                </div>
              </div>

              <button
                onClick={resetGame}
                className="w-full py-4 px-6 bg-gradient-to-r from-lime-500 to-green-600 text-white font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg shadow-lime-500/50 text-lg"
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

export default BreakoutGame;
