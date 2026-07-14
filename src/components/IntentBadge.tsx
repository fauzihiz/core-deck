// ============================================================
// IntentBadge.tsx — Displays the enemy's upcoming intent
// ============================================================

import React from 'react';
import type { Intent } from '../store/types';

interface IntentBadgeProps {
  intent: Intent;
}

export const IntentBadge: React.FC<IntentBadgeProps> = ({ intent }) => {
  const intentColorMap: Record<string, string> = {
    attack: 'bg-red-900/80 border-red-500 text-red-200',
    multi_attack: 'bg-red-900/80 border-red-500 text-red-200',
    defend: 'bg-blue-900/80 border-blue-400 text-blue-200',
    buff: 'bg-amber-900/80 border-amber-400 text-amber-200',
    poison: 'bg-emerald-900/80 border-emerald-400 text-emerald-200',
  };

  const colorClass = intentColorMap[intent.type] || 'bg-slate-800 border-slate-500 text-slate-200';

  const displayText =
    intent.type === 'multi_attack'
      ? `${intent.times}×${intent.value}`
      : intent.type === 'attack' || intent.type === 'defend'
        ? `${intent.value}`
        : intent.type === 'buff'
          ? `+${intent.value}`
          : '';

  return (
    <div
      className={`intent-bob inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${colorClass} text-xs font-bold shadow-lg`}
    >
      <span className="text-base">{intent.emoji}</span>
      <span>{displayText}</span>
    </div>
  );
};
