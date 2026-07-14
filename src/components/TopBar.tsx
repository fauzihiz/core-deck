// ============================================================
// TopBar.tsx — Floor, HP, and reset controls
// ============================================================

import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { HealthBar } from './HealthBar';

export const TopBar: React.FC = () => {
  const { currentFloor, player, resetGame, phase } = useGameStore();

  const floorName = currentFloor === 5 ? '⚠️ BOSS' : `Floor ${currentFloor}`;

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-700 shrink-0">
      {/* Floor indicator */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400 uppercase tracking-widest">Floor</span>
        <span className={`text-sm font-black ${currentFloor === 5 ? 'text-red-400' : 'text-slate-200'}`}>
          {floorName}
        </span>
      </div>

      {/* Player HP */}
      <div className="flex-1 mx-4 max-w-[180px]">
        <HealthBar
          current={player.hp}
          max={player.maxHp}
          height="h-2.5"
          showLabels={true}
        />
      </div>

      {/* Reset button */}
      {phase !== 'title' && (
        <button
          onClick={resetGame}
          className="text-slate-500 hover:text-red-400 transition-colors text-xs px-2 py-1 rounded border border-slate-700 hover:border-red-500"
          title="Reset Run"
        >
          ↺ Reset
        </button>
      )}
    </div>
  );
};
