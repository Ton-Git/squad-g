# Squad SDK

**Programmable multi-agent runtime for GitHub Copilot**, built on [`@github/copilot-sdk`](https://github.com/nicolo-ribaudo/github-copilot-sdk).

> ⚠️ **Alpha** — This is the SDK replatform of [Squad](https://github.com/bradygaster/squad). The original prompt-based orchestrator lives in the source repo.

## What is this?

Squad transforms from a "team template kit" into a **programmable multi-agent runtime**. Instead of a 32KB markdown prompt orchestrating agents via string templates, this SDK-based version provides:

- **Typed session management** — Create, resume, and observe agent sessions programmatically
- **Custom tools** — `squad_route`, `squad_decide`, `squad_memory`, `squad_status`, `squad_skill`
- **Hook-based governance** — File-write guards, PII scrubbing, reviewer lockouts enforced in code
- **Event-driven coordination** — Real-time agent observation via cross-session event bus
- **Crash recovery** — Persistent sessions with auto-resumption

## Tech Stack

- **Runtime:** Node.js ≥ 20, TypeScript (ESM)
- **SDK:** `@github/copilot-sdk` v0.1.8 (Technical Preview)
- **Testing:** Vitest
- **Bundling:** esbuild

## Getting Started

```bash
npm install
npm run build
npm test
```

## Architecture

See the [PRD Index](https://github.com/bradygaster/squad/blob/main/.ai-team/docs/prds/00-index.md) in the source repo for the full 14-PRD replatform plan.

### Module Map

| Module | PRD | Description |
|--------|-----|-------------|
| `src/client/` | PRD 1 | SquadClient adapter, session pool, event bus |
| `src/tools/` | PRD 2 | Custom tools via SDK `defineTool()` |
| `src/hooks/` | PRD 3 | Hook pipeline for policy enforcement |
| `src/agents/` | PRD 4 | Agent session lifecycle, charter compiler |
| `src/coordinator/` | PRD 5 | Coordinator orchestrator |
| `src/casting/` | PRD 11 | Casting system v2 |
| `src/ralph/` | PRD 8 | Ralph work monitor |

## License

MIT
