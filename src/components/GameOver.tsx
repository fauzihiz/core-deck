// ============================================================
// GameOver.tsx — Permadeath game over screen
// ============================================================

import React from 'react';
import { useGameStore } from '../store/useGameStore';

export const GameOver: React.FC = () => {
  const { currentFloor, resetGame, startGame } = useGameStore();

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm fade-in">
      <div className="text-center">
        <span className="text-6xl block mb-4">💀</span>
        <h1 className="text-3xl font-black text-red-500 tracking-wider uppercase mb-2">
          Game Over
        </h1>
        <p className="text-slate-400 text-sm mb-1">
          You fell on <span className="text-slate-200 font-bold">Floor {currentFloor}</span>
        </p>
        <p className="text-slate-600 text-xs mb-8">
          The code was too strong...
        </p>

        <div className="flex gap-3">
          <button
            onClick={startGame}
            className="
              px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider
              bg-emerald-700 border-2 border-emerald-400 text-emerald-100
              hover:bg-emerald-600 hover:scale-105 active:scale-95
              transition-all duration-200 shadow-lg
            "
          >
            ↻ Try Again
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
