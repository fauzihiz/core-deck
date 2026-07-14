// ============================================================
// types.ts — Central type declarations for Core-Deck
// ============================================================

/* ---------- Card Identity ---------- */

export type CardId =
  | 'strike'
  | 'defend'
  | 'heavy_slam'
  | 'shield_bash'
  | 'enrage'
  | 'poison_dart'
  | 'catalyst'
  | 'quick_draw';

export type CardType = 'attack' | 'skill' | 'power';

export interface CardDefinition {
  id: CardId;
  name: string;
  cost: number;
  description: string;
  emoji: string;
  /** Path to sprite image in /public (e.g. '/sprites/card_strike.png'), or null for emoji */
  image: string | null;
  bgColor: string;
  borderColor: string;
  textColor: string;
  type: CardType;
}

/** Runtime card instance with a unique ID for tracking in arrays */
export interface CardInstance {
  instanceId: string;
  cardId: CardId;
}

/* ---------- Enemy Identity ---------- */

export type EnemyId =
  | 'bug_slime'
  | 'shield_cultist'
  | 'production_merge_conflict';

export type IntentType = 'attack' | 'defend' | 'buff' | 'poison' | 'multi_attack';

export interface Intent {
  type: IntentType;
  value: number;
  times?: number; // for multi_attack
  description: string;
  emoji: string;
}

export interface EnemyDefinition {
  id: EnemyId;
  name: string;
  maxHp: number;
  emoji: string;
  /** Path to sprite image in /public (e.g. '/sprites/bug_slime.png'), or null for emoji */
  image: string | null;
  bgColor: string;
  borderColor: string;
  /** Ordered pattern of intents; cycles via turnCount % length */
  intentPattern: Intent[];
}

/* ---------- Runtime Enemy State ---------- */

export interface EnemyState {
  id: EnemyId;
  hp: number;
  maxHp: number;
  block: number;
  poison: number;
  strength: number;
  /** Index into the enemy's intentPattern */
  intentIndex: number;
  currentIntent: Intent;
}

/* ---------- Player State ---------- */

export interface PlayerState {
  hp: number;
  maxHp: number;
  block: number;
  strength: number;
  energy: number;
  maxEnergy: number;
}

/* ---------- Game Phase ---------- */

export type GamePhase =
  | 'title'
  | 'combat'
  | 'draft'
  | 'victory'
  | 'game_over';

/* ---------- Full Game State ---------- */

export interface GameState {
  phase: GamePhase;
  currentFloor: number; // 1-5

  player: PlayerState;

  /** Draw pile */
  deck: CardInstance[];
  /** Current cards in hand */
  hand: CardInstance[];
  /** Discard pile */
  discardPile: CardInstance[];

  /** Active enemy (null outside combat) */
  enemy: EnemyState | null;

  /** 3 card options for the draft screen */
  draftOptions: CardInstance[];

  /** Current turn number within a combat */
  turnCount: number;

  /** Tracks whether the player is currently in an animation phase */
  isAnimating: boolean;

  /** Last enemy action description for display */
  lastEnemyAction: string | null;

  /** Whether the player just played a card (for hit detection) */
  playerHit: boolean;
  enemyHit: boolean;

  /** Counter for unique instance IDs */
  nextInstanceId: number;
}
