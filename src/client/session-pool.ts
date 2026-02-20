/**
 * Session Pool Manager (PRD 1)
 *
 * Manages the lifecycle of multiple concurrent agent sessions.
 * Tracks session state, enforces concurrency limits, and handles
 * cleanup of idle/errored sessions.
 */

import type { SquadSession, SessionStatus } from './index.js';

// --- Pool Configuration ---

export interface SessionPoolConfig {
  /** Maximum concurrent sessions */
  maxConcurrent: number;

  /** Idle timeout before auto-cleanup (ms) */
  idleTimeout: number;

  /** Health check interval (ms) */
  healthCheckInterval: number;
}

export const DEFAULT_POOL_CONFIG: SessionPoolConfig = {
  maxConcurrent: 10,
  idleTimeout: 300_000, // 5 minutes
  healthCheckInterval: 30_000, // 30 seconds
};

// --- Pool Events ---

export type PoolEventType =
  | 'session.added'
  | 'session.removed'
  | 'session.status_changed'
  | 'pool.at_capacity'
  | 'pool.health_check';

export interface PoolEvent {
  type: PoolEventType;
  sessionId?: string;
  oldStatus?: SessionStatus;
  newStatus?: SessionStatus;
  timestamp: Date;
}

// --- Session Pool ---

export class SessionPool {
  private config: SessionPoolConfig;
  private sessions: Map<string, SquadSession> = new Map();

  constructor(config: Partial<SessionPoolConfig> = {}) {
    this.config = { ...DEFAULT_POOL_CONFIG, ...config };
    // TODO: PRD 1 — Start health check interval
    // TODO: PRD 1 — Set up idle session cleanup timer
  }

  /** Add a session to the pool */
  add(session: SquadSession): void {
    // TODO: PRD 1 — Check capacity limit
    // TODO: PRD 1 — Emit 'session.added' event
    this.sessions.set(session.id, session);
  }

  /** Remove a session from the pool */
  remove(sessionId: string): boolean {
    // TODO: PRD 1 — Emit 'session.removed' event
    return this.sessions.delete(sessionId);
  }

  /** Get a session by ID */
  get(sessionId: string): SquadSession | undefined {
    return this.sessions.get(sessionId);
  }

  /** Find a session by agent name */
  findByAgent(agentName: string): SquadSession | undefined {
    for (const session of this.sessions.values()) {
      if (session.agentName === agentName) return session;
    }
    return undefined;
  }

  /** Get all active sessions */
  active(): SquadSession[] {
    return Array.from(this.sessions.values()).filter(s => s.status === 'active');
  }

  /** Current pool size */
  get size(): number {
    return this.sessions.size;
  }

  /** Whether the pool is at capacity */
  get atCapacity(): boolean {
    return this.sessions.size >= this.config.maxConcurrent;
  }

  /** Destroy all sessions and stop timers */
  async shutdown(): Promise<void> {
    // TODO: PRD 1 — Stop health check timer
    // TODO: PRD 1 — Destroy all sessions gracefully
    this.sessions.clear();
  }
}
