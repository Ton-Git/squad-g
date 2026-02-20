/**
 * Hook Pipeline — Hooks & Policy Enforcement (PRD 3)
 *
 * Programmatic enforcement of governance policies via SDK hooks.
 * Replaces prompt-level rules with deterministic, testable handlers.
 *
 * Hook types:
 *   - onPreToolUse:  Intercept tool calls before execution (block/allow/modify)
 *   - onPostToolUse: Inspect tool results after execution (scrub PII, log)
 *   - onSessionStart: Inject context at session creation
 *   - onSessionEnd:  Cleanup at session teardown
 *   - onErrorOccurred: Handle errors from SDK or tools
 */

// --- Hook Types ---

export type HookAction = 'allow' | 'block' | 'modify';

export interface PreToolUseContext {
  /** Name of the tool being called */
  toolName: string;
  /** Arguments passed to the tool */
  arguments: Record<string, unknown>;
  /** Agent name that invoked the tool */
  agentName: string;
  /** Session ID */
  sessionId: string;
}

export interface PreToolUseResult {
  action: HookAction;
  /** Modified arguments (only if action === 'modify') */
  modifiedArguments?: Record<string, unknown>;
  /** Reason for blocking (only if action === 'block') */
  reason?: string;
}

export interface PostToolUseContext {
  toolName: string;
  arguments: Record<string, unknown>;
  result: unknown;
  agentName: string;
  sessionId: string;
}

export interface PostToolUseResult {
  /** Scrubbed or modified result */
  result: unknown;
}

export type PreToolUseHook = (ctx: PreToolUseContext) => PreToolUseResult | Promise<PreToolUseResult>;
export type PostToolUseHook = (ctx: PostToolUseContext) => PostToolUseResult | Promise<PostToolUseResult>;

// --- Policy Definitions ---

export interface PolicyConfig {
  /** File paths agents are allowed to write to (glob patterns) */
  allowedWritePaths?: string[];

  /** Shell commands that are always blocked */
  blockedCommands?: string[];

  /** Maximum ask_user calls per session */
  maxAskUserPerSession?: number;

  /** Enable PII scrubbing on tool outputs */
  scrubPii?: boolean;
}

export const DEFAULT_BLOCKED_COMMANDS: string[] = [
  'rm -rf',
  'git push --force',
  'git rebase',
  'git reset --hard',
];

// --- Hook Pipeline ---

export class HookPipeline {
  private preToolHooks: PreToolUseHook[] = [];
  private postToolHooks: PostToolUseHook[] = [];
  private config: PolicyConfig;

  constructor(config: PolicyConfig = {}) {
    this.config = config;
    // TODO: PRD 3 — Register file-write guard hook
    // TODO: PRD 3 — Register shell command restriction hook
    // TODO: PRD 3 — Register PII scrubbing hook
    // TODO: PRD 3 — Register reviewer lockout hook
    // TODO: PRD 3 — Register ask_user rate limiter
  }

  /** Register a pre-tool-use hook */
  addPreToolHook(hook: PreToolUseHook): void {
    this.preToolHooks.push(hook);
  }

  /** Register a post-tool-use hook */
  addPostToolHook(hook: PostToolUseHook): void {
    this.postToolHooks.push(hook);
  }

  /** Run all pre-tool hooks in order. First 'block' wins. */
  async runPreToolHooks(ctx: PreToolUseContext): Promise<PreToolUseResult> {
    for (const hook of this.preToolHooks) {
      const result = await hook(ctx);
      if (result.action === 'block') return result;
      if (result.action === 'modify' && result.modifiedArguments) {
        ctx = { ...ctx, arguments: result.modifiedArguments };
      }
    }
    return { action: 'allow' };
  }

  /** Run all post-tool hooks in order */
  async runPostToolHooks(ctx: PostToolUseContext): Promise<PostToolUseResult> {
    let result = ctx.result;
    for (const hook of this.postToolHooks) {
      const hookResult = await hook({ ...ctx, result });
      result = hookResult.result;
    }
    return { result };
  }
}
