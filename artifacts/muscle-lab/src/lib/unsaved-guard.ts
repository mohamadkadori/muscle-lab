import type { MouseEvent } from 'react';

let dirty = false;
let handler: ((href: string) => void) | null = null;

export function setUnsavedGuard(isDirty: boolean, onBlocked: ((href: string) => void) | null) {
  dirty = isDirty;
  handler = onBlocked;
}

/** Call from link onClick. Returns true when navigation was blocked. */
export function guardNav(e: MouseEvent, href: string): boolean {
  if (!dirty || !handler) return false;
  e.preventDefault();
  handler(href);
  return true;
}
