import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { main, RuntimeService } from '../index';
import { DEFAULT_BUNDLE_PATH } from '../modules/analyzeModules';

describe('main', () => {
  it('parses analyze command and records execution', async () => {
    const directory = mkdtempSync(join(tmpdir(), 'cc-clj-cli-'));
    const analysisPath = join(directory, 'analysis.json');
    const argv = [
      'node',
      'cc-clj',
      'analyze',
      '--bundle',
      DEFAULT_BUNDLE_PATH,
      '--output',
      analysisPath,
      '--profile',
      'dev',
      '--uppercase',
    ];

    try {
      const result = await main(argv);
      const runtime = result.services.get<RuntimeService>('runtime');

      expect(result.program.processedArgs()).toEqual(['analyze']);
      expect(runtime.executions).toHaveLength(1);
      expect(runtime.executions[0]).toMatchObject({
        command: 'analyze',
        target: analysisPath.toUpperCase(),
        options: expect.objectContaining({
          profile: 'dev',
          uppercase: true,
          output: analysisPath,
        }),
      });
      expect(runtime.executions[0].result).toMatchObject({
        outputPath: analysisPath,
      });
      expect(result.services.initializationOrder).toEqual([
        'config',
        'telemetry',
        'httpClient',
        'runtime',
      ]);
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });
});
