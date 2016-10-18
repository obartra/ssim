#!/bin/bash
# Writes the current version to `version.js`
# It uses the version to commit on master and "0.0.0-semantically-released" on all other branches

if [ "$CIRCLE_BRANCH" == "master" ]; then
  version=`./node_modules/.bin/semantic-release pre 2>&1 >/dev/null | grep -oP '({.+})'`;
else
  version="{ type: 'test', version: '0.0.0-semantically-released' }"
fi
echo "module.exports = $version;" > version.js
