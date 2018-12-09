Object.defineProperty(exports, "__esModule", { value: true });
var ReallySmallEvents = (function () {
    function ReallySmallEvents() {
        this.eventListeners = {};
    }
    ReallySmallEvents.prototype.on = function (event, callback) {
        if (!this.eventListeners[event]) {
            this.eventListeners[event] = [];
        }
        this.eventListeners[event].push(callback);
    };
    ReallySmallEvents.prototype.off = function (event, callback) {
        var _this = this;
        if (this.eventListeners[event] && this.eventListeners[event].length) {
            this.eventListeners[event].forEach(function (cb, idx) {
                if (cb === callback) {
                    _this.eventListeners[event].splice(idx, 1);
                }
            });
        }
    };
    ReallySmallEvents.prototype.trigger = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (this.eventListeners[event]) {
            this.eventListeners[event].forEach(function (cb) { return cb.apply(void 0, args); });
        }
    };
    return ReallySmallEvents;
}());
exports.ReallySmallEvents = ReallySmallEvents;
exports.RSE = new ReallySmallEvents();
