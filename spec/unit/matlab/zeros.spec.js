const test = require('blue-tape')
const { zeros } = require('../../../src/matlab/zeros')
const { flatDataToMx } = require('../../helpers/util')

test('should create a matrix of the specified size with all zeros', t => {
  t.deepEqual(flatDataToMx(zeros(4)), [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ])
  t.end()
})

test('should create a matrix with different width and height when multiple params are set', t => {
  t.deepEqual(flatDataToMx(zeros(1, 4)), [[0, 0, 0, 0]])
  t.end()
})
