# Migration checklist for CLI source split

This checklist covers the preparatory work required to regenerate TypeScript sources from the bundled `cli-origin.js` while preserving behavior. Work through the items in order when executing the migration.

## 1. Decide how to seed the split sources
- Review `docs/splitting-plan.md` to confirm the planned directory layout and module groupings before automating any generation.【F:docs/splitting-plan.md†L1-L120】
- Prefer an automated generator over duplicating the TypeScript templates by hand. A Node script (for example `scripts/generate-split-files.js`) can reuse the same Babel parsing utilities that power `analyze-modules.js`, ensuring consistent export detection and reducing transcription errors.【F:analyze-modules.js†L1-L160】
- Have the generator consume:
  - `module-analysis.json` for export/usage metadata gathered from the bundle.【F:docs/splitting-plan.md†L68-L120】
  - `module-groups.json` and `module-grouping-report.md` for the planned file boundaries and rationale.【F:module-groups.json†L1-L32】【F:docs/splitting-plan.md†L1-L64】
- Script responsibilities:
  1. Load the module grouping data and build an in-memory plan of which bundle module IDs map to each target file.
  2. For each target file, read the export statements captured in `module-analysis.json` and scaffold the matching TypeScript facade (e.g., named exports, default exports, internal wiring).
  3. Emit placeholder internal modules (`src/**/internal/*.ts`) with TODO markers rather than leaving them blank to prevent commit-time linting failures.
  4. Preserve existing handwritten utilities that already live under `src/` by checking for file collisions before writing.
- Capture the generator output alongside a manifest (for example `scripts/.generated-files.json`) so subsequent runs can diff and clean up obsolete files.

## 2. Formatting and type-safety guardrails
- Add Prettier as a development dependency (`npm install --save-dev prettier`) and create a `prettier.config.cjs` that aligns with the existing TypeScript style. Run formatting as part of the generation pipeline with `npx prettier --write`.
- Enforce type safety by invoking `npm run build` (which calls `tsc`) after each generation run; this already exists in `package.json` and will surface missing imports or type regressions early.【F:package.json†L1-L28】
- Gate commits on both `npx prettier --check "src/**/*.ts" "docs/**/*.md"` and `npm run build` to keep the generated surface consistent and type-correct.
- Extend Jest coverage (`npm run test` or the narrower `npm run test:cli`) after generation once the TypeScript files are populated to ensure parity against the existing CLI parity tests.【F:package.json†L8-L14】

## 3. Behavioral regression snapshot
Run the current bundle commands and record their outputs before migrating. Re-run the same commands after splitting and verify the results match.

| Command | Purpose | Expected current behavior |
| --- | --- | --- |
| `node dist/index.js --help` | Exercises the custom help formatter wired in `buildProgram`.| Fails with `CommanderError: Unknown option '--help'.` because the bundled parser does not register the flag automatically.【F:src/index.ts†L200-L244】【e84be1†L1-L15】 |
| `node dist/index.js analyze cli-origin.js` | Regenerates `module-analysis.json` directly from the bundle, validating that the analyzer still runs end-to-end.| Exits with status code `0` and produces no stdout, while updating the analysis file on disk.【F:src/index.ts†L272-L285】【91d846†L1-L2】【f13008†L1-L2】 |
| `node dist/index.js categorize module-analysis.json` | Reads the captured analysis and builds grouped categories.| Currently fails with `SyntaxError: Expected ',' or ']' after array element…` because the committed analysis JSON is not yet normalized; use this failure signature as a regression check until the data is cleaned up.【F:src/index.ts†L286-L295】【485607†L1-L15】 |
| `node dist/index.js summarize module-analysis.json` | Summarizes module exports by alias for reporting.| Exhibits the same JSON parse error as `categorize`, confirming both commands depend on a valid analysis file.【F:src/index.ts†L296-L304】【e2ff7d†L1-L12】 |
| `node dist/index.js analyze --print …` (any position) | Validates the command-line option parser.| Throws `CommanderError: Unknown option '--print'.`, highlighting a known limitation that the split must preserve.【F:src/index.ts†L218-L244】【95dbc9†L1-L14】【828049†L1-L14】 |

## 4. Execution log
Tick off each item when migrating:

- [ ] Copy the latest `module-analysis.json`, `module-groups.json`, and `module-grouping-report.md` into a staging branch.
- [ ] Implement or update `scripts/generate-split-files.js` to emit the planned source skeleton.
- [ ] Run `npx prettier --write` on the generated files.
- [ ] Run `npm run build` and address any type errors.
- [ ] Capture the regression commands listed above and compare their outputs (or failure signatures) with the baseline table.
- [ ] Review `git status` for unexpected changes (especially under `src/shared/**` and `src/utils/**`).
- [ ] Commit the generated sources alongside the manifest and checklist updates.
