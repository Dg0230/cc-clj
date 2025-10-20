/**
 * Request validation helpers inspired by gaxios bundle module `Yd2`.
 */
// TODO: Port HTTP validation rules from cli-origin.js bundle.
export function validate(url: string): void {
  if (!/^https?:\/\//.test(url)) {
    throw new Error(`Invalid URL: ${url}`);
  }
}
