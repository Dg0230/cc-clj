import { main, RuntimeService } from '../index';

describe('main', () => {
  it('parses analyze command and records execution', async () => {
    const argv = ['node', 'cc-clj', 'analyze', 'moduleA', '--profile', 'dev', '--uppercase'];

    const result = await main(argv);
    const runtime = result.services.get<RuntimeService>('runtime');

    expect(result.program.processedArgs()).toEqual(['analyze', 'moduleA']);
    expect(runtime.executions).toHaveLength(1);
    expect(runtime.executions[0]).toMatchObject({
      command: 'analyze',
      target: 'MODULEA',
      options: expect.objectContaining({
        profile: 'dev',
        uppercase: true,
        target: 'moduleA',
      }),
    });
    expect(result.services.initializationOrder).toEqual([
      'config',
      'telemetry',
      'httpClient',
      'runtime',
    ]);
  });
});
