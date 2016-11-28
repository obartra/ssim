#!/bin/bash
#
# Runs remaining testing / code quality tasks on the second CircleCI node
#

echo "Running node $CIRCLE_NODE_INDEX"

npm run lint                          # Ensure all code adheres to the styleguide
npm run docs:check                    # Validate documentation using inchjs
npm run test:perf                     # Run performance tests
npm run test:web                      # Run cross browser web-based tests
npm run e2e                           # Run node end to end tests
