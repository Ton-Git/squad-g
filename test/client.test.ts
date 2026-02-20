import { describe, it, expect } from 'vitest';
import { SquadClient, type SquadClientConfig } from '../src/client/index.js';
import { SessionPool, DEFAULT_POOL_CONFIG } from '../src/client/session-pool.js';
import { EventBus } from '../src/client/event-bus.js';

describe('SquadClient', () => {
  it('should construct with config', () => {
    const config: SquadClientConfig = {
      teamRoot: '/tmp/test-squad',
    };
    const client = new SquadClient(config);
    expect(client).toBeDefined();
  });

  it('should list sessions (empty initially)', () => {
    const client = new SquadClient({ teamRoot: '/tmp/test' });
    expect(client.listSessions()).toEqual([]);
  });
});

describe('SessionPool', () => {
  it('should construct with default config', () => {
    const pool = new SessionPool();
    expect(pool.size).toBe(0);
    expect(pool.atCapacity).toBe(false);
  });

  it('should report default config values', () => {
    expect(DEFAULT_POOL_CONFIG.maxConcurrent).toBe(10);
    expect(DEFAULT_POOL_CONFIG.idleTimeout).toBe(300_000);
  });
});

describe('EventBus', () => {
  it('should subscribe and emit events', async () => {
    const bus = new EventBus();
    const received: string[] = [];

    bus.on('session.created', (event) => {
      received.push(event.type);
    });

    await bus.emit({
      type: 'session.created',
      payload: { test: true },
      timestamp: new Date(),
    });

    expect(received).toEqual(['session.created']);
  });

  it('should support wildcard subscriptions via onAny', async () => {
    const bus = new EventBus();
    const received: string[] = [];

    bus.onAny((event) => {
      received.push(event.type);
    });

    await bus.emit({ type: 'session.created', payload: null, timestamp: new Date() });
    await bus.emit({ type: 'session.destroyed', payload: null, timestamp: new Date() });

    expect(received).toEqual(['session.created', 'session.destroyed']);
  });

  it('should return unsubscribe function', async () => {
    const bus = new EventBus();
    let count = 0;

    const unsub = bus.on('session.error', () => { count++; });

    await bus.emit({ type: 'session.error', payload: null, timestamp: new Date() });
    expect(count).toBe(1);

    unsub();
    await bus.emit({ type: 'session.error', payload: null, timestamp: new Date() });
    expect(count).toBe(1); // unchanged after unsub
  });
});
