export class ReallySmallEvents {

    public eventListeners: {
        [event: string]: ((...args: any[]) => void)[];
    } = {};

    public on(event: string, callback:(...args: any[]) => void) {
        if (!this.eventListeners[event]) {
            this.eventListeners[event] = [];
        }
        this.eventListeners[event].push(callback);
    }

    public off(event: string, callback:(...args: any[]) => void) {
        if (this.eventListeners[event] && this.eventListeners[event].length) {
            this.eventListeners[event].forEach((cb, idx) => {
                if (cb === callback) {
                    this.eventListeners[event].splice(idx, 1);
                }
            })
        }
    }

    public trigger(event: string, ...args: any[]) {
        if (this.eventListeners[event]) {
            this.eventListeners[event].forEach(cb => cb(...args));
        }
    }
}

export const RSE = new ReallySmallEvents();