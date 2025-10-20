import { isValidUTF8 as sharedIsValidUTF8 } from '../../../shared/http/utf8';

/**
 * HTTP validation helpers derived from bundle module `rt`.
 */
// TODO: Replace placeholder validators with cli-origin.js implementations.
export interface BlobLike {
  readonly size: number;
  readonly type?: string;
}

export function isBlob(value: unknown): value is BlobLike {
  return typeof value === 'object' && value !== null && 'size' in (value as Record<string, unknown>);
}

export function isValidStatusCode(code: number): boolean {
  return Number.isInteger(code) && code >= 100 && code <= 599;
}

export function isValidUTF8(value: string): boolean {
  return sharedIsValidUTF8(value);
}
