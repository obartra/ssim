#!/bin/bash
#
# Runs remaining testing / code quality tasks on the second CircleCI node
#
set -euo pipefail

yarn
ci/getVersion.sh                 # Determine the version semantic-release will use, so we can include it in the build
yarn build                       # Generate build
yarn test --coverage --runInBand # Fail if coverage drops below 100%
yarn codeclimate                 # Run tests and send coverage to code climate
