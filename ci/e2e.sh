#!/bin/bash
rm -rf node_modules
nvm install $1
nvm use $1
npm install
npm run build
npm run test:e2e
