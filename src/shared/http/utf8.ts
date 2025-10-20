/**
 * UTF-8 validation helpers shared across HTTP modules.
 */
// TODO: Port UTF-8 validation logic from bundle module `rt`.
export function isValidUTF8(input: string): boolean {
  try {
    decodeURIComponent(escape(input));
    return true;
  } catch (error) {
    return false;
  }
}
