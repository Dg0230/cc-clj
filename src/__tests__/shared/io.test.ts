import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { readJsonFile, readTextFile, writeJsonFile, writeTextFile } from '../../shared/io';

describe('shared io utilities', () => {
  const directory = mkdtempSync(join(tmpdir(), 'cc-clj-io-'));

  afterAll(() => {
    rmSync(directory, { recursive: true, force: true });
  });

  it('reads and writes text files with utf8 encoding', () => {
    const file = join(directory, 'text.txt');
    writeTextFile(file, 'example');
    expect(readTextFile(file)).toBe('example');
  });

  it('reads and writes JSON files', () => {
    const file = join(directory, 'data.json');
    writeJsonFile(file, { value: 42 });
    expect(readJsonFile<{ value: number }>(file)).toEqual({ value: 42 });
  });
});
