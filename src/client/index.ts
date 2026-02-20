/**
 * Squad Client — SDK Orchestration Runtime (PRD 1)
 *
 * Adapter layer wrapping @github/copilot-sdk's CopilotClient.
 * All Squad code imports from here, never from the SDK directly.
 * This isolates us from Technical Preview breaking changes.
 */

// --- Configuration ---

export interface SquadClientConfig {
  /** Path to the .squad/ or .ai-team/ team directory */
  teamRoot: string;

  /** Model to use for the coordinator session */
  model?: string;

  /** Custom agents registered with the SDK */
  customAgents?: CustomAgentConfig[];

  /** MCP server configurations */
  mcpServers?: Record<string, McpServerConfig>;

  /** Maximum concurrent sessions (default: 10) */
  maxSessions?: number;

  /** Connection timeout in milliseconds (default: 5000) */
  connectionTimeout?: number;

  /** Enable auto-reconnection on connection loss */
  autoReconnect?: boolean;
}

export interface CustomAgentConfig {
  name: string;
  displayName: string;
  description: string;
  prompt: string;
  tools?: string[];
  mcpServers?: string[];
}

export interface McpServerConfig {
  command: string;
  args?: string[];
  env?: Record<string, string>;
}

// --- Session Types ---

export interface SquadSessionConfig {
  /** Agent name (maps to a charter) */
  agentName: string;

  /** System message content */
  systemMessage?: string;

  /** System message mode: append to or replace agent prompt */
  systemMessageMode?: 'append' | 'replace';

  /** Tools available to this session */
  availableTools?: string[];

  /** Tools excluded from this session */
  excludedTools?: string[];

  /** Model override for this session */
  model?: string;

  /** Enable infinite session with auto-compaction */
  infiniteSession?: boolean;
}

export interface SquadSession {
  id: string;
  agentName: string;
  status: SessionStatus;
  createdAt: Date;
}

export type SessionStatus = 'creating' | 'active' | 'idle' | 'error' | 'destroyed';

// --- Client ---

export class SquadClient {
  private config: SquadClientConfig;
  private sessions: Map<string, SquadSession> = new Map();

  constructor(config: SquadClientConfig) {
    this.config = config;
    // TODO: PRD 1 — Initialize CopilotClient from @github/copilot-sdk
    // TODO: PRD 1 — Check sdkProtocolVersion compatibility
    // TODO: PRD 1 — Set up auto-reconnection if configured
  }

  /** Initialize the client and connect to the Copilot server */
  async connect(): Promise<void> {
    // TODO: PRD 1 — Spawn or connect to Copilot server
    // TODO: PRD 1 — Verify protocol version via getStatus()
    // TODO: PRD 1 — Discover available models via listModels()
  }

  /** Create a new agent session */
  async createSession(config: SquadSessionConfig): Promise<SquadSession> {
    // TODO: PRD 1 — Map SquadSessionConfig to SDK SessionConfig
    // TODO: PRD 1 — Register session in pool
    // TODO: PRD 1 — Emit 'session.created' event
    throw new Error('Not implemented');
  }

  /** Resume an existing session by ID */
  async resumeSession(sessionId: string): Promise<SquadSession> {
    // TODO: PRD 1 — Call SDK resumeSession()
    // TODO: PRD 1 — Restore session metadata
    throw new Error('Not implemented');
  }

  /** List all active sessions */
  listSessions(): SquadSession[] {
    return Array.from(this.sessions.values());
  }

  /** Destroy a session and release resources */
  async destroySession(sessionId: string): Promise<void> {
    // TODO: PRD 1 — Call SDK session.destroy()
    // TODO: PRD 1 — Remove from pool, emit 'session.destroyed'
    this.sessions.delete(sessionId);
  }

  /** Graceful shutdown — destroy all sessions and disconnect */
  async shutdown(): Promise<void> {
    // TODO: PRD 1 — Destroy all sessions
    // TODO: PRD 1 — Close CopilotClient connection
    this.sessions.clear();
  }
}
