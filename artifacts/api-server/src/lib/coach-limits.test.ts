import assert from 'node:assert/strict';
import { test } from 'node:test';
import { reserveCoachRequest } from './coach-limits';

test('blocks duplicate in-flight requests and releases reservations only once', () => {
  const first = reserveCoachRequest('one', 100000);
  assert.equal(first.ok, true);
  assert.equal(reserveCoachRequest('one', 100000).ok, false);
  if (first.ok) { first.release(); first.release(); }
  const next = reserveCoachRequest('one', 100001);
  assert.equal(next.ok, true);
  if (next.ok) next.release();
});

test('bounds simultaneous AI requests across visitors', () => {
  const reservations = Array.from({ length: 4 }, (_, i) => reserveCoachRequest(`parallel${i}`, 10000000));
  assert.ok(reservations.every(r => r.ok));
  assert.equal(reserveCoachRequest('overflow', 10000000).ok, false);
  for (const r of reservations) if (r.ok) r.release();
});

test('enforces a visitor window and permits requests after expiry', () => {
  const now = 100000000;
  for (let i = 0; i < 20; i++) {
    const r = reserveCoachRequest('quota', now);
    assert.equal(r.ok, true);
    if (r.ok) r.release();
  }
  const blocked = reserveCoachRequest('quota', now);
  assert.equal(blocked.ok, false);
  if (!blocked.ok) assert.equal(blocked.retryAfter, 900);
  const later = reserveCoachRequest('quota', now + 900001);
  assert.equal(later.ok, true);
  if (later.ok) later.release();
});

test('bounds overall hourly usage and recovers after the hour', () => {
  const now = 1000000000;
  for (let i = 0; i < 100; i++) {
    const r = reserveCoachRequest(`global${i}`, now);
    assert.equal(r.ok, true);
    if (r.ok) r.release();
  }
  assert.equal(reserveCoachRequest('hourly-overflow', now).ok, false);
  const later = reserveCoachRequest('hourly-overflow', now + 3600001);
  assert.equal(later.ok, true);
  if (later.ok) later.release();
});
