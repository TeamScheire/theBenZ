export declare const setFast: (...args: any[]) => void;
export declare class Promise<T> {
    constructor(resolver: (onSuccess: (...T) => void, onFail: (...T) => void) => void);
    static doPolyFill(): void;
    catch(onRejected: any): Promise<{}>;
    then(onFulfilled?: (...args) => void, onRejected?: (...args) => void): Promise<{}>;
    /**
     *
     * @static
     * @param {any} value
     * @returns
     *
     * @memberOf Promise
     */
    static resolve(value: any): Promise<any>;
    /**
     *
     * @static
     * @param {any} reason
     * @returns
     *
     * @memberOf Promise
     */
    static reject(reason: any): Promise<any>;
    static all(iterable: Promise<any>[]): Promise<any>;
    static race(iterable: Promise<any>[]): Promise<any>;
}
