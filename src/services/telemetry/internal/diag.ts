/**
 * Minimal diagnostic logger placeholder for OpenTelemetry shim.
 */
// TODO: Implement diagnostic logging consistent with cli-origin.js behaviour.
export interface DiagLogger {
  warn(message: string): void;
  error(message: string): void;
  debug(message: string): void;
}

class NoopDiagLogger implements DiagLogger {
  warn(message: string): void {
    console.warn(message);
  }

  error(message: string): void {
    console.error(message);
  }

  debug(message: string): void {
    console.debug(message);
  }
}

export const diag: DiagLogger = new NoopDiagLogger();
