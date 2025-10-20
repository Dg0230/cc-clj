import { pkg } from './internal/pkg';
import { Gaxios, GaxiosError, GAXIOS_ERROR_SYMBOL, defaultErrorRedactor } from './internal/gaxios';
import { validate } from './internal/validators';
import { DefaultTransporter } from './internal/transporter';

/**
 * Gaxios facade aligning with bundle exports.
 */
// TODO: Ensure exports match cli-origin.js HTTP modules.
export { pkg, Gaxios, GaxiosError, GAXIOS_ERROR_SYMBOL, defaultErrorRedactor, validate, DefaultTransporter };

export function request<T = unknown>(options: Parameters<Gaxios['request']>[0]): Promise<T> {
  return Gaxios.instance.request<T>(options);
}
