#!/bin/bash
#
# Runs remaining testing / code quality tasks on the second CircleCI node
#
set -euo pipefail

sudo apt-get update
sudo apt-get install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

# Install dependencies
ADBLOCK=1 yarn

# Generate build
yarn build

# Download test reporter as a static binary
curl -L https://codeclimate.com/downloads/test-reporter/test-reporter-latest-linux-amd64 >./cc-test-reporter
chmod +x ./cc-test-reporter

# notify Code Climate of a pending test report using `before-build`
./cc-test-reporter before-build

# Runu tests and fail if coverage drops below 100%
yarn test --coverage --runInBand

# upload test report to Code Climate using `after-build`
./cc-test-reporter after-build --coverage-input-type lcov coverage/frontend/lcov.info
