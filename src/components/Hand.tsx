// ============================================================
// Hand.tsx — Card hand display with fan layout + End Turn button
// ============================================================

import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { CARD_REGISTRY } from '../config/assetRegistry';
import { Card } from './Card';

export const Hand: React.FC = () => {
  const { hand, player, playCard, endTurn } = useGameStore();

  const handlePlayCard = (instanceId: string) => {
    playCard(instanceId);
  };

  return (
    <div className="shrink-0 bg-slate-900/90 border-t border-slate-700 pt-2 pb-3 px-2">
      {/* Cards container */}
      <div className="flex items-end justify-center gap-0 min-h-[180px] overflow-visible px-2">
        {hand.map((card, i) => {
          const def = CARD_REGISTRY[card.cardId];
          const isPlayable = player.energy >= def.cost;
          return (
            <div key={card.instanceId} className="-mx-2 first:ml-0 last:mr-0">
              <Card
                card={card}
                index={i}
                total={hand.length}
                isPlayable={isPlayable}
                onClick={() => handlePlayCard(card.instanceId)}
              />
            </div>
          );
        })}
        {hand.length === 0 && (
          <div className="text-slate-600 text-sm py-8">No cards in hand</div>
        )}
      </div>

      {/* End Turn button */}
      <div className="flex justify-center mt-2">
        <button
          onClick={endTurn}
          disabled={hand.length === 0}
          className={`
            px-6 py-2 rounded-xl font-bold text-sm uppercase tracking-wider
            border-2 transition-all duration-200
            ${hand.length === 0
              ? 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed'
              : 'bg-emerald-700 border-emerald-400 text-emerald-100 hover:bg-emerald-600 hover:scale-105 active:scale-95 shadow-lg shadow-emerald-900/50'
            }
          `}
        >
          ⏭ End Turn
        </button>
      </div>
    </div>
  );
};
