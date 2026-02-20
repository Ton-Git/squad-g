/**
 * Casting System v2 (PRD 11)
 *
 * Runtime casting engine that generates CustomAgentConfig objects
 * from the casting registry. Replaces static agent definitions with
 * dynamic identity assignment based on universe, role, and team composition.
 */

// --- Casting Types ---

export interface CastingUniverse {
  /** Universe name (e.g., 'The Wire', 'Seinfeld') */
  name: string;
  /** Available character names */
  characters: string[];
  /** Universe-specific constraints */
  constraints?: string[];
}

export interface CastingEntry {
  /** Agent role name (e.g., 'core-dev', 'lead') */
  role: string;
  /** Cast character name */
  characterName: string;
  /** Universe the character is from */
  universe: string;
  /** Display name (e.g., 'Fenster — Core Dev') */
  displayName: string;
}

export interface CastingRegistryConfig {
  /** Path to .squad/casting/ directory */
  castingDir: string;
  /** Active universe name */
  activeUniverse?: string;
}

// --- Casting Registry ---

export class CastingRegistry {
  private entries: Map<string, CastingEntry> = new Map();
  private config: CastingRegistryConfig;

  constructor(config: CastingRegistryConfig) {
    this.config = config;
    // TODO: PRD 11 — Load casting/registry.json
    // TODO: PRD 11 — Load casting/policy.json for universe allowlist
    // TODO: PRD 11 — Load casting/history.json for past assignments
  }

  /** Load the casting registry from filesystem */
  async load(): Promise<void> {
    // TODO: PRD 11 — Parse registry.json into entries map
    // TODO: PRD 11 — Validate against policy constraints
  }

  /** Get the cast entry for a role */
  getByRole(role: string): CastingEntry | undefined {
    return this.entries.get(role);
  }

  /** Get all current cast entries */
  getAllEntries(): CastingEntry[] {
    return Array.from(this.entries.values());
  }

  /** Cast a new agent for a role (assigns character from active universe) */
  async cast(role: string, universe?: string): Promise<CastingEntry> {
    // TODO: PRD 11 — Select character from universe using policy rules
    // TODO: PRD 11 — Check for name collisions
    // TODO: PRD 11 — Write to registry.json and history.json
    throw new Error('Not implemented');
  }

  /** Recast the entire team in a new universe */
  async recast(universe: string): Promise<CastingEntry[]> {
    // TODO: PRD 11 — Validate universe is in allowlist
    // TODO: PRD 11 — Assign characters to all roles
    // TODO: PRD 11 — Archive old cast in history.json
    throw new Error('Not implemented');
  }
}
