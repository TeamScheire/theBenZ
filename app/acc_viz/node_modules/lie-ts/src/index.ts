import { setImmediate } from "timers";

// stolen from https://github.com/Octane/setImmediate
// convertd to NodeJS friendly syntax
let uid = 0;
let storage = {};
let slice = Array.prototype.slice;
let message = 'setMsg';

// declare const Promise: any;

const canSetImmediate = typeof window !== 'undefined' && window["setImmediate"] ? window["setImmediate"] : typeof global !== "undefined" && global["setImmediate"] ? global["setImmediate"] : false;
const canPost = typeof window !== 'undefined' && window.postMessage && window.addEventListener;

const fastApply = (args) => {
    return args[0].apply(null, slice.call(args, 1));
}

const callback = (event) => {
    var key = event.data;
    var data;
    if (typeof key == 'string' && key.indexOf(message) === 0) {
        data = storage[key];
        if (data) {
            delete storage[key];
            fastApply(data);
        }
    }
}

if (canPost) {
    window.addEventListener('message', callback);
}

const setImmediatePolyfill = (...args: any[]) => {
    var id = uid++;
    var key = message + id;
    storage[key] = args;
    window.postMessage(key, '*');
    return id;
};

export const setFast = (() => {
    return canSetImmediate ? (...args: any[]) => { // built in setImmediate (bast case)
        canSetImmediate(() => {
            fastApply(args);
        })
    } : canPost ? setImmediatePolyfill : // built in window messaging (pretty fast, not bad)
    (...args: any[]) => {
        setTimeout(() => { // setTimeout, absolute worse case :(
            fastApply(args);
        }, 0);
    };    
})();


const _INTERNAL = () => { }
const _REJECTED = ['R'];
const _FULFILLED = ['F'];
const _PENDING = ['P'];

export class Promise<T> {

    /**
     * 
     * @internal
     * @type {string[]}
     * @memberOf Promise
     */
    public _state: string[];
    /**
     * 
     * @internal
     * @type {_QueueItem[]}
     * @memberOf Promise
     */
    public _queue: _QueueItem[];
    /**
     * 
     * @internal
     * @type {*}
     * @memberOf Promise
     */
    public _outcome: any;
    /**
     * 
     * @internal
     * @type {(string[] | null)}
     * @memberOf Promise
     */
    public _handled: string[] | null;

    constructor(resolver: (onSuccess:(...T) => void, onFail:(...T) => void) => void) {
        this._state = _PENDING;
        this._queue = [];
        this._outcome = void 0;
        if (resolver !== _INTERNAL) {
            _safelyResolveThenable(this, resolver);
        }
    }

    public static doPolyFill() {
        if (typeof global !== "undefined") {
            if (!global["Promise"]) {
                global["Promise"] = this;
            }
        }
        if (typeof window !== "undefined") {
            if (!window["Promise"]) {
                window["Promise"] = this;
            }
        }
    }

    public catch(onRejected) {
        return this.then(() => {}, onRejected);
    }

    public then(onFulfilled?:(...args) => void, onRejected?:(...args) => void) {
        if (typeof onFulfilled !== 'function' && this._state === _FULFILLED ||
            typeof onRejected !== 'function' && this._state === _REJECTED) {
            return this;
        }
        var promise = new Promise(_INTERNAL);
        if (this._state !== _PENDING) {
            var resolver = this._state === _FULFILLED ? onFulfilled : onRejected;
            _unwrap(promise, resolver, this._outcome);
        } else {
            this._queue.push(new _QueueItem(promise, onFulfilled, onRejected));
        }

        return promise;
    }


    /**
     * 
     * @static
     * @param {any} value 
     * @returns 
     * 
     * @memberOf Promise
     */
    public static resolve(value) {
        if (value instanceof this) return value;
        return _handlers._resolve(new Promise(_INTERNAL), value);
    }

    /**
     * 
     * @static
     * @param {any} reason 
     * @returns 
     * 
     * @memberOf Promise
     */
    public static reject(reason) {
        return _handlers._reject(new Promise(_INTERNAL), reason);
    }

    public static all(iterable: Promise<any>[]): Promise<any> {
        let t = this;
        return new Promise((resolve, reject) => {
            let results: any[] = [];

            if(!iterable.length) {
                resolve([]);
                return;
            }

            const maybeReturn = (index: number, success, failure) => {
                if(failure !== undefined) {
                    results.push(failure);
                } else {
                    results.push(success);
                }

                if(results.length == iterable.length) {
                    resolve(results);
                }
            };

            for (let i = 0; i < iterable.length; i++) {
                iterable[i].then((res) => {
                    maybeReturn(i, res, undefined);
                }).catch((e) => {
                    maybeReturn(i, undefined, e);
                })
            }
        });
    }

    public static race(iterable: Promise<any>[]) {
        var self = this;
        var len = iterable.length;
        var called = false;
        var i = -1;
        var promise = new Promise(_INTERNAL);
        if (Array.isArray(iterable) !== false) {
            return this.reject(new TypeError());
        }

        function resolver(value) {
            self.resolve(value).then(function (response) {
                if (!called) {
                    called = true;
                    _handlers._resolve(promise, response);
                }
            }, function (error) {
                if (!called) {
                    called = true;
                    _handlers._reject(promise, error);
                }
            });
        }

        if (!len) {
            return this.resolve([]);
        }
        while (++i < len) {
            resolver(iterable[i]);
        }
        return promise;
    }
}

/**
 * @internal
 * 
 * @export
 * @class _QueueItem
 */
export class _QueueItem {

    private _promise: Promise<any>;
    public _onFulfilled: any;
    public _onRejected: any;

    constructor(promise: Promise<any>, onFulfilled, onRejected) {
        this._promise = promise;
        if (typeof onFulfilled === 'function') {
            this._onFulfilled = onFulfilled;
            this._callFulfilled = this._otherCallFulfilled;
        }
        if (typeof onRejected === 'function') {
            this._onRejected = onRejected;
            this._callRejected = this._otherCallRejected;
        }
    }

    public _callFulfilled(value) {
        _handlers._resolve(this._promise, value);
    };

    public _otherCallFulfilled(value) {
        _unwrap(this._promise, this._onFulfilled, value);
    };
    public _callRejected(value) {
        _handlers._reject(this._promise, value);
    };
    public _otherCallRejected(value) {
        _unwrap(this._promise, this._onRejected, value);
    };
}

/**
 * 
 * @internal
 * @param {any} promise 
 * @param {any} func 
 * @param {any} value 
 */
function _unwrap(promise, func, value) {
    setFast(function () {
        var returnValue;
        try {
            returnValue = func.apply(null, value);
        } catch (e) {
            return _handlers._reject(promise, e);
        }
        
        if (returnValue === promise) {
            _handlers._reject(promise, new TypeError());
        } else {
            _handlers._resolve(promise, returnValue);
        }
        return null;
    });
}

/**
 * 
 * @internal
 * @class _handlers
 */
class _handlers {

    public static _resolve(self:Promise<any>, value) {
        var result = _tryCatch(_getThen, value);
        var thenable = result._value;
        var i = -1;
        var len = self._queue.length;

        if (result._status === 'error') {
            return _handlers._reject(self, result._value);
        }
        
        if (thenable) {
            _safelyResolveThenable(self, thenable);
        } else {
            self._state = _FULFILLED;
            self._outcome = value;
            while (++i < len) {
                self._queue[i]._callFulfilled(value);
            }
        }
        return self;
    };


    public static _reject(self:Promise<any>, error) {
        self._state = _REJECTED;
        self._outcome = error;

        var i = -1;
        var len = self._queue.length;
        while (++i < len) {
            self._queue[i]._callRejected(error);
        }
        return self;
    };

}

/**
 * 
 * @internal
 * @param {any} obj 
 * @returns 
 */
function _getThen(obj) {
    // Make sure we only access the accessor once as required by the spec
    var then = obj && obj.then;
    if (obj && (typeof obj === 'object' || typeof obj === 'function') && typeof then === 'function') {
        return function appyThen() {
            then.apply(obj, arguments);
        };
    } else {
        return null;
    }
}

/**
 * 
 * @internal
 * @param {Promise<any>} self 
 * @param {(onSuccess:(...T) => void, onFail:(...T) => void) => void} thenable 
 */
function _safelyResolveThenable(self: Promise<any>, thenable: (onSuccess:(...T) => void, onFail:(...T) => void) => void) {
    // Either fulfill, reject or reject with error
    var called = false;
    function onError(...value) {
        if (called) {
            return;
        }
        called = true;
        _handlers._reject(self, value);
    }

    function onSuccess(...value) {
        if (called) {
            return;
        }
        called = true;
        _handlers._resolve(self, value);
    }

    function tryToUnwrap() {
        thenable(onSuccess, onError);
    }

    var result = _tryCatch(tryToUnwrap);
    if (result._status === 'error') {
        onError(result._value);
    }
}

/**
 * 
 * @internal
 * @param {any} func 
 * @param {*} [values] 
 * @returns 
 */
function _tryCatch(func, values?: any) {
    var out: {
        _value: any;
        _status: any;
    } = { _status: null, _value: null };
    try {
        out._value = func(values);
        out._status = 'success';
    } catch (e) {
        out._status = 'error';
        out._value = e;
    }
    return out;
}
