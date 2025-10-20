import { registerGlobal, getGlobal, unregisterGlobal } from './internal/global';
import { diag } from './internal/diag';
import { trace, metrics, propagation, context } from './internal/api';

/**
 * OpenTelemetry shim facade aligning with bundle exports.
 */
// TODO: Ensure export surface matches cli-origin.js telemetry modules.
export { registerGlobal, getGlobal, unregisterGlobal };
export const api = { diag, trace, metrics, propagation, context };
