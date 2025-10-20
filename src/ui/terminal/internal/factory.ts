import { TemplateChunk } from './template';

/**
 * Chalk factory placeholder derived from bundle module `f2B`.
 */
// TODO: Port Chalk styling logic from cli-origin.js bundle.
export interface ChalkTheme {
  readonly enabled: boolean;
}

export const DEFAULT_THEME: ChalkTheme = { enabled: true };

export class ChalkFactory {
  constructor(private readonly theme: ChalkTheme = DEFAULT_THEME) {}

  public template(template: TemplateStringsArray, ...substitutions: unknown[]): TemplateChunk[] {
    return template.raw ? [{ text: template.raw.join('') }] : substitutions.map((value) => ({ text: String(value) }));
  }

  public withTheme(theme: ChalkTheme): ChalkFactory {
    return new ChalkFactory(theme);
  }
}

export function toJson(theme: ChalkTheme): string {
  return JSON.stringify(theme);
}

export function fromJson(serialized: string): ChalkTheme {
  try {
    return JSON.parse(serialized) as ChalkTheme;
  } catch (error) {
    return DEFAULT_THEME;
  }
}
