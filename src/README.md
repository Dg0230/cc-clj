# Source module staging

This directory collects TypeScript placeholders for modules that will be ported from the bundled `cli-origin.js` file. Each subdirectory documents the bundle `moduleId` values that must eventually be migrated so the mapping remains traceable.

## Module group overview

- `commands/commander.ts` – Commander CLI wiring (8 modules).
- `services/aws/sdk.ts` – AWS/Smithy runtime generated helpers (323 modules).
- `services/telemetry/opentelemetry.ts` – OpenTelemetry shims (26 modules).
- `services/http/axios.ts` – Axios integration (4 modules).
- `ui/react/react.ts` – React runtime (2 modules).
- `ui/terminal/chalk.ts` – Chalk terminal styling (2 modules).
- `utils/validation/schema.ts` – AJV schema utilities (37 modules).

Refer to each subdirectory README for the explicit module ID rosters.
