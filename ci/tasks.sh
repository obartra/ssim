#!/bin/bash
#
# Runs remaining testing / code quality tasks on the second CircleCI node
#

echo "Running node $CIRCLE_NODE_INDEX"


if [ "$CIRCLE_NODE_INDEX" -eq "0" ]; then
  npm run cover || exit 1               # Report test coverage locally
else
  npm run lint || exit 1                # Ensure all code adheres to the styleguide
  npm run docs:check || exit 1          # Validate documentation using inchjs
  npm run test:perf || exit 1           # Run performance tests
  npm run test:web || exit 1            # Run cross browser web-based tests
  npm run e2e:live || exit 1            # Run node end to end LIVE dataset tests
  npm run e2e:ivc || exit 1             # Run node end to end IVC dataset tests
fi
