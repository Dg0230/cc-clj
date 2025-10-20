/**
 * Package metadata placeholders exported by the AWS SDK facade.
 */
// TODO: Replace package metadata with values sourced from cli-origin.js bundles.
export interface PackageMetadata {
  readonly name: string;
  readonly version: string;
  readonly description?: string;
}

export const bedrockPackage: PackageMetadata = {
  name: '@aws-sdk/client-bedrock',
  version: '0.0.0-placeholder',
};

export const bedrockRuntimePackage: PackageMetadata = {
  name: '@aws-sdk/client-bedrock-runtime',
  version: '0.0.0-placeholder',
};
