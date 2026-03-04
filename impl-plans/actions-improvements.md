# GitHub Actions Optionality Analysis & Implementation Plan

## Executive Summary

GitHub Actions are **not mandatory for core Squad usage** (local `squad` shell, team scaffolding, prompts, local edits, and manual issue workflows can run without Actions).

However, the current CLI and templates make Actions feel **effectively required for the default GitHub automation experience** because:

1. `squad init` always enables workflow generation from the CLI path.
2. `squad upgrade` always rewrites workflow files.
3. Documentation often presents workflow installation as default/automatic behavior.

So the project is functionally usable without Actions, but **product ergonomics and defaults are Actions-first**.

---

## What the codebase currently does

### 1) SDK already supports optional workflows

In SDK init options (`packages/squad-sdk/src/config/init.ts`), `includeWorkflows?: boolean` exists and defaults to `true`. Workflow copying is gated behind that flag.

Implication: the lower-level API already has a mechanism to make workflow creation optional.

### 2) CLI forces workflows on init

`packages/squad-cli/src/cli/core/init.ts` calls SDK init with:

```ts
const initOptions: InitOptions = {
  // ...
  includeWorkflows: true,
  // ...
};
```

No CLI flag currently exposes disabling this.

Implication: most users (CLI users) cannot opt out, even though SDK supports it.

### 3) CLI upgrade always updates workflows

`packages/squad-cli/src/cli/core/upgrade.ts` always copies workflow templates into `.github/workflows`.

Implication: users who manually removed workflows can have them restored during upgrade.

### 4) Workflow files target GitHub automation concerns

Templates in `templates/workflows/*.yml` focus on CI/release/triage/heartbeat/docs automation, which are valuable but not essential for local squad operation.

---

## Is GitHub Actions mandatory?

### Answer

**No, not strictly mandatory for using Squad.**

You can use Squad without Actions by:

- Running Squad locally (`squad`, `squad init`, interactive shell)
- Managing issues/triage manually or via local CLI commands
- Running local build/test/lint in your own CI platform

What you lose without Actions:

- Scheduled heartbeat automation
- Label/triage workflow triggers
- Built-in release/docs deployment automation templates

---

## Plan: make GitHub Actions explicitly optional

### Goal

Enable fully supported “no GitHub Actions” mode with predictable behavior across init/upgrade/docs.

### Scope

- CLI flags and behavior
- Upgrade behavior controls
- Documentation clarity
- Validation tests

### Non-goals

- Replacing GitHub Actions with another CI provider in this change
- Altering core agent execution model

---

## Proposed implementation (minimal and backward compatible)

### Phase 1 — Expose opt-out at init

1. Add CLI flag to init:
   - `squad init --no-workflows`
2. Parse this flag in `packages/squad-cli/src/cli-entry.ts` and pass through to `runInit(...)`.
3. Extend `RunInitOptions` / init command path in `packages/squad-cli/src/cli/core/init.ts`.
4. Wire to SDK option:
   - `includeWorkflows: !noWorkflows`
5. Keep default unchanged (`includeWorkflows: true`) for backward compatibility.

**Acceptance criteria**
- With `--no-workflows`, `.github/workflows/` is not created or modified by init.
- Without flag, behavior remains unchanged.

### Phase 2 — Prevent forced workflow reintroduction on upgrade

1. Add upgrade flag:
   - `squad upgrade --no-workflows`
2. Add an optional persistent preference in `squad.config.ts` (example):
   ```ts
   export default {
     github: {
       workflows: {
         enabled: false
       }
     }
   };
   ```
3. Upgrade resolution order:
   - CLI flag overrides config
   - config overrides default
   - default remains enabled for existing users
4. In `packages/squad-cli/src/cli/core/upgrade.ts`, skip workflow copy/update when disabled.

**Acceptance criteria**
- Repositories in no-workflows mode are not repopulated with workflow files during upgrade.

### Phase 3 — Document explicit “without Actions” path

1. Update README command docs to include `--no-workflows` examples.
2. Add/adjust docs scenario (e.g., CI/CD integration + existing repo docs) describing:
   - what still works without Actions
   - what automations are unavailable
   - how to re-enable later (`squad upgrade` or dedicated flag)
3. Ensure wording says workflows are optional, not required.

**Acceptance criteria**
- A newcomer can complete setup without creating any GitHub workflow files.

### Phase 4 — Optional provider-agnostic scaffolding (follow-up)

(Separate change, optional)

- Add `squad init --ci-provider=<github|none>` (future extension)
- Keep `github` default
- `none` implies no workflow templates

This keeps future extension clean for GitLab/Azure/Jenkins users.

---

## Test plan for the implementation

### Unit/CLI behavior tests

1. `init --no-workflows`:
   - assert `.github/workflows` absent
2. `init` default:
   - assert workflows exist
3. `upgrade --no-workflows`:
   - assert workflows unchanged/absent after upgrade
4. Config-based disable:
   - assert upgrade/init respects config when no CLI override
5. Flag precedence:
   - config disabled + CLI explicit enable (if supported) behaves predictably

### Regression checks

- Existing init/upgrade tests remain green with default behavior.
- No changes to team state files and merge-rule setup behavior.

---

## Rollout strategy

1. Ship flags first (`--no-workflows` on init/upgrade) with defaults unchanged.
2. Add docs immediately in same release.
3. Gather feedback from non-GitHub users.
4. Evaluate whether to add provider abstraction in a future minor release.

---

## Risks and mitigations

1. **Risk:** Users disable workflows then expect heartbeat/auto-triage.
   - **Mitigation:** Print a clear post-init/post-upgrade note when workflows are disabled.

2. **Risk:** Upgrade logic divergence (with/without workflows) causes maintenance complexity.
   - **Mitigation:** Centralize workflow-enabled decision in a single helper.

3. **Risk:** Docs drift between templates and CLI behavior.
   - **Mitigation:** Add test coverage for help text and flag wiring.

---

## Definition of done

- Users can initialize and upgrade Squad without creating/restoring GitHub workflows.
- Behavior is explicit via CLI flags (and optionally config).
- Docs clearly describe Actions as optional automation, not a hard requirement.
- Existing default behavior remains unchanged for current users.
