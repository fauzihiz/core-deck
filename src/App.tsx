// ============================================================
// App.tsx — Root application layout and phase router
// ============================================================

import React from 'react';
import { useGameStore } from './store/useGameStore';

import { TopBar } from './components/TopBar';
import { BattleArea } from './components/BattleArea';
import { PlayerStatus } from './components/PlayerStatus';
import { Hand } from './components/Hand';
import { CardDraft } from './components/CardDraft';
import { TitleScreen } from './components/TitleScreen';
import { GameOver } from './components/GameOver';
import { Victory } from './components/Victory';

const App: React.FC = () => {
  const { phase, deck, discardPile } = useGameStore();

  // Title screen — full viewport
  if (phase === 'title') {
    return (
      <div className="w-full h-screen max-w-md mx-auto flex flex-col bg-slate-950 overflow-hidden">
        <TitleScreen />
      </div>
    );
  }

  // Combat / Draft layout — the main game screen
  return (
    <div className="relative w-full h-screen max-w-md mx-auto flex flex-col justify-between bg-slate-950 overflow-hidden">
      {/* Top bar — Floor + HP + Reset */}
      <TopBar />

      {/* Battle area — Enemy display */}
      <BattleArea />

      {/* Player status — Energy + Block + Strength */}
      <PlayerStatus />

      {/* Deck/Discard info strip */}
      <div className="flex items-center justify-center gap-6 py-1 bg-slate-900/50 text-[10px] text-slate-500 shrink-0">
        <span>🃏 Deck: {deck.length}</span>
        <span>♻️ Discard: {discardPile.length}</span>
      </div>

      {/* Hand area — Cards + End Turn */}
      <Hand />

      {/* Overlays */}
      {phase === 'draft' && <CardDraft />}
      {phase === 'game_over' && <GameOver />}
      {phase === 'victory' && <Victory />}
    </div>
  );
};

export default App;
