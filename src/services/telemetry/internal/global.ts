/**
 * Global registration helpers mirroring OpenTelemetry shim behaviour.
 */
// TODO(mn): Port OpenTelemetry global registration from cli-origin.js.
const globals = new Map<string, unknown>();

export function registerGlobal<T>(name: string, value: T): void {
  globals.set(name, value);
}

export function getGlobal<T>(name: string): T | undefined {
  return globals.get(name) as T | undefined;
}

export function unregisterGlobal(name: string): void {
  globals.delete(name);
}
