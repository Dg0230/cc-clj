import { pkg } from './internal/pkg';
import { Gaxios, GaxiosError, GAXIOS_ERROR_SYMBOL, defaultErrorRedactor } from './internal/gaxios';
import { validate } from './internal/validators';
import { DefaultTransporter } from './internal/transporter';
/**
 * Gaxios facade aligning with bundle exports.
 */
export { pkg, Gaxios, GaxiosError, GAXIOS_ERROR_SYMBOL, defaultErrorRedactor, validate, DefaultTransporter };
export declare function request<T = unknown>(options: Parameters<Gaxios['request']>[0]): Promise<T>;
