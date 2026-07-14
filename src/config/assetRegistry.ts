// ============================================================
// assetRegistry.ts — Data-driven visual configuration
// ============================================================
// All rendering is driven from this file. Swap emojis/images/colors
// here and the entire UI updates without touching component logic.
//
// TO USE SPRITE IMAGES:
// 1. Place transparent PNGs in public/sprites/
// 2. Set the `image` field on the relevant definition below
// 3. The UI auto-switches from emoji → image
// ============================================================

import type { CardId, CardDefinition, EnemyId, EnemyDefinition } from '../store/types';

// Get the base URL from Vite config
const BASE_URL = import.meta.env.BASE_URL || '/';

// ────────────────────────────────────────────
//  PLAYER SPRITE
// ────────────────────────────────────────────

/** Set to a path like '/sprites/player.png' to use an image, or null for emoji */
export const PLAYER_SPRITE: string | null = `${BASE_URL}sprites/player_front.png`;
export const PLAYER_EMOJI = '🧙‍♀️';
export const PLAYER_NAME = 'Mage';

// ────────────────────────────────────────────
//  CARD REGISTRY
// ────────────────────────────────────────────

export const CARD_REGISTRY: Record<CardId, CardDefinition> = {
  strike: {
    id: 'strike',
    name: 'Strike',
    cost: 1,
    description: 'Deal 6 damage.',
    emoji: '⚔️',
    image: null, // Set to '/sprites/card_strike.png' to use image
    bgColor: 'bg-red-800',
    borderColor: 'border-red-500',
    textColor: 'text-red-100',
    type: 'attack',
  },
  defend: {
    id: 'defend',
    name: 'Defend',
    cost: 1,
    description: 'Gain 5 Block.',
    emoji: '🛡️',
    image: null,
    bgColor: 'bg-blue-800',
    borderColor: 'border-blue-400',
    textColor: 'text-blue-100',
    type: 'skill',
  },
  heavy_slam: {
    id: 'heavy_slam',
    name: 'Heavy Slam',
    cost: 2,
    description: 'Deal 14 damage.',
    emoji: '🔨',
    image: null,
    bgColor: 'bg-orange-800',
    borderColor: 'border-orange-500',
    textColor: 'text-orange-100',
    type: 'attack',
  },
  shield_bash: {
    id: 'shield_bash',
    name: 'Shield Bash',
    cost: 1,
    description: 'Deal damage equal to your Block.',
    emoji: '💥',
    image: null,
    bgColor: 'bg-cyan-800',
    borderColor: 'border-cyan-400',
    textColor: 'text-cyan-100',
    type: 'attack',
  },
  enrage: {
    id: 'enrage',
    name: 'Enrage',
    cost: 1,
    description: 'Gain 2 Strength (permanent).',
    emoji: '🔥',
    image: null,
    bgColor: 'bg-amber-800',
    borderColor: 'border-amber-400',
    textColor: 'text-amber-100',
    type: 'power',
  },
  poison_dart: {
    id: 'poison_dart',
    name: 'Poison Dart',
    cost: 1,
    description: 'Deal 3 damage. Apply 4 Poison.',
    emoji: '🧪',
    image: null,
    bgColor: 'bg-emerald-800',
    borderColor: 'border-emerald-400',
    textColor: 'text-emerald-100',
    type: 'attack',
  },
  catalyst: {
    id: 'catalyst',
    name: 'Catalyst',
    cost: 2,
    description: 'Double enemy Poison.',
    emoji: '⚗️',
    image: null,
    bgColor: 'bg-violet-800',
    borderColor: 'border-violet-400',
    textColor: 'text-violet-100',
    type: 'skill',
  },
  quick_draw: {
    id: 'quick_draw',
    name: 'Quick Draw',
    cost: 1,
    description: 'Deal 4 damage. Draw 2 cards.',
    emoji: '🃏',
    image: null,
    bgColor: 'bg-yellow-800',
    borderColor: 'border-yellow-400',
    textColor: 'text-yellow-100',
    type: 'attack',
  },
};

// Cards available as draft rewards (excludes starter cards)
export const DRAFT_POOL: CardId[] = [
  'heavy_slam',
  'shield_bash',
  'enrage',
  'poison_dart',
  'catalyst',
  'quick_draw',
];

// ────────────────────────────────────────────
//  ENEMY REGISTRY
// ────────────────────────────────────────────

export const ENEMY_REGISTRY: Record<EnemyId, EnemyDefinition> = {
  bug_slime: {
    id: 'bug_slime',
    name: 'Bug Slime',
    maxHp: 35,
    emoji: '🐛',
    image: `${BASE_URL}sprites/bug_slime_front.png`,
    bgColor: 'bg-lime-700',
    borderColor: 'border-lime-400',
    intentPattern: [
      { type: 'attack', value: 8, description: 'Slime Slam', emoji: '⚔️' },
      { type: 'attack', value: 5, description: 'Acid Spit', emoji: '💧' },
      { type: 'defend', value: 4, description: 'Slime Shield', emoji: '🛡️' },
      { type: 'attack', value: 10, description: 'Enrage Bite', emoji: '🦷' },
    ],
  },
  shield_cultist: {
    id: 'shield_cultist',
    name: 'Shield Cultist',
    maxHp: 45,
    emoji: '🧙',
    image: null,
    bgColor: 'bg-indigo-700',
    borderColor: 'border-indigo-400',
    intentPattern: [
      { type: 'attack', value: 6, description: 'Shadow Strike', emoji: '🌑' },
      { type: 'buff', value: 2, description: 'Dark Ritual', emoji: '✨' },
      { type: 'defend', value: 8, description: 'Barrier', emoji: '🛡️' },
      { type: 'attack', value: 12, description: 'Void Blast', emoji: '💫' },
    ],
  },
  production_merge_conflict: {
    id: 'production_merge_conflict',
    name: 'Merge Conflict',
    maxHp: 150,
    emoji: '🔥',
    image: null,
    bgColor: 'bg-red-700',
    borderColor: 'border-red-400',
    intentPattern: [
      { type: 'multi_attack', value: 3, times: 3, description: 'Volley of Errors', emoji: '⚔️' },
      { type: 'buff', value: 2, description: 'Refactor', emoji: '🔧' },
      { type: 'attack', value: 16, description: 'Production Deploy', emoji: '💣' },
      { type: 'defend', value: 10, description: 'Rollback', emoji: '🛡️' },
      { type: 'multi_attack', value: 6, times: 2, description: 'Rebase Clash', emoji: '🔀' },
    ],
  },
};

// ────────────────────────────────────────────
//  FLOOR → ENEMY MAPPING
// ────────────────────────────────────────────

import type { EnemyId as EID } from '../store/types';

export const FLOOR_ENEMIES: EID[] = [
  'bug_slime',          // Floor 1
  'bug_slime',          // Floor 2
  'shield_cultist',     // Floor 3
  'shield_cultist',     // Floor 4
  'production_merge_conflict', // Floor 5 (Boss)
];

// ────────────────────────────────────────────
//  STARTER DECK CONFIGURATION
// ────────────────────────────────────────────

export const STARTER_DECK: CardId[] = [
  'strike',
  'strike',
  'strike',
  'strike',
  'strike',
  'defend',
  'defend',
  'defend',
  'defend',
  'defend',
];

// ────────────────────────────────────────────
//  STARTER STATS
// ────────────────────────────────────────────

export const STARTER_PLAYER = {
  maxHp: 80,
  maxEnergy: 3,
} as const;
