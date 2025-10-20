/**
 * Chalk template parsing placeholder derived from bundle module `j2B`.
 */
// TODO: Replace with real Chalk template parser from cli-origin.js bundle.
export interface TemplateChunk {
  readonly text: string;
}

export function parseTemplate(template: TemplateStringsArray, ...substitutions: unknown[]): TemplateChunk[] {
  const parts: TemplateChunk[] = [];
  template.forEach((segment, index) => {
    parts.push({ text: segment });
    if (index < substitutions.length) {
      parts.push({ text: String(substitutions[index]) });
    }
  });
  return parts;
}
