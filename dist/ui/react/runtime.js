"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useReducer = exports.useContext = exports.useCallback = exports.useRef = exports.useMemo = exports.useEffect = exports.useState = exports.act = exports.startTransition = exports.memo = exports.forwardRef = exports.createContext = exports.cloneElement = exports.Children = exports.Profiler = exports.Suspense = exports.StrictMode = exports.Fragment = exports.PureComponent = exports.Component = void 0;
exports.createElement = createElement;
class Component {
    constructor(props) {
        this.state = {};
        this.props = props;
    }
    // eslint-disable-next-line class-methods-use-this
    setState(_) {
        throw new Error('setState is not implemented in the placeholder runtime.');
    }
}
exports.Component = Component;
class PureComponent extends Component {
}
exports.PureComponent = PureComponent;
exports.Fragment = Symbol('Fragment');
exports.StrictMode = Symbol('StrictMode');
exports.Suspense = Symbol('Suspense');
exports.Profiler = Symbol('Profiler');
exports.Children = {
    toArray(children) {
        if (Array.isArray(children)) {
            return children;
        }
        if (children === undefined || children === null) {
            return [];
        }
        return [children];
    },
};
function createElement(type, props, ...children) {
    var _a;
    const normalizedProps = { ...(props !== null && props !== void 0 ? props : {}), children: children.length > 1 ? children : children[0] };
    return {
        type,
        props: normalizedProps,
        key: (_a = props === null || props === void 0 ? void 0 : props.key) !== null && _a !== void 0 ? _a : null,
    };
}
exports.cloneElement = createElement;
const createContext = (defaultValue) => ({ defaultValue });
exports.createContext = createContext;
const forwardRef = (component) => component;
exports.forwardRef = forwardRef;
const memo = (component) => component;
exports.memo = memo;
const startTransition = (callback) => callback();
exports.startTransition = startTransition;
const act = async (callback) => {
    await callback();
};
exports.act = act;
const useState = (initial) => {
    let state = initial;
    return [state, (value) => {
            state = value;
        }];
};
exports.useState = useState;
const useEffect = (_effect, _deps) => { };
exports.useEffect = useEffect;
const useMemo = (factory, _deps) => factory();
exports.useMemo = useMemo;
const useRef = (value) => ({ current: value });
exports.useRef = useRef;
const useCallback = (fn, _deps) => fn;
exports.useCallback = useCallback;
const useContext = (context) => context.defaultValue;
exports.useContext = useContext;
const useReducer = (reducer, initialState) => {
    let state = initialState;
    return [state, (action) => {
            state = reducer(state, action);
        }];
};
exports.useReducer = useReducer;
