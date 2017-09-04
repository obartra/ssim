const test = require('blue-tape')
const { skip2d } = require('../../../src/matlab/skip2d')

test('should get a window of a matrix', t => {
  const w = skip2d(
    {
      data: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      width: 3,
      height: 3,
    },
    [1, 1, 2],
    [1, 1, 2]
  )

  t.deepEqual(w.data, [5])
  t.end()
})

test('should skip every n elements for the new matrix', t => {
  const w = skip2d(
    {
      data: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      width: 3,
      height: 3,
    },
    [0, 2, 3],
    [0, 2, 3]
  )

  t.deepEqual(w, { data: [1, 3, 7, 9], width: 2, height: 2 })
  t.end()
})
