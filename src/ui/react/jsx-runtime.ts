import { Fragment, createElement } from './runtime';

/**
 * JSX runtime placeholder for compatibility with automatic JSX runtime.
 */
// TODO: Align JSX runtime with actual React implementation once ported.
export { Fragment };

export function jsx(type: unknown, props: Record<string, unknown>, key?: string): unknown {
  return createElement(type, { ...props, key }, props.children);
}

export function jsxs(type: unknown, props: Record<string, unknown>, key?: string): unknown {
  return createElement(type, { ...props, key }, props.children);
}
