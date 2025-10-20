import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync, SpawnSyncReturns } from 'node:child_process';

type UseCase = {
  readonly name: string;
  readonly command: readonly string[];
  readonly inputs?: readonly { flag: string; baseline: string }[];
  readonly outputs?: readonly { flag: string; baseline: string }[];
  readonly expectedStdout?: string;
  readonly expectedStderr?: string;
};

const useCases: UseCase[] = require('../../../tests/cli/useCases.json');

const repoRoot = path.resolve(__dirname, '..', '..', '..');
const newCliPath = path.join(repoRoot, 'dist', 'index.js');

function runCli(args: readonly string[]): SpawnSyncReturns<string> {
  const result = spawnSync('node', [newCliPath, ...args], {
    cwd: repoRoot,
    env: { ...process.env, NODE_NO_WARNINGS: '1' },
    encoding: 'utf8',
  });
  if (result.error) {
    throw result.error;
  }
  return result;
}

describe('cc-clj CLI parity with legacy outputs', () => {
  for (const useCase of useCases) {
    it(`${useCase.name} matches legacy expectations`, () => {
      const tempDir = mkdtempSync(path.join(tmpdir(), `${useCase.name}-`));
      const args: string[] = [...useCase.command];

      for (const input of useCase.inputs ?? []) {
        const baselinePath = path.join(repoRoot, input.baseline);
        args.push(input.flag, baselinePath);
      }

      const outputComparisons: Array<{ generated: string; baseline: string }> = [];
      for (const output of useCase.outputs ?? []) {
        const baselinePath = path.join(repoRoot, output.baseline);
        const targetPath = path.join(tempDir, path.basename(output.baseline));
        args.push(output.flag, targetPath);
        outputComparisons.push({ generated: targetPath, baseline: baselinePath });
      }

      const result = runCli(args);

      expect(result.status).toBe(0);
      if (useCase.expectedStdout !== undefined) {
        expect(result.stdout).toBe(useCase.expectedStdout);
      }
      if (useCase.expectedStderr !== undefined) {
        expect(result.stderr).toBe(useCase.expectedStderr);
      }

      for (const comparison of outputComparisons) {
        const generated = readFileSync(comparison.generated, 'utf8');
        const baseline = readFileSync(comparison.baseline, 'utf8');
        if (comparison.generated.endsWith('.json')) {
          expect(JSON.parse(generated)).toEqual(JSON.parse(baseline));
        } else {
          expect(generated).toEqual(baseline);
        }
      }

      rmSync(tempDir, { recursive: true, force: true });
    });
  }
});
