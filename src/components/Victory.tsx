// ============================================================
// Victory.tsx — Run victory screen
// ============================================================

import React from 'react';
import { useGameStore } from '../store/useGameStore';

export const Victory: React.FC = () => {
  const { resetGame, startGame, deck } = useGameStore();

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm fade-in">
      <div className="text-center">
        <span className="text-6xl block mb-4">🏆</span>
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-300 tracking-wider uppercase mb-2">
          Victory!
        </h1>
        <p className="text-slate-400 text-sm mb-1">
          The <span className="text-red-400 font-bold">Merge Conflict</span> has been defeated!
        </p>
        <p className="text-slate-500 text-xs mb-4">
          Final deck size: {deck.length} cards
        </p>
        <p className="text-slate-600 text-xs mb-8">
          Production is safe... for now.
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={startGame}
            className="
              px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider
              bg-gradient-to-r from-yellow-600 to-amber-500
              border-2 border-yellow-300 text-yellow-900
              hover:scale-105 active:scale-95
              transition-all duration-200 shadow-lg shadow-yellow-900/50
            "
          >
            🎮 Play Again
          </button>
          <button
            onClick={resetGame}
            className="
              px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider
              bg-slate-800 border-2 border-slate-600 text-slate-300
              hover:bg-slate-700 hover:scale-105 active:scale-95
              transition-all duration-200
            "
          >
            🏠 Title
          </button>
        </div>
      </div>
    </div>
  );
};
