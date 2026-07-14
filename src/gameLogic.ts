// ============================================================
// gameLogic.ts — Pure utility functions for combat math
// ============================================================

import type { CardInstance, EnemyDefinition, Intent } from './types';

/** Shuffle an array in place (Fisher-Yates) */
export function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Create a unique instance ID */
let idCounter = 0;
export function makeInstanceId(): string {
  return `ci_${Date.now()}_${idCounter++}`;
}

/** Convert a CardId array into CardInstance array with unique IDs */
export function instantiateDeck(cardIds: string[]): CardInstance[] {
  return cardIds.map((cardId) => ({
    instanceId: makeInstanceId(),
    cardId: cardId as CardInstance['cardId'],
  }));
}

/** Get the next intent from an enemy definition and current intent index */
export function getNextIntent(
  def: EnemyDefinition,
  currentIntentIndex: number,
): { intent: Intent; nextIndex: number } {
  const nextIndex = (currentIntentIndex + 1) % def.intentPattern.length;
  return { intent: def.intentPattern[nextIndex], nextIndex };
}

/** Calculate damage after applying strength */
export function calcDamage(baseDamage: number, strength: number): number {
  return Math.max(0, baseDamage + strength);
}
