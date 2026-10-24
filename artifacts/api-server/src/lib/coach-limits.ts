const WINDOW_MS = 15 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;
const visitors = new Map<string, { count: number; until: number; busy: boolean }>();
let globalUntil = 0;
let globalCount = 0;
let active = 0;

/** Process-local abuse/cost guard. Never stores questions or health details. */
export function reserveCoachRequest(key: string, now = Date.now()) {
  for (const [id, entry] of visitors) {
    if (entry.until <= now && !entry.busy) visitors.delete(id);
  }
  if (globalUntil <= now) { globalUntil = now + HOUR_MS; globalCount = 0; }
  const entry = visitors.get(key) ?? { count: 0, until: now + WINDOW_MS, busy: false };
  if (entry.busy || active >= 4) {
    return { ok: false as const, retryAfter: 30, error: 'The coach is helping with another request. Please try again shortly.' };
  }
  if (entry.count >= 20 || globalCount >= 100 || (!visitors.has(key) && visitors.size >= 5000)) {
    const until = entry.count >= 20 ? entry.until : globalUntil;
    return { ok: false as const, retryAfter: Math.max(1, Math.ceil((until - now) / 1000)), error: 'The coach has reached its request limit. Please take a break and try again later.' };
  }
  entry.count++;
  entry.busy = true;
  visitors.set(key, entry);
  active++;
  globalCount++;
  let released = false;
  return {
    ok: true as const,
    release() {
      if (released) return;
      released = true;
      entry.busy = false;
      active--;
    },
  };
}
