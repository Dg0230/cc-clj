/**
 * Minimal Commander error implementations staged from bundle module `aC1`.
 *
 * The real logic will be ported from the cli-origin.js bundle; this placeholder
 * only mirrors the exported surface.
 */
// TODO(aC1): Port Commander error handling from cli-origin.js.
export class CommanderError extends Error {
  public readonly code: string;
  public readonly exitCode: number;

  constructor(code: string, exitCode: number, message: string) {
    super(message);
    this.code = code;
    this.exitCode = exitCode;
    this.name = 'CommanderError';
  }
}

export class InvalidArgumentError extends CommanderError {
  constructor(message: string) {
    super('commander.invalidArgument', 1, message);
    this.name = 'InvalidArgumentError';
  }
}
