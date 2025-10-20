# Source splitting blueprint

This document captures how the bundled modules extracted from `cli-origin.js` map onto TypeScript source files under `src/`. It draws on `module-groups.json` for the module→feature grouping and the `exports` sections inside `module-analysis.json` to identify the public surface that needs to be preserved during the rewrite.

## Directory skeleton

```
src/
  commands/
    commander.ts
    internal/
      argument.ts
      command.ts
      help.ts
      option.ts
      suggest.ts
  services/
    aws/
      sdk.ts
      auth.ts
      runtime-auth.ts
      metadata.ts
    telemetry/
      opentelemetry.ts
      internal/
        api.ts
        diag.ts
        global.ts
    http/
      axios.ts
      internal/
        gaxios.ts
        pkg.ts
        transporter.ts
        validators.ts
  ui/
    react/
      react.ts
      runtime.ts
      jsx-runtime.ts
    terminal/
      chalk.ts
      internal/
        factory.ts
        template.ts
  utils/
    validation/
      schema.ts
      internal/
        core.ts
        http.ts
        keywords.ts
  shared/
    aws/
      context.ts
      credentials.ts
    cli/
      ansi.ts
      errors.ts
    http/
      utf8.ts
```

The additional files under `src/shared/` capture cross-cutting helpers that multiple feature areas import today via deep bundle references. Introducing them as shared modules keeps the planned TypeScript files acyclic.

---

## `src/commands/commander.ts`

### Module coverage
Module IDs: `aC1`, `He1`, `xs0`, `vs0`, `RjQ`, `SjQ`, `xjQ`, `bjQ`.

### Export surface to retain
`module-analysis.json` shows that these modules collectively export:

- `CommanderError` and `InvalidArgumentError` from `aC1`.【F:module-analysis.json†L392986-L392993】
- `Argument` and the helper `humanReadableArgName` from `He1`.【F:module-analysis.json†L393032-L393045】
- `Help` from `xs0`.【F:module-analysis.json†L393046-L393232】
- `Option` and `DualOptions` from `vs0`.【F:module-analysis.json†L393233-L393332】
- `suggestSimilar` utilities from `RjQ`.【F:module-analysis.json†L393333-L393373】
- `Command` from `SjQ`.【F:module-analysis.json†L393374-L394248】
- Aggregated re-exports such as `program`, `createCommand`, `createOption`, `createArgument`, `Command`, `Option`, `Argument`, `Help`, `CommanderError`, `InvalidArgumentError`, and `InvalidOptionArgumentError` from `xjQ`.【F:module-analysis.json†L394250-L394273】
- Final top-level namespace re-export mirroring the default `commander` export in `bjQ`.【F:module-analysis.json†L394275-L394288】

### Planned module structure

```ts
// src/shared/cli/errors.ts
export class CommanderError extends Error { /* ported from ks0 */ }
export class InvalidArgumentError extends CommanderError { /* ported from wjQ */ }

// src/commands/commander.ts
import { CommanderError, InvalidArgumentError } from "../shared/cli/errors";
import { Command } from "./internal/command";
import { Option, DualOptions } from "./internal/option";
import { Argument, humanReadableArgName } from "./internal/argument";
import { Help } from "./internal/help";
import { suggestSimilar } from "./internal/suggest";

const program = new Command();
const createCommand = (name?: string) => new Command(name);
const createOption = (...args: ConstructorParameters<typeof Option>) => new Option(...args);
const createArgument = (...args: ConstructorParameters<typeof Argument>) => new Argument(...args);

export {
  program,
  Command,
  Option,
  DualOptions,
  Argument,
  Help,
  CommanderError,
  InvalidArgumentError,
  humanReadableArgName,
  suggestSimilar,
  createCommand,
  createOption,
  createArgument,
};
export default program;
```

To keep the file manageable and avoid circular imports between the command/option/argument classes, we will implement those pieces as local helper files under `src/commands/internal/` during the actual rewrite.

---

## `src/services/aws/sdk.ts`

### Module coverage
323 module IDs ranging from Smithy context factories (`Z70`, `W70`, `iTA`, `W3`, `WPA`) to credential/config providers (`UG1`, `HQ`, `uPA`, `K70`, `AjA`, `VjA`, ...). The full list is preserved in `module-groups.json` under the `services/aws` category.

### Export surface to retain
Representative exports that must exist in the rewritten SDK surface include:

- Smithy HTTP auth helpers such as `defaultBedrockHttpAuthSchemeProvider`, `defaultBedrockHttpAuthSchemeParametersProvider`, and `resolveHttpAuthSchemeConfig` (`moduleId` `OG0`).【F:module-analysis.json†L90030-L90100】
- Runtime equivalents for Bedrock, `defaultBedrockRuntimeHttpAuthSchemeProvider`, `defaultBedrockRuntimeHttpAuthSchemeParametersProvider`, and `resolveHttpAuthSchemeConfig` (`moduleId` `rU0`).【F:module-analysis.json†L156324-L156372】
- Package metadata for both clients (`moduleIds` `$gA` and `Hx2`) that expose the npm package descriptors for `@aws-sdk/client-bedrock` and `@aws-sdk/client-bedrock-runtime`.【F:module-analysis.json†L90101-L90110】【F:module-analysis.json†L156373-L156410】
- The Smithy context wiring (`moduleIds` `Z70`, `W70`, `iTA`, `W3`, `WPA`) that supply `__smithy_context` factories for downstream clients.【F:module-analysis.json†L75550-L75960】

During implementation we will audit the remaining modules to locate the generated client classes, command builders, middleware stacks, retry strategy helpers, and credential providers. Each discovered export will be mapped to a named TypeScript export.

### Planned module structure

```ts
// src/shared/aws/context.ts
export const smithyContext = createSmithyContext(/* ported from VN9, NN9, xN9 ... */);

// src/shared/aws/credentials.ts
export interface AwsCredentialProvider { /* shared types from credential helpers */ }
export const defaultCredentialChain = /* stitched from UG1, HQ, uPA, ... */;

// src/services/aws/auth.ts
import { smithyContext } from "../../shared/aws/context";
export const defaultBedrockHttpAuthSchemeProvider = /* port OG0 Wd9 */;
export const defaultBedrockHttpAuthSchemeParametersProvider = /* port OG0 Zd9 */;
export const resolveHttpAuthSchemeConfig = /* port OG0 Jd9 */;

// src/services/aws/runtime-auth.ts
export const defaultBedrockRuntimeHttpAuthSchemeProvider = /* port rU0 PB6 */;
export const defaultBedrockRuntimeHttpAuthSchemeParametersProvider = /* port rU0 RB6 */;
export const resolveRuntimeHttpAuthSchemeConfig = /* port rU0 jB6 */;

// src/services/aws/metadata.ts
export const bedrockPackage = /* port $gA.Fd9 */;
export const bedrockRuntimePackage = /* port Hx2.Bv1 */;

// src/services/aws/sdk.ts
export * from "./auth";
export * from "./runtime-auth";
export * from "./metadata";
export { smithyContext } from "../../shared/aws/context";
export { defaultCredentialChain } from "../../shared/aws/credentials";
// client and command classes will be exported here after porting the remaining modules.
```

This layered plan confines cross-cutting infrastructure (context + credentials) to `src/shared/aws`, keeping `sdk.ts` focused on public exports and orchestrating the generated client pieces. We will double-check for cycles once the credential providers are ported; if they depend back on the clients we will introduce additional leaf modules.

---

## `src/services/telemetry/opentelemetry.ts`

### Module coverage
Module IDs include `mn`, `Dx0`, `kPB`, `LjB`, `SK1`, `ugB`, `gv0`, `ov0`, `JAQ`, `RAQ`, `JA1`, `RA1`, and related registration utilities.

### Export surface to retain
Key exports observed in the analysis:

- Global registration helpers `registerGlobal`, `getGlobal`, and `unregisterGlobal` (`moduleId` `mn`).【F:module-analysis.json†L282850-L282892】
- API, tracer, and meter providers (e.g., `RAQ`, `JAQ`) that expose factories for the OpenTelemetry shim—these modules set up the no-op implementations referenced throughout the bundle.【F:module-analysis.json†L283000-L283260】
- Warning utilities that emit the `OpenTelemetry API is not available` messages (e.g., module `gv0`).【F:module-analysis.json†L284200-L284280】

### Planned module structure

```ts
// src/services/telemetry/opentelemetry.ts
import { registerGlobal, getGlobal, unregisterGlobal } from "./internal/global";
import { diag } from "./internal/diag";
import { trace, metrics, propagation, context } from "./internal/api";

export { registerGlobal, getGlobal, unregisterGlobal };
export const api = { diag, trace, metrics, propagation, context };
```

Supporting files under `src/services/telemetry/internal/` will break apart the API namespaces to avoid circular dependencies between the diag logger, tracing API, and baggage/context helpers. Shared warning strings will live alongside the diag implementation so that both the telemetry service and other features can reuse them without re-importing the full API surface.

---

## `src/services/http/axios.ts`

### Module coverage
Module IDs: `nu2`, `ru2`, `_q0`, `_L`, `Yd2`, plus supporting pieces such as `wI1` and `v21` that enrich the transport and buffer handling.

### Export surface to retain

- Package metadata pulled from the gaxios bundle (`moduleId` `nu2`) exposed via the `pkg` export (`ru2`).【F:module-analysis.json†L179756-L179856】
- `GaxiosError`, `GAXIOS_ERROR_SYMBOL`, and the `defaultErrorRedactor` exported from `_q0`.【F:module-analysis.json†L179857-L179897】
- The default `Gaxios` client instance, its constructor, and the request helper exported from `_L`.【F:module-analysis.json†L180313-L180352】
- The validation helper `validate` from `Yd2` and the `DefaultTransporter` wrapper from `wI1` that powers Google auth HTTP requests.【F:module-analysis.json†L182190-L182350】

### Planned module structure

```ts
// src/services/http/axios.ts
import { pkg } from "./internal/pkg";
import { Gaxios, GaxiosError, GAXIOS_ERROR_SYMBOL, defaultErrorRedactor } from "./internal/gaxios";
import { validate } from "./internal/validators";
import { DefaultTransporter } from "./internal/transporter";

export { pkg, Gaxios, GaxiosError, GAXIOS_ERROR_SYMBOL, defaultErrorRedactor, validate, DefaultTransporter };
export const request = (...args) => Gaxios.instance.request(...args);
```

A small shared helper under `src/shared/http/` may be necessary if both the AWS SDK and telemetry stack depend on the same UTF-8 utilities surfaced by the gaxios bundle.

---

## `src/ui/react/react.ts`

### Module coverage
Module IDs: `K1`, `P$A`.

### Export surface to retain

- Core React runtime exports such as `Children`, `Component`, `Fragment`, `Profiler`, `PureComponent`, `StrictMode`, `Suspense`, `act`, `cloneElement`, `createElement`, `createContext`, hooks (`useEffect`, `useMemo`, etc.), and JSX runtime symbols from `K1`.【F:module-analysis.json†L3893-L4230】
- The JSX runtime factory that throws helpful error messages when React is misused (`moduleId` `P$A`).【F:module-analysis.json†L44104-L44140】

### Planned module structure

```ts
// src/ui/react/react.ts
export { Children, Component, PureComponent, createElement, createContext, useState, useEffect, Suspense, Fragment, memo, forwardRef, startTransition, act } from "./runtime";
export { jsx, jsxs, Fragment as jsxFragment } from "./jsx-runtime";
```

Internally `./runtime` and `./jsx-runtime` will wrap the minimal pieces we need from the React bundle, and both will import shared error helpers from `src/shared/cli/errors.ts` where appropriate to prevent duplication.

---

## `src/ui/terminal/chalk.ts`

### Module coverage
Module IDs: `j2B`, `f2B`.

### Export surface to retain

- Template parsing logic for Chalk tagged template literals (`moduleId` `j2B`).【F:module-analysis.json†L214301-L214368】
- The Chalk factory function that produces the default export and theme helpers (`moduleId` `f2B`).【F:module-analysis.json†L214390-L214530】

### Planned module structure

```ts
// src/ui/terminal/chalk.ts
import { parseTemplate } from "./internal/template";
import { ChalkFactory, DEFAULT_THEME, toJson, fromJson } from "./internal/factory";

export { ChalkFactory as Chalk, DEFAULT_THEME, toJson, fromJson, parseTemplate };
export default new ChalkFactory();
```

If other modules need the template parser, we will expose it via `src/shared/cli/ansi.ts` to prevent repeated parsing logic.

---

## `src/utils/validation/schema.ts`

### Module coverage
37 module IDs covering AJV validators, schema loading, and error formatting (e.g. `rt`, `W50`, `I50`, `dG1`, `Ie2`, `qM0`, `RQB`, `dQB`, `iQB`, `aQB`, `rQB`, `Q9B`).

### Export surface to retain

- HTTP-related validators such as `isBlob`, `isValidStatusCode`, and `isValidUTF8` exposed by `rt`.【F:module-analysis.json†L50959-L51005】
- Core AJV factory exports from modules `W50` and `I50`, which point to the main schema compiler entry points.【F:module-analysis.json†L51009-L51340】
- Schema compilation helpers and keyword definitions from the remaining modules (e.g., `qM0`, `RQB`) that plug into AJV’s `compile` and `validate` flows.【F:module-analysis.json†L51500-L52850】

### Planned module structure

```ts
// src/utils/validation/schema.ts
export { isBlob, isValidStatusCode, isValidUTF8 } from "./internal/http";
export { createAjvInstance, compileSchema, validateSchema } from "./internal/core";
export { formats, keywords } from "./internal/keywords";
```

Shared utility files (`internal/http.ts`, `internal/core.ts`, `internal/keywords.ts`) will wrap the respective module clusters to keep the exported API minimal while still giving tests access to the lower-level helpers.

---

## Cross-cutting considerations

- **Circular dependencies:** The commander, telemetry, and AWS SDK bundles expose aggregates that depend back on lower-level helpers. By introducing `src/shared/cli/errors.ts`, `src/shared/aws/context.ts`, and `src/shared/aws/credentials.ts` we can keep re-export files like `commander.ts` and `sdk.ts` as thin façades without recursive imports.
- **Shared utilities:** UTF-8 validation (`rt`) and environment detection (numerous AWS modules) are currently duplicated across bundles. We will consolidate these into `src/shared/aws/context.ts` and, if needed, `src/shared/http/utf8.ts` once usage sites are audited.
- **Follow-up analysis:** Before implementation we will script against the cleaned `module-analysis.json` to enumerate any remaining exported names, ensuring the rewritten TypeScript keeps parity with the bundled surface.
