import { Router } from 'express';
import { getAuth } from '@clerk/express';
import { AskCoachBody, AskCoachResponse } from '@workspace/api-zod';
import { getOpenAI, zodResponseFormat } from '@workspace/integrations-openai-ai-server';
import { getClerkProxyHost } from '../middlewares/clerkProxyMiddleware';
import { COACH_POLICY } from '../lib/coach-policy';
import { reserveCoachRequest } from '../lib/coach-limits';

const router = Router();

router.post('/openai/coach', async (req, res) => {
  res.setHeader('Cache-Control', 'private, no-store');
  const origin = req.get('origin');
  try {
    if ((origin && new URL(origin).host !== getClerkProxyHost(req)) || req.get('sec-fetch-site') === 'cross-site') {
      res.status(403).json({ error: 'Open the coach directly from muscleLab to send a message.' });
      return;
    }
  } catch {
    res.status(403).json({ error: 'The request origin is invalid.' });
    return;
  }
  const parsed = AskCoachBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Please send a conversation of up to 16 messages.' });
    return;
  }
  const messages = parsed.data.messages;
  const last = messages[messages.length - 1]!;
  if (last.role !== 'user' || !last.content.trim() || last.content.length > 2000 ||
      messages.reduce((total, m) => total + m.content.length, 0) > 48000) {
    res.status(400).json({ error: 'Keep your question under 2,000 characters and start a new conversation if this one is too long.' });
    return;
  }
  const identity = getAuth(req).userId;
  const reservation = reserveCoachRequest(identity ? `user:${identity}` : `guest:${req.ip ?? 'unknown'}`);
  if (!reservation.ok) {
    res.setHeader('Retry-After', reservation.retryAfter);
    res.status(429).json({ error: reservation.error });
    return;
  }
  const controller = new AbortController();
  const abort = () => controller.abort();
  res.once('close', abort);
  try {
    const completion = await getOpenAI().chat.completions.create({
      model: 'gpt-5.4-mini',
      store: false,
      reasoning_effort: 'low',
      max_completion_tokens: 6000,
      response_format: zodResponseFormat(AskCoachResponse, 'musclelab_coach_reply'),
      messages: [{ role: 'system', content: COACH_POLICY }, ...messages],
    }, { signal: controller.signal });
    const choice = completion.choices[0];
    const text = choice?.message.content;
    if (choice?.finish_reason !== 'stop' || !text) throw new Error('IncompleteCoachReply');
    const result = AskCoachResponse.safeParse(JSON.parse(text));
    if (!result.success || !result.data.reply.trim() ||
        result.data.workouts.some(w => !w.name.trim() || w.exercises.some(e => !e.name.trim() || !e.reps.trim()))) {
      throw new Error('InvalidCoachReply');
    }
    if (!res.destroyed) res.json(result.data);
  } catch (error) {
    if (controller.signal.aborted) return;
    const status = error && typeof error === 'object' && 'status' in error ? error.status : undefined;
    req.log.warn({ providerStatus: typeof status === 'number' ? status : undefined }, 'AI coach request did not complete');
    if (!res.destroyed) res.status(503).json({ error: 'The AI coach could not finish that reply. Your message and existing workouts are unchanged. Please try again shortly.' });
  } finally {
    res.off('close', abort);
    reservation.release();
  }
});

export default router;
