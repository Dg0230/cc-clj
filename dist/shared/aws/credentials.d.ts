/**
 * Shared AWS credential provider contracts used across the SDK facade.
 */
export interface AwsCredentials {
    readonly accessKeyId: string;
    readonly secretAccessKey: string;
    readonly sessionToken?: string;
}
export type AwsCredentialProvider = () => Promise<AwsCredentials>;
export declare const defaultCredentialChain: AwsCredentialProvider;
