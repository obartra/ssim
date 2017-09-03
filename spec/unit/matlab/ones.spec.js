const test = require('blue-tape')
const { ones } = require('../../../src/matlab/ones')
const { flatDataToMx } = require('../../helpers/util')

test('should create a matrix of the specified size with all ones', t => {
  t.deepEqual(flatDataToMx(ones(4)), [
    [1, 1, 1, 1],
    [1, 1, 1, 1],
    [1, 1, 1, 1],
    [1, 1, 1, 1],
  ])
  t.end()
})

test('should create a matrix with different width and height when multiple params are set', t => {
  t.deepEqual(flatDataToMx(ones(1, 4)), [[1, 1, 1, 1]])
  t.end()
})
