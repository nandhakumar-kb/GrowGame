import React, { useState } from 'react';
import GameNavigation from '../components/GameNavigation';
import soundManager from '../utils/soundManager';

const TicTacToeGame = ({ setPage, gamesList, currentGame }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [xWins, setXWins] = useState(0);
  const [oWins, setOWins] = useState(0);
  const [draws, setDraws] = useState(0);

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (let [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (index) => {
    if (board[index] || winner) return;

    soundManager.playClick();
    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);

    const gameWinner = calculateWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      soundManager.playWin();
      if (gameWinner === 'X') setXWins(prev => prev + 1);
      else setOWins(prev => prev + 1);
    } else if (newBoard.every(cell => cell !== null)) {
      setWinner('draw');
      soundManager.playClick();
      setDraws(prev => prev + 1);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <GameNavigation currentGame={currentGame} setPage={setPage} gamesList={gamesList} />
        
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            ⭕ <span className="bg-gradient-to-r from-red-400 to-rose-500 bg-clip-text text-transparent">Tic-Tac-Toe</span>
          </h2>
          <p className="text-gray-300 mb-4">Two Player Game</p>
          
          {/* Scoreboard */}
          <div className="flex justify-center gap-6 mb-4">
            <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 border-2 border-cyan-400 rounded-xl px-6 py-3">
              <div className="text-cyan-400 font-bold text-lg">Player X</div>
              <div className="text-3xl font-bold text-white">{xWins}</div>
            </div>
            <div className="bg-gradient-to-br from-gray-500/20 to-gray-600/20 border-2 border-gray-400 rounded-xl px-6 py-3">
              <div className="text-gray-400 font-bold text-lg">Draws</div>
              <div className="text-3xl font-bold text-white">{draws}</div>
            </div>
            <div className="bg-gradient-to-br from-pink-500/20 to-pink-600/20 border-2 border-pink-400 rounded-xl px-6 py-3">
              <div className="text-pink-400 font-bold text-lg">Player O</div>
              <div className="text-3xl font-bold text-white">{oWins}</div>
            </div>
          </div>

          <div className="text-2xl font-bold">
            {winner ? (
              winner === 'draw' ? (
                <span className="text-gray-400">It's a Draw!</span>
              ) : (
                <span className={winner === 'X' ? 'text-cyan-400' : 'text-pink-400'}>
                  Winner: {winner} 🎉
                </span>
              )
            ) : (
              <span className={isXNext ? 'text-cyan-400' : 'text-pink-400'}>
                Next: {isXNext ? 'X' : 'O'} {isXNext ? '🔵' : '🔴'}
              </span>
            )}
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <div className="grid grid-cols-3 gap-8 bg-gradient-to-br from-gray-800 to-gray-900 p-12 rounded-3xl border-4 border-red-500 shadow-2xl shadow-red-500/30">
            {board.map((cell, index) => (
              <button
                key={index}
                onClick={() => handleClick(index)}
                className="w-48 h-48 bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 border-3 border-red-400/50 rounded-2xl text-8xl font-bold text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={cell !== null || winner !== null}
              >
                {cell === 'X' && <span className="text-cyan-400 drop-shadow-lg">X</span>}
                {cell === 'O' && <span className="text-pink-400 drop-shadow-lg">O</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="text-center flex justify-center gap-4">
          <button
            onClick={resetGame}
            className="py-4 px-8 bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg shadow-red-500/50 text-lg"
          >
            🔄 New Round
          </button>
          <button
            onClick={() => {
              setXWins(0);
              setOWins(0);
              setDraws(0);
              resetGame();
            }}
            className="py-4 px-8 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg text-lg"
          >
            🔄 Reset Score
          </button>
        </div>

        {winner && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 max-w-md mx-4 border-4 border-red-500 shadow-2xl shadow-red-500/50 transform animate-scaleIn">
              <div className="text-center mb-6">
                <div className="text-7xl mb-4">
                  {winner === 'draw' ? '🤝' : winner === 'X' ? '🎉' : '🎊'}
                </div>
                <h3 className="text-4xl font-bold text-white mb-2">
                  {winner === 'draw' ? "It's a Draw!" : `${winner} Wins!`}
                </h3>
                {winner !== 'draw' && (
                  <p className="text-gray-400">
                    Player {winner} takes this round!
                  </p>
                )}
              </div>
              
              <div className="bg-gray-900/50 rounded-xl p-6 mb-6 border border-red-500/30">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-cyan-400">Player X Wins</span>
                  <span className="text-2xl font-bold text-white">{xWins}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Draws</span>
                  <span className="text-2xl font-bold text-white">{draws}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-pink-400">Player O Wins</span>
                  <span className="text-2xl font-bold text-white">{oWins}</span>
                </div>
              </div>

              <button
                onClick={resetGame}
                className="w-full py-4 px-6 bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg shadow-red-500/50 text-lg"
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

export default TicTacToeGame;
