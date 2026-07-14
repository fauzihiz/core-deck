// ============================================================
// useGameStore.ts — Zustand state engine with localStorage persist
// ============================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type {
  GameState,
  CardInstance,
  EnemyState,
  GamePhase,
} from './types';

import {
  CARD_REGISTRY,
  DRAFT_POOL,
  ENEMY_REGISTRY,
  FLOOR_ENEMIES,
  STARTER_DECK,
  STARTER_PLAYER,
} from '../config/assetRegistry';

import {
  shuffleArray,
  makeInstanceId,
  instantiateDeck,
  getNextIntent,
  calcDamage,
} from '../gameLogic';

// ── Helpers ──────────────────────────────────────────────────

function pickN<T>(arr: T[], n: number): T[] {
  const shuffled = shuffleArray(arr);
  return shuffled.slice(0, n);
}

function buildCardInstance(cardId: string): CardInstance {
  return { instanceId: makeInstanceId(), cardId: cardId as CardInstance['cardId'] };
}

// ── Initial State Factory ───────────────────────────────────

function freshState(): GameState {
  return {
    phase: 'title',
    currentFloor: 1,
    player: {
      hp: STARTER_PLAYER.maxHp,
      maxHp: STARTER_PLAYER.maxHp,
      block: 0,
      strength: 0,
      energy: STARTER_PLAYER.maxEnergy,
      maxEnergy: STARTER_PLAYER.maxEnergy,
    },
    deck: instantiateDeck(STARTER_DECK),
    hand: [],
    discardPile: [],
    enemy: null,
    draftOptions: [],
    turnCount: 0,
    isAnimating: false,
    lastEnemyAction: null,
    playerHit: false,
    enemyHit: false,
    nextInstanceId: 0,
  };
}

// ── Store Interface ─────────────────────────────────────────

export interface GameActions {
  startGame: () => void;
  resetGame: () => void;
  startCombat: () => void;
  drawCards: (count: number) => void;
  playCard: (instanceId: string) => void;
  endTurn: () => void;
  selectDraftCard: (instanceId: string) => void;
  clearAnimations: () => void;
}

// ── Store Implementation ────────────────────────────────────

export const useGameStore = create<GameState & GameActions>()(
  persist(
    (set, get) => ({
      ...freshState(),

      // ── Start a new run ───────────────────────────────────
      startGame: () => {
        const fresh = freshState();
        set({
          ...fresh,
          phase: 'combat',
        });
        // Immediately start combat on floor 1
        setTimeout(() => get().startCombat(), 0);
      },

      // ── Full reset to title screen ────────────────────────
      resetGame: () => {
        set(freshState());
      },

      // ── Spawn enemy for current floor ─────────────────────
      startCombat: () => {
        const { currentFloor } = get();
        const enemyId = FLOOR_ENEMIES[currentFloor - 1];
        const enemyDef = ENEMY_REGISTRY[enemyId];
        const firstIntent = enemyDef.intentPattern[0];

        const enemy: EnemyState = {
          id: enemyId,
          hp: enemyDef.maxHp,
          maxHp: enemyDef.maxHp,
          block: 0,
          poison: 0,
          strength: 0,
          intentIndex: 0,
          currentIntent: firstIntent,
        };

        // Shuffle the deck for this combat
        const shuffledDeck = shuffleArray(get().deck);

        set({
          phase: 'combat',
          enemy,
          deck: shuffledDeck,
          hand: [],
          discardPile: [],
          turnCount: 0,
          lastEnemyAction: null,
          playerHit: false,
          enemyHit: false,
          player: {
            ...get().player,
            block: 0,
            strength: 0,
            energy: STARTER_PLAYER.maxEnergy,
            maxEnergy: STARTER_PLAYER.maxEnergy,
          },
        });

        // Auto-draw first hand
        setTimeout(() => get().drawCards(4), 100);
      },

      // ── Draw cards from the deck ──────────────────────────
      drawCards: (count: number) => {
        const { deck, discardPile, hand } = get();
        let currentDeck = [...deck];
        let currentDiscard = [...discardPile];
        const drawn: CardInstance[] = [];

        for (let i = 0; i < count; i++) {
          if (currentDeck.length === 0) {
            if (currentDiscard.length === 0) break; // truly empty
            // Reshuffle discard into deck
            currentDeck = shuffleArray(currentDiscard);
            currentDiscard = [];
          }
          const card = currentDeck.pop()!;
          drawn.push(card);
        }

        // Start of turn: reset energy and block
        const { turnCount, player } = get();
        const newTurn = turnCount + 1;

        set({
          deck: currentDeck,
          discardPile: currentDiscard,
          hand: [...hand, ...drawn],
          turnCount: newTurn,
          player: {
            ...player,
            energy: player.maxEnergy,
            block: 0, // block expires at start of turn
          },
        });
      },

      // ── Play a card from hand ─────────────────────────────
      playCard: (instanceId: string) => {
        const state = get();
        const { hand, player, enemy, discardPile } = state;

        if (!enemy) return;

        // Find the card in hand
        const cardIndex = hand.findIndex((c) => c.instanceId === instanceId);
        if (cardIndex === -1) return;

        const cardInst = hand[cardIndex];
        const cardDef = CARD_REGISTRY[cardInst.cardId];

        // Check energy cost
        if (player.energy < cardDef.cost) return;

        // Remove from hand
        const newHand = [...hand];
        newHand.splice(cardIndex, 1);

        // Deduct energy
        const newEnergy = player.energy - cardDef.cost;

        // Clone mutable state
        let newPlayer = { ...player, energy: newEnergy };
        let newEnemy = { ...enemy };
        let extraDraw = 0;
        let isEnemyHit = false;

        // ── Execute card effects ──
        switch (cardInst.cardId) {
          case 'strike': {
            const dmg = calcDamage(6, newPlayer.strength);
            const blocked = Math.min(newEnemy.block, dmg);
            newEnemy.block -= blocked;
            newEnemy.hp -= (dmg - blocked);
            isEnemyHit = true;
            break;
          }
          case 'defend': {
            newPlayer.block += 5;
            break;
          }
          case 'heavy_slam': {
            const dmg = calcDamage(14, newPlayer.strength);
            const blocked = Math.min(newEnemy.block, dmg);
            newEnemy.block -= blocked;
            newEnemy.hp -= (dmg - blocked);
            isEnemyHit = true;
            break;
          }
          case 'shield_bash': {
            const dmg = calcDamage(newPlayer.block, newPlayer.strength);
            const blocked = Math.min(newEnemy.block, dmg);
            newEnemy.block -= blocked;
            newEnemy.hp -= (dmg - blocked);
            isEnemyHit = true;
            break;
          }
          case 'enrage': {
            newPlayer.strength += 2;
            break;
          }
          case 'poison_dart': {
            const dmg = calcDamage(3, newPlayer.strength);
            const blocked = Math.min(newEnemy.block, dmg);
            newEnemy.block -= blocked;
            newEnemy.hp -= (dmg - blocked);
            newEnemy.poison += 4;
            isEnemyHit = true;
            break;
          }
          case 'catalyst': {
            newEnemy.poison = newEnemy.poison * 2;
            break;
          }
          case 'quick_draw': {
            const dmg = calcDamage(4, newPlayer.strength);
            const blocked = Math.min(newEnemy.block, dmg);
            newEnemy.block -= blocked;
            newEnemy.hp -= (dmg - blocked);
            extraDraw = 2;
            isEnemyHit = true;
            break;
          }
        }

        // Clamp enemy HP
        newEnemy.hp = Math.max(0, newEnemy.hp);

        // Move card to discard
        const newDiscard = [...discardPile, cardInst];

        set({
          hand: newHand,
          player: newPlayer,
          enemy: newEnemy,
          discardPile: newDiscard,
          enemyHit: isEnemyHit,
        });

        // Handle extra draw (e.g. Quick Draw)
        if (extraDraw > 0) {
          setTimeout(() => get().drawCards(extraDraw), 200);
        }

        // Check if enemy is dead
        if (newEnemy.hp <= 0) {
          setTimeout(() => {
            const s = get();
            if (s.enemy && s.enemy.hp <= 0) {
              // Generate draft rewards
              const draftCardIds = pickN(DRAFT_POOL, 3);
              const draftOptions = draftCardIds.map((id) => buildCardInstance(id));
              set({ phase: 'draft', draftOptions, hand: [] });
            }
          }, 600);
        }
      },

      // ── End turn: discard hand → enemy acts ───────────────
      endTurn: () => {
        const state = get();
        const { hand, discardPile, enemy, player, turnCount } = state;

        if (!enemy) return;

        // 1. Discard entire hand
        const newDiscard = [...discardPile, ...hand];

        // 2. Apply poison to enemy (poison ticks at start of their turn)
        let newEnemy = { ...enemy };
        if (newEnemy.poison > 0) {
          newEnemy.hp -= newEnemy.poison;
          newEnemy.poison = Math.max(0, newEnemy.poison - 1);
        }
        newEnemy.hp = Math.max(0, newEnemy.hp);

        // Check if enemy died from poison
        if (newEnemy.hp <= 0) {
          const draftCardIds = pickN(DRAFT_POOL, 3);
          const draftOptions = draftCardIds.map((id) => buildCardInstance(id));
          set({
            hand: [],
            discardPile: newDiscard,
            enemy: newEnemy,
            phase: 'draft',
            draftOptions,
          });
          return;
        }

        // 3. Enemy executes current intent
        let newPlayer = { ...player };
        const intent = newEnemy.currentIntent;
        let actionText = '';

        switch (intent.type) {
          case 'attack': {
            const dmg = calcDamage(intent.value, newEnemy.strength);
            const blocked = Math.min(newPlayer.block, dmg);
            newPlayer.block -= blocked;
            newPlayer.hp -= (dmg - blocked);
            actionText = `${intent.emoji} ${intent.description}: ${dmg} damage`;
            break;
          }
          case 'multi_attack': {
            const times = intent.times ?? 2;
            let totalDmg = 0;
            for (let i = 0; i < times; i++) {
              const hitDmg = calcDamage(intent.value, newEnemy.strength);
              const blocked = Math.min(newPlayer.block, hitDmg);
              newPlayer.block -= blocked;
              newPlayer.hp -= (hitDmg - blocked);
              totalDmg += hitDmg;
            }
            actionText = `${intent.emoji} ${intent.description}: ${times}×${intent.value} damage`;
            break;
          }
          case 'defend': {
            newEnemy.block += intent.value;
            actionText = `${intent.emoji} ${intent.description}: +${intent.value} Block`;
            break;
          }
          case 'buff': {
            newEnemy.strength += intent.value;
            actionText = `${intent.emoji} ${intent.description}: +${intent.value} Strength`;
            break;
          }
          case 'poison': {
            newPlayer.hp -= intent.value;
            actionText = `${intent.emoji} ${intent.description}`;
            break;
          }
        }

        newPlayer.hp = Math.max(0, newPlayer.hp);

        // 4. Calculate next enemy intent
        const { intent: nextIntent, nextIndex } = getNextIntent(
          ENEMY_REGISTRY[newEnemy.id],
          newEnemy.intentIndex,
        );
        newEnemy.intentIndex = nextIndex;
        newEnemy.currentIntent = nextIntent;

        // 5. Reset enemy block (block expires each turn in StS style)
        newEnemy.block = 0;

        set({
          hand: [],
          discardPile: newDiscard,
          player: newPlayer,
          enemy: newEnemy,
          lastEnemyAction: actionText,
          playerHit: true,
        });

        // Check for player death
        if (newPlayer.hp <= 0) {
          setTimeout(() => {
            set({ phase: 'game_over', hand: [] });
          }, 800);
          return;
        }

        // 6. Start new turn: draw 4 cards (which also resets energy & block)
        setTimeout(() => get().drawCards(4), 500);
      },

      // ── Draft: pick a reward card ─────────────────────────
      selectDraftCard: (instanceId: string) => {
        const state = get();
        const { draftOptions, deck, currentFloor } = state;

        const chosen = draftOptions.find((c) => c.instanceId === instanceId);
        if (!chosen) return;

        const newDeck = [...deck, chosen];
        const nextFloor = currentFloor + 1;

        // Check for victory (beat floor 5)
        if (currentFloor >= 5) {
          set({
            phase: 'victory',
            deck: newDeck,
            draftOptions: [],
          });
          return;
        }

        set({
          deck: newDeck,
          currentFloor: nextFloor,
          draftOptions: [],
          discardPile: [],
          hand: [],
        });

        // Start next combat
        setTimeout(() => get().startCombat(), 200);
      },

      // ── Clear hit animation flags ─────────────────────────
      clearAnimations: () => {
        set({ playerHit: false, enemyHit: false });
      },
    }),
    {
      name: 'core-deck-save',
      // Only persist run-relevant data, not transient UI state
      partialize: (state) => ({
        currentFloor: state.currentFloor,
        player: state.player,
        deck: state.deck,
        discardPile: state.discardPile,
        phase: state.phase,
        nextInstanceId: state.nextInstanceId,
      }),
    },
  ),
);
