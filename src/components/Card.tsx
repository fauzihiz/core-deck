// ============================================================
// Card.tsx — Interactive card component with hover/fan effects
// ============================================================
// Supports both emoji (fallback) and image sprites.
// Set image path in assetRegistry.ts to switch.
// ============================================================

import React from 'react';
import type { CardInstance } from '../store/types';
import { CARD_REGISTRY } from '../config/assetRegistry';

interface CardProps {
  card: CardInstance;
  index: number;
  total: number;
  isPlayable: boolean;
  onClick: () => void;
}

/** Renders the card art area — image sprite or emoji fallback */
function CardArt({ image, emoji }: { image: string | null; emoji: string }) {
  if (image) {
    return (
      <img
        src={image}
        alt={emoji}
        className="w-14 h-14 object-contain drop-shadow-lg"
        draggable={false}
      />
    );
  }
  return <span className="text-4xl drop-shadow-lg">{emoji}</span>;
}

export const Card: React.FC<CardProps> = ({
  card,
  index,
  total,
  isPlayable,
  onClick,
}) => {
  const def = CARD_REGISTRY[card.cardId];

  // Fan layout calculations
  const fanSpread = Math.min(6, 30 / total);
  const centerOffset = (total - 1) / 2;
  const rotation = (index - centerOffset) * fanSpread;
  const yOffset = Math.abs(index - centerOffset) * 4;

  return (
    <button
      onClick={isPlayable ? onClick : undefined}
      disabled={!isPlayable}
      className={`
        card-enter relative flex flex-col items-center justify-between
        w-[120px] h-[170px] min-w-[120px] rounded-xl border-2
        ${def.bgColor} ${def.borderColor} ${def.textColor}
        shadow-lg transition-all duration-200 select-none
        ${isPlayable
          ? 'cursor-pointer hover:-translate-y-6 hover:scale-110 hover:shadow-2xl hover:z-50 active:scale-95'
          : 'cursor-not-allowed opacity-50 saturate-50'
        }
      `}
      style={{
        transform: `rotate(${rotation}deg) translateY(${yOffset}px)`,
        zIndex: index + 1,
        animationDelay: `${index * 0.05}s`,
      }}
    >
      {/* Energy cost badge */}
      <div className="absolute -top-2 -left-2 w-7 h-7 rounded-full bg-slate-900 border-2 border-yellow-400 flex items-center justify-center">
        <span className="text-yellow-300 text-xs font-black">{def.cost}</span>
      </div>

      {/* Card art area */}
      <div className="flex-1 flex items-center justify-center w-full pt-4">
        <CardArt image={def.image} emoji={def.emoji} />
      </div>

      {/* Card info */}
      <div className="w-full px-2 pb-2 text-center">
        <div className="text-[10px] font-bold uppercase tracking-wider leading-tight mb-0.5">
          {def.name}
        </div>
        <div className="text-[9px] leading-tight opacity-80">
          {def.description}
        </div>
      </div>

      {/* Type indicator strip */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-xl ${
          def.type === 'attack'
            ? 'bg-red-400'
            : def.type === 'skill'
              ? 'bg-blue-400'
              : 'bg-amber-400'
        }`}
      />
    </button>
  );
};
