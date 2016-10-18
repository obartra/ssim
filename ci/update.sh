#!/bin/bash
#
# Uses ncu (npm-check-updates) to update all packages to the latest versions and updates shrinkwrap

rm -rf npm-shrinkwrap.json dist
./node_modules/.bin/ncu -au -x eslint-plugin-import
rm -rf node_modules
npm install
npm prune
npm run build
npm shrinkwrap --dev
npm run test
