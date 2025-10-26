import React, { useState, useEffect, useRef } from 'react';
import GameNavigation from '../components/GameNavigation';
import soundManager from '../utils/soundManager';
import { useSettings } from '../context/SettingsContext';

const PongGame = ({ setPage, gamesList, currentGame }) => {
  const { difficulty } = useSettings();
  
  const CANVAS_WIDTH = 1000;
  const CANVAS_HEIGHT = 700;
  const PADDLE_WIDTH = 15;
  const PADDLE_HEIGHT = 130;
  const BALL_SIZE = 16;

  const getDifficultySettings = () => {
    switch(difficulty) {
      case 'easy':
        return { ballSpeed: 2, aiSpeed: 3.5, paddleSpeed: 8 };
      case 'normal':
        return { ballSpeed: 2.5, aiSpeed: 4.5, paddleSpeed: 7 };
      case 'hard':
        return { ballSpeed: 3.5, aiSpeed: 5.5, paddleSpeed: 6 };
      case 'expert':
        return { ballSpeed: 4.5, aiSpeed: 7, paddleSpeed: 5 };
      default:
        return { ballSpeed: 2.5, aiSpeed: 4.5, paddleSpeed: 7 };
    }
  };

  const canvasRef = useRef(null);
  const [leftPaddleY, setLeftPaddleY] = useState(CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2);
  const [rightPaddleY, setRightPaddleY] = useState(CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2);
  const [ballPos, setBallPos] = useState({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 });
  const [ballVel, setBallVel] = useState({ x: 2.5, y: 2.5 });
  const [leftScore, setLeftScore] = useState(0);
  const [rightScore, setRightScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const gameLoopRef = useRef(null);
  const keysPressed = useRef({});

  const WIN_SCORE = 5;

  const resetBall = () => {
    const diffSettings = getDifficultySettings();
    setBallPos({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 });
    setBallVel({ 
      x: (Math.random() > 0.5 ? 1 : -1) * diffSettings.ballSpeed, 
      y: (Math.random() - 0.5) * 4 
    });
  };

  const resetGame = () => {
    setLeftScore(0);
    setRightScore(0);
    setGameOver(false);
    setGameStarted(false);
    setWinner(null);
    resetBall();
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      keysPressed.current[e.key] = true;
      if (!gameStarted && (e.key === ' ' || e.key === 'Enter')) {
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
  }, [gameStarted]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameLoop = () => {
      const diffSettings = getDifficultySettings();
      
      // Move paddles
      if (keysPressed.current['w']) {
        setLeftPaddleY(prev => Math.max(0, prev - diffSettings.paddleSpeed));
      }
      if (keysPressed.current['s']) {
        setLeftPaddleY(prev => Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, prev + diffSettings.paddleSpeed));
      }
      if (keysPressed.current['ArrowUp']) {
        setRightPaddleY(prev => Math.max(0, prev - diffSettings.paddleSpeed));
      }
      if (keysPressed.current['ArrowDown']) {
        setRightPaddleY(prev => Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, prev + diffSettings.paddleSpeed));
      }

      // Move ball
      setBallPos(prev => {
        let newX = prev.x + ballVel.x;
        let newY = prev.y + ballVel.y;
        let newVelX = ballVel.x;
        let newVelY = ballVel.y;

        // Top/bottom collision
        if (newY <= 0 || newY >= CANVAS_HEIGHT - BALL_SIZE) {
          newVelY = -newVelY;
          newY = newY <= 0 ? 0 : CANVAS_HEIGHT - BALL_SIZE;
          soundManager.playHit();
        }

        // Left paddle collision
        if (newX <= PADDLE_WIDTH && 
            newY + BALL_SIZE >= leftPaddleY && 
            newY <= leftPaddleY + PADDLE_HEIGHT) {
          newVelX = Math.abs(newVelX) * 1.05;
          newVelY += (newY - (leftPaddleY + PADDLE_HEIGHT / 2)) * 0.1;
          newX = PADDLE_WIDTH;
          soundManager.playHit();
        }

        // Right paddle collision
        if (newX >= CANVAS_WIDTH - PADDLE_WIDTH - BALL_SIZE && 
            newY + BALL_SIZE >= rightPaddleY && 
            newY <= rightPaddleY + PADDLE_HEIGHT) {
          newVelX = -Math.abs(newVelX) * 1.05;
          newVelY += (newY - (rightPaddleY + PADDLE_HEIGHT / 2)) * 0.1;
          newX = CANVAS_WIDTH - PADDLE_WIDTH - BALL_SIZE;
          soundManager.playHit();
        }

        // Score
        if (newX < 0) {
          soundManager.playCoin();
          setRightScore(prev => {
            const newScore = prev + 1;
            if (newScore >= WIN_SCORE) {
              setWinner('Right');
              setGameOver(true);
              soundManager.playWin();
            }
            return newScore;
          });
          resetBall();
          return { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 };
        }

        if (newX > CANVAS_WIDTH) {
          soundManager.playCoin();
          setLeftScore(prev => {
            const newScore = prev + 1;
            if (newScore >= WIN_SCORE) {
              setWinner('Left');
              setGameOver(true);
              soundManager.playWin();
            }
            return newScore;
          });
          resetBall();
          return { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 };
        }

        setBallVel({ x: newVelX, y: newVelY });
        return { x: newX, y: newY };
      });

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameStarted, gameOver, leftPaddleY, rightPaddleY, ballVel, difficulty]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw center line
    ctx.strokeStyle = '#444';
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(CANVAS_WIDTH / 2, 0);
    ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw paddles
    ctx.fillStyle = '#00FF00';
    ctx.fillRect(0, leftPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillStyle = '#FF00FF';
    ctx.fillRect(CANVAS_WIDTH - PADDLE_WIDTH, rightPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw ball
    ctx.fillStyle = '#FFF';
    ctx.fillRect(ballPos.x, ballPos.y, BALL_SIZE, BALL_SIZE);

    // Draw scores
    ctx.font = '48px Inter';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.fillText(leftScore, CANVAS_WIDTH / 4, 60);
    ctx.fillText(rightScore, (CANVAS_WIDTH / 4) * 3, 60);

  }, [leftPaddleY, rightPaddleY, ballPos, leftScore, rightScore]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <GameNavigation currentGame={currentGame} setPage={setPage} gamesList={gamesList} />
        
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            🏓 <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">Pong</span>
          </h2>
          <p className="text-gray-300 mb-4">W/S: Left Paddle | ↑/↓: Right Paddle | First to {WIN_SCORE} wins!</p>
          <div className="flex items-center justify-center gap-8">
            <div className="text-3xl font-bold text-green-400">Left: {leftScore}</div>
            <div className="text-3xl font-bold text-fuchsia-400">Right: {rightScore}</div>
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              className="border-4 border-indigo-500 rounded-xl shadow-2xl shadow-indigo-500/30 bg-black"
            />
            {!gameStarted && !gameOver && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm rounded-xl">
                <div className="text-center text-white animate-slideUp">
                  <div className="text-6xl mb-4 animate-bounce">🏓</div>
                  <p className="text-2xl font-bold mb-2">Press Space to Start!</p>
                  <p className="text-lg text-gray-300">2 Player Game</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {gameOver && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 max-w-md mx-4 border-4 border-indigo-500 shadow-2xl shadow-indigo-500/50 transform animate-scaleIn">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-4xl font-bold text-white mb-2">{winner} Player Wins!</h3>
                <p className="text-gray-400">Congratulations!</p>
              </div>
              
              <div className="bg-gray-900/50 rounded-xl p-6 mb-6 border border-indigo-500/30">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-green-400">Left Player</span>
                  <span className="text-3xl font-bold text-white">{leftScore}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-fuchsia-400">Right Player</span>
                  <span className="text-3xl font-bold text-white">{rightScore}</span>
                </div>
              </div>

              <button
                onClick={resetGame}
                className="w-full py-4 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg shadow-indigo-500/50 text-lg"
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

export default PongGame;
