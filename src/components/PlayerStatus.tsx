// ============================================================
// PlayerStatus.tsx — Player stats display in center zone
// ============================================================

import React, { useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { PLAYER_SPRITE, PLAYER_EMOJI } from '../config/assetRegistry';

export const PlayerStatus: React.FC = () => {
  const { player, playerHit, clearAnimations } = useGameStore();

  useEffect(() => {
    if (playerHit) {
      const timer = setTimeout(() => clearAnimations(), 300);
      return () => clearTimeout(timer);
    }
  }, [playerHit, clearAnimations]);

  const energyPips = [];
  for (let i = 0; i < player.maxEnergy; i++) {
    energyPips.push(
      <div
        key={i}
        className={`
          w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center
          text-[10px] font-black transition-all duration-300
          ${i < player.energy
            ? 'bg-yellow-500 border-yellow-300 text-yellow-900 energy-pulse'
            : 'bg-slate-700 border-slate-600 text-slate-500'
          }
        `}
      >
        ⚡
      </div>,
    );
  }

  return (
    <div
      className={`
        flex items-center justify-center gap-6 py-3 px-4
        bg-slate-900/50 border-y border-slate-800 shrink-0
        ${playerHit ? 'player-hit' : ''}
      `}
    >
      {/* Player avatar */}
      <div className="flex flex-col items-center gap-1">
        <div className="w-12 h-12 rounded-xl bg-sky-800 border-2 border-sky-400 flex items-center justify-center shadow-lg overflow-hidden">
          {PLAYER_SPRITE ? (
            <img
              src={PLAYER_SPRITE}
              alt="Player"
              className="w-full h-full object-contain"
              draggable={false}
            />
          ) : (
            <span className="text-2xl">{PLAYER_EMOJI}</span>
          )}
        </div>

        {/* Block */}
        {player.block > 0 && (
          <div className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
            🛡️ {player.block}
          </div>
        )}

        {/* Strength */}
        {player.strength > 0 && (
          <div className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
            💪 {player.strength}
          </div>
        )}
      </div>

      {/* Energy pips */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider">Energy</span>
        <div className="flex gap-1.5">
          {energyPips}
        </div>
        <span className="text-xs text-yellow-400 font-mono font-bold">
          {player.energy}/{player.maxEnergy}
        </span>
      </div>
    </div>
  );
};
