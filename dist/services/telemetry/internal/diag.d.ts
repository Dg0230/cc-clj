/**
 * Minimal diagnostic logger placeholder for OpenTelemetry shim.
 */
export interface DiagLogger {
    warn(message: string): void;
    error(message: string): void;
    debug(message: string): void;
}
export declare const diag: DiagLogger;
