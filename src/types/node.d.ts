declare module 'node:path' {
  export function join(...parts: string[]): string;
}

declare module 'node:fs' {
  export function readFileSync(path: string, encoding: 'utf8'): string;
  export function writeFileSync(path: string, data: string, encoding?: 'utf8'): void;
}

declare const __dirname: string;
