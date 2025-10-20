import { Gaxios, GaxiosOptions } from './gaxios';
/**
 * Default transporter placeholder similar to Google auth client.
 */
export declare class DefaultTransporter {
    private readonly client;
    constructor(client?: Gaxios);
    request<T = unknown>(options: GaxiosOptions): Promise<T>;
}
