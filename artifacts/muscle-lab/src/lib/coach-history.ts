import type { CoachMessage, CoachRoutine } from '@workspace/api-client-react';

export const MAX_USER_CHARS = 2000;
const MAX_MESSAGES = 16;
const MAX_TOTAL = 48000;
const MAX_ONE = 16000;

export interface TranscriptItem {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  workouts?: CoachRoutine[];
}

export function summarizeForHistory(item: TranscriptItem): string {
  let text = item.content;
  if (item.workouts?.length) {
    const plans = item.workouts.map((w, i) =>
      `${i + 1}. ${w.name}${w.notes ? ` (${w.notes})` : ''}: ` +
      w.exercises.map((e) => `${e.name} ${e.sets}x${e.reps}`).join('; ')).join('\n');
    text += `\n\n[Drafted routines shown to the user]\n${plans}`;
  }
  return text.slice(0, MAX_ONE);
}

export function buildHistory(items: TranscriptItem[]): CoachMessage[] {
  let msgs: CoachMessage[] = items.map((i) => ({ role: i.role, content: summarizeForHistory(i) }));
  msgs = msgs.slice(-MAX_MESSAGES);
  const total = (m: CoachMessage[]) => m.reduce((n, x) => n + x.content.length, 0);
  while (msgs.length > 1 && (total(msgs) > MAX_TOTAL || msgs[0].role !== 'user')) msgs = msgs.slice(1);
  return msgs;
}
