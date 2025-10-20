/**
 * Package metadata placeholders exported by the AWS SDK facade.
 */
export interface PackageMetadata {
    readonly name: string;
    readonly version: string;
    readonly description?: string;
}
export declare const bedrockPackage: PackageMetadata;
export declare const bedrockRuntimePackage: PackageMetadata;
