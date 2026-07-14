// ============================================================
// TitleScreen.tsx — Opening title with start button
// ============================================================

import React from 'react';
import { useGameStore } from '../store/useGameStore';

export const TitleScreen: React.FC = () => {
  const { startGame } = useGameStore();

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-8 px-6 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900">
      {/* Logo */}
      <div className="text-center">
        <span className="text-6xl block mb-4">🃏</span>
        <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-400 to-purple-400 tracking-tight">
          CORE-DECK
        </h1>
        <p className="text-slate-500 text-sm mt-2 tracking-widest uppercase">
          Roguelike Deckbuilder
        </p>
      </div>

      {/* Flavor icons */}
      <div className="flex gap-4 text-3xl opacity-60">
        <span>⚔️</span>
        <span>🛡️</span>
        <span>🧪</span>
        <span>🔥</span>
        <span>💀</span>
      </div>

      {/* Start button */}
      <button
        onClick={startGame}
        className="
          px-10 py-4 rounded-2xl font-black text-lg uppercase tracking-widest
          bg-gradient-to-r from-emerald-600 to-emerald-500
          border-2 border-emerald-300 text-white
          shadow-xl shadow-emerald-900/50
          hover:scale-105 hover:shadow-2xl
          active:scale-95
          transition-all duration-200
        "
      >
        ▶ Start Run
      </button>

      {/* Footer */}
      <div className="text-[10px] text-slate-700 text-center mt-4">
        5 Floors • 3 Enemies • Permadeath<br />
        Defeat the Merge Conflict to win
      </div>
    </div>
  );
};
