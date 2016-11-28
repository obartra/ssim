#!/bin/bash
#
# Runs testing tasks on first CircleCI node
#
# Coverage related tasks are grouped together because they all depend on the output of
# `npm run cover`.

echo "Running node $CIRCLE_NODE_INDEX"

npm run cover                         # Report test coverage locally
npm run cover:check                   # Fail if coverage drops below 100%
npm run codeclimate                   # Run tests and send coverage to code climate
cp -R coverage/* $CIRCLE_TEST_REPORTS # Copy test coverage reports for CircleCI
