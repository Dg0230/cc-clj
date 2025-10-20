import { Gaxios, GaxiosOptions } from './gaxios';

/**
 * Default transporter placeholder similar to Google auth client.
 */
// TODO: Port transporter behaviour from cli-origin.js bundle.
export class DefaultTransporter {
  constructor(private readonly client: Gaxios = Gaxios.instance) {}

  public async request<T = unknown>(options: GaxiosOptions): Promise<T> {
    return this.client.request<T>(options);
  }
}
