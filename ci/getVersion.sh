#!/bin/bash
# Writes the current version to `version.ts`
# It uses the version to commit on master and "0.0.0" on all other branches

number=$(cat package.json | grep -oP '"version": ".+"' | cut -d " " -f2)

if [ "$CIRCLE_BRANCH" == "master" ]; then
  ./node_modules/.bin/semantic-release pre
  version="export const type = \"deploy\"\nexport const version = $number;"
else
  version="export const type = \"test\";\nexport const version = $number;"
fi
echo -e $version >src/version.ts

# Log the output
cat src/version.ts
