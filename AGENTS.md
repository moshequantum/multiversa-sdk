# AGENTS.md

## Scope

This repository is the public, vendor-neutral contract layer for Multiversa Lab.
It contains schemas, fixtures, generated types in the future, and transport-neutral
SDK helpers. It must remain safe to publish.

## Constitutional boundaries

- Lab contains reusable protocols only. Never add prospect or client data, PII,
  credentials, pricing, proposals, contracts, or configured private judgment.
- `PulseOS` and `ElevatOS` are unique client OS names. They are never templates,
  plans, tiers, or fixture names.
- An OS instance is unique to its owning project. Reusable compositions are called
  blueprints or recipes.
- AI may propose; a human decides. External writes, destructive actions, policy
  changes, permissions, identity, taboos, and contracts require explicit approval.
- Secrets are references only. Secret values must never appear in schemas, fixtures,
  logs, events, or serialized SDK requests.

## Contract rules

- JSON Schema files under `schemas/<contract>/vN.schema.json` are authoritative.
- Breaking changes require a new major schema directory. Within a major version,
  changes are additive only.
- Every schema change requires valid and invalid fixtures.
- Keep the runtime dependency-free where practical. Use `pnpm`, never npm.
- Run `pnpm check` before committing.
- Do not publish packages, tags, releases, or external messages without explicit
  authorization.

## Naming

Use the canonical domain terms: `Profile`, `OSInstance`, `Capability`, `Mission`,
`SWARM`, `Hardness`, and `Engagement`. Commercial routing belongs to Group and is
represented publicly only by non-sensitive routing or opaque references.
