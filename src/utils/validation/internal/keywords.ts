/**
 * Custom AJV keyword placeholders derived from bundle keyword modules.
 */
// TODO: Populate keyword implementations from cli-origin.js bundle.
export interface AjvKeywordDefinition {
  readonly keyword: string;
  readonly type?: string;
}

export const keywords: AjvKeywordDefinition[] = [
  { keyword: 'example' },
];

export const formats = {
  'date-time': (value: string) => !Number.isNaN(Date.parse(value)),
};
