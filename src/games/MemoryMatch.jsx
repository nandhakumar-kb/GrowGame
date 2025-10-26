import React, { useState } from 'react';
import GameNavigation from '../components/GameNavigation';
import soundManager from '../utils/soundManager';

const MemoryMatchGame = ({ setPage, gamesList, currentGame }) => {
  const emojis = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎸', '🎹'];
  
  const createDeck = () => {
    const deck = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji, flipped: false, matched: false }));
    return deck;
  };

  const [cards, setCards] = useState(createDeck());
  const [flippedCards, setFlippedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [bestMoves, setBestMoves] = useState(Infinity);

  const handleCardClick = (id) => {
    if (flippedCards.length === 2) return;
    
    const card = cards.find(c => c.id === id);
    if (card.flipped || card.matched) return;

    soundManager.playClick();
    const newCards = cards.map(c => 
      c.id === id ? { ...c, flipped: true } : c
    );
    setCards(newCards);
    
    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      const [first, second] = newFlipped;
      const firstCard = newCards.find(c => c.id === first);
      const secondCard = newCards.find(c => c.id === second);

      if (firstCard.emoji === secondCard.emoji) {
        soundManager.playSuccess();
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            c.id === first || c.id === second ? { ...c, matched: true } : c
          ));
          setMatches(prev => {
            const newMatches = prev + 1;
            if (newMatches === emojis.length) {
              setGameWon(true);
              setBestMoves(prev => Math.min(prev, moves + 1));
              soundManager.playWin();
            }
            return newMatches;
          });
          setFlippedCards([]);
        }, 500);
      } else {
        soundManager.playError();
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            c.id === first || c.id === second ? { ...c, flipped: false } : c
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const resetGame = () => {
    setCards(createDeck());
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setGameWon(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-teal-900 to-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <GameNavigation currentGame={currentGame} setPage={setPage} gamesList={gamesList} />
        
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            🧠 <span className="bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent">Memory Match</span>
          </h2>
          <p className="text-gray-300 mb-4">Find all matching pairs!</p>
          <div className="flex items-center justify-center gap-8">
            <div className="text-2xl font-bold text-teal-400">Moves: {moves}</div>
            <div className="text-xl font-semibold text-cyan-400">Matches: {matches}/{emojis.length}</div>
            {bestMoves !== Infinity && <div className="text-xl font-semibold text-green-400">🏆 Best: {bestMoves}</div>}
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <div className="grid grid-cols-4 gap-8 bg-gradient-to-br from-gray-800 to-gray-900 p-12 rounded-3xl border-4 border-teal-500 shadow-2xl shadow-teal-500/30">
            {cards.map(card => (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                className={`w-40 h-40 text-7xl rounded-xl transition-all duration-300 transform hover:scale-105 ${
                  card.flipped || card.matched
                    ? 'bg-gradient-to-br from-teal-500 to-cyan-600'
                    : 'bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700'
                } ${card.matched ? 'opacity-50' : ''}`}
                disabled={card.matched}
              >
                {(card.flipped || card.matched) ? card.emoji : '?'}
              </button>
            ))}
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={resetGame}
            className="py-4 px-8 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg shadow-teal-500/50 text-lg"
          >
            🔄 New Game
          </button>
        </div>

        {gameWon && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 max-w-md mx-4 border-4 border-teal-500 shadow-2xl shadow-teal-500/50 transform animate-scaleIn">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-4xl font-bold text-white mb-2">You Won!</h3>
                <p className="text-gray-400">All pairs matched!</p>
              </div>
              
              <div className="bg-gray-900/50 rounded-xl p-6 mb-6 border border-teal-500/30">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-400">Total Moves</span>
                  <span className="text-3xl font-bold text-teal-400">{moves}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Best Score</span>
                  <span className="text-2xl font-bold text-cyan-400">🏆 {bestMoves}</span>
                </div>
              </div>

              <button
                onClick={resetGame}
                className="w-full py-4 px-6 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg shadow-teal-500/50 text-lg"
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

export default MemoryMatchGame;
