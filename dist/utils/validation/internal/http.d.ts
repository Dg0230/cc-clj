/**
 * HTTP validation helpers derived from bundle module `rt`.
 */
export interface BlobLike {
    readonly size: number;
    readonly type?: string;
}
export declare function isBlob(value: unknown): value is BlobLike;
export declare function isValidStatusCode(code: number): boolean;
export declare function isValidUTF8(value: string): boolean;
