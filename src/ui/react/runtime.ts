/**
 * Minimal React runtime placeholder exposing commonly used helpers.
 */
// TODO: Replace with real React exports once the bundle is fully ported.
export interface ReactElement<P = Record<string, unknown>> {
  readonly type: unknown;
  readonly props: P & { readonly children?: unknown };
  readonly key: string | number | null;
}

export class Component<P = Record<string, unknown>, S = Record<string, unknown>> {
  public props: P;
  public state: S = {} as S;

  constructor(props: P) {
    this.props = props;
  }

  // eslint-disable-next-line class-methods-use-this
  public setState(_: Partial<S>): void {
    throw new Error('setState is not implemented in the placeholder runtime.');
  }
}

export class PureComponent<P = Record<string, unknown>, S = Record<string, unknown>> extends Component<P, S> {}

export const Fragment = Symbol('Fragment');
export const StrictMode = Symbol('StrictMode');
export const Suspense = Symbol('Suspense');
export const Profiler = Symbol('Profiler');

export const Children = {
  toArray(children: unknown): unknown[] {
    if (Array.isArray(children)) {
      return children;
    }
    if (children === undefined || children === null) {
      return [];
    }
    return [children];
  },
};

export function createElement<P = Record<string, unknown>>(type: unknown, props: P | null, ...children: unknown[]): ReactElement<P> {
  const normalizedProps = { ...(props ?? ({} as P)), children: children.length > 1 ? children : children[0] } as P & {
    readonly children?: unknown;
  };
  return {
    type,
    props: normalizedProps,
    key: (props as { key?: string | number } | null)?.key ?? null,
  };
}

export const cloneElement = createElement;
export const createContext = <T,>(defaultValue: T) => ({ defaultValue });
export const forwardRef = <T,>(component: T): T => component;
export const memo = <T,>(component: T): T => component;
export const startTransition = (callback: () => void): void => callback();
export const act = async (callback: () => unknown): Promise<void> => {
  await callback();
};
export const useState = <T,>(initial: T): [T, (value: T) => void] => {
  let state = initial;
  return [state, (value: T) => {
    state = value;
  }];
};
export const useEffect = (_effect: () => void | (() => void), _deps?: unknown[]): void => {};
export const useMemo = <T,>(factory: () => T, _deps: unknown[]): T => factory();
export const useRef = <T,>(value: T) => ({ current: value });
export const useCallback = <T extends (...args: never[]) => unknown>(fn: T, _deps: unknown[]): T => fn;
export const useContext = <T,>(context: { defaultValue: T }): T => context.defaultValue;
export const useReducer = <S, A>(reducer: (state: S, action: A) => S, initialState: S): [S, (action: A) => void] => {
  let state = initialState;
  return [state, (action: A) => {
    state = reducer(state, action);
  }];
};
