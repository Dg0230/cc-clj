import { readFileSync, writeFileSync } from 'node:fs';

export function readTextFile(path: string): string {
  return readFileSync(path, 'utf8');
}

export function writeTextFile(path: string, contents: string): void {
  writeFileSync(path, contents, 'utf8');
}

export function readJsonFile<T>(path: string): T {
  const text = readTextFile(path);
  return JSON.parse(text) as T;
}

export function writeJsonFile(path: string, value: unknown): void {
  const text = JSON.stringify(value, null, 2);
  writeTextFile(path, `${text}\n`);
}
