/**
 * Shared AWS credential provider contracts used across the SDK facade.
 */
// TODO: Replace placeholder credentials with real implementations from cli-origin.js.
export interface AwsCredentials {
  readonly accessKeyId: string;
  readonly secretAccessKey: string;
  readonly sessionToken?: string;
}

export type AwsCredentialProvider = () => Promise<AwsCredentials>;

export const defaultCredentialChain: AwsCredentialProvider = async () => {
  throw new Error('AWS credential chain not yet implemented.');
};
