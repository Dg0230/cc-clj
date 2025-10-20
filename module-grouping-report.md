# Module grouping summary

## Overview
- Total modules parsed from `cli-origin.js`: 2,323.
- Grouped modules: 402 across seven functional buckets (see `module-groups.json` for details).
- Remaining unmatched modules: 1,921 (largely vendor helper code and bundle boilerplate).

## Category breakdown

### commands/commander → `src/commands/commander.ts`
- Module IDs: `aC1`, `He1`, `xs0`, `vs0`, `RjQ`, `SjQ`, `xjQ`, `bjQ`.
- Evidence highlights:
  - String literals such as `commander.invalidArgument` and help/usage text.
  - Export targets wiring `.Command`, `.Option`, `.Argument`, and `.Help` re-exports.
- Role: wraps the Commander CLI definitions, error helpers, and re-export shim used to build the CLI surface area.

### services/aws → `src/services/aws/sdk.ts`
- 323 modules (see `module-groups.json` for the complete list), e.g. `Z70`, `UG1`, `W70`, `iTA`, `HQ`, `uPA`, `K70`, `AjA`, `skA`, `UZ0`.
- Evidence highlights:
  - String literals referencing `@aws-sdk/*`, `__smithy_context`, `AWS_*` env vars, SigV4 signing, and Bedrock client wiring.
- Role: Smithy-generated AWS SDK core, credential providers, HTTP auth config, and service runtime helpers that power Bedrock / SSO integration.

### services/telemetry → `src/services/telemetry/opentelemetry.ts`
- 26 modules, e.g. `mn`, `Dx0`, `kPB`, `LjB`, `SK1`, `ugB`, `gv0`, `ov0`, `JAQ`, `RAQ`.
- Evidence highlights:
  - String literals mentioning `OpenTelemetry`, span/baggage keys, and API registration warnings.
- Role: OpenTelemetry API shims for tracing/context propagation used by the CLI telemetry stack.

### services/http → `src/services/http/axios.ts`
- Modules: `nu2`, `_q0`, `_L`, `Yd2`.
- Evidence highlights:
  - String literals referencing Axios request options, deprecation notices, and adapter configuration.
- Role: Axios HTTP client wrapper and defaults.

### ui/react → `src/ui/react/react.ts`
- Modules: `K1`, `P$A`.
- Evidence highlights:
  - React core symbols such as `react.element`, `react.portal`, `react.fragment`, etc.
- Role: React runtime used for Ink-powered interactive flows inside the CLI.

### ui/terminal → `src/ui/terminal/chalk.ts`
- Modules: `j2B`, `f2B`.
- Evidence highlights:
  - Chalk template validation strings and constructor deprecation notices.
- Role: Terminal styling helpers (Chalk).

### utils/validation → `src/utils/validation/schema.ts`
- 37 modules, e.g. `rt`, `dG1`, `Ie2`, `qM0`, `RQB`, `dQB`, `iQB`, `aQB`, `rQB`, `Q9B`.
- Evidence highlights:
  - Strings referencing schema compilation (`"var validate ="`, `"error compiling schema"`), AJV error messages, and validation helpers.
- Role: JSON schema / AJV validation utilities that support configuration parsing.

## Directory structure proposal
```
src/
  commands/
    commander.ts
  services/
    aws/
      sdk.ts
    telemetry/
      opentelemetry.ts
    http/
      axios.ts
  ui/
    react/
      react.ts
    terminal/
      chalk.ts
  utils/
    validation/
      schema.ts
```

- Keep `module-groups.json` alongside the source (e.g. under `docs/` or `analysis/`) to preserve the full group→module mapping for reference.
- Unmatched modules can be triaged later; most appear to be low-level vendor shims without clear ownership requirements.
