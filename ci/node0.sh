#!/bin/bash
#
# Runs testing tasks on first CircleCI node
#

echo "Running node $CIRCLE_NODE_INDEX"

npm run cover                         # Report test coverage locally
