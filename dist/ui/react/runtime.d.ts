/**
 * Minimal React runtime placeholder exposing commonly used helpers.
 */
export interface ReactElement<P = Record<string, unknown>> {
    readonly type: unknown;
    readonly props: P & {
        readonly children?: unknown;
    };
    readonly key: string | number | null;
}
export declare class Component<P = Record<string, unknown>, S = Record<string, unknown>> {
    props: P;
    state: S;
    constructor(props: P);
    setState(_: Partial<S>): void;
}
export declare class PureComponent<P = Record<string, unknown>, S = Record<string, unknown>> extends Component<P, S> {
}
export declare const Fragment: unique symbol;
export declare const StrictMode: unique symbol;
export declare const Suspense: unique symbol;
export declare const Profiler: unique symbol;
export declare const Children: {
    toArray(children: unknown): unknown[];
};
export declare function createElement<P = Record<string, unknown>>(type: unknown, props: P | null, ...children: unknown[]): ReactElement<P>;
export declare const cloneElement: typeof createElement;
export declare const createContext: <T>(defaultValue: T) => {
    defaultValue: T;
};
export declare const forwardRef: <T>(component: T) => T;
export declare const memo: <T>(component: T) => T;
export declare const startTransition: (callback: () => void) => void;
export declare const act: (callback: () => unknown) => Promise<void>;
export declare const useState: <T>(initial: T) => [T, (value: T) => void];
export declare const useEffect: (_effect: () => void | (() => void), _deps?: unknown[]) => void;
export declare const useMemo: <T>(factory: () => T, _deps: unknown[]) => T;
export declare const useRef: <T>(value: T) => {
    current: T;
};
export declare const useCallback: <T extends (...args: never[]) => unknown>(fn: T, _deps: unknown[]) => T;
export declare const useContext: <T>(context: {
    defaultValue: T;
}) => T;
export declare const useReducer: <S, A>(reducer: (state: S, action: A) => S, initialState: S) => [S, (action: A) => void];
