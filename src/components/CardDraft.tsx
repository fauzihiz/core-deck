// ============================================================
// CardDraft.tsx — Post-combat reward card selection overlay
// ============================================================

import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { CARD_REGISTRY } from '../config/assetRegistry';
import type { CardInstance } from '../store/types';

/** Renders card art — image sprite or emoji fallback */
function DraftCardArt({ image, emoji }: { image: string | null; emoji: string }) {
  if (image) {
    return (
      <img
        src={image}
        alt={emoji}
        className="w-16 h-16 object-contain drop-shadow-lg"
        draggable={false}
      />
    );
  }
  return <span className="text-5xl drop-shadow-lg">{emoji}</span>;
}

const DraftCard: React.FC<{
  card: CardInstance;
  index: number;
  onSelect: () => void;
}> = ({ card, index, onSelect }) => {
  const def = CARD_REGISTRY[card.cardId];

  return (
    <button
      onClick={onSelect}
      className={`
        draft-float flex flex-col items-center justify-between
        w-[130px] h-[185px] rounded-2xl border-2
        ${def.bgColor} ${def.borderColor} ${def.textColor}
        shadow-xl cursor-pointer transition-all duration-200
        hover:-translate-y-4 hover:scale-105 hover:shadow-2xl
        active:scale-95
      `}
      style={{ animationDelay: `${index * 0.15}s` }}
    >
      {/* Cost */}
      <div className="w-7 h-7 rounded-full bg-slate-900 border-2 border-yellow-400 flex items-center justify-center self-start ml-3 mt-3">
        <span className="text-yellow-300 text-xs font-black">{def.cost}</span>
      </div>

      {/* Emoji art */}
      <div className="flex-1 flex items-center justify-center">
        <DraftCardArt image={def.image} emoji={def.emoji} />
      </div>

      {/* Info */}
      <div className="w-full px-3 pb-3 text-center">
        <div className="text-xs font-bold uppercase tracking-wider mb-1">{def.name}</div>
        <div className="text-[10px] leading-tight opacity-80">{def.description}</div>
      </div>

      {/* Type strip */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-1.5 rounded-b-2xl ${
          def.type === 'attack' ? 'bg-red-400' : def.type === 'skill' ? 'bg-blue-400' : 'bg-amber-400'
        }`}
      />
    </button>
  );
};

export const CardDraft: React.FC = () => {
  const { draftOptions, selectDraftCard } = useGameStore();

  if (draftOptions.length === 0) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm fade-in">
      {/* Title */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-black text-yellow-400 tracking-wider uppercase">
          ⚔️ Victory!
        </h2>
        <p className="text-sm text-slate-400 mt-1">Choose a card to add to your deck</p>
      </div>

      {/* Card options */}
      <div className="flex items-center justify-center gap-4 px-4 flex-wrap">
        {draftOptions.map((card, i) => (
          <DraftCard
            key={card.instanceId}
            card={card}
            index={i}
            onSelect={() => selectDraftCard(card.instanceId)}
          />
        ))}
      </div>
    </div>
  );
};
