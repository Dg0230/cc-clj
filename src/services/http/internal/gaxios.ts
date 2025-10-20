/**
 * Minimal gaxios client placeholder.
 */
// TODO: Port gaxios HTTP client behaviour from cli-origin.js bundle.
export interface GaxiosOptions {
  readonly url: string;
  readonly method?: string;
  readonly data?: unknown;
}

export const GAXIOS_ERROR_SYMBOL = Symbol('GaxiosError');

export class GaxiosError extends Error {
  public readonly config: GaxiosOptions;

  public readonly [GAXIOS_ERROR_SYMBOL] = true;

  constructor(message: string, config: GaxiosOptions) {
    super(message);
    this.config = config;
    this.name = 'GaxiosError';
  }
}

export function defaultErrorRedactor(error: unknown): unknown {
  return error;
}

export class Gaxios {
  public static readonly instance = new Gaxios();

  public async request<T = unknown>(options: GaxiosOptions): Promise<T> {
    throw new GaxiosError(`HTTP requests not implemented.`, options);
  }
}
