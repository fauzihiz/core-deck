// ============================================================
// BattleArea.tsx — Enemy display with health, intent, and effects
// ============================================================

import React, { useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { ENEMY_REGISTRY } from '../config/assetRegistry';
import { HealthBar } from './HealthBar';
import { IntentBadge } from './IntentBadge';

/** Renders enemy art — image sprite or emoji fallback */
function EnemyArt({ image, emoji, isBoss }: { image: string | null; emoji: string; isBoss: boolean }) {
  if (image) {
    return (
      <img
        src={image}
        alt={emoji}
        className={`${isBoss ? 'w-20 h-20' : 'w-16 h-16'} object-contain drop-shadow-lg`}
        draggable={false}
      />
    );
  }
  return (
    <span className={`${isBoss ? 'text-6xl' : 'text-5xl'} drop-shadow-lg`}>
      {emoji}
    </span>
  );
}

export const BattleArea: React.FC = () => {
  const { enemy, lastEnemyAction, enemyHit, clearAnimations } = useGameStore();

  useEffect(() => {
    if (enemyHit) {
      const timer = setTimeout(() => clearAnimations(), 300);
      return () => clearTimeout(timer);
    }
  }, [enemyHit, clearAnimations]);

  if (!enemy) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <span className="text-slate-600 text-sm">Preparing encounter...</span>
      </div>
    );
  }

  const def = ENEMY_REGISTRY[enemy.id];
  const isBoss = enemy.id === 'production_merge_conflict';

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 px-4">
      {/* Intent badge above enemy */}
      <div className="h-8 flex items-center justify-center">
        <IntentBadge intent={enemy.currentIntent} />
      </div>

      {/* Enemy character */}
      <div
        className={`
          relative flex flex-col items-center gap-2
          ${enemyHit ? 'enemy-hit' : ''}
        `}
      >
        {/* Enemy sprite area */}
        <div
          className={`
            ${def.bgColor} ${def.borderColor}
            ${isBoss ? 'w-32 h-32 sm:w-36 sm:h-36' : 'w-24 h-24 sm:w-28 sm:h-28'}
            rounded-2xl border-3
            flex items-center justify-center shadow-xl
          `}
        >
          <EnemyArt image={def.image} emoji={def.emoji} isBoss={isBoss} />
        </div>

        {/* Enemy name */}
        <span className={`text-sm font-bold ${def.borderColor.replace('border-', 'text-')} tracking-wide`}>
          {def.name}
        </span>

        {/* Block indicator */}
        {enemy.block > 0 && (
          <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md border border-blue-300">
            🛡️ {enemy.block}
          </div>
        )}

        {/* Poison indicator */}
        {enemy.poison > 0 && (
          <div className="absolute -top-1 -left-1 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md border border-emerald-400">
            ☠️ {enemy.poison}
          </div>
        )}

        {/* Strength indicator */}
        {enemy.strength > 0 && (
          <div className="absolute -bottom-1 -right-1 bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md border border-amber-400">
            💪 {enemy.strength}
          </div>
        )}
      </div>

      {/* Enemy health bar */}
      <div className="w-48 sm:w-56">
        <HealthBar
          current={enemy.hp}
          max={enemy.maxHp}
          height="h-3"
          showLabels={true}
        />
      </div>

      {/* Last enemy action text */}
      {lastEnemyAction && (
        <div className="text-[11px] text-slate-400 font-mono h-4 fade-in">
          {lastEnemyAction}
        </div>
      )}
    </div>
  );
};
