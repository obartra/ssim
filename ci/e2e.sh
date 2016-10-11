#!/bin/bash
rm -rf node_modules
npm install
npm run build
npm run test:e2e
