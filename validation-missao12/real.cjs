"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/.pnpm/@tanstack+react-query@5.104.1_react@19.1.0/node_modules/@tanstack/react-query/build/legacy/rolldown-runtime-VH7oDXx4.cjs
var require_rolldown_runtime_VH7oDXx4 = __commonJS({
  "node_modules/.pnpm/@tanstack+react-query@5.104.1_react@19.1.0/node_modules/@tanstack/react-query/build/legacy/rolldown-runtime-VH7oDXx4.cjs"(exports2) {
    var __create2 = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __getProtoOf2 = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __copyProps2 = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames2(from), i = 0, n = keys.length, key; i < n; i++) {
        key = keys[i];
        if (!__hasOwnProp2.call(to, key) && key !== except) __defProp2(to, key, {
          get: ((k) => from[k]).bind(null, key),
          enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable
        });
      }
      return to;
    };
    var __toESM2 = (mod, isNodeMode, target) => (target = mod != null ? __create2(__getProtoOf2(mod)) : {}, __copyProps2(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp2.call(mod, "default") ? __defProp2(target, "default", {
      value: mod,
      enumerable: true
    }) : target, mod));
    Object.defineProperty(exports2, "__toESM", {
      enumerable: true,
      get: function() {
        return __toESM2;
      }
    });
  }
});

// node_modules/.pnpm/react@19.1.0/node_modules/react/cjs/react.production.js
var require_react_production = __commonJS({
  "node_modules/.pnpm/react@19.1.0/node_modules/react/cjs/react.production.js"(exports2) {
    "use strict";
    var REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element");
    var REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal");
    var REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment");
    var REACT_STRICT_MODE_TYPE = /* @__PURE__ */ Symbol.for("react.strict_mode");
    var REACT_PROFILER_TYPE = /* @__PURE__ */ Symbol.for("react.profiler");
    var REACT_CONSUMER_TYPE = /* @__PURE__ */ Symbol.for("react.consumer");
    var REACT_CONTEXT_TYPE = /* @__PURE__ */ Symbol.for("react.context");
    var REACT_FORWARD_REF_TYPE = /* @__PURE__ */ Symbol.for("react.forward_ref");
    var REACT_SUSPENSE_TYPE = /* @__PURE__ */ Symbol.for("react.suspense");
    var REACT_MEMO_TYPE = /* @__PURE__ */ Symbol.for("react.memo");
    var REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy");
    var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
    function getIteratorFn(maybeIterable) {
      if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
      maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
      return "function" === typeof maybeIterable ? maybeIterable : null;
    }
    var ReactNoopUpdateQueue = {
      isMounted: function() {
        return false;
      },
      enqueueForceUpdate: function() {
      },
      enqueueReplaceState: function() {
      },
      enqueueSetState: function() {
      }
    };
    var assign = Object.assign;
    var emptyObject = {};
    function Component(props, context, updater) {
      this.props = props;
      this.context = context;
      this.refs = emptyObject;
      this.updater = updater || ReactNoopUpdateQueue;
    }
    Component.prototype.isReactComponent = {};
    Component.prototype.setState = function(partialState, callback) {
      if ("object" !== typeof partialState && "function" !== typeof partialState && null != partialState)
        throw Error(
          "takes an object of state variables to update or a function which returns an object of state variables."
        );
      this.updater.enqueueSetState(this, partialState, callback, "setState");
    };
    Component.prototype.forceUpdate = function(callback) {
      this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
    };
    function ComponentDummy() {
    }
    ComponentDummy.prototype = Component.prototype;
    function PureComponent(props, context, updater) {
      this.props = props;
      this.context = context;
      this.refs = emptyObject;
      this.updater = updater || ReactNoopUpdateQueue;
    }
    var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
    pureComponentPrototype.constructor = PureComponent;
    assign(pureComponentPrototype, Component.prototype);
    pureComponentPrototype.isPureReactComponent = true;
    var isArrayImpl = Array.isArray;
    var ReactSharedInternals = { H: null, A: null, T: null, S: null, V: null };
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    function ReactElement(type, key, self, source, owner, props) {
      self = props.ref;
      return {
        $$typeof: REACT_ELEMENT_TYPE,
        type,
        key,
        ref: void 0 !== self ? self : null,
        props
      };
    }
    function cloneAndReplaceKey(oldElement, newKey) {
      return ReactElement(
        oldElement.type,
        newKey,
        void 0,
        void 0,
        void 0,
        oldElement.props
      );
    }
    function isValidElement(object) {
      return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    function escape(key) {
      var escaperLookup = { "=": "=0", ":": "=2" };
      return "$" + key.replace(/[=:]/g, function(match) {
        return escaperLookup[match];
      });
    }
    var userProvidedKeyEscapeRegex = /\/+/g;
    function getElementKey(element, index) {
      return "object" === typeof element && null !== element && null != element.key ? escape("" + element.key) : index.toString(36);
    }
    function noop$1() {
    }
    function resolveThenable(thenable) {
      switch (thenable.status) {
        case "fulfilled":
          return thenable.value;
        case "rejected":
          throw thenable.reason;
        default:
          switch ("string" === typeof thenable.status ? thenable.then(noop$1, noop$1) : (thenable.status = "pending", thenable.then(
            function(fulfilledValue) {
              "pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
            },
            function(error) {
              "pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
            }
          )), thenable.status) {
            case "fulfilled":
              return thenable.value;
            case "rejected":
              throw thenable.reason;
          }
      }
      throw thenable;
    }
    function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
      var type = typeof children;
      if ("undefined" === type || "boolean" === type) children = null;
      var invokeCallback = false;
      if (null === children) invokeCallback = true;
      else
        switch (type) {
          case "bigint":
          case "string":
          case "number":
            invokeCallback = true;
            break;
          case "object":
            switch (children.$$typeof) {
              case REACT_ELEMENT_TYPE:
              case REACT_PORTAL_TYPE:
                invokeCallback = true;
                break;
              case REACT_LAZY_TYPE:
                return invokeCallback = children._init, mapIntoArray(
                  invokeCallback(children._payload),
                  array,
                  escapedPrefix,
                  nameSoFar,
                  callback
                );
            }
        }
      if (invokeCallback)
        return callback = callback(children), invokeCallback = "" === nameSoFar ? "." + getElementKey(children, 0) : nameSoFar, isArrayImpl(callback) ? (escapedPrefix = "", null != invokeCallback && (escapedPrefix = invokeCallback.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c) {
          return c;
        })) : null != callback && (isValidElement(callback) && (callback = cloneAndReplaceKey(
          callback,
          escapedPrefix + (null == callback.key || children && children.key === callback.key ? "" : ("" + callback.key).replace(
            userProvidedKeyEscapeRegex,
            "$&/"
          ) + "/") + invokeCallback
        )), array.push(callback)), 1;
      invokeCallback = 0;
      var nextNamePrefix = "" === nameSoFar ? "." : nameSoFar + ":";
      if (isArrayImpl(children))
        for (var i = 0; i < children.length; i++)
          nameSoFar = children[i], type = nextNamePrefix + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(
            nameSoFar,
            array,
            escapedPrefix,
            type,
            callback
          );
      else if (i = getIteratorFn(children), "function" === typeof i)
        for (children = i.call(children), i = 0; !(nameSoFar = children.next()).done; )
          nameSoFar = nameSoFar.value, type = nextNamePrefix + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(
            nameSoFar,
            array,
            escapedPrefix,
            type,
            callback
          );
      else if ("object" === type) {
        if ("function" === typeof children.then)
          return mapIntoArray(
            resolveThenable(children),
            array,
            escapedPrefix,
            nameSoFar,
            callback
          );
        array = String(children);
        throw Error(
          "Objects are not valid as a React child (found: " + ("[object Object]" === array ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead."
        );
      }
      return invokeCallback;
    }
    function mapChildren(children, func, context) {
      if (null == children) return children;
      var result = [], count = 0;
      mapIntoArray(children, result, "", "", function(child) {
        return func.call(context, child, count++);
      });
      return result;
    }
    function lazyInitializer(payload) {
      if (-1 === payload._status) {
        var ctor = payload._result;
        ctor = ctor();
        ctor.then(
          function(moduleObject) {
            if (0 === payload._status || -1 === payload._status)
              payload._status = 1, payload._result = moduleObject;
          },
          function(error) {
            if (0 === payload._status || -1 === payload._status)
              payload._status = 2, payload._result = error;
          }
        );
        -1 === payload._status && (payload._status = 0, payload._result = ctor);
      }
      if (1 === payload._status) return payload._result.default;
      throw payload._result;
    }
    var reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
      if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
        var event = new window.ErrorEvent("error", {
          bubbles: true,
          cancelable: true,
          message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
          error
        });
        if (!window.dispatchEvent(event)) return;
      } else if ("object" === typeof process && "function" === typeof process.emit) {
        process.emit("uncaughtException", error);
        return;
      }
      console.error(error);
    };
    function noop() {
    }
    exports2.Children = {
      map: mapChildren,
      forEach: function(children, forEachFunc, forEachContext) {
        mapChildren(
          children,
          function() {
            forEachFunc.apply(this, arguments);
          },
          forEachContext
        );
      },
      count: function(children) {
        var n = 0;
        mapChildren(children, function() {
          n++;
        });
        return n;
      },
      toArray: function(children) {
        return mapChildren(children, function(child) {
          return child;
        }) || [];
      },
      only: function(children) {
        if (!isValidElement(children))
          throw Error(
            "React.Children.only expected to receive a single React element child."
          );
        return children;
      }
    };
    exports2.Component = Component;
    exports2.Fragment = REACT_FRAGMENT_TYPE;
    exports2.Profiler = REACT_PROFILER_TYPE;
    exports2.PureComponent = PureComponent;
    exports2.StrictMode = REACT_STRICT_MODE_TYPE;
    exports2.Suspense = REACT_SUSPENSE_TYPE;
    exports2.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals;
    exports2.__COMPILER_RUNTIME = {
      __proto__: null,
      c: function(size) {
        return ReactSharedInternals.H.useMemoCache(size);
      }
    };
    exports2.cache = function(fn) {
      return function() {
        return fn.apply(null, arguments);
      };
    };
    exports2.cloneElement = function(element, config, children) {
      if (null === element || void 0 === element)
        throw Error(
          "The argument must be a React element, but you passed " + element + "."
        );
      var props = assign({}, element.props), key = element.key, owner = void 0;
      if (null != config)
        for (propName in void 0 !== config.ref && (owner = void 0), void 0 !== config.key && (key = "" + config.key), config)
          !hasOwnProperty.call(config, propName) || "key" === propName || "__self" === propName || "__source" === propName || "ref" === propName && void 0 === config.ref || (props[propName] = config[propName]);
      var propName = arguments.length - 2;
      if (1 === propName) props.children = children;
      else if (1 < propName) {
        for (var childArray = Array(propName), i = 0; i < propName; i++)
          childArray[i] = arguments[i + 2];
        props.children = childArray;
      }
      return ReactElement(element.type, key, void 0, void 0, owner, props);
    };
    exports2.createContext = function(defaultValue) {
      defaultValue = {
        $$typeof: REACT_CONTEXT_TYPE,
        _currentValue: defaultValue,
        _currentValue2: defaultValue,
        _threadCount: 0,
        Provider: null,
        Consumer: null
      };
      defaultValue.Provider = defaultValue;
      defaultValue.Consumer = {
        $$typeof: REACT_CONSUMER_TYPE,
        _context: defaultValue
      };
      return defaultValue;
    };
    exports2.createElement = function(type, config, children) {
      var propName, props = {}, key = null;
      if (null != config)
        for (propName in void 0 !== config.key && (key = "" + config.key), config)
          hasOwnProperty.call(config, propName) && "key" !== propName && "__self" !== propName && "__source" !== propName && (props[propName] = config[propName]);
      var childrenLength = arguments.length - 2;
      if (1 === childrenLength) props.children = children;
      else if (1 < childrenLength) {
        for (var childArray = Array(childrenLength), i = 0; i < childrenLength; i++)
          childArray[i] = arguments[i + 2];
        props.children = childArray;
      }
      if (type && type.defaultProps)
        for (propName in childrenLength = type.defaultProps, childrenLength)
          void 0 === props[propName] && (props[propName] = childrenLength[propName]);
      return ReactElement(type, key, void 0, void 0, null, props);
    };
    exports2.createRef = function() {
      return { current: null };
    };
    exports2.forwardRef = function(render) {
      return { $$typeof: REACT_FORWARD_REF_TYPE, render };
    };
    exports2.isValidElement = isValidElement;
    exports2.lazy = function(ctor) {
      return {
        $$typeof: REACT_LAZY_TYPE,
        _payload: { _status: -1, _result: ctor },
        _init: lazyInitializer
      };
    };
    exports2.memo = function(type, compare) {
      return {
        $$typeof: REACT_MEMO_TYPE,
        type,
        compare: void 0 === compare ? null : compare
      };
    };
    exports2.startTransition = function(scope) {
      var prevTransition = ReactSharedInternals.T, currentTransition = {};
      ReactSharedInternals.T = currentTransition;
      try {
        var returnValue = scope(), onStartTransitionFinish = ReactSharedInternals.S;
        null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
        "object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && returnValue.then(noop, reportGlobalError);
      } catch (error) {
        reportGlobalError(error);
      } finally {
        ReactSharedInternals.T = prevTransition;
      }
    };
    exports2.unstable_useCacheRefresh = function() {
      return ReactSharedInternals.H.useCacheRefresh();
    };
    exports2.use = function(usable) {
      return ReactSharedInternals.H.use(usable);
    };
    exports2.useActionState = function(action, initialState, permalink) {
      return ReactSharedInternals.H.useActionState(action, initialState, permalink);
    };
    exports2.useCallback = function(callback, deps) {
      return ReactSharedInternals.H.useCallback(callback, deps);
    };
    exports2.useContext = function(Context) {
      return ReactSharedInternals.H.useContext(Context);
    };
    exports2.useDebugValue = function() {
    };
    exports2.useDeferredValue = function(value, initialValue) {
      return ReactSharedInternals.H.useDeferredValue(value, initialValue);
    };
    exports2.useEffect = function(create, createDeps, update) {
      var dispatcher = ReactSharedInternals.H;
      if ("function" === typeof update)
        throw Error(
          "useEffect CRUD overload is not enabled in this build of React."
        );
      return dispatcher.useEffect(create, createDeps);
    };
    exports2.useId = function() {
      return ReactSharedInternals.H.useId();
    };
    exports2.useImperativeHandle = function(ref, create, deps) {
      return ReactSharedInternals.H.useImperativeHandle(ref, create, deps);
    };
    exports2.useInsertionEffect = function(create, deps) {
      return ReactSharedInternals.H.useInsertionEffect(create, deps);
    };
    exports2.useLayoutEffect = function(create, deps) {
      return ReactSharedInternals.H.useLayoutEffect(create, deps);
    };
    exports2.useMemo = function(create, deps) {
      return ReactSharedInternals.H.useMemo(create, deps);
    };
    exports2.useOptimistic = function(passthrough, reducer) {
      return ReactSharedInternals.H.useOptimistic(passthrough, reducer);
    };
    exports2.useReducer = function(reducer, initialArg, init) {
      return ReactSharedInternals.H.useReducer(reducer, initialArg, init);
    };
    exports2.useRef = function(initialValue) {
      return ReactSharedInternals.H.useRef(initialValue);
    };
    exports2.useState = function(initialState) {
      return ReactSharedInternals.H.useState(initialState);
    };
    exports2.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
      return ReactSharedInternals.H.useSyncExternalStore(
        subscribe,
        getSnapshot,
        getServerSnapshot
      );
    };
    exports2.useTransition = function() {
      return ReactSharedInternals.H.useTransition();
    };
    exports2.version = "19.1.0";
  }
});

// node_modules/.pnpm/react@19.1.0/node_modules/react/cjs/react.development.js
var require_react_development = __commonJS({
  "node_modules/.pnpm/react@19.1.0/node_modules/react/cjs/react.development.js"(exports2, module2) {
    "use strict";
    "production" !== process.env.NODE_ENV && (function() {
      function defineDeprecationWarning(methodName, info) {
        Object.defineProperty(Component.prototype, methodName, {
          get: function() {
            console.warn(
              "%s(...) is deprecated in plain JavaScript React classes. %s",
              info[0],
              info[1]
            );
          }
        });
      }
      function getIteratorFn(maybeIterable) {
        if (null === maybeIterable || "object" !== typeof maybeIterable)
          return null;
        maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
        return "function" === typeof maybeIterable ? maybeIterable : null;
      }
      function warnNoop(publicInstance, callerName) {
        publicInstance = (publicInstance = publicInstance.constructor) && (publicInstance.displayName || publicInstance.name) || "ReactClass";
        var warningKey = publicInstance + "." + callerName;
        didWarnStateUpdateForUnmountedComponent[warningKey] || (console.error(
          "Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.",
          callerName,
          publicInstance
        ), didWarnStateUpdateForUnmountedComponent[warningKey] = true);
      }
      function Component(props, context, updater) {
        this.props = props;
        this.context = context;
        this.refs = emptyObject;
        this.updater = updater || ReactNoopUpdateQueue;
      }
      function ComponentDummy() {
      }
      function PureComponent(props, context, updater) {
        this.props = props;
        this.context = context;
        this.refs = emptyObject;
        this.updater = updater || ReactNoopUpdateQueue;
      }
      function testStringCoercion(value) {
        return "" + value;
      }
      function checkKeyStringCoercion(value) {
        try {
          testStringCoercion(value);
          var JSCompiler_inline_result = false;
        } catch (e) {
          JSCompiler_inline_result = true;
        }
        if (JSCompiler_inline_result) {
          JSCompiler_inline_result = console;
          var JSCompiler_temp_const = JSCompiler_inline_result.error;
          var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
          JSCompiler_temp_const.call(
            JSCompiler_inline_result,
            "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
            JSCompiler_inline_result$jscomp$0
          );
          return testStringCoercion(value);
        }
      }
      function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type)
          return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch (type) {
          case REACT_FRAGMENT_TYPE:
            return "Fragment";
          case REACT_PROFILER_TYPE:
            return "Profiler";
          case REACT_STRICT_MODE_TYPE:
            return "StrictMode";
          case REACT_SUSPENSE_TYPE:
            return "Suspense";
          case REACT_SUSPENSE_LIST_TYPE:
            return "SuspenseList";
          case REACT_ACTIVITY_TYPE:
            return "Activity";
        }
        if ("object" === typeof type)
          switch ("number" === typeof type.tag && console.error(
            "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
          ), type.$$typeof) {
            case REACT_PORTAL_TYPE:
              return "Portal";
            case REACT_CONTEXT_TYPE:
              return (type.displayName || "Context") + ".Provider";
            case REACT_CONSUMER_TYPE:
              return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
              var innerType = type.render;
              type = type.displayName;
              type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
              return type;
            case REACT_MEMO_TYPE:
              return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
              innerType = type._payload;
              type = type._init;
              try {
                return getComponentNameFromType(type(innerType));
              } catch (x) {
              }
          }
        return null;
      }
      function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE)
          return "<...>";
        try {
          var name = getComponentNameFromType(type);
          return name ? "<" + name + ">" : "<...>";
        } catch (x) {
          return "<...>";
        }
      }
      function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
      }
      function UnknownOwner() {
        return Error("react-stack-top-frame");
      }
      function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
          var getter = Object.getOwnPropertyDescriptor(config, "key").get;
          if (getter && getter.isReactWarning) return false;
        }
        return void 0 !== config.key;
      }
      function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
          specialPropKeyWarningShown || (specialPropKeyWarningShown = true, console.error(
            "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
            displayName
          ));
        }
        warnAboutAccessingKey.isReactWarning = true;
        Object.defineProperty(props, "key", {
          get: warnAboutAccessingKey,
          configurable: true
        });
      }
      function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = true, console.error(
          "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
        ));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
      }
      function ReactElement(type, key, self, source, owner, props, debugStack, debugTask) {
        self = props.ref;
        type = {
          $$typeof: REACT_ELEMENT_TYPE,
          type,
          key,
          props,
          _owner: owner
        };
        null !== (void 0 !== self ? self : null) ? Object.defineProperty(type, "ref", {
          enumerable: false,
          get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", { enumerable: false, value: null });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: null
        });
        Object.defineProperty(type, "_debugStack", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
      }
      function cloneAndReplaceKey(oldElement, newKey) {
        newKey = ReactElement(
          oldElement.type,
          newKey,
          void 0,
          void 0,
          oldElement._owner,
          oldElement.props,
          oldElement._debugStack,
          oldElement._debugTask
        );
        oldElement._store && (newKey._store.validated = oldElement._store.validated);
        return newKey;
      }
      function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
      }
      function escape(key) {
        var escaperLookup = { "=": "=0", ":": "=2" };
        return "$" + key.replace(/[=:]/g, function(match) {
          return escaperLookup[match];
        });
      }
      function getElementKey(element, index) {
        return "object" === typeof element && null !== element && null != element.key ? (checkKeyStringCoercion(element.key), escape("" + element.key)) : index.toString(36);
      }
      function noop$1() {
      }
      function resolveThenable(thenable) {
        switch (thenable.status) {
          case "fulfilled":
            return thenable.value;
          case "rejected":
            throw thenable.reason;
          default:
            switch ("string" === typeof thenable.status ? thenable.then(noop$1, noop$1) : (thenable.status = "pending", thenable.then(
              function(fulfilledValue) {
                "pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
              },
              function(error) {
                "pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
              }
            )), thenable.status) {
              case "fulfilled":
                return thenable.value;
              case "rejected":
                throw thenable.reason;
            }
        }
        throw thenable;
      }
      function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
        var type = typeof children;
        if ("undefined" === type || "boolean" === type) children = null;
        var invokeCallback = false;
        if (null === children) invokeCallback = true;
        else
          switch (type) {
            case "bigint":
            case "string":
            case "number":
              invokeCallback = true;
              break;
            case "object":
              switch (children.$$typeof) {
                case REACT_ELEMENT_TYPE:
                case REACT_PORTAL_TYPE:
                  invokeCallback = true;
                  break;
                case REACT_LAZY_TYPE:
                  return invokeCallback = children._init, mapIntoArray(
                    invokeCallback(children._payload),
                    array,
                    escapedPrefix,
                    nameSoFar,
                    callback
                  );
              }
          }
        if (invokeCallback) {
          invokeCallback = children;
          callback = callback(invokeCallback);
          var childKey = "" === nameSoFar ? "." + getElementKey(invokeCallback, 0) : nameSoFar;
          isArrayImpl(callback) ? (escapedPrefix = "", null != childKey && (escapedPrefix = childKey.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c) {
            return c;
          })) : null != callback && (isValidElement(callback) && (null != callback.key && (invokeCallback && invokeCallback.key === callback.key || checkKeyStringCoercion(callback.key)), escapedPrefix = cloneAndReplaceKey(
            callback,
            escapedPrefix + (null == callback.key || invokeCallback && invokeCallback.key === callback.key ? "" : ("" + callback.key).replace(
              userProvidedKeyEscapeRegex,
              "$&/"
            ) + "/") + childKey
          ), "" !== nameSoFar && null != invokeCallback && isValidElement(invokeCallback) && null == invokeCallback.key && invokeCallback._store && !invokeCallback._store.validated && (escapedPrefix._store.validated = 2), callback = escapedPrefix), array.push(callback));
          return 1;
        }
        invokeCallback = 0;
        childKey = "" === nameSoFar ? "." : nameSoFar + ":";
        if (isArrayImpl(children))
          for (var i = 0; i < children.length; i++)
            nameSoFar = children[i], type = childKey + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(
              nameSoFar,
              array,
              escapedPrefix,
              type,
              callback
            );
        else if (i = getIteratorFn(children), "function" === typeof i)
          for (i === children.entries && (didWarnAboutMaps || console.warn(
            "Using Maps as children is not supported. Use an array of keyed ReactElements instead."
          ), didWarnAboutMaps = true), children = i.call(children), i = 0; !(nameSoFar = children.next()).done; )
            nameSoFar = nameSoFar.value, type = childKey + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(
              nameSoFar,
              array,
              escapedPrefix,
              type,
              callback
            );
        else if ("object" === type) {
          if ("function" === typeof children.then)
            return mapIntoArray(
              resolveThenable(children),
              array,
              escapedPrefix,
              nameSoFar,
              callback
            );
          array = String(children);
          throw Error(
            "Objects are not valid as a React child (found: " + ("[object Object]" === array ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead."
          );
        }
        return invokeCallback;
      }
      function mapChildren(children, func, context) {
        if (null == children) return children;
        var result = [], count = 0;
        mapIntoArray(children, result, "", "", function(child) {
          return func.call(context, child, count++);
        });
        return result;
      }
      function lazyInitializer(payload) {
        if (-1 === payload._status) {
          var ctor = payload._result;
          ctor = ctor();
          ctor.then(
            function(moduleObject) {
              if (0 === payload._status || -1 === payload._status)
                payload._status = 1, payload._result = moduleObject;
            },
            function(error) {
              if (0 === payload._status || -1 === payload._status)
                payload._status = 2, payload._result = error;
            }
          );
          -1 === payload._status && (payload._status = 0, payload._result = ctor);
        }
        if (1 === payload._status)
          return ctor = payload._result, void 0 === ctor && console.error(
            "lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))\n\nDid you accidentally put curly braces around the import?",
            ctor
          ), "default" in ctor || console.error(
            "lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))",
            ctor
          ), ctor.default;
        throw payload._result;
      }
      function resolveDispatcher() {
        var dispatcher = ReactSharedInternals.H;
        null === dispatcher && console.error(
          "Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem."
        );
        return dispatcher;
      }
      function noop() {
      }
      function enqueueTask(task) {
        if (null === enqueueTaskImpl)
          try {
            var requireString = ("require" + Math.random()).slice(0, 7);
            enqueueTaskImpl = (module2 && module2[requireString]).call(
              module2,
              "timers"
            ).setImmediate;
          } catch (_err) {
            enqueueTaskImpl = function(callback) {
              false === didWarnAboutMessageChannel && (didWarnAboutMessageChannel = true, "undefined" === typeof MessageChannel && console.error(
                "This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."
              ));
              var channel = new MessageChannel();
              channel.port1.onmessage = callback;
              channel.port2.postMessage(void 0);
            };
          }
        return enqueueTaskImpl(task);
      }
      function aggregateErrors(errors) {
        return 1 < errors.length && "function" === typeof AggregateError ? new AggregateError(errors) : errors[0];
      }
      function popActScope(prevActQueue, prevActScopeDepth) {
        prevActScopeDepth !== actScopeDepth - 1 && console.error(
          "You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. "
        );
        actScopeDepth = prevActScopeDepth;
      }
      function recursivelyFlushAsyncActWork(returnValue, resolve, reject) {
        var queue = ReactSharedInternals.actQueue;
        if (null !== queue)
          if (0 !== queue.length)
            try {
              flushActQueue(queue);
              enqueueTask(function() {
                return recursivelyFlushAsyncActWork(returnValue, resolve, reject);
              });
              return;
            } catch (error) {
              ReactSharedInternals.thrownErrors.push(error);
            }
          else ReactSharedInternals.actQueue = null;
        0 < ReactSharedInternals.thrownErrors.length ? (queue = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, reject(queue)) : resolve(returnValue);
      }
      function flushActQueue(queue) {
        if (!isFlushing) {
          isFlushing = true;
          var i = 0;
          try {
            for (; i < queue.length; i++) {
              var callback = queue[i];
              do {
                ReactSharedInternals.didUsePromise = false;
                var continuation = callback(false);
                if (null !== continuation) {
                  if (ReactSharedInternals.didUsePromise) {
                    queue[i] = callback;
                    queue.splice(0, i);
                    return;
                  }
                  callback = continuation;
                } else break;
              } while (1);
            }
            queue.length = 0;
          } catch (error) {
            queue.splice(0, i + 1), ReactSharedInternals.thrownErrors.push(error);
          } finally {
            isFlushing = false;
          }
        }
      }
      "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
      var REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = /* @__PURE__ */ Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = /* @__PURE__ */ Symbol.for("react.profiler");
      /* @__PURE__ */ Symbol.for("react.provider");
      var REACT_CONSUMER_TYPE = /* @__PURE__ */ Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = /* @__PURE__ */ Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = /* @__PURE__ */ Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = /* @__PURE__ */ Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = /* @__PURE__ */ Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = /* @__PURE__ */ Symbol.for("react.memo"), REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = /* @__PURE__ */ Symbol.for("react.activity"), MAYBE_ITERATOR_SYMBOL = Symbol.iterator, didWarnStateUpdateForUnmountedComponent = {}, ReactNoopUpdateQueue = {
        isMounted: function() {
          return false;
        },
        enqueueForceUpdate: function(publicInstance) {
          warnNoop(publicInstance, "forceUpdate");
        },
        enqueueReplaceState: function(publicInstance) {
          warnNoop(publicInstance, "replaceState");
        },
        enqueueSetState: function(publicInstance) {
          warnNoop(publicInstance, "setState");
        }
      }, assign = Object.assign, emptyObject = {};
      Object.freeze(emptyObject);
      Component.prototype.isReactComponent = {};
      Component.prototype.setState = function(partialState, callback) {
        if ("object" !== typeof partialState && "function" !== typeof partialState && null != partialState)
          throw Error(
            "takes an object of state variables to update or a function which returns an object of state variables."
          );
        this.updater.enqueueSetState(this, partialState, callback, "setState");
      };
      Component.prototype.forceUpdate = function(callback) {
        this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
      };
      var deprecatedAPIs = {
        isMounted: [
          "isMounted",
          "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."
        ],
        replaceState: [
          "replaceState",
          "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."
        ]
      }, fnName;
      for (fnName in deprecatedAPIs)
        deprecatedAPIs.hasOwnProperty(fnName) && defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
      ComponentDummy.prototype = Component.prototype;
      deprecatedAPIs = PureComponent.prototype = new ComponentDummy();
      deprecatedAPIs.constructor = PureComponent;
      assign(deprecatedAPIs, Component.prototype);
      deprecatedAPIs.isPureReactComponent = true;
      var isArrayImpl = Array.isArray, REACT_CLIENT_REFERENCE = /* @__PURE__ */ Symbol.for("react.client.reference"), ReactSharedInternals = {
        H: null,
        A: null,
        T: null,
        S: null,
        V: null,
        actQueue: null,
        isBatchingLegacy: false,
        didScheduleLegacyUpdate: false,
        didUsePromise: false,
        thrownErrors: [],
        getCurrentStack: null,
        recentlyCreatedOwnerStacks: 0
      }, hasOwnProperty = Object.prototype.hasOwnProperty, createTask = console.createTask ? console.createTask : function() {
        return null;
      };
      deprecatedAPIs = {
        "react-stack-bottom-frame": function(callStackForError) {
          return callStackForError();
        }
      };
      var specialPropKeyWarningShown, didWarnAboutOldJSXRuntime;
      var didWarnAboutElementRef = {};
      var unknownOwnerDebugStack = deprecatedAPIs["react-stack-bottom-frame"].bind(deprecatedAPIs, UnknownOwner)();
      var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
      var didWarnAboutMaps = false, userProvidedKeyEscapeRegex = /\/+/g, reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
        if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
          var event = new window.ErrorEvent("error", {
            bubbles: true,
            cancelable: true,
            message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
            error
          });
          if (!window.dispatchEvent(event)) return;
        } else if ("object" === typeof process && "function" === typeof process.emit) {
          process.emit("uncaughtException", error);
          return;
        }
        console.error(error);
      }, didWarnAboutMessageChannel = false, enqueueTaskImpl = null, actScopeDepth = 0, didWarnNoAwaitAct = false, isFlushing = false, queueSeveralMicrotasks = "function" === typeof queueMicrotask ? function(callback) {
        queueMicrotask(function() {
          return queueMicrotask(callback);
        });
      } : enqueueTask;
      deprecatedAPIs = Object.freeze({
        __proto__: null,
        c: function(size) {
          return resolveDispatcher().useMemoCache(size);
        }
      });
      exports2.Children = {
        map: mapChildren,
        forEach: function(children, forEachFunc, forEachContext) {
          mapChildren(
            children,
            function() {
              forEachFunc.apply(this, arguments);
            },
            forEachContext
          );
        },
        count: function(children) {
          var n = 0;
          mapChildren(children, function() {
            n++;
          });
          return n;
        },
        toArray: function(children) {
          return mapChildren(children, function(child) {
            return child;
          }) || [];
        },
        only: function(children) {
          if (!isValidElement(children))
            throw Error(
              "React.Children.only expected to receive a single React element child."
            );
          return children;
        }
      };
      exports2.Component = Component;
      exports2.Fragment = REACT_FRAGMENT_TYPE;
      exports2.Profiler = REACT_PROFILER_TYPE;
      exports2.PureComponent = PureComponent;
      exports2.StrictMode = REACT_STRICT_MODE_TYPE;
      exports2.Suspense = REACT_SUSPENSE_TYPE;
      exports2.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals;
      exports2.__COMPILER_RUNTIME = deprecatedAPIs;
      exports2.act = function(callback) {
        var prevActQueue = ReactSharedInternals.actQueue, prevActScopeDepth = actScopeDepth;
        actScopeDepth++;
        var queue = ReactSharedInternals.actQueue = null !== prevActQueue ? prevActQueue : [], didAwaitActCall = false;
        try {
          var result = callback();
        } catch (error) {
          ReactSharedInternals.thrownErrors.push(error);
        }
        if (0 < ReactSharedInternals.thrownErrors.length)
          throw popActScope(prevActQueue, prevActScopeDepth), callback = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, callback;
        if (null !== result && "object" === typeof result && "function" === typeof result.then) {
          var thenable = result;
          queueSeveralMicrotasks(function() {
            didAwaitActCall || didWarnNoAwaitAct || (didWarnNoAwaitAct = true, console.error(
              "You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"
            ));
          });
          return {
            then: function(resolve, reject) {
              didAwaitActCall = true;
              thenable.then(
                function(returnValue) {
                  popActScope(prevActQueue, prevActScopeDepth);
                  if (0 === prevActScopeDepth) {
                    try {
                      flushActQueue(queue), enqueueTask(function() {
                        return recursivelyFlushAsyncActWork(
                          returnValue,
                          resolve,
                          reject
                        );
                      });
                    } catch (error$0) {
                      ReactSharedInternals.thrownErrors.push(error$0);
                    }
                    if (0 < ReactSharedInternals.thrownErrors.length) {
                      var _thrownError = aggregateErrors(
                        ReactSharedInternals.thrownErrors
                      );
                      ReactSharedInternals.thrownErrors.length = 0;
                      reject(_thrownError);
                    }
                  } else resolve(returnValue);
                },
                function(error) {
                  popActScope(prevActQueue, prevActScopeDepth);
                  0 < ReactSharedInternals.thrownErrors.length ? (error = aggregateErrors(
                    ReactSharedInternals.thrownErrors
                  ), ReactSharedInternals.thrownErrors.length = 0, reject(error)) : reject(error);
                }
              );
            }
          };
        }
        var returnValue$jscomp$0 = result;
        popActScope(prevActQueue, prevActScopeDepth);
        0 === prevActScopeDepth && (flushActQueue(queue), 0 !== queue.length && queueSeveralMicrotasks(function() {
          didAwaitActCall || didWarnNoAwaitAct || (didWarnNoAwaitAct = true, console.error(
            "A component suspended inside an `act` scope, but the `act` call was not awaited. When testing React components that depend on asynchronous data, you must await the result:\n\nawait act(() => ...)"
          ));
        }), ReactSharedInternals.actQueue = null);
        if (0 < ReactSharedInternals.thrownErrors.length)
          throw callback = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, callback;
        return {
          then: function(resolve, reject) {
            didAwaitActCall = true;
            0 === prevActScopeDepth ? (ReactSharedInternals.actQueue = queue, enqueueTask(function() {
              return recursivelyFlushAsyncActWork(
                returnValue$jscomp$0,
                resolve,
                reject
              );
            })) : resolve(returnValue$jscomp$0);
          }
        };
      };
      exports2.cache = function(fn) {
        return function() {
          return fn.apply(null, arguments);
        };
      };
      exports2.captureOwnerStack = function() {
        var getCurrentStack = ReactSharedInternals.getCurrentStack;
        return null === getCurrentStack ? null : getCurrentStack();
      };
      exports2.cloneElement = function(element, config, children) {
        if (null === element || void 0 === element)
          throw Error(
            "The argument must be a React element, but you passed " + element + "."
          );
        var props = assign({}, element.props), key = element.key, owner = element._owner;
        if (null != config) {
          var JSCompiler_inline_result;
          a: {
            if (hasOwnProperty.call(config, "ref") && (JSCompiler_inline_result = Object.getOwnPropertyDescriptor(
              config,
              "ref"
            ).get) && JSCompiler_inline_result.isReactWarning) {
              JSCompiler_inline_result = false;
              break a;
            }
            JSCompiler_inline_result = void 0 !== config.ref;
          }
          JSCompiler_inline_result && (owner = getOwner());
          hasValidKey(config) && (checkKeyStringCoercion(config.key), key = "" + config.key);
          for (propName in config)
            !hasOwnProperty.call(config, propName) || "key" === propName || "__self" === propName || "__source" === propName || "ref" === propName && void 0 === config.ref || (props[propName] = config[propName]);
        }
        var propName = arguments.length - 2;
        if (1 === propName) props.children = children;
        else if (1 < propName) {
          JSCompiler_inline_result = Array(propName);
          for (var i = 0; i < propName; i++)
            JSCompiler_inline_result[i] = arguments[i + 2];
          props.children = JSCompiler_inline_result;
        }
        props = ReactElement(
          element.type,
          key,
          void 0,
          void 0,
          owner,
          props,
          element._debugStack,
          element._debugTask
        );
        for (key = 2; key < arguments.length; key++)
          owner = arguments[key], isValidElement(owner) && owner._store && (owner._store.validated = 1);
        return props;
      };
      exports2.createContext = function(defaultValue) {
        defaultValue = {
          $$typeof: REACT_CONTEXT_TYPE,
          _currentValue: defaultValue,
          _currentValue2: defaultValue,
          _threadCount: 0,
          Provider: null,
          Consumer: null
        };
        defaultValue.Provider = defaultValue;
        defaultValue.Consumer = {
          $$typeof: REACT_CONSUMER_TYPE,
          _context: defaultValue
        };
        defaultValue._currentRenderer = null;
        defaultValue._currentRenderer2 = null;
        return defaultValue;
      };
      exports2.createElement = function(type, config, children) {
        for (var i = 2; i < arguments.length; i++) {
          var node = arguments[i];
          isValidElement(node) && node._store && (node._store.validated = 1);
        }
        i = {};
        node = null;
        if (null != config)
          for (propName in didWarnAboutOldJSXRuntime || !("__self" in config) || "key" in config || (didWarnAboutOldJSXRuntime = true, console.warn(
            "Your app (or one of its dependencies) is using an outdated JSX transform. Update to the modern JSX transform for faster performance: https://react.dev/link/new-jsx-transform"
          )), hasValidKey(config) && (checkKeyStringCoercion(config.key), node = "" + config.key), config)
            hasOwnProperty.call(config, propName) && "key" !== propName && "__self" !== propName && "__source" !== propName && (i[propName] = config[propName]);
        var childrenLength = arguments.length - 2;
        if (1 === childrenLength) i.children = children;
        else if (1 < childrenLength) {
          for (var childArray = Array(childrenLength), _i = 0; _i < childrenLength; _i++)
            childArray[_i] = arguments[_i + 2];
          Object.freeze && Object.freeze(childArray);
          i.children = childArray;
        }
        if (type && type.defaultProps)
          for (propName in childrenLength = type.defaultProps, childrenLength)
            void 0 === i[propName] && (i[propName] = childrenLength[propName]);
        node && defineKeyPropWarningGetter(
          i,
          "function" === typeof type ? type.displayName || type.name || "Unknown" : type
        );
        var propName = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        return ReactElement(
          type,
          node,
          void 0,
          void 0,
          getOwner(),
          i,
          propName ? Error("react-stack-top-frame") : unknownOwnerDebugStack,
          propName ? createTask(getTaskName(type)) : unknownOwnerDebugTask
        );
      };
      exports2.createRef = function() {
        var refObject = { current: null };
        Object.seal(refObject);
        return refObject;
      };
      exports2.forwardRef = function(render) {
        null != render && render.$$typeof === REACT_MEMO_TYPE ? console.error(
          "forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...))."
        ) : "function" !== typeof render ? console.error(
          "forwardRef requires a render function but was given %s.",
          null === render ? "null" : typeof render
        ) : 0 !== render.length && 2 !== render.length && console.error(
          "forwardRef render functions accept exactly two parameters: props and ref. %s",
          1 === render.length ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined."
        );
        null != render && null != render.defaultProps && console.error(
          "forwardRef render functions do not support defaultProps. Did you accidentally pass a React component?"
        );
        var elementType = { $$typeof: REACT_FORWARD_REF_TYPE, render }, ownName;
        Object.defineProperty(elementType, "displayName", {
          enumerable: false,
          configurable: true,
          get: function() {
            return ownName;
          },
          set: function(name) {
            ownName = name;
            render.name || render.displayName || (Object.defineProperty(render, "name", { value: name }), render.displayName = name);
          }
        });
        return elementType;
      };
      exports2.isValidElement = isValidElement;
      exports2.lazy = function(ctor) {
        return {
          $$typeof: REACT_LAZY_TYPE,
          _payload: { _status: -1, _result: ctor },
          _init: lazyInitializer
        };
      };
      exports2.memo = function(type, compare) {
        null == type && console.error(
          "memo: The first argument must be a component. Instead received: %s",
          null === type ? "null" : typeof type
        );
        compare = {
          $$typeof: REACT_MEMO_TYPE,
          type,
          compare: void 0 === compare ? null : compare
        };
        var ownName;
        Object.defineProperty(compare, "displayName", {
          enumerable: false,
          configurable: true,
          get: function() {
            return ownName;
          },
          set: function(name) {
            ownName = name;
            type.name || type.displayName || (Object.defineProperty(type, "name", { value: name }), type.displayName = name);
          }
        });
        return compare;
      };
      exports2.startTransition = function(scope) {
        var prevTransition = ReactSharedInternals.T, currentTransition = {};
        ReactSharedInternals.T = currentTransition;
        currentTransition._updatedFibers = /* @__PURE__ */ new Set();
        try {
          var returnValue = scope(), onStartTransitionFinish = ReactSharedInternals.S;
          null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
          "object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && returnValue.then(noop, reportGlobalError);
        } catch (error) {
          reportGlobalError(error);
        } finally {
          null === prevTransition && currentTransition._updatedFibers && (scope = currentTransition._updatedFibers.size, currentTransition._updatedFibers.clear(), 10 < scope && console.warn(
            "Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."
          )), ReactSharedInternals.T = prevTransition;
        }
      };
      exports2.unstable_useCacheRefresh = function() {
        return resolveDispatcher().useCacheRefresh();
      };
      exports2.use = function(usable) {
        return resolveDispatcher().use(usable);
      };
      exports2.useActionState = function(action, initialState, permalink) {
        return resolveDispatcher().useActionState(
          action,
          initialState,
          permalink
        );
      };
      exports2.useCallback = function(callback, deps) {
        return resolveDispatcher().useCallback(callback, deps);
      };
      exports2.useContext = function(Context) {
        var dispatcher = resolveDispatcher();
        Context.$$typeof === REACT_CONSUMER_TYPE && console.error(
          "Calling useContext(Context.Consumer) is not supported and will cause bugs. Did you mean to call useContext(Context) instead?"
        );
        return dispatcher.useContext(Context);
      };
      exports2.useDebugValue = function(value, formatterFn) {
        return resolveDispatcher().useDebugValue(value, formatterFn);
      };
      exports2.useDeferredValue = function(value, initialValue) {
        return resolveDispatcher().useDeferredValue(value, initialValue);
      };
      exports2.useEffect = function(create, createDeps, update) {
        null == create && console.warn(
          "React Hook useEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        );
        var dispatcher = resolveDispatcher();
        if ("function" === typeof update)
          throw Error(
            "useEffect CRUD overload is not enabled in this build of React."
          );
        return dispatcher.useEffect(create, createDeps);
      };
      exports2.useId = function() {
        return resolveDispatcher().useId();
      };
      exports2.useImperativeHandle = function(ref, create, deps) {
        return resolveDispatcher().useImperativeHandle(ref, create, deps);
      };
      exports2.useInsertionEffect = function(create, deps) {
        null == create && console.warn(
          "React Hook useInsertionEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        );
        return resolveDispatcher().useInsertionEffect(create, deps);
      };
      exports2.useLayoutEffect = function(create, deps) {
        null == create && console.warn(
          "React Hook useLayoutEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        );
        return resolveDispatcher().useLayoutEffect(create, deps);
      };
      exports2.useMemo = function(create, deps) {
        return resolveDispatcher().useMemo(create, deps);
      };
      exports2.useOptimistic = function(passthrough, reducer) {
        return resolveDispatcher().useOptimistic(passthrough, reducer);
      };
      exports2.useReducer = function(reducer, initialArg, init) {
        return resolveDispatcher().useReducer(reducer, initialArg, init);
      };
      exports2.useRef = function(initialValue) {
        return resolveDispatcher().useRef(initialValue);
      };
      exports2.useState = function(initialState) {
        return resolveDispatcher().useState(initialState);
      };
      exports2.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
        return resolveDispatcher().useSyncExternalStore(
          subscribe,
          getSnapshot,
          getServerSnapshot
        );
      };
      exports2.useTransition = function() {
        return resolveDispatcher().useTransition();
      };
      exports2.version = "19.1.0";
      "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
    })();
  }
});

// node_modules/.pnpm/react@19.1.0/node_modules/react/index.js
var require_react = __commonJS({
  "node_modules/.pnpm/react@19.1.0/node_modules/react/index.js"(exports2, module2) {
    "use strict";
    if (process.env.NODE_ENV === "production") {
      module2.exports = require_react_production();
    } else {
      module2.exports = require_react_development();
    }
  }
});

// node_modules/.pnpm/react@19.1.0/node_modules/react/cjs/react-jsx-runtime.production.js
var require_react_jsx_runtime_production = __commonJS({
  "node_modules/.pnpm/react@19.1.0/node_modules/react/cjs/react-jsx-runtime.production.js"(exports2) {
    "use strict";
    var REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element");
    var REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment");
    function jsxProd(type, config, maybeKey) {
      var key = null;
      void 0 !== maybeKey && (key = "" + maybeKey);
      void 0 !== config.key && (key = "" + config.key);
      if ("key" in config) {
        maybeKey = {};
        for (var propName in config)
          "key" !== propName && (maybeKey[propName] = config[propName]);
      } else maybeKey = config;
      config = maybeKey.ref;
      return {
        $$typeof: REACT_ELEMENT_TYPE,
        type,
        key,
        ref: void 0 !== config ? config : null,
        props: maybeKey
      };
    }
    exports2.Fragment = REACT_FRAGMENT_TYPE;
    exports2.jsx = jsxProd;
    exports2.jsxs = jsxProd;
  }
});

// node_modules/.pnpm/react@19.1.0/node_modules/react/cjs/react-jsx-runtime.development.js
var require_react_jsx_runtime_development = __commonJS({
  "node_modules/.pnpm/react@19.1.0/node_modules/react/cjs/react-jsx-runtime.development.js"(exports2) {
    "use strict";
    "production" !== process.env.NODE_ENV && (function() {
      function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type)
          return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch (type) {
          case REACT_FRAGMENT_TYPE:
            return "Fragment";
          case REACT_PROFILER_TYPE:
            return "Profiler";
          case REACT_STRICT_MODE_TYPE:
            return "StrictMode";
          case REACT_SUSPENSE_TYPE:
            return "Suspense";
          case REACT_SUSPENSE_LIST_TYPE:
            return "SuspenseList";
          case REACT_ACTIVITY_TYPE:
            return "Activity";
        }
        if ("object" === typeof type)
          switch ("number" === typeof type.tag && console.error(
            "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
          ), type.$$typeof) {
            case REACT_PORTAL_TYPE:
              return "Portal";
            case REACT_CONTEXT_TYPE:
              return (type.displayName || "Context") + ".Provider";
            case REACT_CONSUMER_TYPE:
              return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
              var innerType = type.render;
              type = type.displayName;
              type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
              return type;
            case REACT_MEMO_TYPE:
              return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
              innerType = type._payload;
              type = type._init;
              try {
                return getComponentNameFromType(type(innerType));
              } catch (x) {
              }
          }
        return null;
      }
      function testStringCoercion(value) {
        return "" + value;
      }
      function checkKeyStringCoercion(value) {
        try {
          testStringCoercion(value);
          var JSCompiler_inline_result = false;
        } catch (e) {
          JSCompiler_inline_result = true;
        }
        if (JSCompiler_inline_result) {
          JSCompiler_inline_result = console;
          var JSCompiler_temp_const = JSCompiler_inline_result.error;
          var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
          JSCompiler_temp_const.call(
            JSCompiler_inline_result,
            "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
            JSCompiler_inline_result$jscomp$0
          );
          return testStringCoercion(value);
        }
      }
      function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE)
          return "<...>";
        try {
          var name = getComponentNameFromType(type);
          return name ? "<" + name + ">" : "<...>";
        } catch (x) {
          return "<...>";
        }
      }
      function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
      }
      function UnknownOwner() {
        return Error("react-stack-top-frame");
      }
      function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
          var getter = Object.getOwnPropertyDescriptor(config, "key").get;
          if (getter && getter.isReactWarning) return false;
        }
        return void 0 !== config.key;
      }
      function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
          specialPropKeyWarningShown || (specialPropKeyWarningShown = true, console.error(
            "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
            displayName
          ));
        }
        warnAboutAccessingKey.isReactWarning = true;
        Object.defineProperty(props, "key", {
          get: warnAboutAccessingKey,
          configurable: true
        });
      }
      function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = true, console.error(
          "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
        ));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
      }
      function ReactElement(type, key, self, source, owner, props, debugStack, debugTask) {
        self = props.ref;
        type = {
          $$typeof: REACT_ELEMENT_TYPE,
          type,
          key,
          props,
          _owner: owner
        };
        null !== (void 0 !== self ? self : null) ? Object.defineProperty(type, "ref", {
          enumerable: false,
          get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", { enumerable: false, value: null });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: null
        });
        Object.defineProperty(type, "_debugStack", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
      }
      function jsxDEVImpl(type, config, maybeKey, isStaticChildren, source, self, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children)
          if (isStaticChildren)
            if (isArrayImpl(children)) {
              for (isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)
                validateChildKeys(children[isStaticChildren]);
              Object.freeze && Object.freeze(children);
            } else
              console.error(
                "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
              );
          else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
          children = getComponentNameFromType(type);
          var keys = Object.keys(config).filter(function(k) {
            return "key" !== k;
          });
          isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
          didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error(
            'A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />',
            isStaticChildren,
            children,
            keys,
            children
          ), didWarnAboutKeySpread[children + isStaticChildren] = true);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
          maybeKey = {};
          for (var propName in config)
            "key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(
          maybeKey,
          "function" === typeof type ? type.displayName || type.name || "Unknown" : type
        );
        return ReactElement(
          type,
          children,
          self,
          source,
          getOwner(),
          maybeKey,
          debugStack,
          debugTask
        );
      }
      function validateChildKeys(node) {
        "object" === typeof node && null !== node && node.$$typeof === REACT_ELEMENT_TYPE && node._store && (node._store.validated = 1);
      }
      var React = require_react(), REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = /* @__PURE__ */ Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = /* @__PURE__ */ Symbol.for("react.profiler");
      /* @__PURE__ */ Symbol.for("react.provider");
      var REACT_CONSUMER_TYPE = /* @__PURE__ */ Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = /* @__PURE__ */ Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = /* @__PURE__ */ Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = /* @__PURE__ */ Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = /* @__PURE__ */ Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = /* @__PURE__ */ Symbol.for("react.memo"), REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = /* @__PURE__ */ Symbol.for("react.activity"), REACT_CLIENT_REFERENCE = /* @__PURE__ */ Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
      };
      React = {
        "react-stack-bottom-frame": function(callStackForError) {
          return callStackForError();
        }
      };
      var specialPropKeyWarningShown;
      var didWarnAboutElementRef = {};
      var unknownOwnerDebugStack = React["react-stack-bottom-frame"].bind(
        React,
        UnknownOwner
      )();
      var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
      var didWarnAboutKeySpread = {};
      exports2.Fragment = REACT_FRAGMENT_TYPE;
      exports2.jsx = function(type, config, maybeKey, source, self) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        return jsxDEVImpl(
          type,
          config,
          maybeKey,
          false,
          source,
          self,
          trackActualOwner ? Error("react-stack-top-frame") : unknownOwnerDebugStack,
          trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask
        );
      };
      exports2.jsxs = function(type, config, maybeKey, source, self) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        return jsxDEVImpl(
          type,
          config,
          maybeKey,
          true,
          source,
          self,
          trackActualOwner ? Error("react-stack-top-frame") : unknownOwnerDebugStack,
          trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask
        );
      };
    })();
  }
});

// node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js
var require_jsx_runtime = __commonJS({
  "node_modules/.pnpm/react@19.1.0/node_modules/react/jsx-runtime.js"(exports2, module2) {
    "use strict";
    if (process.env.NODE_ENV === "production") {
      module2.exports = require_react_jsx_runtime_production();
    } else {
      module2.exports = require_react_jsx_runtime_development();
    }
  }
});

// node_modules/.pnpm/@tanstack+react-query@5.104.1_react@19.1.0/node_modules/@tanstack/react-query/build/legacy/QueryClientProvider.cjs
var require_QueryClientProvider = __commonJS({
  "node_modules/.pnpm/@tanstack+react-query@5.104.1_react@19.1.0/node_modules/@tanstack/react-query/build/legacy/QueryClientProvider.cjs"(exports2) {
    "use client";
    Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
    var require_rolldown_runtime = require_rolldown_runtime_VH7oDXx4();
    var react = require_react();
    react = require_rolldown_runtime.__toESM(react, 1);
    var react_jsx_runtime = require_jsx_runtime();
    var QueryClientContext = react.createContext(void 0);
    var useQueryClient = (queryClient) => {
      const client = react.useContext(QueryClientContext);
      if (queryClient) return queryClient;
      if (!client) throw new Error("No QueryClient set, use QueryClientProvider to set one");
      return client;
    };
    var QueryClientProvider = ({ client, children }) => {
      react.useEffect(() => {
        client.mount();
        return () => {
          client.unmount();
        };
      }, [client]);
      return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(QueryClientContext.Provider, {
        value: client,
        children
      });
    };
    exports2.QueryClientContext = QueryClientContext;
    exports2.QueryClientProvider = QueryClientProvider;
    exports2.useQueryClient = useQueryClient;
  }
});

// node_modules/.pnpm/@tanstack+query-core@5.104.1/node_modules/@tanstack/query-core/build/modern/timeoutManager.cjs
var require_timeoutManager = __commonJS({
  "node_modules/.pnpm/@tanstack+query-core@5.104.1/node_modules/@tanstack/query-core/build/modern/timeoutManager.cjs"(exports2) {
    Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
    var defaultTimeoutProvider = {
      setTimeout: (callback, delay) => setTimeout(callback, delay),
      clearTimeout: (timeoutId) => clearTimeout(timeoutId),
      setInterval: (callback, delay) => setInterval(callback, delay),
      clearInterval: (intervalId) => clearInterval(intervalId)
    };
    var TimeoutManager = class {
      #provider = defaultTimeoutProvider;
      #providerCalled = false;
      /**
      * `setTimeoutProvider` can be used to set a custom implementation of the
      * `setTimeout`, `clearTimeout`, `setInterval`, `clearInterval` functions,
      * called a `TimeoutProvider`.
      *
      * This may be useful if you notice event loop performance issues with
      * thousands of queries. A custom TimeoutProvider could also support timer
      * delays longer than the global `setTimeout` maximum delay value of about
      * 24 days.
      *
      * It is important to call `setTimeoutProvider` before creating a
      * QueryClient or queries, so that the same provider is used consistently
      * for all timers in the application, since different TimeoutProviders
      * cannot cancel each others' timers.
      *
      * @example
      * ```ts
      * import { timeoutManager, QueryClient } from '@tanstack/query-core'
      * import { CustomTimeoutProvider } from './CustomTimeoutProvider'
      *
      * timeoutManager.setTimeoutProvider(new CustomTimeoutProvider())
      *
      * export const queryClient = new QueryClient()
      * ```
      */
      setTimeoutProvider(provider) {
        if (process.env.NODE_ENV !== "production") {
          if (this.#providerCalled && provider !== this.#provider) console.error(`[timeoutManager]: Switching provider after calls to previous provider might result in unexpected behavior.`, {
            previous: this.#provider,
            provider
          });
        }
        this.#provider = provider;
        if (process.env.NODE_ENV !== "production") this.#providerCalled = false;
      }
      /**
      * `setTimeout` schedules a callback to run after approximately `delay`
      * milliseconds, like the global `setTimeout` function. The callback can be
      * canceled with `clearTimeout`.
      *
      * It returns a timer ID, which may be a number or an object that can be
      * coerced to a number via `Symbol.toPrimitive`.
      *
      * @example
      * ```ts
      * import { timeoutManager } from '@tanstack/query-core'
      *
      * const timeoutId = timeoutManager.setTimeout(
      *   () => console.log('ran at:', new Date()),
      *   1000,
      * )
      *
      * const timeoutIdNumber: number = Number(timeoutId)
      * ```
      */
      setTimeout(callback, delay) {
        if (process.env.NODE_ENV !== "production") this.#providerCalled = true;
        return this.#provider.setTimeout(callback, delay);
      }
      /**
      * `clearTimeout` cancels a timeout callback scheduled with `setTimeout`,
      * like the global `clearTimeout` function. It should be called with a
      * timer ID returned by `setTimeout`.
      *
      * @example
      * ```ts
      * import { timeoutManager } from '@tanstack/query-core'
      *
      * const timeoutId = timeoutManager.setTimeout(
      *   () => console.log('ran at:', new Date()),
      *   1000,
      * )
      *
      * timeoutManager.clearTimeout(timeoutId)
      * ```
      */
      clearTimeout(timeoutId) {
        this.#provider.clearTimeout(timeoutId);
      }
      /**
      * `setInterval` schedules a callback to be called approximately every
      * `delay` milliseconds, like the global `setInterval` function.
      *
      * Like `setTimeout`, it returns a timer ID, which may be a number or an
      * object that can be coerced to a number via `Symbol.toPrimitive`.
      *
      * @example
      * ```ts
      * import { timeoutManager } from '@tanstack/query-core'
      *
      * const intervalId = timeoutManager.setInterval(
      *   () => console.log('ran at:', new Date()),
      *   1000,
      * )
      * ```
      */
      setInterval(callback, delay) {
        if (process.env.NODE_ENV !== "production") this.#providerCalled = true;
        return this.#provider.setInterval(callback, delay);
      }
      /**
      * `clearInterval` can be used to cancel an interval, like the global
      * `clearInterval` function. It should be called with an interval ID
      * returned by `setInterval`.
      *
      * @example
      * ```ts
      * import { timeoutManager } from '@tanstack/query-core'
      *
      * const intervalId = timeoutManager.setInterval(
      *   () => console.log('ran at:', new Date()),
      *   1000,
      * )
      *
      * timeoutManager.clearInterval(intervalId)
      * ```
      */
      clearInterval(intervalId) {
        this.#provider.clearInterval(intervalId);
      }
    };
    var timeoutManager = new TimeoutManager();
    function systemSetTimeoutZero(callback) {
      setTimeout(callback, 0);
    }
    exports2.TimeoutManager = TimeoutManager;
    exports2.defaultTimeoutProvider = defaultTimeoutProvider;
    exports2.systemSetTimeoutZero = systemSetTimeoutZero;
    exports2.timeoutManager = timeoutManager;
  }
});

// node_modules/.pnpm/@tanstack+query-core@5.104.1/node_modules/@tanstack/query-core/build/modern/utils.cjs
var require_utils = __commonJS({
  "node_modules/.pnpm/@tanstack+query-core@5.104.1/node_modules/@tanstack/query-core/build/modern/utils.cjs"(exports2) {
    Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
    var require_timeoutManager2 = require_timeoutManager();
    var isServer = typeof window === "undefined" || "Deno" in globalThis;
    function noop() {
    }
    function functionalUpdate(updater, input) {
      return typeof updater === "function" ? updater(input) : updater;
    }
    function isValidTimeout(value) {
      return typeof value === "number" && value >= 0 && value !== Infinity;
    }
    function timeUntilStale(updatedAt, staleTime) {
      return Math.max(updatedAt + (staleTime || 0) - Date.now(), 0);
    }
    function resolveQueryValue(value, query) {
      return typeof value === "function" ? value(query) : value;
    }
    function matchQuery(filters, query) {
      const { type = "all", exact, fetchStatus, predicate, queryKey, stale } = filters;
      if (queryKey) {
        if (exact) {
          if (query.queryHash !== hashQueryKeyByOptions(queryKey, query.options)) return false;
        } else if (!partialMatchKey(query.queryKey, queryKey)) return false;
      }
      if (type !== "all") {
        const isActive = query.isActive();
        if (type === "active" && !isActive) return false;
        if (type === "inactive" && isActive) return false;
      }
      if (typeof stale === "boolean" && query.isStale() !== stale) return false;
      if (fetchStatus && fetchStatus !== query.state.fetchStatus) return false;
      if (predicate && !predicate(query)) return false;
      return true;
    }
    function matchMutation(filters, mutation) {
      const { exact, status, predicate, mutationKey } = filters;
      if (mutationKey) {
        if (!mutation.options.mutationKey) return false;
        if (exact) {
          if (hashKey(mutation.options.mutationKey) !== hashKey(mutationKey)) return false;
        } else if (!partialMatchKey(mutation.options.mutationKey, mutationKey)) return false;
      }
      if (status && mutation.state.status !== status) return false;
      if (predicate && !predicate(mutation)) return false;
      return true;
    }
    function hashQueryKeyByOptions(queryKey, options) {
      return (options?.queryKeyHashFn || hashKey)(queryKey);
    }
    function hashKey(queryKey) {
      return JSON.stringify(queryKey, (_, val) => isPlainObject(val) ? Object.keys(val).sort().reduce((result, key) => {
        result[key] = val[key];
        return result;
      }, {}) : val);
    }
    function partialMatchKey(a, b) {
      if (a === b) return true;
      if (typeof a !== typeof b) return false;
      if (a && b && typeof a === "object" && typeof b === "object") {
        if (Array.isArray(a) && Array.isArray(b)) {
          if (b.length > a.length) return false;
          for (let i = 0; i < b.length; i++) if (!partialMatchKey(a[i], b[i])) return false;
          return true;
        }
        const bKeys = Object.keys(b);
        for (const key of bKeys) if (!partialMatchKey(a[key], b[key])) return false;
        return true;
      }
      return false;
    }
    var hasOwn = Object.prototype.hasOwnProperty;
    function replaceEqualDeep(a, b, depth = 0) {
      if (a === b) return a;
      if (depth > 500) return b;
      const array = isPlainArray(a) && isPlainArray(b);
      if (!array && !(isPlainObject(a) && isPlainObject(b))) return b;
      const aSize = (array ? a : Object.keys(a)).length;
      const bItems = array ? b : Object.keys(b);
      const bSize = bItems.length;
      const copy = array ? new Array(bSize) : {};
      let equalItems = 0;
      for (let i = 0; i < bSize; i++) {
        const key = array ? i : bItems[i];
        const aItem = a[key];
        const bItem = b[key];
        if (aItem === bItem) {
          copy[key] = aItem;
          if (array ? i < aSize : hasOwn.call(a, key)) equalItems++;
          continue;
        }
        if (aItem === null || bItem === null || typeof aItem !== "object" || typeof bItem !== "object") {
          copy[key] = bItem;
          continue;
        }
        const v = replaceEqualDeep(aItem, bItem, depth + 1);
        copy[key] = v;
        if (v === aItem) equalItems++;
      }
      return aSize === bSize && equalItems === aSize ? a : copy;
    }
    function shallowEqualObjects(a, b) {
      if (!b || Object.keys(a).length !== Object.keys(b).length) return false;
      for (const key in a) if (a[key] !== b[key]) return false;
      return true;
    }
    function isPlainArray(value) {
      return Array.isArray(value) && value.length === Object.keys(value).length;
    }
    function isPlainObject(o) {
      if (!hasObjectPrototype(o)) return false;
      const objectPrototype = Object.getPrototypeOf(o);
      const ctor = objectPrototype?.constructor;
      if (ctor === void 0) return true;
      if (typeof ctor !== "function") return false;
      const prot = ctor.prototype;
      if (!hasObjectPrototype(prot)) return false;
      if (!prot.hasOwnProperty("isPrototypeOf")) return false;
      if (objectPrototype !== Object.prototype) return false;
      return true;
    }
    function hasObjectPrototype(o) {
      return Object.prototype.toString.call(o) === "[object Object]";
    }
    function sleep(timeout) {
      return new Promise((resolve) => {
        require_timeoutManager2.timeoutManager.setTimeout(resolve, timeout);
      });
    }
    function replaceData(prevData, data, options) {
      if (typeof options.structuralSharing === "function") return options.structuralSharing(prevData, data);
      else if (options.structuralSharing !== false) {
        if (process.env.NODE_ENV !== "production") try {
          return replaceEqualDeep(prevData, data);
        } catch (error) {
          console.error(`Structural sharing requires data to be JSON serializable. To fix this, turn off structuralSharing or return JSON-serializable data from your queryFn. [${options.queryHash}]: ${error}`);
          throw error;
        }
        return replaceEqualDeep(prevData, data);
      }
      return data;
    }
    function keepPreviousData(previousData) {
      return previousData;
    }
    function addToEnd(items, item, max = 0) {
      const newItems = [...items, item];
      return max && newItems.length > max ? newItems.slice(1) : newItems;
    }
    function addToStart(items, item, max = 0) {
      const newItems = [item, ...items];
      return max && newItems.length > max ? newItems.slice(0, -1) : newItems;
    }
    var skipToken = /* @__PURE__ */ Symbol();
    function ensureQueryFn(options, fetchOptions) {
      if (process.env.NODE_ENV !== "production") {
        if (options.queryFn === skipToken) console.error(`Attempted to invoke queryFn when set to skipToken. This is likely a configuration error. Query hash: '${options.queryHash}'`);
      }
      if (!options.queryFn && fetchOptions?.initialPromise) return () => fetchOptions.initialPromise;
      if (!options.queryFn || options.queryFn === skipToken) return () => Promise.reject(/* @__PURE__ */ new Error(`Missing queryFn: '${options.queryHash}'`));
      return options.queryFn;
    }
    function shouldThrowError(throwOnError, params) {
      if (typeof throwOnError === "function") return throwOnError(...params);
      return !!throwOnError;
    }
    function addConsumeAwareSignal(object, getSignal, onCancelled) {
      let consumed = false;
      let signal;
      Object.defineProperty(object, "signal", {
        enumerable: true,
        get: () => {
          signal ??= getSignal();
          if (consumed) return signal;
          consumed = true;
          if (signal.aborted) onCancelled();
          else signal.addEventListener("abort", onCancelled, { once: true });
          return signal;
        }
      });
      return object;
    }
    exports2.addConsumeAwareSignal = addConsumeAwareSignal;
    exports2.addToEnd = addToEnd;
    exports2.addToStart = addToStart;
    exports2.ensureQueryFn = ensureQueryFn;
    exports2.functionalUpdate = functionalUpdate;
    exports2.hashKey = hashKey;
    exports2.hashQueryKeyByOptions = hashQueryKeyByOptions;
    exports2.isPlainArray = isPlainArray;
    exports2.isPlainObject = isPlainObject;
    exports2.isServer = isServer;
    exports2.isValidTimeout = isValidTimeout;
    exports2.keepPreviousData = keepPreviousData;
    exports2.matchMutation = matchMutation;
    exports2.matchQuery = matchQuery;
    exports2.noop = noop;
    exports2.partialMatchKey = partialMatchKey;
    exports2.replaceData = replaceData;
    exports2.replaceEqualDeep = replaceEqualDeep;
    exports2.resolveQueryValue = resolveQueryValue;
    exports2.shallowEqualObjects = shallowEqualObjects;
    exports2.shouldThrowError = shouldThrowError;
    exports2.skipToken = skipToken;
    exports2.sleep = sleep;
    exports2.timeUntilStale = timeUntilStale;
  }
});

// node_modules/.pnpm/@tanstack+query-core@5.104.1/node_modules/@tanstack/query-core/build/modern/environmentManager.cjs
var require_environmentManager = __commonJS({
  "node_modules/.pnpm/@tanstack+query-core@5.104.1/node_modules/@tanstack/query-core/build/modern/environmentManager.cjs"(exports2) {
    Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
    var require_utils2 = require_utils();
    var isServerFn = () => require_utils2.isServer;
    var isServer = () => isServerFn();
    var environmentManager = {
      isServer,
      /**
      * Overrides the server check globally.
      */
      setIsServer(isServerValue) {
        isServerFn = isServerValue;
      }
    };
    exports2.environmentManager = environmentManager;
    exports2.isServer = isServer;
  }
});

// node_modules/.pnpm/@tanstack+query-core@5.104.1/node_modules/@tanstack/query-core/build/modern/subscribable.cjs
var require_subscribable = __commonJS({
  "node_modules/.pnpm/@tanstack+query-core@5.104.1/node_modules/@tanstack/query-core/build/modern/subscribable.cjs"(exports2) {
    Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
    var Subscribable = class {
      constructor() {
        this.listeners = /* @__PURE__ */ new Set();
        this.subscribe = this.subscribe.bind(this);
      }
      /**
      * Registers a listener to be called on every update this object notifies about. Returns a function
      * that removes the listener again — call it to stop listening. The base class never drops a listener
      * on its own, though some subclasses clear all of theirs in `destroy()`.
      * @param listener - Called on each update, with whatever the subclass passes to its subscribers.
      * @example
      * ```ts
      * const unsubscribe = subscribable.subscribe(() => {
      *   // react to the update
      * })
      *
      * unsubscribe()
      * ```
      */
      subscribe(listener) {
        this.listeners.add(listener);
        this.onSubscribe();
        return () => {
          this.listeners.delete(listener);
          this.onUnsubscribe();
        };
      }
      /**
      * Returns `true` while at least one listener is registered, `false` once they have all unsubscribed.
      */
      hasListeners() {
        return this.listeners.size > 0;
      }
      onSubscribe() {
      }
      onUnsubscribe() {
      }
    };
    exports2.Subscribable = Subscribable;
  }
});

// node_modules/.pnpm/@tanstack+query-core@5.104.1/node_modules/@tanstack/query-core/build/modern/focusManager.cjs
var require_focusManager = __commonJS({
  "node_modules/.pnpm/@tanstack+query-core@5.104.1/node_modules/@tanstack/query-core/build/modern/focusManager.cjs"(exports2) {
    Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
    var require_subscribable2 = require_subscribable();
    var FocusManager = class extends require_subscribable2.Subscribable {
      #focused;
      #cleanup;
      #setup;
      constructor() {
        super();
        this.#setup = (onFocus) => {
          if (typeof window !== "undefined" && window.addEventListener) {
            const listener = () => onFocus();
            window.addEventListener("visibilitychange", listener, false);
            return () => {
              window.removeEventListener("visibilitychange", listener);
            };
          }
        };
      }
      onSubscribe() {
        if (!this.#cleanup) this.setEventListener(this.#setup);
      }
      onUnsubscribe() {
        if (!this.hasListeners()) {
          this.#cleanup?.();
          this.#cleanup = void 0;
        }
      }
      /**
      * `setEventListener` can be used to set a custom event listener that will
      * be used to determine the focus state. The provided `setup` function
      * receives a `setFocused` callback: call it with a `boolean` to manually
      * set the focus state, or with no arguments to re-evaluate the current
      * focus state and notify subscribers.
      *
      * @example
      * ```ts
      * import { focusManager } from '@tanstack/query-core'
      *
      * focusManager.setEventListener((handleFocus) => {
      *   const listener = () => handleFocus()
      *   // Listen to visibilitychange
      *   if (typeof window !== 'undefined' && window.addEventListener) {
      *     window.addEventListener('visibilitychange', listener, false)
      *   }
      *
      *   return () => {
      *     // Be sure to unsubscribe if a new handler is set
      *     window.removeEventListener('visibilitychange', listener)
      *   }
      * })
      * ```
      */
      setEventListener(setup) {
        this.#setup = setup;
        this.#cleanup?.();
        this.#cleanup = setup((focused) => {
          if (typeof focused === "boolean") this.setFocused(focused);
          else this.onFocus();
        });
      }
      /**
      * `setFocused` can be used to manually set the focus state. Set `undefined`
      * to fall back to the default focus check.
      *
      * @example
      * ```ts
      * import { focusManager } from '@tanstack/query-core'
      *
      * // Set focused
      * focusManager.setFocused(true)
      *
      * // Set unfocused
      * focusManager.setFocused(false)
      *
      * // Fallback to the default focus check
      * focusManager.setFocused(undefined)
      * ```
      */
      setFocused(focused) {
        if (this.#focused !== focused) {
          this.#focused = focused;
          this.onFocus();
        }
      }
      /**
      * `onFocus` notifies all subscribed listeners with the current focus state.
      */
      onFocus() {
        const isFocused = this.isFocused();
        this.listeners.forEach((listener) => {
          listener(isFocused);
        });
      }
      /**
      * `isFocused` can be used to get the current focus state.
      */
      isFocused() {
        if (typeof this.#focused === "boolean") return this.#focused;
        return globalThis.document?.visibilityState !== "hidden";
      }
    };
    var focusManager = new FocusManager();
    exports2.FocusManager = FocusManager;
    exports2.focusManager = focusManager;
  }
});

// node_modules/.pnpm/@tanstack+query-core@5.104.1/node_modules/@tanstack/query-core/build/modern/hydration.cjs
var require_hydration = __commonJS({
  "node_modules/.pnpm/@tanstack+query-core@5.104.1/node_modules/@tanstack/query-core/build/modern/hydration.cjs"(exports2) {
    Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
    var require_utils2 = require_utils();
    function tryResolveSync(promise) {
      let data;
      promise.then((result) => {
        data = result;
        return result;
      }, require_utils2.noop)?.catch?.(require_utils2.noop);
      if (data !== void 0) return { data };
    }
    function dehydrateMutation(mutation) {
      return {
        mutationKey: mutation.options.mutationKey,
        state: mutation.state,
        ...mutation.options.scope && { scope: mutation.options.scope },
        ...mutation.meta && { meta: mutation.meta }
      };
    }
    function dehydratePromise(query, serializeData, shouldRedactErrors) {
      const promise = query.promise?.then(serializeData).catch((error) => {
        if (shouldRedactErrors?.(error) === false) return Promise.reject(error);
        if (process.env.NODE_ENV !== "production") console.error(`A query that was dehydrated as pending ended up rejecting. [${query.queryHash}]: ${error}; The error will be redacted in production builds`);
        return Promise.reject(/* @__PURE__ */ new Error("redacted"));
      });
      promise?.catch(require_utils2.noop);
      return promise;
    }
    function dehydrateQuery(query, serializeData, shouldRedactErrors) {
      return {
        dehydratedAt: Date.now(),
        state: {
          ...query.state,
          ...query.state.data !== void 0 && { data: serializeData ? serializeData(query.state.data) : query.state.data }
        },
        queryKey: query.queryKey,
        queryHash: query.queryHash,
        ...query.state.status === "pending" && { promise: dehydratePromise(query, serializeData, shouldRedactErrors) },
        ...query.meta && { meta: query.meta },
        ...query.queryType && { queryType: query.queryType }
      };
    }
    function defaultShouldDehydrateMutation(mutation) {
      return mutation.state.isPaused;
    }
    function defaultShouldDehydrateQuery(query) {
      return query.state.status === "success";
    }
    function dehydrate(client, options = {}) {
      const filterMutation = options.shouldDehydrateMutation ?? client.getDefaultOptions().dehydrate?.shouldDehydrateMutation ?? defaultShouldDehydrateMutation;
      const mutations = client.getMutationCache().getAll().flatMap((mutation) => filterMutation(mutation) ? [dehydrateMutation(mutation)] : []);
      const filterQuery = options.shouldDehydrateQuery ?? client.getDefaultOptions().dehydrate?.shouldDehydrateQuery ?? defaultShouldDehydrateQuery;
      const shouldRedactErrors = options.shouldRedactErrors ?? client.getDefaultOptions().dehydrate?.shouldRedactErrors;
      const serializeData = options.serializeData ?? client.getDefaultOptions().dehydrate?.serializeData;
      return {
        mutations,
        queries: client.getQueryCache().getAll().flatMap((query) => filterQuery(query) ? [dehydrateQuery(query, serializeData, shouldRedactErrors)] : [])
      };
    }
    function hydrate(client, dehydratedState, options) {
      const mutationCache = client.getMutationCache();
      const queryCache = client.getQueryCache();
      const deserializeData = options?.defaultOptions?.deserializeData ?? client.getDefaultOptions().hydrate?.deserializeData;
      dehydratedState.mutations?.forEach(({ state, ...mutationOptions }) => {
        mutationCache.build(client, {
          ...client.getDefaultOptions().hydrate?.mutations,
          ...options?.defaultOptions?.mutations,
          ...mutationOptions
        }, state);
      });
      dehydratedState.queries?.forEach(({ queryKey, state, queryHash, meta, promise, dehydratedAt, queryType }) => {
        const syncData = promise ? tryResolveSync(promise) : void 0;
        const rawData = state.data === void 0 ? syncData?.data : state.data;
        const data = rawData === void 0 ? rawData : deserializeData ? deserializeData(rawData) : rawData;
        let query = queryCache.get(queryHash);
        const existingQueryIsPending = query?.state.status === "pending";
        const existingQueryIsFetching = query?.state.fetchStatus === "fetching";
        if (query) {
          const hasNewerSyncData = syncData && dehydratedAt > query.state.dataUpdatedAt;
          if (state.dataUpdatedAt > query.state.dataUpdatedAt || hasNewerSyncData) {
            const { fetchStatus: _ignored, ...serializedState } = state;
            query.setState({
              ...serializedState,
              data,
              ...state.status === "pending" && data !== void 0 && {
                status: "success",
                dataUpdatedAt: dehydratedAt,
                ...!existingQueryIsFetching && { fetchStatus: "idle" }
              }
            });
          }
        } else query = queryCache.build(client, {
          ...client.getDefaultOptions().hydrate?.queries,
          ...options?.defaultOptions?.queries,
          queryKey,
          queryHash,
          meta,
          _type: queryType
        }, {
          ...state,
          data,
          fetchStatus: "idle",
          status: state.status === "pending" && data !== void 0 ? "success" : state.status,
          ...state.status === "pending" && data !== void 0 && { dataUpdatedAt: dehydratedAt }
        });
        if (promise && !syncData && !existingQueryIsPending && !existingQueryIsFetching && dehydratedAt > query.state.dataUpdatedAt) query.fetch(void 0, { initialPromise: Promise.resolve(promise).then(deserializeData) }).catch(require_utils2.noop);
      });
    }
    exports2.defaultShouldDehydrateMutation = defaultShouldDehydrateMutation;
    exports2.defaultShouldDehydrateQuery = defaultShouldDehydrateQuery;
    exports2.dehydrate = dehydrate;
    exports2.dehydrateQuery = dehydrateQuery;
    exports2.hydrate = hydrate;
  }
});

// node_modules/.pnpm/@tanstack+query-core@5.104.1/node_modules/@tanstack/query-core/build/modern/notifyManager.cjs
var require_notifyManager = __commonJS({
  "node_modules/.pnpm/@tanstack+query-core@5.104.1/node_modules/@tanstack/query-core/build/modern/notifyManager.cjs"(exports2) {
    Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
    var defaultScheduler = require_timeoutManager().systemSetTimeoutZero;
    function createNotifyManager() {
      let queue = [];
      let transactions = 0;
      let notifyFn = (callback) => {
        callback();
      };
      let batchNotifyFn = (callback) => {
        callback();
      };
      let scheduleFn = defaultScheduler;
      const schedule = (callback) => {
        if (transactions) queue.push(callback);
        else scheduleFn(() => {
          notifyFn(callback);
        });
      };
      const flush = () => {
        const originalQueue = queue;
        queue = [];
        if (originalQueue.length) scheduleFn(() => {
          batchNotifyFn(() => {
            originalQueue.forEach((callback) => {
              notifyFn(callback);
            });
          });
        });
      };
      return {
        /**
        * Batches all updates scheduled inside the passed callback.
        * This is mainly used internally to optimize query client updating.
        * Batches can be nested; the queue is only flushed once the outermost `batch` call finishes.
        * The return value of `callback` is passed through.
        */
        batch: (callback) => {
          let result;
          transactions++;
          try {
            result = callback();
          } finally {
            transactions--;
            if (!transactions) flush();
          }
          return result;
        },
        /**
        * All calls to the wrapped function will be batched.
        */
        batchCalls: (callback) => {
          return (...args) => {
            schedule(() => {
              callback(...args);
            });
          };
        },
        /**
        * Schedules a function to be run on the next batch.
        * By default, the batch is run with a `setTimeout`, but this can be configured via `setScheduler`.
        */
        schedule,
        /**
        * Use this method to set a custom notify function.
        * This can be used to for example wrap notifications with `React.act` while running tests.
        */
        setNotifyFunction: (fn) => {
          notifyFn = fn;
        },
        /**
        * Use this method to set a custom function to batch notifications together into a single tick.
        * Framework adapters use this to plug in their own batching primitive, so that a single query
        * update only triggers one re-render instead of one per subscriber.
        *
        * @example
        * ```ts
        * import { notifyManager } from '@tanstack/query-core'
        * import { batch } from 'solid-js'
        *
        * notifyManager.setBatchNotifyFunction(batch)
        * ```
        */
        setBatchNotifyFunction: (fn) => {
          batchNotifyFn = fn;
        },
        /**
        * Configures a custom callback that schedules when the next batch runs.
        * The default behavior is `setTimeout(callback, 0)`.
        *
        * @example
        * ```ts
        * import { notifyManager } from '@tanstack/query-core'
        *
        * // Schedule batches in the next microtask
        * notifyManager.setScheduler(queueMicrotask)
        *
        * // Schedule batches before the next frame is rendered
        * notifyManager.setScheduler(requestAnimationFrame)
        *
        * // Schedule batches some time in the future
        * notifyManager.setScheduler((cb) => setTimeout(cb, 10))
        * ```
        */
        setScheduler: (fn) => {
          scheduleFn = fn;
        }
      };
    }
    var notifyManager = createNotifyManager();
    exports2.createNotifyManager = createNotifyManager;
    exports2.defaultScheduler = defaultScheduler;
    exports2.notifyManager = notifyManager;
  }
});

// node_modules/.pnpm/@tanstack+query-core@5.104.1/node_modules/@tanstack/query-core/build/modern/onlineManager.cjs
var require_onlineManager = __commonJS({
  "node_modules/.pnpm/@tanstack+query-core@5.104.1/node_modules/@tanstack/query-core/build/modern/onlineManager.cjs"(exports2) {
    Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
    var require_subscribable2 = require_subscribable();
    var OnlineManager = class extends require_subscribable2.Subscribable {
      #online = true;
      #cleanup;
      #setup;
      constructor() {
        super();
        this.#setup = (onOnline) => {
          if (typeof window !== "undefined" && window.addEventListener) {
            const onlineListener = () => onOnline(true);
            const offlineListener = () => onOnline(false);
            window.addEventListener("online", onlineListener, false);
            window.addEventListener("offline", offlineListener, false);
            return () => {
              window.removeEventListener("online", onlineListener);
              window.removeEventListener("offline", offlineListener);
            };
          }
        };
      }
      onSubscribe() {
        if (!this.#cleanup) this.setEventListener(this.#setup);
      }
      onUnsubscribe() {
        if (!this.hasListeners()) {
          this.#cleanup?.();
          this.#cleanup = void 0;
        }
      }
      /**
      * `setEventListener` can be used to set a custom event listener that will
      * be used to determine the online state. The provided `setup` function
      * receives a `setOnline` callback that should be called with a `boolean`
      * whenever the online state changes.
      *
      * @example
      * ```ts
      * import NetInfo from '@react-native-community/netinfo'
      * import { onlineManager } from '@tanstack/query-core'
      *
      * onlineManager.setEventListener((setOnline) => {
      *   return NetInfo.addEventListener((state) => {
      *     setOnline(!!state.isConnected)
      *   })
      * })
      * ```
      */
      setEventListener(setup) {
        this.#setup = setup;
        this.#cleanup?.();
        this.#cleanup = setup(this.setOnline.bind(this));
      }
      /**
      * `setOnline` can be used to manually set the online state.
      *
      * @example
      * ```ts
      * import { onlineManager } from '@tanstack/query-core'
      *
      * // Set to online
      * onlineManager.setOnline(true)
      *
      * // Set to offline
      * onlineManager.setOnline(false)
      * ```
      */
      setOnline(online) {
        if (this.#online !== online) {
          this.#online = online;
          this.listeners.forEach((listener) => {
            listener(online);
          });
        }
      }
      /**
      * `isOnline` can be used to get the current online state.
      */
      isOnline() {
        return this.#online;
      }
    };
    var onlineManager = new OnlineManager();
    exports2.OnlineManager = OnlineManager;
    exports2.onlineManager = onlineManager;
  }
});

// node_modules/.pnpm/@tanstack+query-core@5.104.1/node_modules/@tanstack/query-core/build/modern/retryer.cjs
var require_retryer = __commonJS({
  "node_modules/.pnpm/@tanstack+query-core@5.104.1/node_modules/@tanstack/query-core/build/modern/retryer.cjs"(exports2) {
    Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
    var require_utils2 = require_utils();
    var require_environmentManager2 = require_environmentManager();
    var require_focusManager2 = require_focusManager();
    var require_onlineManager2 = require_onlineManager();
    function defaultRetryDelay(failureCount) {
      return Math.min(1e3 * 2 ** failureCount, 3e4);
    }
    function canFetch(networkMode) {
      return (networkMode ?? "online") === "online" ? require_onlineManager2.onlineManager.isOnline() : true;
    }
    var CancelledError = class extends Error {
      constructor(options) {
        super("CancelledError");
        this.revert = options?.revert;
        this.silent = options?.silent;
      }
    };
    function isCancelledError(value) {
      return value instanceof CancelledError;
    }
    function createRetryer(config) {
      let isRetryCancelled = false;
      let failureCount = 0;
      let continueFn;
      let status = "pending";
      let promiseResolve;
      let promiseReject;
      const promise = new Promise((resolve2, reject2) => {
        promiseResolve = resolve2;
        promiseReject = reject2;
      });
      promise.catch(require_utils2.noop);
      const isResolved = () => status !== "pending";
      const cancel = (cancelOptions) => {
        if (!isResolved()) {
          const error = new CancelledError(cancelOptions);
          reject(error);
          config.onCancel?.(error);
        }
      };
      const cancelRetry = () => {
        isRetryCancelled = true;
      };
      const continueRetry = () => {
        isRetryCancelled = false;
      };
      const canContinue = () => require_focusManager2.focusManager.isFocused() && (config.networkMode === "always" || require_onlineManager2.onlineManager.isOnline()) && config.canRun();
      const canStart = () => canFetch(config.networkMode) && config.canRun();
      const resolve = (value) => {
        if (!isResolved()) {
          continueFn?.();
          status = "resolved";
          promiseResolve(value);
        }
      };
      const reject = (value) => {
        if (!isResolved()) {
          continueFn?.();
          status = "rejected";
          promiseReject(value);
        }
      };
      const pause = () => {
        return new Promise((continueResolve) => {
          continueFn = (value) => {
            if (isResolved() || canContinue()) continueResolve(value);
          };
          config.onPause?.();
        }).then(() => {
          continueFn = void 0;
          if (!isResolved()) config.onContinue?.();
        });
      };
      const run = () => {
        if (isResolved()) return;
        let promiseOrValue;
        const initialPromise = failureCount === 0 ? config.initialPromise : void 0;
        try {
          promiseOrValue = initialPromise ?? config.fn();
        } catch (error) {
          promiseOrValue = Promise.reject(error);
        }
        Promise.resolve(promiseOrValue).then(resolve).catch((error) => {
          if (isResolved()) return;
          const retry = config.retry ?? (require_environmentManager2.isServer() ? 0 : 3);
          const retryDelay = config.retryDelay ?? defaultRetryDelay;
          const delay = typeof retryDelay === "function" ? retryDelay(failureCount, error) : retryDelay;
          const shouldRetry = retry === true || typeof retry === "number" && failureCount < retry || typeof retry === "function" && retry(failureCount, error);
          if (isRetryCancelled || !shouldRetry) {
            reject(error);
            return;
          }
          failureCount++;
          config.onFail?.(failureCount, error);
          require_utils2.sleep(delay).then(() => {
            return canContinue() ? void 0 : pause();
          }).then(() => {
            if (isRetryCancelled) reject(error);
            else run();
          });
        });
      };
      return {
        promise,
        status: () => status,
        cancel,
        continue: () => {
          continueFn?.();
          return promise;
        },
        cancelRetry,
        continueRetry,
        canStart,
        start: () => {
          if (canStart()) run();
          else pause().then(run);
          return promise;
        }
      };
    }
    exports2.CancelledError = CancelledError;
    exports2.canFetch = canFetch;
    exports2.createRetryer = createRetryer;
    exports2.isCancelledError = isCancelledError;
  }
});

// node_modules/.pnpm/@tanstack+query-core@5.104.1/node_modules/@tanstack/query-core/build/modern/removable.cjs
var require_removable = __commonJS({
  "node_modules/.pnpm/@tanstack+query-core@5.104.1/node_modules/@tanstack/query-core/build/modern/removable.cjs"(exports2) {
    Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
    var require_timeoutManager2 = require_timeoutManager();
    var require_utils2 = require_utils();
    var require_environmentManager2 = require_environmentManager();
    var Removable = class {
      #gcTimeout;
      /**
      * Clears the pending garbage collection timeout, so the entry is no longer scheduled for removal.
      * A subclass may override this to release what it holds on to as well — `Query` also cancels any
      * in-flight fetch.
      */
      destroy() {
        this.clearGcTimeout();
      }
      scheduleGc() {
        this.clearGcTimeout();
        if (require_utils2.isValidTimeout(this.gcTime)) this.#gcTimeout = require_timeoutManager2.timeoutManager.setTimeout(() => {
          this.optionalRemove();
        }, this.gcTime);
      }
      updateGcTime(newGcTime) {
        this.gcTime = Math.max(this.gcTime || 0, newGcTime ?? (require_environmentManager2.isServer() ? Infinity : 3e5));
      }
      clearGcTimeout() {
        if (this.#gcTimeout !== void 0) {
          require_timeoutManager2.timeoutManager.clearTimeout(this.#gcTimeout);
          this.#gcTimeout = void 0;
        }
      }
    };
    exports2.Removable = Removable;
  }
});

// node_modules/.pnpm/@tanstack+query-core@5.104.1/node_modules/@tanstack/query-core/build/modern/infiniteQueryBehavior.cjs
var require_infiniteQueryBehavior = __commonJS({
  "node_modules/.pnpm/@tanstack+query-core@5.104.1/node_modules/@tanstack/query-core/build/modern/infiniteQueryBehavior.cjs"(exports2) {
    Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
    var require_utils2 = require_utils();
    function infiniteQueryBehavior(pages) {
      return { onFetch: (context, query) => {
        const options = context.options;
        const direction = context.fetchOptions?.meta?.fetchMore?.direction;
        const oldPages = context.state.data?.pages || [];
        const oldPageParams = context.state.data?.pageParams || [];
        let result = {
          pages: [],
          pageParams: []
        };
        let currentPage = 0;
        const fetchFn = async () => {
          let cancelled = false;
          const addSignalProperty = (object) => {
            require_utils2.addConsumeAwareSignal(object, () => context.signal, () => cancelled = true);
          };
          const queryFn = require_utils2.ensureQueryFn(context.options, context.fetchOptions);
          const fetchPage = async (data, param, previous) => {
            if (cancelled) return Promise.reject(context.signal.reason);
            if (param == null && data.pages.length) return Promise.resolve(data);
            const createQueryFnContext = () => {
              const queryFnContext2 = {
                client: context.client,
                queryKey: context.queryKey,
                pageParam: param,
                direction: previous ? "backward" : "forward",
                meta: context.options.meta
              };
              addSignalProperty(queryFnContext2);
              return queryFnContext2;
            };
            const queryFnContext = createQueryFnContext();
            const page = await queryFn(queryFnContext);
            const { maxPages } = context.options;
            const addTo = previous ? require_utils2.addToStart : require_utils2.addToEnd;
            return {
              pages: addTo(data.pages, page, maxPages),
              pageParams: addTo(data.pageParams, param, maxPages)
            };
          };
          if (direction && oldPages.length) {
            const previous = direction === "backward";
            const pageParamFn = previous ? getPreviousPageParam : getNextPageParam;
            const oldData = {
              pages: oldPages,
              pageParams: oldPageParams
            };
            result = await fetchPage(oldData, pageParamFn(options, oldData), previous);
          } else {
            const remainingPages = pages ?? oldPages.length;
            do {
              const param = currentPage === 0 ? oldPageParams[0] ?? options.initialPageParam : getNextPageParam(options, result);
              if (currentPage > 0 && param == null) break;
              result = await fetchPage(result, param);
              currentPage++;
            } while (currentPage < remainingPages);
          }
          return result;
        };
        if (context.options.persister) context.fetchFn = () => {
          return context.options.persister?.(fetchFn, {
            client: context.client,
            queryKey: context.queryKey,
            meta: context.options.meta,
            signal: context.signal
          }, query);
        };
        else context.fetchFn = fetchFn;
      } };
    }
    function getNextPageParam(options, { pages, pageParams }) {
      const lastIndex = pages.length - 1;
      return pages.length > 0 ? options.getNextPageParam(pages[lastIndex], pages, pageParams[lastIndex], pageParams) : void 0;
    }
    function getPreviousPageParam(options, { pages, pageParams }) {
      return pages.length > 0 ? options.getPreviousPageParam?.(pages[0], pages, pageParams[0], pageParams) : void 0;
    }
    function hasNextPage(options, data) {
      if (!data) return false;
      return getNextPageParam(options, data) != null;
    }
    function hasPreviousPage(options, data) {
      if (!data || !options.getPreviousPageParam) return false;
      return getPreviousPageParam(options, data) != null;
    }
    exports2.hasNextPage = hasNextPage;
    exports2.hasPreviousPage = hasPreviousPage;
    exports2.infiniteQueryBehavior = infiniteQueryBehavior;
  }
});

// node_modules/.pnpm/@tanstack+query-core@5.104.1/node_modules/@tanstack/query-core/build/modern/query.cjs
var require_query = __commonJS({
  "node_modules/.pnpm/@tanstack+query-core@5.104.1/node_modules/@tanstack/query-core/build/modern/query.cjs"(exports2) {
    Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
    var require_utils2 = require_utils();
    var require_notifyManager2 = require_notifyManager();
    var require_retryer2 = require_retryer();
    var require_removable2 = require_removable();
    var require_infiniteQueryBehavior2 = require_infiniteQueryBehavior();
    var Query = class extends require_removable2.Removable {
      #queryType;
      #initialState;
      #revertState;
      #cache;
      #client;
      #retryer;
      #defaultOptions;
      #abortSignalConsumed;
      constructor(config) {
        super();
        this.#abortSignalConsumed = false;
        this.#defaultOptions = config.defaultOptions;
        this.setOptions(config.options);
        this.observers = [];
        this.#client = config.client;
        this.#cache = this.#client.getQueryCache();
        this.queryKey = config.queryKey;
        this.queryHash = config.queryHash;
        this.#initialState = getDefaultState(this.options);
        this.state = config.state ?? this.#initialState;
        this.scheduleGc();
      }
      /**
      * The `meta` object passed in the query's options, if any.
      */
      get meta() {
        return this.options.meta;
      }
      /** @internal */
      get queryType() {
        return this.#queryType;
      }
      /**
      * The promise for the currently in-flight fetch, if the query is fetching.
      * `undefined` when the query is not fetching.
      */
      get promise() {
        return this.#retryer?.promise;
      }
      /** @internal */
      setOptions(options) {
        this.options = {
          ...this.#defaultOptions,
          ...options
        };
        if (options?._type) this.#queryType = options._type;
        this.updateGcTime(this.options.gcTime);
        if (this.state && this.state.data === void 0) {
          const defaultState = getDefaultState(this.options);
          if (defaultState.data !== void 0) {
            this.setState(successState(defaultState.data, defaultState.dataUpdatedAt));
            this.#initialState = defaultState;
          }
        }
      }
      optionalRemove() {
        if (!this.observers.length && this.state.fetchStatus === "idle") this.#cache.remove(this);
      }
      /** @internal */
      setData(newData, options) {
        const data = require_utils2.replaceData(this.state.data, newData, this.options);
        this.#dispatch({
          data,
          type: "success",
          dataUpdatedAt: options?.updatedAt,
          manual: options?.manual
        });
        return data;
      }
      /**
      * Merges the given partial state directly into this query's state, notifying observers. Used
      * by persistence and broadcast plugins to restore a state snapshot, and by devtools to let a
      * user manually trigger a loading/error state or edit the cached data.
      */
      setState(state) {
        this.#dispatch({
          type: "setState",
          state
        });
      }
      /**
      * Cancels the query's currently in-flight fetch, if any.
      * - Returns a promise that resolves once the cancellation has settled.
      * - If no fetch is in progress, resolves immediately.
      *
      * @example
      * ```ts
      * await query.cancel()
      * ```
      */
      cancel(options) {
        const promise = this.#retryer?.promise;
        this.#retryer?.cancel(options);
        return promise ? promise.then(require_utils2.noop).catch(require_utils2.noop) : Promise.resolve();
      }
      /**
      * Clears the query's garbage collection timeout and silently cancels any
      * in-flight fetch. Called by `QueryCache` when the query is removed from
      * the cache.
      *
      * @see {@link Query#cancel}
      */
      destroy() {
        super.destroy();
        this.cancel({ silent: true });
      }
      /** @internal */
      get resetState() {
        return this.#initialState;
      }
      /**
      * Resets the query back to its initial state (the state it had when it was
      * first created, e.g. any `initialData`), destroying it first to cancel any
      * in-flight fetch.
      */
      reset() {
        this.destroy();
        this.setState(this.resetState);
      }
      /**
      * Returns `true` if the query has at least one observer for which `enabled`
      * does not resolve to `false`.
      */
      isActive() {
        return this.observers.some((observer) => require_utils2.resolveQueryValue(observer.options.enabled, this) !== false);
      }
      /**
      * Returns `true` if the query is disabled, meaning it will not fetch
      * automatically.
      * - If the query has observers, it is disabled when none of them are active
      *   (see `isActive`).
      * - If the query has no observers, it is disabled when its `queryFn` is
      *   `skipToken` or it has never been fetched.
      */
      isDisabled() {
        if (this.getObserversCount() > 0) return !this.isActive();
        return this.options.queryFn === require_utils2.skipToken || !this.isFetched();
      }
      /**
      * Returns `true` if the query has been fetched, i.e. it has resolved with
      * either data or an error at least once.
      */
      isFetched() {
        return this.state.dataUpdateCount + this.state.errorUpdateCount > 0;
      }
      /**
      * Returns `true` if the query has at least one observer configured with
      * `staleTime: 'static'`, meaning it is treated as never stale.
      */
      isStatic() {
        if (this.getObserversCount() > 0) return this.observers.some((observer) => require_utils2.resolveQueryValue(observer.options.staleTime, this) === "static");
        return false;
      }
      /**
      * Returns `true` if the query is stale.
      * - If the query has observers, defers to whether any observer's current
      *   result reports `isStale` (which accounts for each observer's own
      *   `staleTime` and `enabled` state).
      * - If the query has no observers, it is considered stale when it has no
      *   data or has been invalidated.
      *
      * @see {@link Query#isStaleByTime}
      * @example
      * ```ts
      * if (query.isStale()) {
      *   // refetch or otherwise treat the cached data as outdated
      * }
      * ```
      */
      isStale() {
        if (this.getObserversCount() > 0) return this.observers.some((observer) => observer.getCurrentResult().isStale);
        return this.state.data === void 0 || this.state.isInvalidated;
      }
      /**
      * Returns `true` if the query's data is stale relative to the given
      * `staleTime` (defaults to `0`).
      * - A query with no data is always stale.
      * - `staleTime: 'static'` is never stale.
      * - An invalidated query is always stale.
      * - Otherwise, staleness is based on elapsed time since `dataUpdatedAt`.
      *
      * @see {@link Query#isStale}
      * @example
      * ```ts
      * const isStale = query.isStaleByTime(1000 * 60)
      * ```
      */
      isStaleByTime(staleTime = 0) {
        if (this.state.data === void 0) return true;
        if (staleTime === "static") return false;
        if (this.state.isInvalidated) return true;
        return !require_utils2.timeUntilStale(this.state.dataUpdatedAt, staleTime);
      }
      /** @internal */
      onFocus() {
        this.observers.find((x) => x.shouldFetchOnWindowFocus())?.refetch({ cancelRefetch: false });
        this.#retryer?.continue();
      }
      /** @internal */
      onOnline() {
        this.observers.find((x) => x.shouldFetchOnReconnect())?.refetch({ cancelRefetch: false });
        this.#retryer?.continue();
      }
      /** @internal */
      addObserver(observer) {
        if (!this.observers.includes(observer)) {
          this.observers.push(observer);
          this.clearGcTimeout();
          this.#cache.notify({
            type: "observerAdded",
            query: this,
            observer
          });
        }
      }
      /** @internal */
      removeObserver(observer) {
        const index = this.observers.indexOf(observer);
        if (index !== -1) {
          this.observers.splice(index, 1);
          if (!this.observers.length) {
            if (this.#retryer) {
              if (this.#abortSignalConsumed || this.state.fetchStatus === "paused" && this.state.status === "pending") this.#retryer.cancel({ revert: true });
              else this.#retryer.cancelRetry();
            }
            this.scheduleGc();
          }
          this.#cache.notify({
            type: "observerRemoved",
            query: this,
            observer
          });
        }
      }
      /**
      * Returns the number of observers currently subscribed to this query.
      *
      * @example
      * ```ts
      * if (query.getObserversCount() === 0) {
      *   // no component is currently watching this query
      * }
      * ```
      */
      getObserversCount() {
        return this.observers.length;
      }
      /**
      * Marks the query as invalidated, unless it is already invalidated. This
      * updates `state.isInvalidated` and notifies observers, but does not by
      * itself trigger a refetch.
      *
      * @example
      * ```ts
      * query.invalidate()
      * ```
      */
      invalidate() {
        if (!this.state.isInvalidated) this.#dispatch({ type: "invalidate" });
      }
      /**
      * Fetches the query, i.e. runs its `queryFn` (through any configured
      * retryer/behavior) and updates the query's state with the result.
      * - If a fetch is already in flight, returns its promise instead of
      *   starting a new one, unless `fetchOptions.cancelRefetch` is set and the
      *   query already has data, in which case the current fetch is silently
      *   cancelled first.
      * - If `options` is passed, it replaces the query's current options
      *   before fetching.
      */
      async fetch(options, fetchOptions) {
        if (this.state.fetchStatus !== "idle" && this.#retryer?.status() !== "rejected") {
          if (this.state.data !== void 0 && fetchOptions?.cancelRefetch) this.cancel({ silent: true });
          else if (this.#retryer) {
            this.#retryer.continueRetry();
            return this.#retryer.promise;
          }
        }
        if (options) this.setOptions(options);
        if (!this.options.queryFn) {
          const observer = this.observers.find((x) => x.options.queryFn);
          if (observer) this.setOptions(observer.options);
        }
        if (process.env.NODE_ENV !== "production") {
          if (!Array.isArray(this.options.queryKey)) console.error(`As of v4, queryKey needs to be an Array. If you are using a string like 'repoData', please change it to an Array, e.g. ['repoData']`);
        }
        const abortController = new AbortController();
        const addSignalProperty = (object) => {
          Object.defineProperty(object, "signal", {
            enumerable: true,
            get: () => {
              this.#abortSignalConsumed = true;
              return abortController.signal;
            }
          });
        };
        const fetchFn = () => {
          const queryFn = require_utils2.ensureQueryFn(this.options, fetchOptions);
          const createQueryFnContext = () => {
            const queryFnContext2 = {
              client: this.#client,
              queryKey: this.queryKey,
              meta: this.meta
            };
            addSignalProperty(queryFnContext2);
            return queryFnContext2;
          };
          const queryFnContext = createQueryFnContext();
          this.#abortSignalConsumed = false;
          if (this.options.persister) return this.options.persister(queryFn, queryFnContext, this);
          return queryFn(queryFnContext);
        };
        const createFetchContext = () => {
          const context2 = {
            fetchOptions,
            options: this.options,
            queryKey: this.queryKey,
            client: this.#client,
            state: this.state,
            fetchFn
          };
          addSignalProperty(context2);
          return context2;
        };
        const context = createFetchContext();
        (this.#queryType === "infinite" ? require_infiniteQueryBehavior2.infiniteQueryBehavior(this.options.pages) : this.options.behavior)?.onFetch(context, this);
        this.#revertState = this.state;
        if (this.state.fetchStatus === "idle" || this.state.fetchMeta !== context.fetchOptions?.meta) this.#dispatch({
          type: "fetch",
          meta: context.fetchOptions?.meta
        });
        const retryer = this.#retryer = require_retryer2.createRetryer({
          initialPromise: fetchOptions?.initialPromise,
          fn: context.fetchFn,
          onCancel: (error) => {
            if (error instanceof require_retryer2.CancelledError && error.revert) this.setState({
              ...this.#revertState,
              fetchStatus: "idle"
            });
            abortController.abort();
          },
          onFail: (failureCount, error) => {
            this.#dispatch({
              type: "failed",
              failureCount,
              error
            });
          },
          onPause: () => {
            this.#dispatch({ type: "pause" });
          },
          onContinue: () => {
            this.#dispatch({ type: "continue" });
          },
          retry: context.options.retry,
          retryDelay: context.options.retryDelay,
          networkMode: context.options.networkMode,
          canRun: () => true
        });
        try {
          const data = await retryer.start();
          if (data === void 0) {
            if (process.env.NODE_ENV !== "production") console.error(`Query data cannot be undefined. Please make sure to return a value other than undefined from your query function. Affected query key: ${this.queryHash}`);
            throw new Error(`${this.queryHash} data is undefined`);
          }
          this.setData(data);
          this.#cache.config.onSuccess?.(data, this);
          this.#cache.config.onSettled?.(data, this.state.error, this);
          return data;
        } catch (error) {
          if (error instanceof require_retryer2.CancelledError) {
            if (error.silent) return this.#retryer.promise;
            else if (error.revert) {
              if (this.state.data === void 0) throw error;
              return this.state.data;
            }
          }
          this.#dispatch({
            type: "error",
            error
          });
          this.#cache.config.onError?.(error, this);
          this.#cache.config.onSettled?.(this.state.data, error, this);
          throw error;
        } finally {
          if (this.#retryer === retryer) this.#retryer = void 0;
          this.scheduleGc();
        }
      }
      #dispatch(action) {
        const reducer = (state) => {
          switch (action.type) {
            case "failed":
              return {
                ...state,
                fetchFailureCount: action.failureCount,
                fetchFailureReason: action.error
              };
            case "pause":
              return {
                ...state,
                fetchStatus: "paused"
              };
            case "continue":
              return {
                ...state,
                fetchStatus: "fetching"
              };
            case "fetch":
              return {
                ...state,
                ...fetchState(state.data, this.options),
                fetchMeta: action.meta ?? null
              };
            case "success":
              const newState = {
                ...state,
                ...successState(action.data, action.dataUpdatedAt),
                dataUpdateCount: state.dataUpdateCount + 1,
                ...!action.manual && {
                  fetchStatus: "idle",
                  fetchFailureCount: 0,
                  fetchFailureReason: null
                }
              };
              this.#revertState = action.manual ? newState : void 0;
              return newState;
            case "error":
              const error = action.error;
              return {
                ...state,
                error,
                errorUpdateCount: state.errorUpdateCount + 1,
                errorUpdatedAt: Date.now(),
                fetchFailureCount: state.fetchFailureCount + 1,
                fetchFailureReason: error,
                fetchStatus: "idle",
                status: "error",
                isInvalidated: true
              };
            case "invalidate":
              return {
                ...state,
                isInvalidated: true
              };
            case "setState":
              return {
                ...state,
                ...action.state
              };
          }
        };
        this.state = reducer(this.state);
        require_notifyManager2.notifyManager.batch(() => {
          this.observers.slice().forEach((observer) => {
            observer.onQueryUpdate();
          });
          this.#cache.notify({
            query: this,
            type: "updated",
            action
          });
        });
      }
    };
    function fetchState(data, options) {
      return {
        fetchFailureCount: 0,
        fetchFailureReason: null,
        fetchStatus: require_retryer2.canFetch(options.networkMode) ? "fetching" : "paused",
        ...data === void 0 && {
          error: null,
          status: "pending"
        }
      };
    }
    function successState(data, dataUpdatedAt) {
      return {
        data,
        dataUpdatedAt: dataUpdatedAt ?? Date.now(),
        error: null,
        isInvalidated: false,
        status: "success"
      };
    }
    function getDefaultState(options) {
      const data = typeof options.initialData === "function" ? options.initialData() : options.initialData;
      const hasData = data !== void 0;
      const initialDataUpdatedAt = hasData ? typeof options.initialDataUpdatedAt === "function" ? options.initialDataUpdatedAt() : options.initialDataUpdatedAt : 0;
      return {
        data,
        dataUpdateCount: 0,
        dataUpdatedAt: hasData ? initialDataUpdatedAt ?? Date.now() : 0,
        error: null,
        errorUpdateCount: 0,
        errorUpdatedAt: 0,
        fetchFailureCount: 0,
        fetchFailureReason: null,
        fetchMeta: null,
        isInvalidated: false,
        status: hasData ? "success" : "pending",
        fetchStatus: "idle"
      };
    }
    exports2.Query = Query;
    exports2.fetchState = fetchState;
  }
});

// node_modules/.pnpm/@tanstack+query-core@5.104.1/node_modules/@tanstack/query-core/build/modern/queryObserver.cjs
var require_queryObserver = __commonJS({
  "node_modules/.pnpm/@tanstack+query-core@5.104.1/node_modules/@tanstack/query-core/build/modern/queryObserver.cjs"(exports2) {
    Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
    var require_timeoutManager2 = require_timeoutManager();
    var require_utils2 = require_utils();
    var require_environmentManager2 = require_environmentManager();
    var require_subscribable2 = require_subscribable();
    var require_focusManager2 = require_focusManager();
    var require_notifyManager2 = require_notifyManager();
    var require_query2 = require_query();
    var QueryObserver = class extends require_subscribable2.Subscribable {
      #client;
      #currentQuery = void 0;
      #currentQueryInitialState = void 0;
      #currentResult = void 0;
      #currentResultState;
      #currentResultOptions;
      #selectError;
      #selectFn;
      #selectResult;
      #lastQueryWithDefinedData;
      #staleTimeoutId;
      #refetchIntervalId;
      #currentRefetchInterval;
      #trackedProps = /* @__PURE__ */ new Set();
      constructor(client, options) {
        super();
        this.options = options;
        this.#client = client;
        this.#selectError = null;
        this.bindMethods();
        this.setOptions(options);
      }
      bindMethods() {
        this.refetch = this.refetch.bind(this);
      }
      onSubscribe() {
        if (this.listeners.size === 1) {
          this.#currentQuery.addObserver(this);
          if (shouldFetchOnMount(this.#currentQuery, this.options)) this.#executeFetch();
          else this.updateResult();
          this.#updateTimers();
        }
      }
      onUnsubscribe() {
        if (!this.hasListeners()) this.destroy();
      }
      /**
      * Returns whether the observed query is currently stale and configured
      * (via the `refetchOnReconnect` option) to refetch when the network
      * reconnects.
      */
      shouldFetchOnReconnect() {
        return shouldFetchOn(this.#currentQuery, this.options, this.options.refetchOnReconnect);
      }
      /**
      * Returns whether the observed query is currently stale and configured
      * (via the `refetchOnWindowFocus` option) to refetch when the window
      * regains focus.
      */
      shouldFetchOnWindowFocus() {
        return shouldFetchOn(this.#currentQuery, this.options, this.options.refetchOnWindowFocus);
      }
      /**
      * Stops observing the current query: clears all listeners, cancels the
      * stale and refetch-interval timers, and removes this observer from the
      * query it was observing.
      */
      destroy() {
        this.listeners = /* @__PURE__ */ new Set();
        this.#clearStaleTimeout();
        this.#clearRefetchInterval();
        this.#currentQuery.removeObserver(this);
      }
      /**
      * Updates the observer's options. This will re-resolve the query being
      * observed (switching to a different query if the `queryKey` changed),
      * trigger a fetch if the new options require one and the observer has
      * subscribers, recompute the current result, and reschedule the stale and
      * refetch-interval timers as needed.
      *
      * @example
      * ```ts
      * observer.setOptions({ queryKey: ['posts', 1], queryFn: () => fetchPost(1) })
      * // later: switch to a different query, reusing the same observer
      * observer.setOptions({ queryKey: ['posts', 2], queryFn: () => fetchPost(2) })
      * ```
      */
      setOptions(options) {
        const prevOptions = this.options;
        const prevQuery = this.#currentQuery;
        this.options = this.#client.defaultQueryOptions(options);
        if (this.options.enabled !== void 0 && typeof this.options.enabled !== "boolean" && typeof this.options.enabled !== "function" && typeof require_utils2.resolveQueryValue(this.options.enabled, this.#currentQuery) !== "boolean") throw new Error("Expected enabled to be a boolean or a callback that returns a boolean");
        this.#updateQuery();
        this.#currentQuery.setOptions(this.options);
        if (prevOptions._defaulted && !require_utils2.shallowEqualObjects(this.options, prevOptions)) this.#client.getQueryCache().notify({
          type: "observerOptionsUpdated",
          query: this.#currentQuery,
          observer: this
        });
        const mounted = this.hasListeners();
        if (mounted && shouldFetchOptionally(this.#currentQuery, prevQuery, this.options, prevOptions)) this.#executeFetch();
        this.updateResult();
        if (mounted && (this.#currentQuery !== prevQuery || require_utils2.resolveQueryValue(this.options.enabled, this.#currentQuery) !== require_utils2.resolveQueryValue(prevOptions.enabled, this.#currentQuery) || require_utils2.resolveQueryValue(this.options.staleTime, this.#currentQuery) !== require_utils2.resolveQueryValue(prevOptions.staleTime, this.#currentQuery))) this.#updateStaleTimeout();
        const nextRefetchInterval = this.#computeRefetchInterval();
        if (mounted && (this.#currentQuery !== prevQuery || require_utils2.resolveQueryValue(this.options.enabled, this.#currentQuery) !== require_utils2.resolveQueryValue(prevOptions.enabled, this.#currentQuery) || nextRefetchInterval !== this.#currentRefetchInterval)) this.#updateRefetchInterval(nextRefetchInterval);
      }
      /**
      * Computes the result the observer would produce for the given (already-defaulted) options
      * right now, building the underlying `Query` if it doesn't exist yet, without waiting for a
      * subscription callback. Called by framework adapters on every render (e.g. `useQuery`) so the
      * returned value is available synchronously, ahead of `setOptions` triggering an actual fetch.
      */
      getOptimisticResult(options) {
        const query = this.#client.getQueryCache().build(this.#client, options);
        const result = this.createResult(query, options);
        if (!require_utils2.shallowEqualObjects(this.getCurrentResult(), result)) {
          this.#currentResult = result;
          this.#currentResultOptions = this.options;
          this.#currentResultState = this.#currentQuery.state;
        }
        return result;
      }
      /**
      * Returns the most recently computed `QueryObserverResult` for the
      * observed query. This is a point-in-time read; to be notified of updates
      * as they happen, subscribe to the observer instead (its inherited
      * `subscribe` method).
      *
      * @example
      * ```ts
      * const result = observer.getCurrentResult()
      * console.log(result.status, result.data)
      * ```
      */
      getCurrentResult() {
        return this.#currentResult;
      }
      /**
      * Wraps a `QueryObserverResult` in a `Proxy` that records which properties are read, via
      * {@link QueryObserver#trackProp} (and an optional `onPropTracked` callback). Used by framework
      * adapters when `notifyOnChangeProps` is not set, to implement its default "only re-render on
      * properties you actually read" behavior.
      */
      trackResult(result, onPropTracked) {
        return new Proxy(result, { get: (target, key) => {
          this.trackProp(key);
          onPropTracked?.(key);
          return Reflect.get(target, key);
        } });
      }
      /**
      * Records that the given `QueryObserverResult` property was read, so a subsequent update only
      * notifies this observer if a tracked property actually changed. Normally called indirectly via
      * {@link QueryObserver#trackResult}'s proxy; exposed directly for adapters that track property
      * access themselves (e.g. through their own reactivity system) instead of via the proxy.
      */
      trackProp(key) {
        this.#trackedProps.add(key);
      }
      /**
      * Returns the `Query` instance this observer is currently observing.
      */
      getCurrentQuery() {
        return this.#currentQuery;
      }
      /**
      * Refetches the observed query and returns a promise that resolves with
      * the resulting `QueryObserverResult`.
      *
      * @example
      * ```ts
      * const result = await observer.refetch({ cancelRefetch: false })
      * console.log(result.data)
      * ```
      */
      refetch({ ...options } = {}) {
        return this.fetch({ ...options });
      }
      /**
      * Fetches a query defined by the given options without affecting this
      * observer's own tracked query or result, and returns a promise that
      * resolves with the `QueryObserverResult` for that fetch. This is useful
      * for prefetching data that another observer (e.g. a query about to be
      * navigated to) will need, ahead of time.
      *
      * @example
      * ```ts
      * const result = await observer.fetchOptimistic({
      *   queryKey: ['posts', 2],
      *   queryFn: () => fetchPost(2),
      * })
      * console.log(result.data)
      * ```
      */
      fetchOptimistic(options) {
        const defaultedOptions = this.#client.defaultQueryOptions(options);
        const query = this.#client.getQueryCache().build(this.#client, defaultedOptions);
        let unsubscribe = () => {
        };
        let resolveEarly;
        const cachePromise = new Promise((resolve) => {
          resolveEarly = resolve;
          unsubscribe = this.#client.getQueryCache().subscribe((event) => {
            if (event.type === "updated" && event.query.queryHash === query.queryHash && query.state.data !== void 0) {
              unsubscribe();
              resolve(this.createResult(query, defaultedOptions));
            }
          });
        });
        return Promise.race([query.fetch().then(() => {
          const result = this.createResult(query, defaultedOptions);
          resolveEarly?.(result);
          return result;
        }).finally(() => {
          unsubscribe();
        }), cachePromise]);
      }
      fetch(fetchOptions) {
        return this.#executeFetch({
          ...fetchOptions,
          cancelRefetch: fetchOptions.cancelRefetch ?? true
        }).then(() => {
          this.updateResult();
          return this.#currentResult;
        });
      }
      #executeFetch(fetchOptions) {
        this.#updateQuery();
        let promise = this.#currentQuery.fetch(this.options, fetchOptions);
        if (!fetchOptions?.throwOnError) promise = promise.catch(require_utils2.noop);
        return promise;
      }
      #shouldScheduleTimer(timeout) {
        return !require_environmentManager2.isServer() && require_utils2.resolveQueryValue(this.options.enabled, this.#currentQuery) !== false && require_utils2.isValidTimeout(timeout);
      }
      #updateStaleTimeout() {
        this.#clearStaleTimeout();
        const staleTime = require_utils2.resolveQueryValue(this.options.staleTime, this.#currentQuery);
        if (this.#currentResult.isStale || !this.#shouldScheduleTimer(staleTime)) return;
        const timeout = require_utils2.timeUntilStale(this.#currentResult.dataUpdatedAt, staleTime) + 1;
        this.#staleTimeoutId = require_timeoutManager2.timeoutManager.setTimeout(() => {
          if (!this.#currentResult.isStale) this.updateResult();
        }, timeout);
      }
      #computeRefetchInterval() {
        return require_utils2.resolveQueryValue(this.options.refetchInterval, this.#currentQuery) ?? false;
      }
      #updateRefetchInterval(nextInterval) {
        this.#clearRefetchInterval();
        this.#currentRefetchInterval = nextInterval;
        if (this.#currentRefetchInterval === 0 || !this.#shouldScheduleTimer(this.#currentRefetchInterval)) return;
        this.#refetchIntervalId = require_timeoutManager2.timeoutManager.setInterval(() => {
          if (this.options.refetchIntervalInBackground || require_focusManager2.focusManager.isFocused()) this.#executeFetch();
        }, this.#currentRefetchInterval);
      }
      #updateTimers() {
        this.#updateStaleTimeout();
        this.#updateRefetchInterval(this.#computeRefetchInterval());
      }
      #clearStaleTimeout() {
        if (this.#staleTimeoutId !== void 0) {
          require_timeoutManager2.timeoutManager.clearTimeout(this.#staleTimeoutId);
          this.#staleTimeoutId = void 0;
        }
      }
      #clearRefetchInterval() {
        if (this.#refetchIntervalId !== void 0) {
          require_timeoutManager2.timeoutManager.clearInterval(this.#refetchIntervalId);
          this.#refetchIntervalId = void 0;
        }
      }
      createResult(query, options) {
        const prevQuery = this.#currentQuery;
        const prevOptions = this.options;
        const prevResult = this.#currentResult;
        const prevResultState = this.#currentResultState;
        const prevResultOptions = this.#currentResultOptions;
        const queryInitialState = query !== prevQuery ? query.state : this.#currentQueryInitialState;
        const { state } = query;
        let newState = { ...state };
        let isPlaceholderData = false;
        let data;
        if (options._optimisticResults) {
          const mounted = this.hasListeners();
          const fetchOnMount = !mounted && shouldFetchOnMount(query, options);
          const fetchOptionally = mounted && shouldFetchOptionally(query, prevQuery, options, prevOptions);
          if (fetchOnMount || fetchOptionally) newState = {
            ...newState,
            ...require_query2.fetchState(state.data, query.options)
          };
          if (options._optimisticResults === "isRestoring") newState.fetchStatus = "idle";
        }
        let { error, errorUpdatedAt, status } = newState;
        data = newState.data;
        let skipSelect = false;
        if (options.placeholderData !== void 0 && data === void 0 && status === "pending") {
          let placeholderData;
          if (prevResult?.isPlaceholderData && options.placeholderData === prevResultOptions?.placeholderData) {
            placeholderData = prevResult.data;
            skipSelect = true;
          } else placeholderData = typeof options.placeholderData === "function" ? options.placeholderData(this.#lastQueryWithDefinedData?.state.data, this.#lastQueryWithDefinedData) : options.placeholderData;
          if (placeholderData !== void 0) {
            status = "success";
            data = require_utils2.replaceData(prevResult?.data, placeholderData, options);
            isPlaceholderData = true;
          }
        }
        if (options.select && data !== void 0 && !skipSelect) {
          if (prevResult && data === prevResultState?.data && options.select === this.#selectFn) data = this.#selectResult;
          else try {
            this.#selectFn = options.select;
            data = options.select(data);
            data = require_utils2.replaceData(prevResult?.data, data, options);
            this.#selectResult = data;
            this.#selectError = null;
          } catch (selectError) {
            this.#selectError = selectError;
          }
        } else if (data === void 0) this.#selectError = null;
        if (this.#selectError) {
          error = this.#selectError;
          data = this.#selectResult;
          errorUpdatedAt = Date.now();
          status = "error";
          isPlaceholderData = false;
        }
        const isFetching = newState.fetchStatus === "fetching";
        const isPending = status === "pending";
        const isError = status === "error";
        const isLoading = isPending && isFetching;
        const hasData = data !== void 0;
        return {
          status,
          fetchStatus: newState.fetchStatus,
          isPending,
          isSuccess: status === "success",
          isError,
          isInitialLoading: isLoading,
          isLoading,
          data,
          dataUpdatedAt: newState.dataUpdatedAt,
          error,
          errorUpdatedAt,
          failureCount: newState.fetchFailureCount,
          failureReason: newState.fetchFailureReason,
          errorUpdateCount: newState.errorUpdateCount,
          isFetched: query.isFetched(),
          isFetchedAfterMount: newState.dataUpdateCount > queryInitialState.dataUpdateCount || newState.errorUpdateCount > queryInitialState.errorUpdateCount,
          isFetching,
          isRefetching: isFetching && !isPending,
          isLoadingError: isError && !hasData,
          isPaused: newState.fetchStatus === "paused",
          isPlaceholderData,
          isRefetchError: isError && hasData,
          isStale: isStale(query, options),
          refetch: this.refetch,
          isEnabled: require_utils2.resolveQueryValue(options.enabled, query) !== false
        };
      }
      /**
      * Recomputes and stores the current result from the current query/options, notifying listeners
      * if it changed. Framework adapters call this right after subscribing to make sure no query
      * update was missed in the gap between creating the observer and subscribing to it.
      */
      updateResult() {
        const prevResult = this.#currentResult;
        const nextResult = this.createResult(this.#currentQuery, this.options);
        this.#currentResultState = this.#currentQuery.state;
        this.#currentResultOptions = this.options;
        if (this.#currentResultState.data !== void 0) this.#lastQueryWithDefinedData = this.#currentQuery;
        if (require_utils2.shallowEqualObjects(nextResult, prevResult)) return;
        this.#currentResult = nextResult;
        const shouldNotifyListeners = () => {
          if (!prevResult) return true;
          const { notifyOnChangeProps } = this.options;
          const notifyOnChangePropsValue = typeof notifyOnChangeProps === "function" ? notifyOnChangeProps() : notifyOnChangeProps;
          if (notifyOnChangePropsValue === "all" || !notifyOnChangePropsValue && !this.#trackedProps.size) return true;
          const includedProps = new Set(notifyOnChangePropsValue ?? this.#trackedProps);
          if (this.options.throwOnError) includedProps.add("error");
          return Object.keys(this.#currentResult).some((key) => {
            const typedKey = key;
            return this.#currentResult[typedKey] !== prevResult[typedKey] && includedProps.has(typedKey);
          });
        };
        const notifyListeners = shouldNotifyListeners();
        require_notifyManager2.notifyManager.batch(() => {
          if (notifyListeners) this.listeners.forEach((listener) => {
            listener(this.#currentResult);
          });
          this.#client.getQueryCache().notify({
            query: this.#currentQuery,
            type: "observerResultsUpdated"
          });
        });
      }
      #updateQuery() {
        const query = this.#client.getQueryCache().build(this.#client, this.options);
        if (query === this.#currentQuery) return;
        const prevQuery = this.#currentQuery;
        this.#currentQuery = query;
        this.#currentQueryInitialState = query.state;
        if (this.hasListeners()) {
          prevQuery?.removeObserver(this);
          query.addObserver(this);
        }
      }
      /** @internal */
      onQueryUpdate() {
        this.updateResult();
        if (this.hasListeners()) this.#updateTimers();
      }
    };
    function shouldLoadOnMount(query, options) {
      return require_utils2.resolveQueryValue(options.enabled, query) !== false && query.state.data === void 0 && !(query.state.status === "error" && require_utils2.resolveQueryValue(options.retryOnMount, query) === false);
    }
    function shouldFetchOnMount(query, options) {
      return shouldLoadOnMount(query, options) || query.state.data !== void 0 && shouldFetchOn(query, options, options.refetchOnMount);
    }
    function shouldFetchOn(query, options, field) {
      if (require_utils2.resolveQueryValue(options.enabled, query) !== false && require_utils2.resolveQueryValue(options.staleTime, query) !== "static") {
        const value = require_utils2.resolveQueryValue(field, query);
        return value === "always" || value !== false && isStale(query, options);
      }
      return false;
    }
    function shouldFetchOptionally(query, prevQuery, options, prevOptions) {
      return (query !== prevQuery || require_utils2.resolveQueryValue(prevOptions.enabled, query) === false) && (!options.suspense || query.state.status !== "error") && isStale(query, options);
    }
    function isStale(query, options) {
      return require_utils2.resolveQueryValue(options.enabled, query) !== false && query.isStaleByTime(require_utils2.resolveQueryValue(options.staleTime, query));
    }
    exports2.QueryObserver = QueryObserver;
  }
});

// node_modules/.pnpm/@tanstack+query-core@5.104.1/node_modules/@tanstack/query-core/build/modern/infiniteQueryObserver.cjs
var require_infiniteQueryObserver = __commonJS({
  "node_modules/.pnpm/@tanstack+query-core@5.104.1/node_modules/@tanstack/query-core/build/modern/infiniteQueryObserver.cjs"(exports2) {
    Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
    var require_infiniteQueryBehavior2 = require_infiniteQueryBehavior();
    var require_queryObserver2 = require_queryObserver();
    var InfiniteQueryObserver = class extends require_queryObserver2.QueryObserver {
      constructor(client, options) {
        super(client, options);
      }
      bindMethods() {
        super.bindMethods();
        this.fetchNextPage = this.fetchNextPage.bind(this);
        this.fetchPreviousPage = this.fetchPreviousPage.bind(this);
      }
      /**
      * Updates the observer's options. Behaves the same as
      * `QueryObserver.setOptions`, additionally marking the options as
      * belonging to an infinite query before delegating to the base
      * implementation.
      */
      setOptions(options) {
        options._type = "infinite";
        super.setOptions(options);
      }
      /**
      * The infinite-query counterpart of {@link QueryObserver#getOptimisticResult}, marking the
      * options as an infinite query before delegating to it. Called by framework adapters (e.g.
      * `useInfiniteQuery`) ahead of subscribing, to compute the current `InfiniteQueryObserverResult`
      * synchronously.
      */
      getOptimisticResult(options) {
        options._type = "infinite";
        return super.getOptimisticResult(options);
      }
      /**
      * Fetches the next page of the infinite query and returns a promise that
      * resolves with the resulting `InfiniteQueryObserverResult`. The page
      * param used for the fetch is determined by `getNextPageParam`, which
      * receives the current pages/page params and whose result also determines
      * `hasNextPage`.
      *
      * @example
      * ```ts
      * const { hasNextPage } = observer.getCurrentResult()
      *
      * if (hasNextPage) {
      *   await observer.fetchNextPage()
      * }
      * ```
      *
      * @see {@link InfiniteQueryObserver#fetchPreviousPage}
      */
      fetchNextPage(options) {
        return this.fetch({
          ...options,
          meta: { fetchMore: { direction: "forward" } }
        });
      }
      /**
      * Fetches the previous page of the infinite query and returns a promise
      * that resolves with the resulting `InfiniteQueryObserverResult`. The page
      * param used for the fetch is determined by `getPreviousPageParam`, which
      * receives the current pages/page params and whose result also determines
      * `hasPreviousPage`.
      *
      * @example
      * ```ts
      * const { hasPreviousPage } = observer.getCurrentResult()
      *
      * if (hasPreviousPage) {
      *   await observer.fetchPreviousPage()
      * }
      * ```
      *
      * @see {@link InfiniteQueryObserver#fetchNextPage}
      */
      fetchPreviousPage(options) {
        return this.fetch({
          ...options,
          meta: { fetchMore: { direction: "backward" } }
        });
      }
      createResult(query, options) {
        const { state } = query;
        const parentResult = super.createResult(query, options);
        const { isFetching, isRefetching, isError, isRefetchError } = parentResult;
        const fetchDirection = state.fetchMeta?.fetchMore?.direction;
        const isFetchNextPageError = isError && fetchDirection === "forward";
        const isFetchingNextPage = isFetching && fetchDirection === "forward";
        const isFetchPreviousPageError = isError && fetchDirection === "backward";
        const isFetchingPreviousPage = isFetching && fetchDirection === "backward";
        return {
          ...parentResult,
          fetchNextPage: this.fetchNextPage,
          fetchPreviousPage: this.fetchPreviousPage,
          hasNextPage: require_infiniteQueryBehavior2.hasNextPage(options, state.data),
          hasPreviousPage: require_infiniteQueryBehavior2.hasPreviousPage(options, state.data),
          isFetchNextPageError,
          isFetchingNextPage,
          isFetchPreviousPageError,
          isFetchingPreviousPage,
          isRefetchError: isRefetchError && !isFetchNextPageError && !isFetchPreviousPageError,
          isRefetching: isRefetching && !isFetchingNextPage && !isFetchingPreviousPage
        };
      }
    };
    exports2.InfiniteQueryObserver = InfiniteQueryObserver;
  }
});

// node_modules/.pnpm/@tanstack+query-core@5.104.1/node_modules/@tanstack/query-core/build/modern/mutation.cjs
var require_mutation = __commonJS({
  "node_modules/.pnpm/@tanstack+query-core@5.104.1/node_modules/@tanstack/query-core/build/modern/mutation.cjs"(exports2) {
    Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
    var require_notifyManager2 = require_notifyManager();
    var require_retryer2 = require_retryer();
    var require_removable2 = require_removable();
    var Mutation = class extends require_removable2.Removable {
      #client;
      #observers;
      #mutationCache;
      #retryer;
      constructor(config) {
        super();
        this.#client = config.client;
        this.mutationId = config.mutationId;
        this.#mutationCache = config.mutationCache;
        this.#observers = [];
        this.state = config.state || getDefaultState();
        this.setOptions(config.options);
        this.scheduleGc();
      }
      /** @internal */
      setOptions(options) {
        this.options = options;
        this.updateGcTime(this.options.gcTime);
      }
      /**
      * The `meta` object passed in the mutation's options, if any.
      */
      get meta() {
        return this.options.meta;
      }
      /** @internal */
      addObserver(observer) {
        if (!this.#observers.includes(observer)) {
          this.#observers.push(observer);
          this.clearGcTimeout();
          this.#mutationCache.notify({
            type: "observerAdded",
            mutation: this,
            observer
          });
        }
      }
      /** @internal */
      removeObserver(observer) {
        this.#observers = this.#observers.filter((x) => x !== observer);
        this.scheduleGc();
        this.#mutationCache.notify({
          type: "observerRemoved",
          mutation: this,
          observer
        });
      }
      optionalRemove() {
        if (!this.#observers.length) {
          if (this.state.status === "pending") this.scheduleGc();
          else this.#mutationCache.remove(this);
        }
      }
      /**
      * Resumes a mutation that is currently paused or was restored from a
      * dehydrated, still-`pending` state.
      *
      * - If this mutation has an active retryer (it paused mid-attempt, e.g. due
      *   to the network mode or scope-based queuing), its retryer is resumed.
      * - Otherwise, if the mutation's status is still `pending` (e.g. it was
      *   dehydrated while an attempt was in flight and never got a retryer in
      *   this instance), `execute` is called again with the last known variables.
      * - Otherwise the mutation has already settled and this resolves immediately
      *   without running anything again.
      *
      * @example
      * ```ts
      * // typically driven by reconnect handling, e.g. queryClient.resumePausedMutations()
      * const mutation = mutationCache.find({ mutationKey: ['addPost'] })
      * await mutation?.continue()
      * ```
      *
      * @see {@link Mutation#execute}
      */
      continue() {
        return this.#retryer?.continue() ?? (this.state.status === "pending" ? this.execute(this.state.variables) : Promise.resolve());
      }
      /**
      * Runs the mutation function for the given variables through a retryer, and
      * drives the mutation's state and lifecycle callbacks through to settlement.
      *
      * If this mutation's state is already `pending` when `execute` is called
      * (i.e. it was restored, still in-flight, from a dehydrated state), the
      * `onMutate` step is skipped and a `continue` action is dispatched to
      * unpause it; otherwise a `pending` action is dispatched first, then the
      * mutation cache's `onMutate` and the mutation's own `onMutate` option are
      * awaited in that order, and the resulting context is stored.
      *
      * The mutation function is then run (subject to `retry`/`retryDelay`/
      * `networkMode`, and to the mutation cache's scope-based serialization).
      * On success, the cache's `onSuccess`/`onSettled` callbacks run before the
      * mutation's own `onSuccess`/`onSettled` options, a `success` action is
      * dispatched, and the resolved data is returned. On failure, the same
      * cache-then-option ordering is used for `onError`/`onSettled`, but each of
      * those four callbacks is individually caught so that a throwing callback
      * cannot mask the original error; an `error` action is then dispatched and
      * the original error is re-thrown.
      *
      * @example
      * ```ts
      * // Called internally by `MutationObserver.mutate` and `Mutation.continue` —
      * // applications normally trigger mutations through those, not this method.
      * const data = await mutation.execute(variables)
      * ```
      *
      * @see {@link Mutation#continue}
      */
      async execute(variables) {
        const onContinue = () => {
          this.#dispatch({ type: "continue" });
        };
        const mutationFnContext = {
          client: this.#client,
          meta: this.options.meta,
          mutationKey: this.options.mutationKey
        };
        const retryer = this.#retryer = require_retryer2.createRetryer({
          fn: () => {
            if (!this.options.mutationFn) return Promise.reject(/* @__PURE__ */ new Error("No mutationFn found"));
            return this.options.mutationFn(variables, mutationFnContext);
          },
          onFail: (failureCount, error) => {
            this.#dispatch({
              type: "failed",
              failureCount,
              error
            });
          },
          onPause: () => {
            this.#dispatch({ type: "pause" });
          },
          onContinue,
          retry: this.options.retry ?? 0,
          retryDelay: this.options.retryDelay,
          networkMode: this.options.networkMode,
          canRun: () => this.#mutationCache.canRun(this)
        });
        const restored = this.state.status === "pending";
        const isPaused = !retryer.canStart();
        try {
          if (restored) onContinue();
          else {
            this.#dispatch({
              type: "pending",
              variables,
              isPaused
            });
            if (this.#mutationCache.config.onMutate) await this.#mutationCache.config.onMutate(variables, this, mutationFnContext);
            const context = await this.options.onMutate?.(variables, mutationFnContext);
            if (context !== this.state.context) this.#dispatch({
              type: "pending",
              context,
              variables,
              isPaused
            });
          }
          const data = await retryer.start();
          await this.#mutationCache.config.onSuccess?.(data, variables, this.state.context, this, mutationFnContext);
          await this.options.onSuccess?.(data, variables, this.state.context, mutationFnContext);
          await this.#mutationCache.config.onSettled?.(data, null, this.state.variables, this.state.context, this, mutationFnContext);
          await this.options.onSettled?.(data, null, variables, this.state.context, mutationFnContext);
          this.#dispatch({
            type: "success",
            data
          });
          return data;
        } catch (error) {
          try {
            await this.#mutationCache.config.onError?.(error, variables, this.state.context, this, mutationFnContext);
          } catch (e) {
            Promise.reject(e);
          }
          try {
            await this.options.onError?.(error, variables, this.state.context, mutationFnContext);
          } catch (e) {
            Promise.reject(e);
          }
          try {
            await this.#mutationCache.config.onSettled?.(void 0, error, this.state.variables, this.state.context, this, mutationFnContext);
          } catch (e) {
            Promise.reject(e);
          }
          try {
            await this.options.onSettled?.(void 0, error, variables, this.state.context, mutationFnContext);
          } catch (e) {
            Promise.reject(e);
          }
          this.#dispatch({
            type: "error",
            error
          });
          throw error;
        } finally {
          if (this.#retryer === retryer) this.#retryer = void 0;
          this.#mutationCache.runNext(this);
        }
      }
      #dispatch(action) {
        const reducer = (state) => {
          switch (action.type) {
            case "failed":
              return {
                ...state,
                failureCount: action.failureCount,
                failureReason: action.error
              };
            case "pause":
              return {
                ...state,
                isPaused: true
              };
            case "continue":
              return {
                ...state,
                isPaused: false
              };
            case "pending":
              return {
                ...state,
                context: action.context,
                data: void 0,
                failureCount: 0,
                failureReason: null,
                error: null,
                isPaused: action.isPaused,
                status: "pending",
                variables: action.variables,
                submittedAt: Date.now()
              };
            case "success":
              return {
                ...state,
                data: action.data,
                failureCount: 0,
                failureReason: null,
                error: null,
                status: "success",
                isPaused: false
              };
            case "error":
              return {
                ...state,
                data: void 0,
                error: action.error,
                failureCount: state.failureCount + 1,
                failureReason: action.error,
                isPaused: false,
                status: "error"
              };
          }
        };
        this.state = reducer(this.state);
        require_notifyManager2.notifyManager.batch(() => {
          this.#observers.forEach((observer) => {
            observer.onMutationUpdate(action);
          });
          this.#mutationCache.notify({
            mutation: this,
            type: "updated",
            action
          });
        });
      }
    };
    function getDefaultState() {
      return {
        context: void 0,
        data: void 0,
        error: null,
        failureCount: 0,
        failureReason: null,
        isPaused: false,
        status: "idle",
        variables: void 0,
        submittedAt: 0
      };
    }
    exports2.Mutation = Mutation;
    exports2.getDefaultState = getDefaultState;
  }
});

// node_modules/.pnpm/@tanstack+query-core@5.104.1/node_modules/@tanstack/query-core/build/modern/mutationCache.cjs
var require_mutationCache = __commonJS({
  "node_modules/.pnpm/@tanstack+query-core@5.104.1/node_modules/@tanstack/query-core/build/modern/mutationCache.cjs"(exports2) {
    Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
    var require_utils2 = require_utils();
    var require_subscribable2 = require_subscribable();
    var require_notifyManager2 = require_notifyManager();
    var require_mutation2 = require_mutation();
    var MutationCache = class extends require_subscribable2.Subscribable {
      #mutations;
      #scopes;
      #mutationId;
      constructor(config = {}) {
        super();
        this.config = config;
        this.#mutations = /* @__PURE__ */ new Set();
        this.#scopes = /* @__PURE__ */ new Map();
        this.#mutationId = 0;
      }
      /** @internal */
      build(client, options, state) {
        const mutation = new require_mutation2.Mutation({
          client,
          mutationCache: this,
          mutationId: ++this.#mutationId,
          options: client.defaultMutationOptions(options),
          state
        });
        this.add(mutation);
        return mutation;
      }
      /** @internal */
      add(mutation) {
        this.#mutations.add(mutation);
        const scope = scopeFor(mutation);
        if (typeof scope === "string") {
          const scopedMutations = this.#scopes.get(scope);
          if (scopedMutations) scopedMutations.push(mutation);
          else this.#scopes.set(scope, [mutation]);
        }
        this.notify({
          type: "added",
          mutation
        });
      }
      /** @internal */
      remove(mutation) {
        if (this.#mutations.delete(mutation)) {
          const scope = scopeFor(mutation);
          if (typeof scope === "string") {
            const scopedMutations = this.#scopes.get(scope);
            if (scopedMutations) {
              if (scopedMutations.length > 1) {
                const index = scopedMutations.indexOf(mutation);
                if (index !== -1) scopedMutations.splice(index, 1);
              } else if (scopedMutations[0] === mutation) this.#scopes.delete(scope);
            }
          }
        }
        this.notify({
          type: "removed",
          mutation
        });
      }
      /** @internal */
      canRun(mutation) {
        const scope = scopeFor(mutation);
        if (typeof scope === "string") {
          const firstPendingMutation = this.#scopes.get(scope)?.find((m) => m.state.status === "pending");
          return !firstPendingMutation || firstPendingMutation === mutation;
        } else return true;
      }
      /** @internal */
      runNext(mutation) {
        const scope = scopeFor(mutation);
        if (typeof scope === "string") return this.#scopes.get(scope)?.find((m) => m !== mutation && m.state.isPaused)?.continue() ?? Promise.resolve();
        else return Promise.resolve();
      }
      /**
      * Removes all mutations from the cache.
      *
      * @example
      * ```ts
      * const mutationCache = queryClient.getMutationCache()
      *
      * mutationCache.clear()
      * ```
      */
      clear() {
        require_notifyManager2.notifyManager.batch(() => {
          this.#mutations.forEach((mutation) => {
            this.notify({
              type: "removed",
              mutation
            });
          });
          this.#mutations.clear();
          this.#scopes.clear();
        });
      }
      /**
      * Returns all mutations within the cache.
      *
      * This is not typically needed for most applications, but can come in handy when needing more
      * information about a mutation in rare scenarios.
      *
      * @example
      * ```ts
      * const mutationCache = queryClient.getMutationCache()
      *
      * const mutations = mutationCache.getAll()
      * ```
      */
      getAll() {
        return Array.from(this.#mutations);
      }
      /**
      * A slightly more advanced method that can be used to get an existing mutation instance from
      * the cache. If the mutation does not exist, `undefined` is returned.
      *
      * This is not typically needed for most applications, but can come in handy when needing more
      * information about a mutation in rare scenarios.
      *
      * @see {@link MutationCache#findAll}
      * @example
      * ```ts
      * const mutationCache = queryClient.getMutationCache()
      *
      * const mutation = mutationCache.find({ mutationKey: ['addPost'] })
      * ```
      */
      find(filters) {
        const defaultedFilters = {
          exact: true,
          ...filters
        };
        return this.getAll().find((mutation) => require_utils2.matchMutation(defaultedFilters, mutation));
      }
      /**
      * An even more advanced method that can be used to get existing mutation instances from the
      * cache that match the given filters. If no mutations match, an empty array is returned.
      *
      * This is not typically needed for most applications, but can come in handy when needing more
      * information about mutations in rare scenarios.
      *
      * @see {@link MutationCache#find}
      * @example
      * ```ts
      * const mutationCache = queryClient.getMutationCache()
      *
      * const mutations = mutationCache.findAll({ mutationKey: ['addPost'] })
      * ```
      */
      findAll(filters = {}) {
        return this.getAll().filter((mutation) => require_utils2.matchMutation(filters, mutation));
      }
      /** @internal */
      notify(event) {
        require_notifyManager2.notifyManager.batch(() => {
          this.listeners.forEach((listener) => {
            listener(event);
          });
        });
      }
      /** @internal */
      resumePausedMutations() {
        const pausedMutations = this.getAll().filter((x) => x.state.isPaused);
        return require_notifyManager2.notifyManager.batch(() => Promise.all(pausedMutations.map((mutation) => mutation.continue().catch(require_utils2.noop))));
      }
    };
    function scopeFor(mutation) {
      return mutation.options.scope?.id;
    }
    exports2.MutationCache = MutationCache;
  }
});

// node_modules/.pnpm/@tanstack+query-core@5.104.1/node_modules/@tanstack/query-core/build/modern/mutationObserver.cjs
var require_mutationObserver = __commonJS({
  "node_modules/.pnpm/@tanstack+query-core@5.104.1/node_modules/@tanstack/query-core/build/modern/mutationObserver.cjs"(exports2) {
    Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
    var require_utils2 = require_utils();
    var require_subscribable2 = require_subscribable();
    var require_notifyManager2 = require_notifyManager();
    var require_mutation2 = require_mutation();
    var MutationObserver2 = class extends require_subscribable2.Subscribable {
      #client;
      #currentResult = void 0;
      #currentMutation;
      #mutateOptions;
      constructor(client, options) {
        super();
        this.#client = client;
        this.setOptions(options);
        this.bindMethods();
        this.#updateResult();
      }
      bindMethods() {
        this.mutate = this.mutate.bind(this);
        this.reset = this.reset.bind(this);
      }
      /**
      * Updates the observer's options.
      *
      * If the new `mutationKey` differs from the previous one (and both were
      * defined), the observer is reset, detaching it from the mutation it was
      * observing. Otherwise, if the currently observed mutation is still
      * `pending`, its options are updated in place as well.
      *
      * @example
      * ```ts
      * observer.setOptions({
      *   mutationFn: (variables: { title: string }) => addPost(variables),
      *   onSuccess: (data) => console.log(data),
      * })
      * ```
      */
      setOptions(options) {
        const prevOptions = this.options;
        this.options = this.#client.defaultMutationOptions(options);
        if (!require_utils2.shallowEqualObjects(this.options, prevOptions)) this.#client.getMutationCache().notify({
          type: "observerOptionsUpdated",
          mutation: this.#currentMutation,
          observer: this
        });
        if (prevOptions?.mutationKey && this.options.mutationKey && require_utils2.hashKey(prevOptions.mutationKey) !== require_utils2.hashKey(this.options.mutationKey)) this.reset();
        else if (this.#currentMutation?.state.status === "pending") this.#currentMutation.setOptions(this.options);
      }
      onSubscribe() {
        if (this.listeners.size === 1 && this.#currentMutation) {
          this.#currentMutation.addObserver(this);
          this.#updateResult();
        }
      }
      onUnsubscribe() {
        if (!this.hasListeners()) this.#currentMutation?.removeObserver(this);
      }
      /** @internal */
      onMutationUpdate(action) {
        this.#updateResult();
        this.#notify(action);
      }
      /**
      * Returns the observer's current result, derived from the observed
      * mutation's state (or the default, `idle` state if no mutation has been
      * built yet, e.g. before the first `mutate()` call or after `reset()`).
      */
      getCurrentResult() {
        return this.#currentResult;
      }
      /**
      * Detaches the observer from the mutation it is currently observing (if
      * any) and resets the observed result back to its default, `idle` state.
      *
      * This does not cancel an in-flight mutation; the mutation itself keeps
      * running to completion and its own callbacks still fire, but this
      * observer stops reflecting its state and a subsequent `mutate()` call
      * will build a brand new mutation.
      *
      * @example
      * ```ts
      * observer.reset()
      * ```
      *
      * @see {@link MutationObserver#mutate}
      */
      reset() {
        this.#currentMutation?.removeObserver(this);
        this.#currentMutation = void 0;
        this.#updateResult();
        this.#notify();
      }
      /**
      * Builds a new `Mutation` in the `MutationCache` using the observer's
      * current options, detaches this observer from any previously observed
      * mutation, attaches it to the new one, and executes it with the given
      * variables.
      *
      * The optional per-call `options` (`onSuccess`/`onError`/`onSettled`) are
      * invoked once the mutation settles, in addition to any callbacks defined
      * on the observer's own options.
      *
      * @example
      * ```ts
      * await observer.mutate(
      *   { title: 'New post' },
      *   { onSuccess: (data) => console.log(data) },
      * )
      * ```
      */
      mutate(variables, options) {
        this.#mutateOptions = options;
        this.#currentMutation?.removeObserver(this);
        this.#currentMutation = this.#client.getMutationCache().build(this.#client, this.options);
        this.#currentMutation.addObserver(this);
        return this.#currentMutation.execute(variables);
      }
      #updateResult() {
        const state = this.#currentMutation?.state ?? require_mutation2.getDefaultState();
        this.#currentResult = {
          ...state,
          isPending: state.status === "pending",
          isSuccess: state.status === "success",
          isError: state.status === "error",
          isIdle: state.status === "idle",
          mutate: this.mutate,
          reset: this.reset
        };
      }
      #notify(action) {
        require_notifyManager2.notifyManager.batch(() => {
          if (this.#mutateOptions && this.hasListeners()) {
            const variables = this.#currentResult.variables;
            const onMutateResult = this.#currentResult.context;
            const context = {
              client: this.#client,
              meta: this.options.meta,
              mutationKey: this.options.mutationKey
            };
            if (action?.type === "success") {
              try {
                this.#mutateOptions.onSuccess?.(action.data, variables, onMutateResult, context);
              } catch (e) {
                Promise.reject(e);
              }
              try {
                this.#mutateOptions.onSettled?.(action.data, null, variables, onMutateResult, context);
              } catch (e) {
                Promise.reject(e);
              }
            } else if (action?.type === "error") {
              try {
                this.#mutateOptions.onError?.(action.error, variables, onMutateResult, context);
              } catch (e) {
                Promise.reject(e);
              }
              try {
                this.#mutateOptions.onSettled?.(void 0, action.error, variables, onMutateResult, context);
              } catch (e) {
                Promise.reject(e);
              }
            }
          }
          this.listeners.forEach((listener) => {
            listener(this.#currentResult);
          });
        });
      }
    };
    exports2.MutationObserver = MutationObserver2;
  }
});

// node_modules/.pnpm/@tanstack+query-core@5.104.1/node_modules/@tanstack/query-core/build/modern/queriesObserver.cjs
var require_queriesObserver = __commonJS({
  "node_modules/.pnpm/@tanstack+query-core@5.104.1/node_modules/@tanstack/query-core/build/modern/queriesObserver.cjs"(exports2) {
    Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
    var require_utils2 = require_utils();
    var require_subscribable2 = require_subscribable();
    var require_notifyManager2 = require_notifyManager();
    var require_queryObserver2 = require_queryObserver();
    function difference(array1, array2) {
      const excludeSet = new Set(array2);
      return array1.filter((x) => !excludeSet.has(x));
    }
    var QueriesObserver = class extends require_subscribable2.Subscribable {
      #client;
      #result;
      #queries;
      #options;
      #observers;
      #combinedResult;
      #lastCombine;
      #lastResult;
      #lastQueryHashes;
      #observerMatches = [];
      constructor(client, queries, options) {
        super();
        this.#client = client;
        this.#options = options;
        this.#queries = [];
        this.#observers = [];
        this.#result = [];
        this.setQueries(queries);
      }
      onSubscribe() {
        if (this.listeners.size === 1) this.#observers.forEach((observer) => {
          observer.subscribe((result) => {
            this.#onUpdate(observer, result);
          });
        });
      }
      onUnsubscribe() {
        if (!this.listeners.size) this.destroy();
      }
      /**
      * Stops observing all queries: clears all listeners and destroys every
      * underlying `QueryObserver` this observer manages.
      */
      destroy() {
        this.listeners = /* @__PURE__ */ new Set();
        this.#observers.forEach((observer) => {
          observer.destroy();
        });
      }
      /**
      * Replaces the set of queries being observed. Existing `QueryObserver`s
      * are reused for queries that match an already-observed query hash;
      * observers for queries that are no longer present are destroyed, and new
      * observers are created and subscribed to for newly added queries.
      *
      * @example
      * ```ts
      * observer.setQueries([
      *   { queryKey: ['post', 1], queryFn: fetchPost },
      *   { queryKey: ['post', 3], queryFn: fetchPost },
      * ])
      * ```
      */
      setQueries(queries, options) {
        this.#queries = queries;
        this.#options = options;
        if (process.env.NODE_ENV !== "production") {
          const queryHashes = queries.map((query) => this.#client.defaultQueryOptions(query).queryHash);
          if (new Set(queryHashes).size !== queryHashes.length) console.warn("[QueriesObserver]: Duplicate Queries found. This might result in unexpected behavior.");
        }
        require_notifyManager2.notifyManager.batch(() => {
          const prevObservers = this.#observers;
          const newObserverMatches = this.#findMatchingObservers(this.#queries);
          newObserverMatches.forEach((match) => match.observer.setOptions(match.defaultedQueryOptions));
          const newObservers = newObserverMatches.map((match) => match.observer);
          const newResult = newObservers.map((observer) => observer.getCurrentResult());
          const hasLengthChange = prevObservers.length !== newObservers.length;
          const hasIndexChange = newObservers.some((observer, index) => observer !== prevObservers[index]);
          const hasStructuralChange = hasLengthChange || hasIndexChange;
          const hasResultChange = hasStructuralChange ? true : newResult.some((result, index) => {
            const prev = this.#result[index];
            return !prev || !require_utils2.shallowEqualObjects(result, prev);
          });
          if (!hasStructuralChange && !hasResultChange) return;
          if (hasStructuralChange) {
            this.#observerMatches = newObserverMatches;
            this.#observers = newObservers;
          }
          this.#result = newResult;
          if (!this.hasListeners()) return;
          if (hasStructuralChange) {
            difference(prevObservers, newObservers).forEach((observer) => {
              observer.destroy();
            });
            difference(newObservers, prevObservers).forEach((observer) => {
              observer.subscribe((result) => {
                this.#onUpdate(observer, result);
              });
            });
          }
          this.#notify();
        });
      }
      /**
      * Returns the most recently computed array of `QueryObserverResult`s, one
      * per observed query, in the same order as the queries passed to the
      * constructor or `setQueries`.
      *
      * @example
      * ```ts
      * const results = observer.getCurrentResult()
      * const data = results.map((result) => result.data)
      * ```
      */
      getCurrentResult() {
        return this.#result;
      }
      /**
      * Returns the underlying `Query` instances currently being observed, in
      * the same order as the queries passed to the constructor or `setQueries`.
      */
      getQueries() {
        return this.#observers.map((observer) => observer.getCurrentQuery());
      }
      /**
      * Returns the underlying `QueryObserver` instances this observer manages,
      * in the same order as the queries passed to the constructor or
      * `setQueries`.
      */
      getObservers() {
        return this.#observers;
      }
      /**
      * The `QueriesObserver` counterpart of {@link QueryObserver#getOptimisticResult} — computes
      * the result for the given (already-defaulted) queries right now, synchronously. Called by
      * framework adapters (e.g. `useQueries`) ahead of subscribing, returning a tuple of the raw
      * per-query results, a function to compute the combined result from them, and a function to
      * wrap the results for property-access tracking.
      */
      getOptimisticResult(queries, combine) {
        const matches = this.#findMatchingObservers(queries);
        const result = matches.map((match) => match.observer.getOptimisticResult(match.defaultedQueryOptions));
        const queryHashes = matches.map((match) => match.defaultedQueryOptions.queryHash);
        return [
          result,
          (r) => {
            return this.#combineResult(r ?? result, combine, queryHashes);
          },
          () => {
            return this.#trackResult(result, matches);
          }
        ];
      }
      #trackResult(result, matches) {
        const trackedProps = /* @__PURE__ */ new Set();
        return matches.map((match, index) => {
          const observerResult = result[index];
          return !match.defaultedQueryOptions.notifyOnChangeProps ? match.observer.trackResult(observerResult, (accessedProp) => {
            if (!trackedProps.has(accessedProp)) {
              trackedProps.add(accessedProp);
              matches.forEach((m) => {
                m.observer.trackProp(accessedProp);
              });
            }
          }) : observerResult;
        });
      }
      #combineResult(input, combine, queryHashes) {
        if (combine) {
          const lastHashes = this.#lastQueryHashes;
          const queryHashesChanged = queryHashes !== void 0 && lastHashes !== void 0 && (lastHashes.length !== queryHashes.length || queryHashes.some((hash, i) => hash !== lastHashes[i]));
          if (this.#result !== this.#lastResult || queryHashesChanged || combine !== this.#lastCombine) {
            this.#lastCombine = combine;
            this.#lastResult = this.#result;
            if (queryHashes !== void 0) this.#lastQueryHashes = queryHashes;
            this.#combinedResult = require_utils2.replaceEqualDeep(this.#combinedResult, combine(input));
          }
          return this.#combinedResult;
        }
        return input;
      }
      #shouldSkipCombine() {
        return !this.#options?.combine || this.#observers.some((observer, index) => {
          return observer.options.suspense && this.#result[index]?.data === void 0;
        });
      }
      #findMatchingObservers(queries) {
        const prevObserversMap = /* @__PURE__ */ new Map();
        this.#observers.forEach((observer) => {
          const key = observer.options.queryHash;
          if (!key) return;
          const previousObservers = prevObserversMap.get(key);
          if (previousObservers) previousObservers.push(observer);
          else prevObserversMap.set(key, [observer]);
        });
        const observers = [];
        queries.forEach((options) => {
          const defaultedOptions = this.#client.defaultQueryOptions(options);
          const observer = prevObserversMap.get(defaultedOptions.queryHash)?.shift() ?? new require_queryObserver2.QueryObserver(this.#client, defaultedOptions);
          observers.push({
            defaultedQueryOptions: defaultedOptions,
            observer
          });
        });
        return observers;
      }
      #onUpdate(observer, result) {
        const index = this.#observers.indexOf(observer);
        if (index !== -1) {
          this.#result = this.#result.slice();
          this.#result[index] = result;
          this.#notify();
        }
      }
      #notify() {
        if (this.hasListeners()) {
          const shouldSkipCombine = this.#shouldSkipCombine();
          const previousResult = this.#combinedResult;
          const newResult = shouldSkipCombine ? previousResult : this.#combineResult(this.#trackResult(this.#result, this.#observerMatches), this.#options?.combine);
          if (shouldSkipCombine || previousResult !== newResult) require_notifyManager2.notifyManager.batch(() => {
            this.listeners.forEach((listener) => {
              listener(this.#result);
            });
          });
        }
      }
    };
    exports2.QueriesObserver = QueriesObserver;
  }
});

// node_modules/.pnpm/@tanstack+query-core@5.104.1/node_modules/@tanstack/query-core/build/modern/queryCache.cjs
var require_queryCache = __commonJS({
  "node_modules/.pnpm/@tanstack+query-core@5.104.1/node_modules/@tanstack/query-core/build/modern/queryCache.cjs"(exports2) {
    Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
    var require_utils2 = require_utils();
    var require_subscribable2 = require_subscribable();
    var require_notifyManager2 = require_notifyManager();
    var require_query2 = require_query();
    var QueryCache = class extends require_subscribable2.Subscribable {
      #queries;
      constructor(config = {}) {
        super();
        this.config = config;
        this.#queries = /* @__PURE__ */ new Map();
      }
      /**
      * Returns the existing `Query` instance for the given options' `queryKey`/`queryHash`, or
      * builds and adds a new one to the cache if none exists yet. Used by framework adapters and
      * plugins (e.g. broadcast/persistence) that need to get-or-create a `Query` directly, bypassing
      * the reactive `QueryObserver` machinery.
      *
      * @example
      * ```ts
      * const queryCache = queryClient.getQueryCache()
      *
      * const query = queryCache.build(queryClient, {
      *   queryKey: ['posts'],
      *   queryFn: fetchPosts,
      * })
      * ```
      */
      build(client, options, state) {
        const queryKey = options.queryKey;
        const queryHash = options.queryHash ?? require_utils2.hashQueryKeyByOptions(queryKey, options);
        let query = this.get(queryHash);
        if (!query) {
          query = new require_query2.Query({
            client,
            queryKey,
            queryHash,
            options: client.defaultQueryOptions(options),
            state,
            defaultOptions: client.getQueryDefaults(queryKey)
          });
          this.add(query);
        }
        return query;
      }
      /** @internal */
      add(query) {
        if (!this.#queries.has(query.queryHash)) {
          this.#queries.set(query.queryHash, query);
          this.notify({
            type: "added",
            query
          });
        }
      }
      /**
      * Destroys the given `Query` and removes it from the cache, notifying subscribers with a
      * `'removed'` event. A no-op if the query is no longer the one currently stored under its hash
      * (e.g. it was already replaced). Used by plugins (e.g. the broadcast client) that mirror
      * removals across `QueryCache` instances.
      *
      * @example
      * ```ts
      * const queryCache = queryClient.getQueryCache()
      * const query = queryCache.find({ queryKey: ['posts'] })
      *
      * if (query) {
      *   queryCache.remove(query)
      * }
      * ```
      */
      remove(query) {
        if (this.#queries.get(query.queryHash) === query) {
          query.destroy();
          this.#queries.delete(query.queryHash);
          this.notify({
            type: "removed",
            query
          });
        }
      }
      /**
      * Removes all queries from the cache.
      *
      * @example
      * ```ts
      * const queryCache = queryClient.getQueryCache()
      *
      * queryCache.clear()
      * ```
      */
      clear() {
        require_notifyManager2.notifyManager.batch(() => {
          this.getAll().forEach((query) => {
            this.remove(query);
          });
        });
      }
      /**
      * Returns the `Query` instance stored under the given `queryHash`, or `undefined` if none
      * exists. Unlike {@link QueryCache#find}, this looks up by the already-computed hash rather
      * than by `QueryFilters`. Used by plugins (e.g. broadcast/hydration) that already have a hash
      * to look up directly.
      *
      * @example
      * ```ts
      * const queryCache = queryClient.getQueryCache()
      * const queryHash = hashKey(['posts'])
      *
      * const query = queryCache.get(queryHash)
      * ```
      */
      get(queryHash) {
        return this.#queries.get(queryHash);
      }
      /**
      * Returns all queries within the cache.
      *
      * @example
      * ```ts
      * const queryCache = queryClient.getQueryCache()
      *
      * const queries = queryCache.getAll()
      * ```
      */
      getAll() {
        return [...this.#queries.values()];
      }
      /**
      * A slightly more advanced method that can be used to get an existing query instance from the
      * cache. This instance not only contains all the state for the query, but all of the instances,
      * and underlying guts of the query as well. If the query does not exist, `undefined` is
      * returned.
      *
      * This is not typically needed for most applications, but can come in handy when needing more
      * information about a query in rare scenarios (e.g. looking at `query.state.dataUpdatedAt` to
      * decide whether a query is fresh enough to be used as an initial value).
      *
      * @see {@link QueryCache#findAll}
      * @example
      * ```ts
      * const queryCache = queryClient.getQueryCache()
      *
      * const query = queryCache.find({ queryKey: ['posts'] })
      * ```
      */
      find(filters) {
        const defaultedFilters = {
          exact: true,
          ...filters
        };
        return this.getAll().find((query) => require_utils2.matchQuery(defaultedFilters, query));
      }
      /**
      * An even more advanced method that can be used to get existing query instances from the cache
      * that partially match a query key. If no queries match, an empty array is returned.
      *
      * This is not typically needed for most applications, but can come in handy when needing more
      * information about queries in rare scenarios.
      *
      * @see {@link QueryCache#find}
      * @example
      * ```ts
      * const queryCache = queryClient.getQueryCache()
      *
      * const queries = queryCache.findAll({ queryKey: ['posts'] })
      * ```
      */
      findAll(filters = {}) {
        const queries = this.getAll();
        return Object.keys(filters).length > 0 ? queries.filter((query) => require_utils2.matchQuery(filters, query)) : queries;
      }
      /** @internal */
      notify(event) {
        require_notifyManager2.notifyManager.batch(() => {
          this.listeners.forEach((listener) => {
            listener(event);
          });
        });
      }
      /** @internal */
      onFocus() {
        require_notifyManager2.notifyManager.batch(() => {
          this.getAll().forEach((query) => {
            query.onFocus();
          });
        });
      }
      /** @internal */
      onOnline() {
        require_notifyManager2.notifyManager.batch(() => {
          this.getAll().forEach((query) => {
            query.onOnline();
          });
        });
      }
    };
    exports2.QueryCache = QueryCache;
  }
});

// node_modules/.pnpm/@tanstack+query-core@5.104.1/node_modules/@tanstack/query-core/build/modern/queryClient.cjs
var require_queryClient = __commonJS({
  "node_modules/.pnpm/@tanstack+query-core@5.104.1/node_modules/@tanstack/query-core/build/modern/queryClient.cjs"(exports2) {
    Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
    var require_utils2 = require_utils();
    var require_focusManager2 = require_focusManager();
    var require_notifyManager2 = require_notifyManager();
    var require_onlineManager2 = require_onlineManager();
    var require_mutationCache2 = require_mutationCache();
    var require_queryCache2 = require_queryCache();
    var QueryClient2 = class {
      #queryCache;
      #mutationCache;
      #defaultOptions;
      #queryDefaults;
      #mutationDefaults;
      #mountCount;
      #unsubscribeFocus;
      #unsubscribeOnline;
      constructor(config = {}) {
        this.#queryCache = config.queryCache || new require_queryCache2.QueryCache();
        this.#mutationCache = config.mutationCache || new require_mutationCache2.MutationCache();
        this.#defaultOptions = config.defaultOptions || {};
        this.#queryDefaults = /* @__PURE__ */ new Map();
        this.#mutationDefaults = /* @__PURE__ */ new Map();
        this.#mountCount = 0;
      }
      /**
      * Called by a framework adapter's `QueryClientProvider`-equivalent when it mounts, to start
      * listening for focus/online events and resume paused mutations. Ref-counted via an internal
      * mount count, so nested or multiple providers sharing the same `QueryClient` don't tear down
      * the shared listeners until the last one unmounts.
      */
      mount() {
        this.#mountCount++;
        if (this.#mountCount !== 1) return;
        this.#unsubscribeFocus = require_focusManager2.focusManager.subscribe(async (focused) => {
          if (focused) {
            await this.resumePausedMutations();
            this.#queryCache.onFocus();
          }
        });
        this.#unsubscribeOnline = require_onlineManager2.onlineManager.subscribe(async (online) => {
          if (online) {
            await this.resumePausedMutations();
            this.#queryCache.onOnline();
          }
        });
      }
      /**
      * The inverse of {@link QueryClient#mount} — called by a framework adapter's
      * `QueryClientProvider`-equivalent when it unmounts. Only tears down the focus/online
      * listeners once the mount count returns to `0`.
      */
      unmount() {
        this.#mountCount--;
        if (this.#mountCount !== 0) return;
        this.#unsubscribeFocus?.();
        this.#unsubscribeFocus = void 0;
        this.#unsubscribeOnline?.();
        this.#unsubscribeOnline = void 0;
      }
      /**
      * Returns the number of queries in the cache that are currently fetching, optionally
      * matching a set of filters. This includes background-fetching, loading new pages, and
      * loading more infinite query results.
      *
      * @example
      * ```ts
      * if (queryClient.isFetching()) {
      *   console.log('At least one query is fetching!')
      * }
      * ```
      */
      isFetching(filters) {
        return this.#queryCache.findAll({
          ...filters,
          fetchStatus: "fetching"
        }).length;
      }
      /**
      * Returns the number of mutations in the cache that are currently pending, optionally
      * matching a set of filters.
      *
      * @example
      * ```ts
      * if (queryClient.isMutating()) {
      *   console.log('At least one mutation is pending!')
      * }
      * ```
      */
      isMutating(filters) {
        return this.#mutationCache.findAll({
          ...filters,
          status: "pending"
        }).length;
      }
      /**
      * Imperative (non-reactive) way to retrieve data for a QueryKey.
      * Should only be used in callbacks or functions where reading the latest data is necessary, e.g. for optimistic updates.
      *
      * Hint: Do not use this function inside a component, because it won't receive updates.
      * Use `useQuery` to create a `QueryObserver` that subscribes to changes.
      *
      * @returns The cached data for the query, or `undefined` if no query with this key has been observed yet.
      * @see {@link QueryClient#getQueriesData}
      */
      getQueryData(queryKey) {
        const options = this.defaultQueryOptions({ queryKey });
        return this.#queryCache.get(options.queryHash)?.state.data;
      }
      /**
      * @deprecated Use queryClient.query({ ...options, staleTime: 'static' }) instead. This method will be removed in the next major version.
      */
      ensureQueryData(options) {
        const defaultedOptions = this.defaultQueryOptions(options);
        const query = this.#queryCache.build(this, defaultedOptions);
        const cachedData = query.state.data;
        if (cachedData === void 0) return this.fetchQuery(options);
        if (options.revalidateIfStale && query.isStaleByTime(require_utils2.resolveQueryValue(defaultedOptions.staleTime, query))) this.prefetchQuery(defaultedOptions);
        return Promise.resolve(cachedData);
      }
      /**
      * Imperative (non-reactive) way to retrieve the cached data of multiple queries at once.
      * Only queries matching the given filters are returned; if none match, an empty array is
      * returned.
      *
      * Because the matched queries can hold data of different shapes (e.g. a broad filter can match
      * queries with unrelated data types), the `TQueryFnData` generic defaults to `unknown` rather
      * than being inferred. Passing a more specific type is a convenience for call sites that know
      * every matched query holds the same shape — it is not checked against the actual cache
      * contents.
      *
      * @returns An array of query key and data pairs. The data is `undefined` for a query with no cached data.
      * @see {@link QueryClient#getQueryData}
      * @example
      * ```ts
      * const data = queryClient.getQueriesData({ queryKey: ['posts'] })
      * ```
      */
      getQueriesData(filters) {
        return this.#queryCache.findAll(filters).map(({ queryKey, state }) => {
          return [queryKey, state.data];
        });
      }
      /**
      * Synchronous way to immediately update a query's cached data. If the updater (or the value
      * passed) resolves to `undefined`, the cache is left untouched and no query is created;
      * otherwise, if the query does not exist yet, it will be created. To update multiple queries
      * at once by partially matching query keys, use {@link QueryClient#setQueriesData} instead.
      *
      * Updates must be performed immutably: do not mutate `oldData`, or data previously retrieved
      * via {@link QueryClient#getQueryData}, in place.
      *
      * @param queryKey - The query key to set data for.
      * @param updater - Either the new data, or a function that receives the current data (which
      * may be `undefined`) and returns the new data.
      * @param options - Set `updatedAt` to override the timestamp the written data is recorded with.
      * @returns The data that was written, or `undefined` if the updater returned `undefined` — in that case
      * the write is skipped and the cache is left unchanged.
      *
      * @example
      * ```ts
      * queryClient.setQueryData(['posts'], newPosts)
      *
      * // Or, using an updater function that receives the current data:
      * queryClient.setQueryData(['posts'], (oldPosts) => [...oldPosts, newPost])
      * ```
      */
      setQueryData(queryKey, updater, options) {
        const defaultedOptions = this.defaultQueryOptions({ queryKey });
        const prevData = this.#queryCache.get(defaultedOptions.queryHash)?.state.data;
        const data = require_utils2.functionalUpdate(updater, prevData);
        if (data === void 0) return;
        return this.#queryCache.build(this, defaultedOptions).setData(data, {
          ...options,
          manual: true
        });
      }
      /**
      * Synchronous way to immediately update the cached data of multiple queries at once, using
      * filters or partial query key matching. Only queries that already exist and match the given
      * filters are updated; no new cache entries are created. Internally this calls
      * {@link QueryClient#setQueryData} for each matching query.
      *
      * @returns One `[queryKey, data]` tuple per matched query, in the same shape and with the same
      * `undefined` case as {@link QueryClient#setQueryData}.
      * @example
      * ```ts
      * queryClient.setQueriesData({ queryKey: ['posts'] }, (oldPosts) =>
      *   oldPosts ? oldPosts.filter((post) => post.id !== deletedId) : oldPosts,
      * )
      * ```
      */
      setQueriesData(filters, updater, options) {
        return require_notifyManager2.notifyManager.batch(() => this.#queryCache.findAll(filters).map(({ queryKey }) => [queryKey, this.setQueryData(queryKey, updater, options)]));
      }
      /**
      * Imperative (non-reactive) way to retrieve an existing query's state. If the query does not
      * exist, `undefined` is returned.
      *
      * @example
      * ```ts
      * const state = queryClient.getQueryState(['posts'])
      * console.log(state?.dataUpdatedAt)
      * ```
      */
      getQueryState(queryKey) {
        const options = this.defaultQueryOptions({ queryKey });
        return this.#queryCache.get(options.queryHash)?.state;
      }
      /**
      * Removes queries from the cache that match the given filters. Unlike
      * {@link QueryClient#invalidateQueries} or {@link QueryClient#refetchQueries}, this removes
      * matching queries from the cache instead of refetching them. Without filters, every query in
      * the cache is removed.
      *
      * @example
      * ```ts
      * queryClient.removeQueries({ queryKey: ['posts'], exact: true })
      * ```
      */
      removeQueries(filters) {
        const queryCache = this.#queryCache;
        require_notifyManager2.notifyManager.batch(() => {
          queryCache.findAll(filters).forEach((query) => {
            queryCache.remove(query);
          });
        });
      }
      /**
      * Resets queries matching the given filters back to their initial state (e.g. any
      * `initialData`), notifying subscribers rather than removing them. Active queries among the
      * matched set are then refetched, and the returned promise resolves once that refetch settles.
      *
      * @example
      * ```ts
      * await queryClient.resetQueries({ queryKey: ['posts'], exact: true })
      * ```
      */
      resetQueries(filters, options) {
        const queryCache = this.#queryCache;
        return require_notifyManager2.notifyManager.batch(() => {
          const matched = queryCache.findAll(filters);
          const queriesToRefetch = new Set(matched);
          matched.forEach((query) => {
            query.reset();
          });
          return this.refetchQueries({
            type: "active",
            predicate: (query) => queriesToRefetch.has(query)
          }, options);
        });
      }
      /**
      * Cancels outgoing fetches for queries matching the given filters. Most useful when performing
      * optimistic updates, since any outgoing refetch that resolves afterwards would otherwise
      * overwrite the optimistic update. By default (`revert: true`), a cancelled query's data is
      * reverted to its state before the outgoing fetch started.
      *
      * The returned promise never rejects, even if individual cancellations fail.
      *
      * @example
      * ```ts
      * await queryClient.cancelQueries({ queryKey: ['posts'], exact: true })
      * ```
      */
      cancelQueries(filters, cancelOptions = {}) {
        const defaultedCancelOptions = {
          revert: true,
          ...cancelOptions
        };
        const promises = require_notifyManager2.notifyManager.batch(() => this.#queryCache.findAll(filters).map((query) => query.cancel(defaultedCancelOptions)));
        return Promise.all(promises).then(require_utils2.noop).catch(require_utils2.noop);
      }
      /**
      * Marks queries matching the given filters as invalidated. Unlike
      * {@link QueryClient#removeQueries}, invalidated queries stay in the cache.
      *
      * Unless `filters.refetchType` is `'none'`, matching queries are then refetched via
      * {@link QueryClient#refetchQueries}, using `filters.refetchType` if set, otherwise
      * `filters.type`, otherwise `'active'`.
      *
      * @example
      * ```ts
      * await queryClient.invalidateQueries({ queryKey: ['posts'], refetchType: 'active' })
      * ```
      */
      invalidateQueries(filters, options = {}) {
        return require_notifyManager2.notifyManager.batch(() => {
          this.#queryCache.findAll(filters).forEach((query) => {
            query.invalidate();
          });
          if (filters?.refetchType === "none") return Promise.resolve();
          return this.refetchQueries({
            ...filters,
            type: filters?.refetchType ?? filters?.type ?? "active"
          }, options);
        });
      }
      /**
      * Refetches queries matching the given filters, regardless of whether they are stale. Without
      * filters, every query in the cache is refetched. Queries that are disabled, or static (only
      * have observers with a static `staleTime`), are never refetched.
      *
      * By default (`cancelRefetch: true`), a currently running fetch is cancelled before the new
      * one starts. The returned promise resolves once all matching queries have settled; it does
      * not reject on individual query failures unless `throwOnError` is set.
      *
      * @example
      * ```ts
      * // refetch all active queries partially matching a query key:
      * await queryClient.refetchQueries({ queryKey: ['posts'], type: 'active' })
      * ```
      */
      refetchQueries(filters, options = {}) {
        const fetchOptions = {
          ...options,
          cancelRefetch: options.cancelRefetch ?? true
        };
        const promises = require_notifyManager2.notifyManager.batch(() => this.#queryCache.findAll(filters).filter((query) => !query.isDisabled() && !query.isStatic()).map((query) => {
          let promise = query.fetch(void 0, fetchOptions);
          if (!fetchOptions.throwOnError) promise = promise.catch(require_utils2.noop);
          return query.state.fetchStatus === "paused" ? Promise.resolve() : promise;
        }));
        return Promise.all(promises).then(require_utils2.noop);
      }
      /**
      * Asynchronous method to fetch and cache a query, resolving with the data or throwing with
      * the error.
      *
      * If the query already exists in the cache and its data is not stale (per the given
      * `staleTime`), the cached data is returned without fetching. Otherwise, the query is fetched
      * and the promise resolves once the fetch settles. If a `select` function is provided, it is
      * applied to the data in both cases (cached or freshly fetched) before it is returned.
      *
      * Unlike a reactive observer, retries are disabled by default here (`retry: false`) unless
      * explicitly configured, since there is no component to catch a thrown error and retry through
      * re-render.
      *
      * The accepted options are `QueryObserverOptions` minus the fields that only make sense for a
      * reactive observer — `enabled`, `refetchInterval`, `refetchIntervalInBackground`,
      * `refetchOnWindowFocus`, `refetchOnReconnect`, `refetchOnMount`, `retryOnMount`,
      * `notifyOnChangeProps`, `throwOnError`, `suspense`, and `placeholderData` are not part of this
      * method's options.
      *
      * This method replaces the deprecated `fetchQuery`, and — combined with
      * `{ staleTime: 'static' }` — the deprecated `ensureQueryData`.
      *
      * @example
      * ```ts
      * try {
      *   const data = await queryClient.query({ queryKey, queryFn, staleTime: 10000 })
      * } catch (error) {
      *   console.log(error)
      * }
      * ```
      */
      async query(options) {
        const defaultedOptions = this.defaultQueryOptions(options);
        if (defaultedOptions.retry === void 0) defaultedOptions.retry = false;
        const query = this.#queryCache.build(this, defaultedOptions);
        const queryData = query.isStaleByTime(require_utils2.resolveQueryValue(defaultedOptions.staleTime, query)) ? await query.fetch(defaultedOptions) : query.state.data;
        const select = defaultedOptions.select;
        if (select) return select(queryData);
        return queryData;
      }
      /**
      * @deprecated Use queryClient.query(options) instead. This method will be removed in the next major version.
      */
      fetchQuery(options) {
        const defaultedOptions = this.defaultQueryOptions(options);
        if (defaultedOptions.retry === void 0) defaultedOptions.retry = false;
        const query = this.#queryCache.build(this, defaultedOptions);
        return query.isStaleByTime(require_utils2.resolveQueryValue(defaultedOptions.staleTime, query)) ? query.fetch(defaultedOptions) : Promise.resolve(query.state.data);
      }
      /**
      * @deprecated Use queryClient.query(options) instead. You can swallow errors with `.catch(noop)`. This method will be removed in the next major version.
      */
      prefetchQuery(options) {
        return this.fetchQuery(options).then(require_utils2.noop).catch(require_utils2.noop);
      }
      /**
      * Asynchronous method to fetch and cache an infinite query, resolving with an
      * {@link InfiniteData} object or throwing with the error.
      *
      * Behaves like {@link QueryClient#query}, accepting the same options (minus
      * `initialPageParam`), plus the required `initialPageParam`, and an optional `pages` /
      * `getNextPageParam` pair used to refetch a fixed number of pages from the start.
      *
      * This method replaces the deprecated `fetchInfiniteQuery`, and — combined with
      * `{ staleTime: 'static' }` — the deprecated `ensureInfiniteQueryData`.
      *
      * @example
      * ```ts
      * try {
      *   const data = await queryClient.infiniteQuery({ queryKey, queryFn, initialPageParam: 0 })
      *   console.log(data.pages)
      * } catch (error) {
      *   console.log(error)
      * }
      * ```
      */
      infiniteQuery(options) {
        options._type = "infinite";
        return this.query(options);
      }
      /**
      * @deprecated Use queryClient.infiniteQuery(options) instead. This method will be removed in the next major version.
      */
      fetchInfiniteQuery(options) {
        options._type = "infinite";
        return this.fetchQuery(options);
      }
      /**
      * @deprecated Use queryClient.infiniteQuery(options) instead. You can swallow errors with `.catch(noop)`. This method will be removed in the next major version.
      */
      prefetchInfiniteQuery(options) {
        return this.fetchInfiniteQuery(options).then(require_utils2.noop).catch(require_utils2.noop);
      }
      /**
      * @deprecated Use queryClient.infiniteQuery({ ...options, staleTime: 'static' }) instead. This method will be removed in the next major version.
      */
      ensureInfiniteQueryData(options) {
        options._type = "infinite";
        return this.ensureQueryData(options);
      }
      /**
      * Resumes mutations that were paused because there was no network connection. Does nothing
      * (resolving immediately) if the client is currently offline.
      *
      * @example
      * ```ts
      * import { QueryClient } from '@tanstack/query-core'
      *
      * const queryClient = new QueryClient()
      * await queryClient.resumePausedMutations()
      * ```
      */
      resumePausedMutations() {
        if (require_onlineManager2.onlineManager.isOnline()) return this.#mutationCache.resumePausedMutations();
        return Promise.resolve();
      }
      /**
      * Returns the query cache this client is connected to.
      *
      * @example
      * ```ts
      * import { QueryClient } from '@tanstack/query-core'
      *
      * const queryClient = new QueryClient()
      * const queryCache = queryClient.getQueryCache()
      * const queries = queryCache.findAll({ queryKey: ['posts'] })
      * ```
      */
      getQueryCache() {
        return this.#queryCache;
      }
      /**
      * Returns the mutation cache this client is connected to.
      *
      * @example
      * ```ts
      * import { QueryClient } from '@tanstack/query-core'
      *
      * const queryClient = new QueryClient()
      * const mutationCache = queryClient.getMutationCache()
      * const mutations = mutationCache.findAll({ status: 'pending' })
      * ```
      */
      getMutationCache() {
        return this.#mutationCache;
      }
      /**
      * Returns the default options that were set when creating the client, or via
      * {@link QueryClient#setDefaultOptions}.
      *
      * @example
      * ```ts
      * import { QueryClient } from '@tanstack/query-core'
      *
      * const queryClient = new QueryClient()
      * const defaultOptions = queryClient.getDefaultOptions()
      * ```
      */
      getDefaultOptions() {
        return this.#defaultOptions;
      }
      /**
      * Dynamically sets the default options for this client, overwriting any previously defined
      * default options.
      *
      * @see {@link QueryClient#getDefaultOptions}
      * @example
      * ```ts
      * import { QueryClient } from '@tanstack/query-core'
      *
      * const queryClient = new QueryClient()
      * queryClient.setDefaultOptions({
      *   queries: {
      *     staleTime: Infinity,
      *   },
      * })
      * ```
      */
      setDefaultOptions(options) {
        this.#defaultOptions = options;
      }
      /**
      * Sets default options for queries whose query key partially matches the given `queryKey`.
      *
      * If several registered query defaults match a given query key, they are merged together in
      * registration order by {@link QueryClient#getQueryDefaults}, so register defaults from the
      * most generic key to the least generic one — more specific defaults should be registered
      * after more generic ones so they take precedence.
      *
      * @example
      * ```ts
      * queryClient.setQueryDefaults(['posts'], { queryFn: fetchPosts })
      *
      * await queryClient.query({ queryKey: ['posts'] })
      * ```
      */
      setQueryDefaults(queryKey, options) {
        this.#queryDefaults.set(require_utils2.hashKey(queryKey), {
          queryKey,
          defaultOptions: options
        });
      }
      /**
      * Returns the default options registered for queries whose query key partially matches the
      * given `queryKey`, via {@link QueryClient#setQueryDefaults}. If multiple registered defaults
      * match, they are merged together in registration order.
      *
      * @example
      * ```ts
      * const defaultOptions = queryClient.getQueryDefaults(['posts'])
      * ```
      */
      getQueryDefaults(queryKey) {
        const defaults = [...this.#queryDefaults.values()];
        const result = {};
        defaults.forEach((queryDefault) => {
          if (require_utils2.partialMatchKey(queryKey, queryDefault.queryKey)) Object.assign(result, queryDefault.defaultOptions);
        });
        return result;
      }
      /**
      * Sets default options for mutations whose mutation key partially matches the given
      * `mutationKey`. As with {@link QueryClient#setQueryDefaults}, the order of registration
      * matters when several registered defaults match the same mutation key.
      *
      * @see {@link QueryClient#getMutationDefaults}
      * @example
      * ```ts
      * queryClient.setMutationDefaults(['addPost'], { mutationFn: addPost })
      * ```
      */
      setMutationDefaults(mutationKey, options) {
        this.#mutationDefaults.set(require_utils2.hashKey(mutationKey), {
          mutationKey,
          defaultOptions: options
        });
      }
      /**
      * Returns the default options registered for mutations whose mutation key partially matches
      * the given `mutationKey`, via {@link QueryClient#setMutationDefaults}. If multiple registered
      * defaults match, they are merged together in registration order.
      *
      * @example
      * ```ts
      * const defaultOptions = queryClient.getMutationDefaults(['addPost'])
      * ```
      */
      getMutationDefaults(mutationKey) {
        const defaults = [...this.#mutationDefaults.values()];
        const result = {};
        defaults.forEach((queryDefault) => {
          if (require_utils2.partialMatchKey(mutationKey, queryDefault.mutationKey)) Object.assign(result, queryDefault.defaultOptions);
        });
        return result;
      }
      /**
      * Called by framework adapters (e.g. inside `useQuery`) to resolve the options passed by the
      * caller into their final, defaulted form: merging `queryClient.setQueryDefaults` for the
      * given `queryKey`, then the client's own `defaultOptions.queries`, then the caller's options
      * on top. A no-op if the options are already defaulted (`_defaulted: true`).
      */
      defaultQueryOptions(options) {
        if (options._defaulted) return options;
        const defaultedOptions = {
          ...this.#defaultOptions.queries,
          ...this.getQueryDefaults(options.queryKey),
          ...options,
          _defaulted: true
        };
        if (!defaultedOptions.queryHash) defaultedOptions.queryHash = require_utils2.hashQueryKeyByOptions(defaultedOptions.queryKey, defaultedOptions);
        if (defaultedOptions.refetchOnReconnect === void 0) defaultedOptions.refetchOnReconnect = defaultedOptions.networkMode !== "always";
        if (defaultedOptions.throwOnError === void 0) defaultedOptions.throwOnError = !!defaultedOptions.suspense;
        if (!defaultedOptions.networkMode && defaultedOptions.persister) defaultedOptions.networkMode = "offlineFirst";
        if (defaultedOptions.queryFn === require_utils2.skipToken) defaultedOptions.enabled = false;
        return defaultedOptions;
      }
      /**
      * The mutation counterpart of {@link QueryClient#defaultQueryOptions}. Called by framework
      * adapters (e.g. inside `useMutation`) to merge `queryClient.setMutationDefaults` for the
      * given `mutationKey`, then the client's `defaultOptions.mutations`, then the caller's options
      * on top. A no-op if the options are already defaulted (`_defaulted: true`).
      */
      defaultMutationOptions(options) {
        if (options?._defaulted) return options;
        return {
          ...this.#defaultOptions.mutations,
          ...options?.mutationKey && this.getMutationDefaults(options.mutationKey),
          ...options,
          _defaulted: true
        };
      }
      /**
      * Clears both the query cache and the mutation cache this client is connected to.
      *
      * @example
      * ```ts
      * import { QueryClient } from '@tanstack/query-core'
      *
      * const queryClient = new QueryClient()
      * queryClient.clear()
      * ```
      */
      clear() {
        this.#queryCache.clear();
        this.#mutationCache.clear();
      }
    };
    exports2.QueryClient = QueryClient2;
  }
});

// node_modules/.pnpm/@tanstack+query-core@5.104.1/node_modules/@tanstack/query-core/build/modern/streamedQuery.cjs
var require_streamedQuery = __commonJS({
  "node_modules/.pnpm/@tanstack+query-core@5.104.1/node_modules/@tanstack/query-core/build/modern/streamedQuery.cjs"(exports2) {
    Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
    var require_utils2 = require_utils();
    function streamedQuery({ streamFn, refetchMode = "reset", reducer = (items, chunk) => require_utils2.addToEnd(items, chunk), initialValue = [] }) {
      return async (context) => {
        const query = context.client.getQueryCache().find({
          queryKey: context.queryKey,
          exact: true
        });
        const isRefetch = !!query && query.isFetched();
        if (isRefetch && refetchMode === "reset") query.setState({
          ...query.resetState,
          fetchStatus: "fetching"
        });
        let result = initialValue;
        let cancelled = false;
        const stream = await streamFn(require_utils2.addConsumeAwareSignal({
          client: context.client,
          meta: context.meta,
          queryKey: context.queryKey,
          pageParam: context.pageParam,
          direction: context.direction
        }, () => context.signal, () => cancelled = true));
        const isReplaceRefetch = isRefetch && refetchMode === "replace";
        for await (const chunk of stream) {
          if (cancelled) break;
          if (isReplaceRefetch) result = reducer(result, chunk);
          else context.client.setQueryData(context.queryKey, (prev) => reducer(prev === void 0 ? initialValue : prev, chunk));
        }
        if (isReplaceRefetch && !cancelled) context.client.setQueryData(context.queryKey, result);
        const data = context.client.getQueryData(context.queryKey);
        return data === void 0 ? initialValue : data;
      };
    }
    exports2.streamedQuery = streamedQuery;
  }
});

// node_modules/.pnpm/@tanstack+query-core@5.104.1/node_modules/@tanstack/query-core/build/modern/types.cjs
var require_types = __commonJS({
  "node_modules/.pnpm/@tanstack+query-core@5.104.1/node_modules/@tanstack/query-core/build/modern/types.cjs"(exports2) {
    Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
    var dataTagSymbol = /* @__PURE__ */ Symbol();
    var dataTagErrorSymbol = /* @__PURE__ */ Symbol();
    var unsetMarker = /* @__PURE__ */ Symbol();
    exports2.dataTagErrorSymbol = dataTagErrorSymbol;
    exports2.dataTagSymbol = dataTagSymbol;
    exports2.unsetMarker = unsetMarker;
  }
});

// node_modules/.pnpm/@tanstack+query-core@5.104.1/node_modules/@tanstack/query-core/build/modern/index.cjs
var require_modern = __commonJS({
  "node_modules/.pnpm/@tanstack+query-core@5.104.1/node_modules/@tanstack/query-core/build/modern/index.cjs"(exports2) {
    Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
    var require_timeoutManager2 = require_timeoutManager();
    var require_utils2 = require_utils();
    var require_environmentManager2 = require_environmentManager();
    var require_focusManager2 = require_focusManager();
    var require_hydration2 = require_hydration();
    var require_notifyManager2 = require_notifyManager();
    var require_onlineManager2 = require_onlineManager();
    var require_retryer2 = require_retryer();
    var require_query2 = require_query();
    var require_queryObserver2 = require_queryObserver();
    var require_infiniteQueryObserver2 = require_infiniteQueryObserver();
    var require_mutation2 = require_mutation();
    var require_mutationCache2 = require_mutationCache();
    var require_mutationObserver2 = require_mutationObserver();
    var require_queriesObserver2 = require_queriesObserver();
    var require_queryCache2 = require_queryCache();
    var require_queryClient2 = require_queryClient();
    var require_streamedQuery2 = require_streamedQuery();
    var require_types2 = require_types();
    exports2.CancelledError = require_retryer2.CancelledError;
    exports2.InfiniteQueryObserver = require_infiniteQueryObserver2.InfiniteQueryObserver;
    exports2.Mutation = require_mutation2.Mutation;
    exports2.MutationCache = require_mutationCache2.MutationCache;
    exports2.MutationObserver = require_mutationObserver2.MutationObserver;
    exports2.QueriesObserver = require_queriesObserver2.QueriesObserver;
    exports2.Query = require_query2.Query;
    exports2.QueryCache = require_queryCache2.QueryCache;
    exports2.QueryClient = require_queryClient2.QueryClient;
    exports2.QueryObserver = require_queryObserver2.QueryObserver;
    exports2.dataTagErrorSymbol = require_types2.dataTagErrorSymbol;
    exports2.dataTagSymbol = require_types2.dataTagSymbol;
    exports2.defaultScheduler = require_notifyManager2.defaultScheduler;
    exports2.defaultShouldDehydrateMutation = require_hydration2.defaultShouldDehydrateMutation;
    exports2.defaultShouldDehydrateQuery = require_hydration2.defaultShouldDehydrateQuery;
    exports2.dehydrate = require_hydration2.dehydrate;
    exports2.dehydrateQuery = require_hydration2.dehydrateQuery;
    exports2.environmentManager = require_environmentManager2.environmentManager;
    exports2.experimental_streamedQuery = require_streamedQuery2.streamedQuery;
    exports2.focusManager = require_focusManager2.focusManager;
    exports2.hashKey = require_utils2.hashKey;
    exports2.hydrate = require_hydration2.hydrate;
    exports2.isCancelledError = require_retryer2.isCancelledError;
    exports2.isServer = require_utils2.isServer;
    exports2.keepPreviousData = require_utils2.keepPreviousData;
    exports2.matchMutation = require_utils2.matchMutation;
    exports2.matchQuery = require_utils2.matchQuery;
    exports2.noop = require_utils2.noop;
    exports2.notifyManager = require_notifyManager2.notifyManager;
    exports2.onlineManager = require_onlineManager2.onlineManager;
    exports2.partialMatchKey = require_utils2.partialMatchKey;
    exports2.replaceEqualDeep = require_utils2.replaceEqualDeep;
    exports2.shouldThrowError = require_utils2.shouldThrowError;
    exports2.skipToken = require_utils2.skipToken;
    exports2.timeoutManager = require_timeoutManager2.timeoutManager;
    exports2.unsetMarker = require_types2.unsetMarker;
  }
});

// node_modules/.pnpm/@tanstack+react-query@5.104.1_react@19.1.0/node_modules/@tanstack/react-query/build/legacy/HydrationBoundary.cjs
var require_HydrationBoundary = __commonJS({
  "node_modules/.pnpm/@tanstack+react-query@5.104.1_react@19.1.0/node_modules/@tanstack/react-query/build/legacy/HydrationBoundary.cjs"(exports2) {
    "use client";
    Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
    var require_rolldown_runtime = require_rolldown_runtime_VH7oDXx4();
    var require_QueryClientProvider2 = require_QueryClientProvider();
    var react = require_react();
    react = require_rolldown_runtime.__toESM(react, 1);
    var _tanstack_query_core = require_modern();
    var HydrationBoundary = ({ children, options = {}, state, queryClient }) => {
      const client = require_QueryClientProvider2.useQueryClient(queryClient);
      const optionsRef = react.useRef(options);
      react.useEffect(() => {
        optionsRef.current = options;
      });
      const hydrationQueue = react.useMemo(() => {
        if (state) {
          if (typeof state !== "object") return;
          const queryCache = client.getQueryCache();
          const queries = state.queries || [];
          const newQueries = [];
          const existingQueries = [];
          for (const dehydratedQuery of queries) {
            const existingQuery = queryCache.get(dehydratedQuery.queryHash);
            if (!existingQuery) newQueries.push(dehydratedQuery);
            else if (dehydratedQuery.state.dataUpdatedAt > existingQuery.state.dataUpdatedAt || dehydratedQuery.promise && existingQuery.state.status !== "pending" && existingQuery.state.fetchStatus !== "fetching" && dehydratedQuery.dehydratedAt > existingQuery.state.dataUpdatedAt) existingQueries.push(dehydratedQuery);
          }
          if (newQueries.length > 0) (0, _tanstack_query_core.hydrate)(client, { queries: newQueries }, optionsRef.current);
          if (existingQueries.length > 0) return existingQueries;
        }
      }, [client, state]);
      react.useEffect(() => {
        if (hydrationQueue) (0, _tanstack_query_core.hydrate)(client, { queries: hydrationQueue }, optionsRef.current);
      }, [client, hydrationQueue]);
      return children;
    };
    exports2.HydrationBoundary = HydrationBoundary;
  }
});

// node_modules/.pnpm/@tanstack+react-query@5.104.1_react@19.1.0/node_modules/@tanstack/react-query/build/legacy/IsRestoringProvider.cjs
var require_IsRestoringProvider = __commonJS({
  "node_modules/.pnpm/@tanstack+react-query@5.104.1_react@19.1.0/node_modules/@tanstack/react-query/build/legacy/IsRestoringProvider.cjs"(exports2) {
    "use client";
    Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
    var require_rolldown_runtime = require_rolldown_runtime_VH7oDXx4();
    var react = require_react();
    react = require_rolldown_runtime.__toESM(react, 1);
    var IsRestoringContext = react.createContext(false);
    var useIsRestoring = () => react.useContext(IsRestoringContext);
    var IsRestoringProvider = IsRestoringContext.Provider;
    exports2.IsRestoringProvider = IsRestoringProvider;
    exports2.useIsRestoring = useIsRestoring;
  }
});

// node_modules/.pnpm/@tanstack+react-query@5.104.1_react@19.1.0/node_modules/@tanstack/react-query/build/legacy/QueryErrorResetBoundary.cjs
var require_QueryErrorResetBoundary = __commonJS({
  "node_modules/.pnpm/@tanstack+react-query@5.104.1_react@19.1.0/node_modules/@tanstack/react-query/build/legacy/QueryErrorResetBoundary.cjs"(exports2) {
    "use client";
    Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
    var require_rolldown_runtime = require_rolldown_runtime_VH7oDXx4();
    var react = require_react();
    react = require_rolldown_runtime.__toESM(react, 1);
    var react_jsx_runtime = require_jsx_runtime();
    function createValue() {
      let isReset = false;
      return {
        /**
        * Clears the reset state, so queries know not to try again until the boundary is reset again.
        */
        clearReset: () => {
          isReset = false;
        },
        /**
        * Resets any query errors within the boundary, so queries know they can try again.
        */
        reset: () => {
          isReset = true;
        },
        /**
        * Returns whether the boundary has been reset and not yet cleared.
        */
        isReset: () => {
          return isReset;
        }
      };
    }
    var QueryErrorResetBoundaryContext = react.createContext(createValue());
    var useQueryErrorResetBoundary = () => react.useContext(QueryErrorResetBoundaryContext);
    var QueryErrorResetBoundary = ({ children }) => {
      const [value] = react.useState(() => createValue());
      return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(QueryErrorResetBoundaryContext.Provider, {
        value,
        children: typeof children === "function" ? children(value) : children
      });
    };
    exports2.QueryErrorResetBoundary = QueryErrorResetBoundary;
    exports2.useQueryErrorResetBoundary = useQueryErrorResetBoundary;
  }
});

// node_modules/.pnpm/@tanstack+react-query@5.104.1_react@19.1.0/node_modules/@tanstack/react-query/build/legacy/errorBoundaryUtils.cjs
var require_errorBoundaryUtils = __commonJS({
  "node_modules/.pnpm/@tanstack+react-query@5.104.1_react@19.1.0/node_modules/@tanstack/react-query/build/legacy/errorBoundaryUtils.cjs"(exports2) {
    "use client";
    Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
    var require_rolldown_runtime = require_rolldown_runtime_VH7oDXx4();
    var react = require_react();
    react = require_rolldown_runtime.__toESM(react, 1);
    var _tanstack_query_core = require_modern();
    var ensurePreventErrorBoundaryRetry = (options, errorResetBoundary, query) => {
      const throwOnError = (query === null || query === void 0 ? void 0 : query.state.error) && typeof options.throwOnError === "function" ? (0, _tanstack_query_core.shouldThrowError)(options.throwOnError, [query.state.error, query]) : options.throwOnError;
      if (options.suspense || throwOnError) {
        if (!errorResetBoundary.isReset()) options.retryOnMount = false;
      }
    };
    var useClearResetErrorBoundary = (errorResetBoundary) => {
      react.useEffect(() => {
        errorResetBoundary.clearReset();
      }, [errorResetBoundary]);
    };
    var getHasError = ({ result, errorResetBoundary, throwOnError, query, suspense }) => {
      return result.isError && !errorResetBoundary.isReset() && !result.isFetching && query && (suspense && result.data === void 0 || (0, _tanstack_query_core.shouldThrowError)(throwOnError, [result.error, query]));
    };
    exports2.ensurePreventErrorBoundaryRetry = ensurePreventErrorBoundaryRetry;
    exports2.getHasError = getHasError;
    exports2.useClearResetErrorBoundary = useClearResetErrorBoundary;
  }
});

// node_modules/.pnpm/@tanstack+react-query@5.104.1_react@19.1.0/node_modules/@tanstack/react-query/build/legacy/suspense.cjs
var require_suspense = __commonJS({
  "node_modules/.pnpm/@tanstack+react-query@5.104.1_react@19.1.0/node_modules/@tanstack/react-query/build/legacy/suspense.cjs"(exports2) {
    Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
    var defaultThrowOnError = (_error, query) => query.state.data === void 0;
    var ensureSuspenseTimers = (defaultedOptions) => {
      if (defaultedOptions.suspense) {
        const MIN_SUSPENSE_TIME_MS = 1e3;
        const clamp = (value) => value === "static" ? value : Math.max(value ?? MIN_SUSPENSE_TIME_MS, MIN_SUSPENSE_TIME_MS);
        const originalStaleTime = defaultedOptions.staleTime;
        defaultedOptions.staleTime = typeof originalStaleTime === "function" ? (...args) => clamp(originalStaleTime(...args)) : clamp(originalStaleTime);
        if (typeof defaultedOptions.gcTime === "number") defaultedOptions.gcTime = Math.max(defaultedOptions.gcTime, MIN_SUSPENSE_TIME_MS);
      }
    };
    var shouldSuspend = (defaultedOptions, result) => (defaultedOptions === null || defaultedOptions === void 0 ? void 0 : defaultedOptions.suspense) && result.isPending;
    var fetchOptimistic = (defaultedOptions, observer, errorResetBoundary) => observer.fetchOptimistic(defaultedOptions).catch(() => {
      errorResetBoundary.clearReset();
    });
    exports2.defaultThrowOnError = defaultThrowOnError;
    exports2.ensureSuspenseTimers = ensureSuspenseTimers;
    exports2.fetchOptimistic = fetchOptimistic;
    exports2.shouldSuspend = shouldSuspend;
  }
});

// node_modules/.pnpm/@tanstack+react-query@5.104.1_react@19.1.0/node_modules/@tanstack/react-query/build/legacy/useQueries.cjs
var require_useQueries = __commonJS({
  "node_modules/.pnpm/@tanstack+react-query@5.104.1_react@19.1.0/node_modules/@tanstack/react-query/build/legacy/useQueries.cjs"(exports2) {
    "use client";
    Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
    var require_rolldown_runtime = require_rolldown_runtime_VH7oDXx4();
    var require_QueryClientProvider2 = require_QueryClientProvider();
    var require_IsRestoringProvider2 = require_IsRestoringProvider();
    var require_QueryErrorResetBoundary2 = require_QueryErrorResetBoundary();
    var require_errorBoundaryUtils2 = require_errorBoundaryUtils();
    var require_suspense2 = require_suspense();
    var react = require_react();
    react = require_rolldown_runtime.__toESM(react, 1);
    var _tanstack_query_core = require_modern();
    function useQueries({ queries, ...options }, queryClient) {
      const client = require_QueryClientProvider2.useQueryClient(queryClient);
      const isRestoring = require_IsRestoringProvider2.useIsRestoring();
      const errorResetBoundary = require_QueryErrorResetBoundary2.useQueryErrorResetBoundary();
      const subscribed = options.subscribed !== false;
      const defaultedQueries = react.useMemo(() => queries.map((opts) => {
        const defaultedOptions = client.defaultQueryOptions(opts);
        defaultedOptions._optimisticResults = isRestoring ? "isRestoring" : subscribed ? "optimistic" : void 0;
        return defaultedOptions;
      }), [
        queries,
        client,
        isRestoring,
        subscribed
      ]);
      defaultedQueries.forEach((queryOptions) => {
        require_suspense2.ensureSuspenseTimers(queryOptions);
        const query = client.getQueryCache().get(queryOptions.queryHash);
        require_errorBoundaryUtils2.ensurePreventErrorBoundaryRetry(queryOptions, errorResetBoundary, query);
      });
      require_errorBoundaryUtils2.useClearResetErrorBoundary(errorResetBoundary);
      const [observer] = react.useState(() => new _tanstack_query_core.QueriesObserver(client, defaultedQueries, options));
      const [optimisticResult, getCombinedResult, trackResult] = observer.getOptimisticResult(defaultedQueries, options.combine);
      const shouldSubscribe = !isRestoring && subscribed;
      react.useSyncExternalStore(react.useCallback((onStoreChange) => shouldSubscribe ? observer.subscribe(_tanstack_query_core.notifyManager.batchCalls(onStoreChange)) : _tanstack_query_core.noop, [observer, shouldSubscribe]), () => observer.getCurrentResult(), () => observer.getCurrentResult());
      react.useEffect(() => {
        observer.setQueries(defaultedQueries, options);
      }, [
        defaultedQueries,
        options,
        observer
      ]);
      const suspensePromises = optimisticResult.some((result, index) => require_suspense2.shouldSuspend(defaultedQueries[index], result)) ? optimisticResult.flatMap((result, index) => {
        const opts = defaultedQueries[index];
        if (opts && require_suspense2.shouldSuspend(opts, result)) {
          const queryObserver = new _tanstack_query_core.QueryObserver(client, opts);
          return require_suspense2.fetchOptimistic(opts, queryObserver, errorResetBoundary);
        }
        return [];
      }) : [];
      if (suspensePromises.length > 0) throw Promise.all(suspensePromises);
      const firstSingleResultWhichShouldThrow = optimisticResult.find((result, index) => {
        const query = defaultedQueries[index];
        return query && require_errorBoundaryUtils2.getHasError({
          result,
          errorResetBoundary,
          throwOnError: query.throwOnError,
          query: client.getQueryCache().get(query.queryHash),
          suspense: query.suspense
        });
      });
      if (firstSingleResultWhichShouldThrow) throw firstSingleResultWhichShouldThrow.error;
      return getCombinedResult(trackResult());
    }
    exports2.useQueries = useQueries;
  }
});

// node_modules/.pnpm/@tanstack+react-query@5.104.1_react@19.1.0/node_modules/@tanstack/react-query/build/legacy/useBaseQuery.cjs
var require_useBaseQuery = __commonJS({
  "node_modules/.pnpm/@tanstack+react-query@5.104.1_react@19.1.0/node_modules/@tanstack/react-query/build/legacy/useBaseQuery.cjs"(exports2) {
    "use client";
    Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
    var require_rolldown_runtime = require_rolldown_runtime_VH7oDXx4();
    var require_QueryClientProvider2 = require_QueryClientProvider();
    var require_IsRestoringProvider2 = require_IsRestoringProvider();
    var require_QueryErrorResetBoundary2 = require_QueryErrorResetBoundary();
    var require_errorBoundaryUtils2 = require_errorBoundaryUtils();
    var require_suspense2 = require_suspense();
    var react = require_react();
    react = require_rolldown_runtime.__toESM(react, 1);
    var _tanstack_query_core = require_modern();
    function useBaseQuery(options, Observer, queryClient) {
      if (process.env.NODE_ENV !== "production") {
        if (typeof options !== "object" || Array.isArray(options)) throw new Error('Bad argument type. Starting with v5, only the "Object" form is allowed when calling query related functions. Please use the error stack to find the culprit call. More info here: https://tanstack.com/query/latest/docs/react/guides/migrating-to-v5#supports-a-single-signature-one-object');
      }
      const isRestoring = require_IsRestoringProvider2.useIsRestoring();
      const errorResetBoundary = require_QueryErrorResetBoundary2.useQueryErrorResetBoundary();
      const client = require_QueryClientProvider2.useQueryClient(queryClient);
      const defaultedOptions = client.defaultQueryOptions(options);
      const query = client.getQueryCache().get(defaultedOptions.queryHash);
      if (process.env.NODE_ENV !== "production") {
        if (!defaultedOptions.queryFn) console.error(`[${defaultedOptions.queryHash}]: No queryFn was passed as an option, and no default queryFn was found. The queryFn parameter is only optional when using a default queryFn. More info here: https://tanstack.com/query/latest/docs/framework/react/guides/default-query-function`);
      }
      const subscribed = options.subscribed !== false;
      defaultedOptions._optimisticResults = isRestoring ? "isRestoring" : subscribed ? "optimistic" : void 0;
      require_suspense2.ensureSuspenseTimers(defaultedOptions);
      require_errorBoundaryUtils2.ensurePreventErrorBoundaryRetry(defaultedOptions, errorResetBoundary, query);
      require_errorBoundaryUtils2.useClearResetErrorBoundary(errorResetBoundary);
      const [observer] = react.useState(() => new Observer(client, defaultedOptions));
      const result = observer.getOptimisticResult(defaultedOptions);
      const shouldSubscribe = !isRestoring && subscribed;
      react.useSyncExternalStore(react.useCallback((onStoreChange) => {
        const unsubscribe = shouldSubscribe ? observer.subscribe(_tanstack_query_core.notifyManager.batchCalls(onStoreChange)) : _tanstack_query_core.noop;
        observer.updateResult();
        return unsubscribe;
      }, [observer, shouldSubscribe]), () => observer.getCurrentResult(), () => observer.getCurrentResult());
      react.useEffect(() => {
        observer.setOptions(defaultedOptions);
      }, [defaultedOptions, observer]);
      if (require_suspense2.shouldSuspend(defaultedOptions, result)) throw require_suspense2.fetchOptimistic(defaultedOptions, observer, errorResetBoundary);
      if (require_errorBoundaryUtils2.getHasError({
        result,
        errorResetBoundary,
        throwOnError: defaultedOptions.throwOnError,
        query,
        suspense: defaultedOptions.suspense
      })) throw result.error;
      return !defaultedOptions.notifyOnChangeProps ? observer.trackResult(result) : result;
    }
    exports2.useBaseQuery = useBaseQuery;
  }
});

// node_modules/.pnpm/@tanstack+react-query@5.104.1_react@19.1.0/node_modules/@tanstack/react-query/build/legacy/useQuery.cjs
var require_useQuery = __commonJS({
  "node_modules/.pnpm/@tanstack+react-query@5.104.1_react@19.1.0/node_modules/@tanstack/react-query/build/legacy/useQuery.cjs"(exports2) {
    "use client";
    Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
    var require_useBaseQuery2 = require_useBaseQuery();
    var _tanstack_query_core = require_modern();
    function useQuery(options, queryClient) {
      return require_useBaseQuery2.useBaseQuery(options, _tanstack_query_core.QueryObserver, queryClient);
    }
    exports2.useQuery = useQuery;
  }
});

// node_modules/.pnpm/@tanstack+react-query@5.104.1_react@19.1.0/node_modules/@tanstack/react-query/build/legacy/useSuspenseQuery.cjs
var require_useSuspenseQuery = __commonJS({
  "node_modules/.pnpm/@tanstack+react-query@5.104.1_react@19.1.0/node_modules/@tanstack/react-query/build/legacy/useSuspenseQuery.cjs"(exports2) {
    "use client";
    Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
    var require_suspense2 = require_suspense();
    var require_useBaseQuery2 = require_useBaseQuery();
    var _tanstack_query_core = require_modern();
    function useSuspenseQuery(options, queryClient) {
      if (process.env.NODE_ENV !== "production") {
        if (options.queryFn === _tanstack_query_core.skipToken) console.error("skipToken is not allowed for useSuspenseQuery");
      }
      return require_useBaseQuery2.useBaseQuery({
        ...options,
        enabled: true,
        suspense: true,
        throwOnError: require_suspense2.defaultThrowOnError,
        placeholderData: void 0
      }, _tanstack_query_core.QueryObserver, queryClient);
    }
    exports2.useSuspenseQuery = useSuspenseQuery;
  }
});

// node_modules/.pnpm/@tanstack+react-query@5.104.1_react@19.1.0/node_modules/@tanstack/react-query/build/legacy/useSuspenseInfiniteQuery.cjs
var require_useSuspenseInfiniteQuery = __commonJS({
  "node_modules/.pnpm/@tanstack+react-query@5.104.1_react@19.1.0/node_modules/@tanstack/react-query/build/legacy/useSuspenseInfiniteQuery.cjs"(exports2) {
    "use client";
    Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
    var require_suspense2 = require_suspense();
    var require_useBaseQuery2 = require_useBaseQuery();
    var _tanstack_query_core = require_modern();
    function useSuspenseInfiniteQuery(options, queryClient) {
      if (process.env.NODE_ENV !== "production") {
        if (options.queryFn === _tanstack_query_core.skipToken) console.error("skipToken is not allowed for useSuspenseInfiniteQuery");
      }
      return require_useBaseQuery2.useBaseQuery({
        ...options,
        enabled: true,
        suspense: true,
        throwOnError: require_suspense2.defaultThrowOnError,
        placeholderData: void 0
      }, _tanstack_query_core.InfiniteQueryObserver, queryClient);
    }
    exports2.useSuspenseInfiniteQuery = useSuspenseInfiniteQuery;
  }
});

// node_modules/.pnpm/@tanstack+react-query@5.104.1_react@19.1.0/node_modules/@tanstack/react-query/build/legacy/useSuspenseQueries.cjs
var require_useSuspenseQueries = __commonJS({
  "node_modules/.pnpm/@tanstack+react-query@5.104.1_react@19.1.0/node_modules/@tanstack/react-query/build/legacy/useSuspenseQueries.cjs"(exports2) {
    "use client";
    Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
    var require_suspense2 = require_suspense();
    var require_useQueries2 = require_useQueries();
    var _tanstack_query_core = require_modern();
    function useSuspenseQueries(options, queryClient) {
      return require_useQueries2.useQueries({
        ...options,
        queries: options.queries.map((query) => {
          if (process.env.NODE_ENV !== "production") {
            if (query.queryFn === _tanstack_query_core.skipToken) console.error("skipToken is not allowed for useSuspenseQueries");
          }
          return {
            ...query,
            suspense: true,
            throwOnError: require_suspense2.defaultThrowOnError,
            enabled: true,
            placeholderData: void 0
          };
        })
      }, queryClient);
    }
    exports2.useSuspenseQueries = useSuspenseQueries;
  }
});

// node_modules/.pnpm/@tanstack+react-query@5.104.1_react@19.1.0/node_modules/@tanstack/react-query/build/legacy/usePrefetchQuery.cjs
var require_usePrefetchQuery = __commonJS({
  "node_modules/.pnpm/@tanstack+react-query@5.104.1_react@19.1.0/node_modules/@tanstack/react-query/build/legacy/usePrefetchQuery.cjs"(exports2) {
    Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
    var require_QueryClientProvider2 = require_QueryClientProvider();
    var _tanstack_query_core = require_modern();
    function usePrefetchQuery(options, queryClient) {
      const client = require_QueryClientProvider2.useQueryClient(queryClient);
      if (!client.getQueryState(options.queryKey)) client.query(options).catch(_tanstack_query_core.noop);
    }
    exports2.usePrefetchQuery = usePrefetchQuery;
  }
});

// node_modules/.pnpm/@tanstack+react-query@5.104.1_react@19.1.0/node_modules/@tanstack/react-query/build/legacy/usePrefetchInfiniteQuery.cjs
var require_usePrefetchInfiniteQuery = __commonJS({
  "node_modules/.pnpm/@tanstack+react-query@5.104.1_react@19.1.0/node_modules/@tanstack/react-query/build/legacy/usePrefetchInfiniteQuery.cjs"(exports2) {
    Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
    var require_QueryClientProvider2 = require_QueryClientProvider();
    var _tanstack_query_core = require_modern();
    function usePrefetchInfiniteQuery(options, queryClient) {
      const client = require_QueryClientProvider2.useQueryClient(queryClient);
      if (!client.getQueryState(options.queryKey)) client.infiniteQuery(options).catch(_tanstack_query_core.noop);
    }
    exports2.usePrefetchInfiniteQuery = usePrefetchInfiniteQuery;
  }
});

// node_modules/.pnpm/@tanstack+react-query@5.104.1_react@19.1.0/node_modules/@tanstack/react-query/build/legacy/queryOptions.cjs
var require_queryOptions = __commonJS({
  "node_modules/.pnpm/@tanstack+react-query@5.104.1_react@19.1.0/node_modules/@tanstack/react-query/build/legacy/queryOptions.cjs"(exports2) {
    Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
    function queryOptions(options) {
      return options;
    }
    exports2.queryOptions = queryOptions;
  }
});

// node_modules/.pnpm/@tanstack+react-query@5.104.1_react@19.1.0/node_modules/@tanstack/react-query/build/legacy/infiniteQueryOptions.cjs
var require_infiniteQueryOptions = __commonJS({
  "node_modules/.pnpm/@tanstack+react-query@5.104.1_react@19.1.0/node_modules/@tanstack/react-query/build/legacy/infiniteQueryOptions.cjs"(exports2) {
    Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
    function infiniteQueryOptions(options) {
      return options;
    }
    exports2.infiniteQueryOptions = infiniteQueryOptions;
  }
});

// node_modules/.pnpm/@tanstack+react-query@5.104.1_react@19.1.0/node_modules/@tanstack/react-query/build/legacy/useIsFetching.cjs
var require_useIsFetching = __commonJS({
  "node_modules/.pnpm/@tanstack+react-query@5.104.1_react@19.1.0/node_modules/@tanstack/react-query/build/legacy/useIsFetching.cjs"(exports2) {
    "use client";
    Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
    var require_rolldown_runtime = require_rolldown_runtime_VH7oDXx4();
    var require_QueryClientProvider2 = require_QueryClientProvider();
    var react = require_react();
    react = require_rolldown_runtime.__toESM(react, 1);
    var _tanstack_query_core = require_modern();
    function useIsFetching(filters, queryClient) {
      const client = require_QueryClientProvider2.useQueryClient(queryClient);
      const queryCache = client.getQueryCache();
      return react.useSyncExternalStore(react.useCallback((onStoreChange) => queryCache.subscribe(_tanstack_query_core.notifyManager.batchCalls(onStoreChange)), [queryCache]), () => client.isFetching(filters), () => client.isFetching(filters));
    }
    exports2.useIsFetching = useIsFetching;
  }
});

// node_modules/.pnpm/@tanstack+react-query@5.104.1_react@19.1.0/node_modules/@tanstack/react-query/build/legacy/useMutationState.cjs
var require_useMutationState = __commonJS({
  "node_modules/.pnpm/@tanstack+react-query@5.104.1_react@19.1.0/node_modules/@tanstack/react-query/build/legacy/useMutationState.cjs"(exports2) {
    "use client";
    Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
    var require_rolldown_runtime = require_rolldown_runtime_VH7oDXx4();
    var require_QueryClientProvider2 = require_QueryClientProvider();
    var react = require_react();
    react = require_rolldown_runtime.__toESM(react, 1);
    var _tanstack_query_core = require_modern();
    function useIsMutating(filters, queryClient) {
      const client = require_QueryClientProvider2.useQueryClient(queryClient);
      return useMutationState({ filters: {
        ...filters,
        status: "pending"
      } }, client).length;
    }
    function getResult(mutationCache, options) {
      return mutationCache.findAll(options.filters).map((mutation) => options.select ? options.select(mutation) : mutation.state);
    }
    function useMutationState(options = {}, queryClient) {
      const mutationCache = require_QueryClientProvider2.useQueryClient(queryClient).getMutationCache();
      const optionsRef = react.useRef(options);
      const resultRef = react.useRef(null);
      if (resultRef.current === null) resultRef.current = getResult(mutationCache, options);
      react.useEffect(() => {
        optionsRef.current = options;
      });
      return react.useSyncExternalStore(react.useCallback((onStoreChange) => mutationCache.subscribe(() => {
        const nextResult = (0, _tanstack_query_core.replaceEqualDeep)(resultRef.current, getResult(mutationCache, optionsRef.current));
        if (resultRef.current !== nextResult) {
          resultRef.current = nextResult;
          _tanstack_query_core.notifyManager.schedule(onStoreChange);
        }
      }), [mutationCache]), () => resultRef.current, () => resultRef.current);
    }
    exports2.useIsMutating = useIsMutating;
    exports2.useMutationState = useMutationState;
  }
});

// node_modules/.pnpm/@tanstack+react-query@5.104.1_react@19.1.0/node_modules/@tanstack/react-query/build/legacy/useMutation.cjs
var require_useMutation = __commonJS({
  "node_modules/.pnpm/@tanstack+react-query@5.104.1_react@19.1.0/node_modules/@tanstack/react-query/build/legacy/useMutation.cjs"(exports2) {
    "use client";
    Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
    var require_rolldown_runtime = require_rolldown_runtime_VH7oDXx4();
    var require_QueryClientProvider2 = require_QueryClientProvider();
    var react = require_react();
    react = require_rolldown_runtime.__toESM(react, 1);
    var _tanstack_query_core = require_modern();
    function useMutation(options, queryClient) {
      const client = require_QueryClientProvider2.useQueryClient(queryClient);
      const [observer] = react.useState(() => new _tanstack_query_core.MutationObserver(client, options));
      react.useEffect(() => {
        observer.setOptions(options);
      }, [observer, options]);
      const result = react.useSyncExternalStore(react.useCallback((onStoreChange) => observer.subscribe(_tanstack_query_core.notifyManager.batchCalls(onStoreChange)), [observer]), () => observer.getCurrentResult(), () => observer.getCurrentResult());
      const mutate = react.useCallback((...args) => {
        observer.mutate(args[0], args[1]).catch(_tanstack_query_core.noop);
      }, [observer]);
      if (result.error && (0, _tanstack_query_core.shouldThrowError)(observer.options.throwOnError, [result.error])) throw result.error;
      return {
        ...result,
        mutate,
        mutateAsync: result.mutate
      };
    }
    exports2.useMutation = useMutation;
  }
});

// node_modules/.pnpm/@tanstack+react-query@5.104.1_react@19.1.0/node_modules/@tanstack/react-query/build/legacy/mutationOptions.cjs
var require_mutationOptions = __commonJS({
  "node_modules/.pnpm/@tanstack+react-query@5.104.1_react@19.1.0/node_modules/@tanstack/react-query/build/legacy/mutationOptions.cjs"(exports2) {
    Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
    function mutationOptions(options) {
      return options;
    }
    exports2.mutationOptions = mutationOptions;
  }
});

// node_modules/.pnpm/@tanstack+react-query@5.104.1_react@19.1.0/node_modules/@tanstack/react-query/build/legacy/useInfiniteQuery.cjs
var require_useInfiniteQuery = __commonJS({
  "node_modules/.pnpm/@tanstack+react-query@5.104.1_react@19.1.0/node_modules/@tanstack/react-query/build/legacy/useInfiniteQuery.cjs"(exports2) {
    "use client";
    Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
    var require_useBaseQuery2 = require_useBaseQuery();
    var _tanstack_query_core = require_modern();
    function useInfiniteQuery(options, queryClient) {
      return require_useBaseQuery2.useBaseQuery(options, _tanstack_query_core.InfiniteQueryObserver, queryClient);
    }
    exports2.useInfiniteQuery = useInfiniteQuery;
  }
});

// node_modules/.pnpm/@tanstack+react-query@5.104.1_react@19.1.0/node_modules/@tanstack/react-query/build/legacy/index.cjs
var require_legacy = __commonJS({
  "node_modules/.pnpm/@tanstack+react-query@5.104.1_react@19.1.0/node_modules/@tanstack/react-query/build/legacy/index.cjs"(exports2) {
    Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
    var require_QueryClientProvider2 = require_QueryClientProvider();
    var require_HydrationBoundary2 = require_HydrationBoundary();
    var require_IsRestoringProvider2 = require_IsRestoringProvider();
    var require_QueryErrorResetBoundary2 = require_QueryErrorResetBoundary();
    var require_useQueries2 = require_useQueries();
    var require_useQuery2 = require_useQuery();
    var require_useSuspenseQuery2 = require_useSuspenseQuery();
    var require_useSuspenseInfiniteQuery2 = require_useSuspenseInfiniteQuery();
    var require_useSuspenseQueries2 = require_useSuspenseQueries();
    var require_usePrefetchQuery2 = require_usePrefetchQuery();
    var require_usePrefetchInfiniteQuery2 = require_usePrefetchInfiniteQuery();
    var require_queryOptions2 = require_queryOptions();
    var require_infiniteQueryOptions2 = require_infiniteQueryOptions();
    var require_useIsFetching2 = require_useIsFetching();
    var require_useMutationState2 = require_useMutationState();
    var require_useMutation2 = require_useMutation();
    var require_mutationOptions2 = require_mutationOptions();
    var require_useInfiniteQuery2 = require_useInfiniteQuery();
    exports2.HydrationBoundary = require_HydrationBoundary2.HydrationBoundary;
    exports2.IsRestoringProvider = require_IsRestoringProvider2.IsRestoringProvider;
    exports2.QueryClientContext = require_QueryClientProvider2.QueryClientContext;
    exports2.QueryClientProvider = require_QueryClientProvider2.QueryClientProvider;
    exports2.QueryErrorResetBoundary = require_QueryErrorResetBoundary2.QueryErrorResetBoundary;
    exports2.infiniteQueryOptions = require_infiniteQueryOptions2.infiniteQueryOptions;
    exports2.mutationOptions = require_mutationOptions2.mutationOptions;
    exports2.queryOptions = require_queryOptions2.queryOptions;
    exports2.useInfiniteQuery = require_useInfiniteQuery2.useInfiniteQuery;
    exports2.useIsFetching = require_useIsFetching2.useIsFetching;
    exports2.useIsMutating = require_useMutationState2.useIsMutating;
    exports2.useIsRestoring = require_IsRestoringProvider2.useIsRestoring;
    exports2.useMutation = require_useMutation2.useMutation;
    exports2.useMutationState = require_useMutationState2.useMutationState;
    exports2.usePrefetchInfiniteQuery = require_usePrefetchInfiniteQuery2.usePrefetchInfiniteQuery;
    exports2.usePrefetchQuery = require_usePrefetchQuery2.usePrefetchQuery;
    exports2.useQueries = require_useQueries2.useQueries;
    exports2.useQuery = require_useQuery2.useQuery;
    exports2.useQueryClient = require_QueryClientProvider2.useQueryClient;
    exports2.useQueryErrorResetBoundary = require_QueryErrorResetBoundary2.useQueryErrorResetBoundary;
    exports2.useSuspenseInfiniteQuery = require_useSuspenseInfiniteQuery2.useSuspenseInfiniteQuery;
    exports2.useSuspenseQueries = require_useSuspenseQueries2.useSuspenseQueries;
    exports2.useSuspenseQuery = require_useSuspenseQuery2.useSuspenseQuery;
    var _tanstack_query_core = require_modern();
    Object.keys(_tanstack_query_core).forEach(function(k) {
      if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports2, k)) Object.defineProperty(exports2, k, {
        enumerable: true,
        get: function() {
          return _tanstack_query_core[k];
        }
      });
    });
  }
});

// validation-missao12/real.ts
var import_node_fs = __toESM(require("node:fs"));

// lib/api-client-react/src/custom-fetch.ts
var NO_BODY_STATUS = /* @__PURE__ */ new Set([204, 205, 304]);
var DEFAULT_JSON_ACCEPT = "application/json, application/problem+json";
var _baseUrl = null;
var _authTokenGetter = null;
function setBaseUrl(url) {
  _baseUrl = url ? url.replace(/\/+$/, "") : null;
}
function isRequest(input) {
  return typeof Request !== "undefined" && input instanceof Request;
}
function resolveMethod(input, explicitMethod) {
  if (explicitMethod) return explicitMethod.toUpperCase();
  if (isRequest(input)) return input.method.toUpperCase();
  return "GET";
}
function isUrl(input) {
  return typeof URL !== "undefined" && input instanceof URL;
}
function applyBaseUrl(input) {
  if (!_baseUrl) return input;
  const url = resolveUrl(input);
  if (!url.startsWith("/")) return input;
  const absolute = `${_baseUrl}${url}`;
  if (typeof input === "string") return absolute;
  if (isUrl(input)) return new URL(absolute);
  return new Request(absolute, input);
}
function resolveUrl(input) {
  if (typeof input === "string") return input;
  if (isUrl(input)) return input.toString();
  return input.url;
}
function mergeHeaders(...sources) {
  const headers = new Headers();
  for (const source of sources) {
    if (!source) continue;
    new Headers(source).forEach((value, key) => {
      headers.set(key, value);
    });
  }
  return headers;
}
function getMediaType(headers) {
  const value = headers.get("content-type");
  return value ? value.split(";", 1)[0].trim().toLowerCase() : null;
}
function isJsonMediaType(mediaType) {
  return mediaType === "application/json" || Boolean(mediaType?.endsWith("+json"));
}
function isTextMediaType(mediaType) {
  return Boolean(
    mediaType && (mediaType.startsWith("text/") || mediaType === "application/xml" || mediaType === "text/xml" || mediaType.endsWith("+xml") || mediaType === "application/x-www-form-urlencoded")
  );
}
function hasNoBody(response, method) {
  if (method === "HEAD") return true;
  if (NO_BODY_STATUS.has(response.status)) return true;
  if (response.headers.get("content-length") === "0") return true;
  if (response.body === null) return true;
  return false;
}
function stripBom(text) {
  return text.charCodeAt(0) === 65279 ? text.slice(1) : text;
}
function looksLikeJson(text) {
  const trimmed = text.trimStart();
  return trimmed.startsWith("{") || trimmed.startsWith("[");
}
function getStringField(value, key) {
  if (!value || typeof value !== "object") return void 0;
  const candidate = value[key];
  if (typeof candidate !== "string") return void 0;
  const trimmed = candidate.trim();
  return trimmed === "" ? void 0 : trimmed;
}
function truncate(text, maxLength = 300) {
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}\u2026` : text;
}
function buildErrorMessage(response, data) {
  const prefix = `HTTP ${response.status} ${response.statusText}`;
  if (typeof data === "string") {
    const text = data.trim();
    return text ? `${prefix}: ${truncate(text)}` : prefix;
  }
  const title = getStringField(data, "title");
  const detail = getStringField(data, "detail");
  const message = getStringField(data, "message") ?? getStringField(data, "error_description") ?? getStringField(data, "error");
  if (title && detail) return `${prefix}: ${title} \u2014 ${detail}`;
  if (detail) return `${prefix}: ${detail}`;
  if (message) return `${prefix}: ${message}`;
  if (title) return `${prefix}: ${title}`;
  return prefix;
}
var ApiError = class extends Error {
  name = "ApiError";
  status;
  statusText;
  data;
  headers;
  response;
  method;
  url;
  constructor(response, data, requestInfo) {
    super(buildErrorMessage(response, data));
    Object.setPrototypeOf(this, new.target.prototype);
    this.status = response.status;
    this.statusText = response.statusText;
    this.data = data;
    this.headers = response.headers;
    this.response = response;
    this.method = requestInfo.method;
    this.url = response.url || requestInfo.url;
  }
};
var ResponseParseError = class extends Error {
  name = "ResponseParseError";
  status;
  statusText;
  headers;
  response;
  method;
  url;
  rawBody;
  cause;
  constructor(response, rawBody, cause, requestInfo) {
    super(
      `Failed to parse response from ${requestInfo.method} ${response.url || requestInfo.url} (${response.status} ${response.statusText}) as JSON`
    );
    Object.setPrototypeOf(this, new.target.prototype);
    this.status = response.status;
    this.statusText = response.statusText;
    this.headers = response.headers;
    this.response = response;
    this.method = requestInfo.method;
    this.url = response.url || requestInfo.url;
    this.rawBody = rawBody;
    this.cause = cause;
  }
};
async function parseJsonBody(response, requestInfo) {
  const raw = await response.text();
  const normalized = stripBom(raw);
  if (normalized.trim() === "") {
    return null;
  }
  try {
    return JSON.parse(normalized);
  } catch (cause) {
    throw new ResponseParseError(response, raw, cause, requestInfo);
  }
}
async function parseErrorBody(response, method) {
  if (hasNoBody(response, method)) {
    return null;
  }
  const mediaType = getMediaType(response.headers);
  if (mediaType && !isJsonMediaType(mediaType) && !isTextMediaType(mediaType)) {
    return typeof response.blob === "function" ? response.blob() : response.text();
  }
  const raw = await response.text();
  const normalized = stripBom(raw);
  const trimmed = normalized.trim();
  if (trimmed === "") {
    return null;
  }
  if (isJsonMediaType(mediaType) || looksLikeJson(normalized)) {
    try {
      return JSON.parse(normalized);
    } catch {
      return raw;
    }
  }
  return raw;
}
function inferResponseType(response) {
  const mediaType = getMediaType(response.headers);
  if (isJsonMediaType(mediaType)) return "json";
  if (isTextMediaType(mediaType) || mediaType == null) return "text";
  return "blob";
}
async function parseSuccessBody(response, responseType, requestInfo) {
  if (hasNoBody(response, requestInfo.method)) {
    return null;
  }
  const effectiveType = responseType === "auto" ? inferResponseType(response) : responseType;
  switch (effectiveType) {
    case "json":
      return parseJsonBody(response, requestInfo);
    case "text": {
      const text = await response.text();
      return text === "" ? null : text;
    }
    case "blob":
      if (typeof response.blob !== "function") {
        throw new TypeError(
          'Blob responses are not supported in this runtime. Use responseType "json" or "text" instead.'
        );
      }
      return response.blob();
  }
}
async function customFetch(input, options = {}) {
  input = applyBaseUrl(input);
  const { responseType = "auto", headers: headersInit, ...init } = options;
  const method = resolveMethod(input, init.method);
  if (init.body != null && (method === "GET" || method === "HEAD")) {
    throw new TypeError(`customFetch: ${method} requests cannot have a body.`);
  }
  const headers = mergeHeaders(isRequest(input) ? input.headers : void 0, headersInit);
  if (typeof init.body === "string" && !headers.has("content-type") && looksLikeJson(init.body)) {
    headers.set("content-type", "application/json");
  }
  if (responseType === "json" && !headers.has("accept")) {
    headers.set("accept", DEFAULT_JSON_ACCEPT);
  }
  if (_authTokenGetter && !headers.has("authorization")) {
    const token = await _authTokenGetter();
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
  }
  const requestInfo = { method, url: resolveUrl(input) };
  const response = await fetch(input, { ...init, method, headers });
  if (!response.ok) {
    const errorData = await parseErrorBody(response, method);
    throw new ApiError(response, errorData, requestInfo);
  }
  return await parseSuccessBody(response, responseType, requestInfo);
}

// lib/api-client-react/src/generated/api.ts
var getGenerateStudySummaryUrl = () => {
  return `/api/study/summaries`;
};
var generateStudySummary = async (studyGenerationRequest, options) => {
  const getHeaders = (h) => {
    if (!h) return {};
    if (h instanceof Headers) return Object.fromEntries(h.entries());
    if (Symbol.iterator in h) {
      return Object.fromEntries(
        Array.from(h, (entry) => Array.from(entry))
      );
    }
    const headers = {};
    for (const [name, value] of Object.entries(h)) {
      if (value !== void 0) headers[name] = value;
    }
    return headers;
  };
  return customFetch(
    getGenerateStudySummaryUrl(),
    {
      ...options,
      method: "POST",
      headers: { "Content-Type": "application/json", ...getHeaders(options?.headers) },
      body: JSON.stringify(studyGenerationRequest)
    }
  );
};
var getGenerateStudySummaryMutationKey = () => ["generateStudySummary"];
var getGenerateStudySummaryMutationOptions = (options) => {
  const mutationKey = getGenerateStudySummaryMutationKey();
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : { ...options, mutation: { ...options.mutation, mutationKey } } : { mutation: { mutationKey }, request: void 0 };
  const mutationFn = (props) => {
    const { data } = props ?? {};
    return generateStudySummary(data, requestOptions);
  };
  return { mutationFn, ...mutationOptions };
};
var getGenerateStudyQuizUrl = () => {
  return `/api/study/quizzes`;
};
var generateStudyQuiz = async (studyQuizRequest, options) => {
  const getHeaders = (h) => {
    if (!h) return {};
    if (h instanceof Headers) return Object.fromEntries(h.entries());
    if (Symbol.iterator in h) {
      return Object.fromEntries(
        Array.from(h, (entry) => Array.from(entry))
      );
    }
    const headers = {};
    for (const [name, value] of Object.entries(h)) {
      if (value !== void 0) headers[name] = value;
    }
    return headers;
  };
  return customFetch(
    getGenerateStudyQuizUrl(),
    {
      ...options,
      method: "POST",
      headers: { "Content-Type": "application/json", ...getHeaders(options?.headers) },
      body: JSON.stringify(studyQuizRequest)
    }
  );
};
var getGenerateStudyQuizMutationKey = () => ["generateStudyQuiz"];
var getGenerateStudyQuizMutationOptions = (options) => {
  const mutationKey = getGenerateStudyQuizMutationKey();
  const { mutation: mutationOptions, request: requestOptions } = options ? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey ? options : { ...options, mutation: { ...options.mutation, mutationKey } } : { mutation: { mutationKey }, request: void 0 };
  const mutationFn = (props) => {
    const { data } = props ?? {};
    return generateStudyQuiz(data, requestOptions);
  };
  return { mutationFn, ...mutationOptions };
};

// validation-missao12/real.ts
var import_react_query = __toESM(require_legacy());
async function main() {
  setBaseUrl("http://localhost:19006");
  const qc = new import_react_query.QueryClient({ defaultOptions: { mutations: { retry: false } } });
  const payload = JSON.parse(import_node_fs.default.readFileSync("validation-missao05-1/payload.json", "utf8"));
  const results = [];
  for (const [name, options, data] of [["resumo", getGenerateStudySummaryMutationOptions({ request: { signal: AbortSignal.timeout(7e4) } }), payload], ["quiz", getGenerateStudyQuizMutationOptions({ request: { signal: AbortSignal.timeout(7e4) } }), { ...payload, questionCount: 5 }]]) {
    const start = Date.now();
    const mutation = new import_react_query.MutationObserver(qc, options);
    try {
      const result = await mutation.mutate({ data });
      results.push({ name, status: 200, elapsedMs: Date.now() - start, result });
      console.log(JSON.stringify({ name, status: 200, elapsedMs: Date.now() - start, title: result.title, questions: result.questions?.length }));
    } catch (e) {
      results.push({ name, status: e.status, errorName: e.name, message: e.data?.message ?? e.message, code: e.data?.code, elapsedMs: Date.now() - start });
      console.log(JSON.stringify(results.at(-1)));
    }
    import_node_fs.default.writeFileSync("validation-missao12/real-results.json", JSON.stringify({ scope: "Gemini real, mutationFn gerada e MutationObserver reais, via Express de producao, sem Vite. Sem automa\xE7\xE3o visual e sem hist\xF3rico do navegador.", results }, null, 2));
  }
  qc.clear();
}
main().catch((e) => {
  console.error(e.name);
  process.exitCode = 1;
});
/*! Bundled license information:

react/cjs/react.production.js:
  (**
   * @license React
   * react.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react.development.js:
  (**
   * @license React
   * react.development.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react-jsx-runtime.production.js:
  (**
   * @license React
   * react-jsx-runtime.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react-jsx-runtime.development.js:
  (**
   * @license React
   * react-jsx-runtime.development.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/
