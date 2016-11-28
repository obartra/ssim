#!/bin/bash
# Writes the current version to `version.js`
# It uses the version to commit on master and "0.0.0" on all other branches

if [ "$CIRCLE_BRANCH" == "master" ]; then
  ./node_modules/.bin/semantic-release pre
  number=`cat package.json | grep -oP '"version": ".+"'`;
  version="{ type: 'deploy', $number}";
else
  version="{ type: 'test', version: '0.0.0' }";
fi
echo "module.exports = $version;" > version.js

# Log the output
cat version.js
