# really-small-events
A Tiny Typescript Event Library

Just over 300 bytes gzipped. :)

## Installation

```js
npm i really-small-events --save 
```

## Usage

Typescript / Babel
```js
import { RSE } from "really-small-events";
```

NodeJS
```js
const RSE = require("really-small-events").RSE;
```

## API

Listen for events
```js
const runThisFunc = (as, many, args, as, I, want) => {
    console.log("Hello, world!");
};

// Listen for Event
RSE.on("someEvent", runThisFunc)

// Trigger event anywhere in your app
RSE.trigger("someEvent", the, args, to, pass, to, the, event);

// Remove listener
RSE.off("someEvent", runThisFunc);
```