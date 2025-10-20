import { parseTemplate } from './internal/template';
import { ChalkFactory, DEFAULT_THEME, toJson, fromJson } from './internal/factory';
/**
 * Chalk facade aligning with bundle exports.
 */
export { ChalkFactory as Chalk, DEFAULT_THEME, toJson, fromJson, parseTemplate };
declare const chalk: ChalkFactory;
export default chalk;
