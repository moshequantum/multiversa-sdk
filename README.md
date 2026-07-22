# Multiversa SDK

Public, vendor-neutral contracts for building and integrating a unique Project OS.
This repository begins with the protocol layer: versioned JSON Schemas and
executable fixtures shared by the CLI, MCP server, Installer, local HTTP surface,
and future language SDKs.

It does not contain consulting logic, commercial tiers, client identities, private
prompts, credentials, or deployment configuration.

## Contracts

| Contract | Schema ID | Purpose |
|---|---|---|
| CLI envelope | `https://schemas.multiversa.dev/cli-envelope/v1` | Stable success/error boundary for machine-readable CLI output |
| Profile | `https://schemas.multiversa.dev/profile/v1` | Identity, governance, taboos, routing, and enabled capabilities |
| VoiceProfile | `https://schemas.multiversa.dev/voice-profile/v1` | Private-by-default language, address form, interaction and assistant relationship contract |
| OS instance | `https://schemas.multiversa.dev/os-instance/v1` | Unique system owned by one project |
| Mission | `https://schemas.multiversa.dev/mission/v1` | Verifiable objective, authority, gates, and learning policy |
| Capability | `https://schemas.multiversa.dev/capability/v1` | Versioned unit of technical ability and its operating mode |
| SWARM event | `https://schemas.multiversa.dev/swarm-event/v1` | Evidence-bearing runtime event emitted by a mission fleet |

Schemas live at `schemas/<contract>/v1.schema.json`. Fixtures live beside each
schema under `fixtures/<contract>/{valid,invalid}`.

## Versioning

Contract versions are independent from package and CLI versions. Additive fields
may be introduced within `v1`; renamed fields, removed fields, or changed meaning
require `v2`. Consumers must reject unsupported major versions and ignore unknown
additive fields unless their security policy requires stricter handling.

## Local validation

```bash
pnpm check
```

Release candidates are distributed from GitHub as a source archive and a packed
contract artifact. This package is not yet published to npm; do not treat the
package name as an npm availability claim.

The initial checker has no external dependencies. It validates JSON syntax, schema
metadata, local references, fixture coverage, and core valid/invalid invariants.
A standards-complete JSON Schema validator can be added later as a development
dependency without changing the contracts.

## Security boundary

Secret values never cross these contracts. Use opaque secret references and a
separate protected channel. A Profile may route reusable work to Lab or private
work to Group, but commercial terms and private engagement details remain outside
the public contract.

A `VoiceProfile` may contain personal context and is therefore private by default.
Adapters may project it into an upstream custom-persona surface, but must not publish
it, infer sensitive traits, impersonate the human, or change identity/language rules
without confirmation from the OS owner.
