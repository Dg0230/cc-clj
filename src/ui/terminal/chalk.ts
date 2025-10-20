import { parseTemplate } from './internal/template';
import { ChalkFactory, DEFAULT_THEME, toJson, fromJson } from './internal/factory';

/**
 * Chalk facade aligning with bundle exports.
 */
// TODO: Ensure export surface matches cli-origin.js terminal styling modules.
export { ChalkFactory as Chalk, DEFAULT_THEME, toJson, fromJson, parseTemplate };

const chalk = new ChalkFactory();
export default chalk;
