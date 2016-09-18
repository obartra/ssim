#!/bin/bash

rm -rf node_modules npm-shrinkwrap.json dist
./node_modules/.bin/ncu -au
npm install
npm prune
npm run build
npm shrinkwrap --dev
npm run test
