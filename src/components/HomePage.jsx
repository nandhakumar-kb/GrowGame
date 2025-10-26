import React, { useState } from 'react';
import { GAMES_LIST } from '../constants/games';
const HomePage = ({ setPage }) => {
  const [showDonation, setShowDonation] = useState(false);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-6 px-4 sm:px-6 lg:px-8 relative overflow-hidden">

      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        <header className="text-center mb-8 animate-slideDown">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
            Welcome to GrowGame
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-3">
            Choose your favorite classic game and start playing!
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-400" role="status" aria-live="polite">
            <span className="flex items-center gap-2 px-4 py-2 glass rounded-full">
              <span className="text-green-400" aria-hidden="true">●</span> {GAMES_LIST.length} Games Available
            </span>
          </div>
        </header>
        <main>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6" role="list" aria-label="Available games">
          {GAMES_LIST.map((game, index) => (
            <article
              key={game.id}
              role="listitem"
              className="bg-gray-800 rounded-2xl p-5 shadow-2xl border border-purple-500/30 hover:scale-105 hover:shadow-purple-500/50 transition-all duration-300 transform cursor-pointer group animate-slideUp hover:border-purple-400"
              style={{animationDelay: `${index * 0.1}s`}}
              aria-label={`${game.title} - ${game.description}`}
            >
              <div className="text-center">
                <div className="relative inline-block mb-3">
                  <div className="text-5xl group-hover:scale-125 transition-transform duration-300 group-hover:animate-float" aria-hidden="true">
                    {game.emoji}
                  </div>
                  <div className={`absolute inset-0 bg-gradient-to-r ${game.gradient} blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300`} aria-hidden="true"></div>
                </div>
                <h2 className={`text-xl font-bold text-white mb-2 group-hover:bg-gradient-to-r group-hover:${game.gradient} group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300`}>
                  {game.title}
                </h2>
                <p className="text-sm text-gray-400 mb-4 group-hover:text-gray-300 transition-colors duration-300">{game.description}</p>
                <button
                  onClick={() => setPage(game.id)}
                  className={`w-full py-2 px-4 rounded-lg bg-gradient-to-r ${game.gradient} text-white font-bold hover:scale-105 transition-all duration-300 shadow-lg game-button hover:shadow-xl`}
                  aria-label={`Play ${game.title} game`}
                >
                  <span className="flex items-center justify-center gap-2">
                    Play Now
                    <span className="group-hover:translate-x-1 transition-transform duration-300" aria-hidden="true">→</span>
                  </span>
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mb-6">
          <button
            onClick={() => setShowDonation(true)}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg shadow-green-500/50 text-base flex items-center gap-2 mx-auto"
            aria-label="Support the developer with a donation"
          >
            <span className="text-xl" aria-hidden="true">💝</span>
            <span>Support the Developer</span>
            <span className="text-xl" aria-hidden="true">☕</span>
          </button>
          <p className="text-gray-400 mt-2 text-sm" aria-live="polite">
            Enjoying the games? Buy me a coffee! <span aria-hidden="true">❤️</span>
          </p>
        </div>
        </main>

        {showDonation && (
          <div 
            className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn px-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="donation-title"
            aria-describedby="donation-description"
          >
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 max-w-md w-full mx-4 border-4 border-green-500 shadow-2xl shadow-green-500/50 transform animate-scaleIn">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4 animate-bounce" aria-hidden="true">🙏</div>
                <h3 id="donation-title" className="text-4xl font-bold text-white mb-2">Support Development</h3>
                <p id="donation-description" className="text-gray-400">Your support helps keep GrowGame free and awesome!</p>
              </div>
              <div className="bg-gray-900/50 rounded-xl p-6 mb-6 border border-green-500/30">
                <h4 className="text-xl font-bold text-green-400 mb-4 text-center">Scan to Donate via Google Pay</h4>
                <div className="flex justify-center mb-4">
                  <img 
                    src="/Gpay.jpg" 
                    alt="Google Pay QR Code" 
                    className="w-64 h-64 object-contain rounded-lg border-2 border-green-500/50 shadow-lg"
                  />
                </div>
                <p className="text-gray-300 text-center text-sm">
                  Scan this QR code with any UPI app
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDonation(false)}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg"
                  aria-label="Close donation modal"
                >
                  Close
                </button>
                <button
                  onClick={() => window.open('/Gpay.jpg', '_blank')}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg shadow-green-500/50"
                  aria-label="View QR code full size in new tab"
                >
                  View Full Size
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default HomePage;
