import React, { useEffect } from 'react';
const GameNavigation = ({ currentGame, setPage, gamesList }) => {
  const currentIndex = gamesList.findIndex(g => g.id === currentGame);
  const prevGame = currentIndex > 0 ? gamesList[currentIndex - 1] : null;
  const nextGame = currentIndex < gamesList.length - 1 ? gamesList[currentIndex + 1] : null;
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey) {
        if (e.key === 'ArrowLeft' && prevGame) {
          e.preventDefault();
          setPage(prevGame.id);
        } else if (e.key === 'ArrowRight' && nextGame) {
          e.preventDefault();
          setPage(nextGame.id);
        } else if (e.key === 'Escape') {
          e.preventDefault();
          setPage('home');
        }
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentGame, prevGame, nextGame, setPage]);
  return (
    <nav className="flex items-center justify-between mb-6 px-4" role="navigation" aria-label="Game navigation">

      <button
        onClick={() => setPage('home')}
        className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all duration-300 hover:scale-105 shadow-lg group"
        aria-label="Return to home page"
      >
        <span className="text-xl group-hover:-translate-x-1 transition-transform duration-300" aria-hidden="true">←</span>
        <span className="font-semibold">Back to Home</span>
      </button>

      <div className="flex items-center gap-3" role="group" aria-label="Switch between games">
        {prevGame && (
          <button
            onClick={() => setPage(prevGame.id)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white rounded-lg transition-all duration-300 hover:scale-105 shadow-lg group"
            title={`Previous: ${prevGame.title}`}
            aria-label={`Play previous game: ${prevGame.title}`}
          >
            <span className="text-xl group-hover:-translate-x-1 transition-transform duration-300" aria-hidden="true">←</span>
            <span className="hidden sm:inline font-semibold"><span aria-hidden="true">{prevGame.emoji}</span> {prevGame.title}</span>
            <span className="sm:hidden text-xl" aria-hidden="true">{prevGame.emoji}</span>
          </button>
        )}
        {nextGame && (
          <button
            onClick={() => setPage(nextGame.id)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white rounded-lg transition-all duration-300 hover:scale-105 shadow-lg group"
            title={`Next: ${nextGame.title}`}
            aria-label={`Play next game: ${nextGame.title}`}
          >
            <span className="hidden sm:inline font-semibold"><span aria-hidden="true">{nextGame.emoji}</span> {nextGame.title}</span>
            <span className="sm:hidden text-xl" aria-hidden="true">{nextGame.emoji}</span>
            <span className="text-xl group-hover:translate-x-1 transition-transform duration-300" aria-hidden="true">→</span>
          </button>
        )}
      </div>

      <div className="hidden lg:flex items-center gap-2 text-xs text-gray-500" role="status" aria-label="Keyboard shortcuts">
        <kbd className="px-2 py-1 bg-gray-800 rounded border border-gray-700">Ctrl</kbd>
        <span>+</span>
        <kbd className="px-2 py-1 bg-gray-800 rounded border border-gray-700">←/→</kbd>
        <span>to navigate</span>
      </div>
    </nav>
  );
};
export default GameNavigation;
