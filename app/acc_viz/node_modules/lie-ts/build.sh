#!/bin/bash

#clean up
rm -rf dist/*.*
rm -rf *.d.ts
echo "Clean Completed..."

#type declerations & node build
bash ./node_modules/.bin/tsc --stripInternal -d --moduleResolution "node" -t "ES5" --rootDir  "./src" -module "commonjs" --outDir "./" src/index.ts

echo "Node Build & Type Declarations Completed..."

#Browser build
export NODE_ENV=production && ./node_modules/.bin/webpack

echo "Build Completed. Size Info:"
echo " "

function size {
    echo $(cat dist/lie-ts.min.js) | gzip -9f | wc -c;
}
echo $(size) Kb;