"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// stolen from https://github.com/Octane/setImmediate
// convertd to NodeJS friendly syntax
var uid = 0;
var storage = {};
var slice = Array.prototype.slice;
var message = 'setMsg';
// declare const Promise: any;
var canSetImmediate = typeof window !== 'undefined' && window["setImmediate"] ? window["setImmediate"] : typeof global !== "undefined" && global["setImmediate"] ? global["setImmediate"] : false;
var canPost = typeof window !== 'undefined' && window.postMessage && window.addEventListener;
var fastApply = function (args) {
    return args[0].apply(null, slice.call(args, 1));
};
var callback = function (event) {
    var key = event.data;
    var data;
    if (typeof key == 'string' && key.indexOf(message) === 0) {
        data = storage[key];
        if (data) {
            delete storage[key];
            fastApply(data);
        }
    }
};
if (canPost) {
    window.addEventListener('message', callback);
}
var setImmediatePolyfill = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var id = uid++;
    var key = message + id;
    storage[key] = args;
    window.postMessage(key, '*');
    return id;
};
exports.setFast = (function () {
    return canSetImmediate ? function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        canSetImmediate(function () {
            fastApply(args);
        });
    } : canPost ? setImmediatePolyfill : // built in window messaging (pretty fast, not bad)
        function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            setTimeout(function () {
                fastApply(args);
            }, 0);
        };
})();
var _INTERNAL = function () { };
var _REJECTED = ['R'];
var _FULFILLED = ['F'];
var _PENDING = ['P'];
var Promise = /** @class */ (function () {
    function Promise(resolver) {
        this._state = _PENDING;
        this._queue = [];
        this._outcome = void 0;
        if (resolver !== _INTERNAL) {
            _safelyResolveThenable(this, resolver);
        }
    }
    Promise.doPolyFill = function () {
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
    };
    Promise.prototype.catch = function (onRejected) {
        return this.then(function () { }, onRejected);
    };
    Promise.prototype.then = function (onFulfilled, onRejected) {
        if (typeof onFulfilled !== 'function' && this._state === _FULFILLED ||
            typeof onRejected !== 'function' && this._state === _REJECTED) {
            return this;
        }
        var promise = new Promise(_INTERNAL);
        if (this._state !== _PENDING) {
            var resolver = this._state === _FULFILLED ? onFulfilled : onRejected;
            _unwrap(promise, resolver, this._outcome);
        }
        else {
            this._queue.push(new _QueueItem(promise, onFulfilled, onRejected));
        }
        return promise;
    };
    /**
     *
     * @static
     * @param {any} value
     * @returns
     *
     * @memberOf Promise
     */
    Promise.resolve = function (value) {
        if (value instanceof this)
            return value;
        return _handlers._resolve(new Promise(_INTERNAL), value);
    };
    /**
     *
     * @static
     * @param {any} reason
     * @returns
     *
     * @memberOf Promise
     */
    Promise.reject = function (reason) {
        return _handlers._reject(new Promise(_INTERNAL), reason);
    };
    Promise.all = function (iterable) {
        var t = this;
        return new Promise(function (resolve, reject) {
            var results = [];
            if (!iterable.length) {
                resolve([]);
                return;
            }
            var maybeReturn = function (index, success, failure) {
                if (failure !== undefined) {
                    results.push(failure);
                }
                else {
                    results.push(success);
                }
                if (results.length == iterable.length) {
                    resolve(results);
                }
            };
            var _loop_1 = function (i) {
                iterable[i].then(function (res) {
                    maybeReturn(i, res, undefined);
                }).catch(function (e) {
                    maybeReturn(i, undefined, e);
                });
            };
            for (var i = 0; i < iterable.length; i++) {
                _loop_1(i);
            }
        });
    };
    Promise.race = function (iterable) {
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
    };
    return Promise;
}());
exports.Promise = Promise;
/**
 * @internal
 *
 * @export
 * @class _QueueItem
 */
var _QueueItem = /** @class */ (function () {
    function _QueueItem(promise, onFulfilled, onRejected) {
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
    _QueueItem.prototype._callFulfilled = function (value) {
        _handlers._resolve(this._promise, value);
    };
    ;
    _QueueItem.prototype._otherCallFulfilled = function (value) {
        _unwrap(this._promise, this._onFulfilled, value);
    };
    ;
    _QueueItem.prototype._callRejected = function (value) {
        _handlers._reject(this._promise, value);
    };
    ;
    _QueueItem.prototype._otherCallRejected = function (value) {
        _unwrap(this._promise, this._onRejected, value);
    };
    ;
    return _QueueItem;
}());
exports._QueueItem = _QueueItem;
/**
 *
 * @internal
 * @param {any} promise
 * @param {any} func
 * @param {any} value
 */
function _unwrap(promise, func, value) {
    exports.setFast(function () {
        var returnValue;
        try {
            returnValue = func.apply(null, value);
        }
        catch (e) {
            return _handlers._reject(promise, e);
        }
        if (returnValue === promise) {
            _handlers._reject(promise, new TypeError());
        }
        else {
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
var _handlers = /** @class */ (function () {
    function _handlers() {
    }
    _handlers._resolve = function (self, value) {
        var result = _tryCatch(_getThen, value);
        var thenable = result._value;
        var i = -1;
        var len = self._queue.length;
        if (result._status === 'error') {
            return _handlers._reject(self, result._value);
        }
        if (thenable) {
            _safelyResolveThenable(self, thenable);
        }
        else {
            self._state = _FULFILLED;
            self._outcome = value;
            while (++i < len) {
                self._queue[i]._callFulfilled(value);
            }
        }
        return self;
    };
    ;
    _handlers._reject = function (self, error) {
        self._state = _REJECTED;
        self._outcome = error;
        var i = -1;
        var len = self._queue.length;
        while (++i < len) {
            self._queue[i]._callRejected(error);
        }
        return self;
    };
    ;
    return _handlers;
}());
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
    }
    else {
        return null;
    }
}
/**
 *
 * @internal
 * @param {Promise<any>} self
 * @param {(onSuccess:(...T) => void, onFail:(...T) => void) => void} thenable
 */
function _safelyResolveThenable(self, thenable) {
    // Either fulfill, reject or reject with error
    var called = false;
    function onError() {
        var value = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            value[_i] = arguments[_i];
        }
        if (called) {
            return;
        }
        called = true;
        _handlers._reject(self, value);
    }
    function onSuccess() {
        var value = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            value[_i] = arguments[_i];
        }
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
function _tryCatch(func, values) {
    var out = { _status: null, _value: null };
    try {
        out._value = func(values);
        out._status = 'success';
    }
    catch (e) {
        out._status = 'error';
        out._value = e;
    }
    return out;
}
