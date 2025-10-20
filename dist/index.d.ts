#!/usr/bin/env node
import { Command } from './commands/commander';
export interface ExecutionRecord {
    command: string;
    target: string;
    options: {
        profile: string;
        uppercase: boolean;
    } & Record<string, unknown>;
}
export interface AppConfiguration {
    readonly defaultProfile: string;
    readonly defaultTarget: string;
    readonly telemetryEnabled: boolean;
    readonly endpoint: string;
}
export declare class ConfigurationService implements AppConfiguration {
    readonly defaultProfile: string;
    readonly defaultTarget: string;
    readonly telemetryEnabled: boolean;
    readonly endpoint: string;
    constructor();
}
export declare class TelemetryService {
    private readonly config;
    readonly events: string[];
    constructor(config: AppConfiguration);
    log(event: string): void;
}
export interface HttpRequestRecord {
    readonly url: string;
    readonly payload: unknown;
}
export declare class HttpClientService {
    private readonly config;
    readonly requests: HttpRequestRecord[];
    constructor(config: AppConfiguration);
    send(command: string, payload: unknown): void;
}
export declare class RuntimeService {
    private readonly telemetry;
    private readonly httpClient;
    readonly executions: ExecutionRecord[];
    constructor(telemetry: TelemetryService, httpClient: HttpClientService);
    record(execution: ExecutionRecord): void;
}
type ServiceFactory<T> = (container: ServiceContainer) => T | Promise<T>;
interface ServiceDefinition<T = unknown> {
    readonly name: string;
    readonly dependsOn?: readonly string[];
    readonly factory: ServiceFactory<T>;
}
export declare class ServiceContainer {
    private readonly definitions;
    private readonly order;
    private readonly services;
    private readonly initializing;
    private readonly _initializationOrder;
    constructor(definitions: readonly ServiceDefinition[]);
    initializeAll(): Promise<void>;
    resolve<T = unknown>(name: string): Promise<T>;
    get<T = unknown>(name: string): T;
    get initializationOrder(): readonly string[];
}
export interface MainResult {
    program: Command;
    services: ServiceContainer;
}
export declare function bootstrapServices(): Promise<ServiceContainer>;
export declare function main(argv?: readonly string[]): Promise<MainResult>;
export {};
