# Lie-TS

The smallest, quickest TypeScript promise library available.

Forked from the orginal Lie JS promise lib and includes it's own setImmediate polyfill, significantly reducing the effective size compared to the original library. 

- Entire lib is self contained and only 1.6 kb gzipped.  
- Runs easily in NodeJS and any modern browser, including IE9+.
- Autodetects best `setImediate` method and uses it.  Checks in this order for these methods:
1. Built in `setImediate` method attached to window or global object.
2. If `window.Promise` or `global.Promise` exists, uses `Promise.resolve().then...`
3. If `window.postMessage` is possible, uses an ultra fast messaging method to polyfill setImediate.
4. Finally falls back to `setTimeout` if everything else fails.

Also includes a new special tricK:
```ts
new Promise(function(res, rej) {
    res(1,2,3);
}).then(function(v1,v2,v3) {
    console.log(v1,v2,v3) // <= 1, 2, 3
})
```

## Install

```bash
npm install lie-ts
```

You can also grab the compressed, minified file fom the `/dist` folder of this repository.

## Usage

```javascript
// Common JS/node
var Promise = require('lie-ts').Promise;

// ES6/ Typescript
import { Promise } from "lie-ts";

// Take over global/window Promise object *if it doesn't exist already*.
Promise.doPolyfill();
```

You can also just drop the minified lib from the `/dist` folder directly into a `<script>` tag or load it in with an AMD loader.

## API

Implements the standard ES6 api:

```js
new Promise(function(resolve, reject){
    doSomething(function(err, result) {
        if (err) {
            reject(err);
        } else {
            resolve(result);
        }
    });
}).then(function (value) {
    //on success
}, function (reason) {
    //on error
}).catch(function (reason) {
    //shortcut for error handling
});

Promise.all([
    //array of promises or values
]).then(function ([/* array of results */]));

Promise.race([
    //array of promises or values
]);
// either resolves or rejects depending on the first value to do so
```

## A Little Bonus

The isomorphic setImmediate polyfill described at the top is exposed as `setFast`.

```ts
import { setFast } from "lie-ts";

setFast((a, b, c) => {
    console.log(a, b, c) // <= "args", "to", "pass"
    console.log("This will happen very quickly!")
}, "args", "to", "pass");

```

## Unhandled Rejections

In Node.js, lie emits an `unhandledRejection` event when a rejected promise isn't caught, in line with [how io.js does it](https://iojs.org/api/process.html#process_event_unhandledrejection). This allows it to act as a promise shim in both Node.js and the browser.
