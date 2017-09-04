const test = require('blue-tape')
const math = require('../../src/math')

test('should get the average between 2 numbers (average)', t => {
  const avg = math.average([2, 4])

  t.equal(avg, 3)
  t.end()
})

test('should round to the lowest integer each element of the array (floor)', t => {
  const floor = math.floor([1.1, 1.9, 1, -1.5, -1.9, -1.1])

  t.deepEqual(floor, [1, 1, 1, -2, -2, -2])
  t.end()
})

test('should add all the values in the matrix (sum2d)', t => {
  const sum = math.sum2d({ data: [1, 1, 2], width: 3, height: 1 })
  const sum2 = math.sum2d({ data: [1, 1, 2, 0, 0, -1], width: 3, height: 2 })

  t.equal(sum, 4)
  t.equal(sum2, 3)
  t.end()
})

test('should add a constant value to each matrix element (add2d)', t => {
  const add = math.add2d(
    {
      data: [1, 2, 3, 4],
      width: 2,
      height: 2,
    },
    10
  )

  t.deepEqual(add, {
    data: [11, 12, 13, 14],
    width: 2,
    height: 2,
  })
  t.end()
})

test('should add 2 matrices of the same size (add2d)', t => {
  const add = math.add2d(
    {
      data: [1, 2, 3, 4],
      width: 2,
      height: 2,
    },
    {
      data: [-1, -2, -3, -4],
      width: 2,
      height: 2,
    }
  )

  t.deepEqual(add, {
    data: [0, 0, 0, 0],
    width: 2,
    height: 2,
  })
  t.end()
})

test('should subtract a constant value to each matrix element (subtract2d)', t => {
  const sub = math.subtract2d(
    {
      data: [1, 2, 3, 4],
      width: 2,
      height: 2,
    },
    10
  )

  t.deepEqual(sub, {
    data: [-9, -8, -7, -6],
    width: 2,
    height: 2,
  })
  t.end()
})

test('should subtract 2 matrices of the same size (subtract2d)', t => {
  const sub = math.subtract2d(
    {
      data: [1, 2, 3, 4],
      width: 2,
      height: 2,
    },
    {
      data: [1, 2, 3, 4],
      width: 2,
      height: 2,
    }
  )

  t.deepEqual(sub, {
    data: [0, 0, 0, 0],
    width: 2,
    height: 2,
  })
  t.end()
})

test('should divide by a constant value each matrix element (divide2d)', t => {
  const divide = math.divide2d(
    {
      data: [10, 20, 30, 40],
      width: 2,
      height: 2,
    },
    10
  )

  t.deepEqual(divide, {
    data: [1, 2, 3, 4],
    width: 2,
    height: 2,
  })
  t.end()
})

test('should divide 2 matrices of the same size (divide2d)', t => {
  const divide = math.divide2d(
    {
      data: [10, 20, 30, 40],
      width: 2,
      height: 2,
    },
    {
      data: [1, 2, 3, 4],
      width: 2,
      height: 2,
    }
  )

  t.deepEqual(divide, {
    data: [10, 10, 10, 10],
    width: 2,
    height: 2,
  })
  t.end()
})

test('should multiply by a constant value each matrix element (multiply2d)', t => {
  const multiply = math.multiply2d(
    {
      data: [10, 20, 30, 40],
      width: 2,
      height: 2,
    },
    10
  )

  t.deepEqual(multiply, {
    data: [100, 200, 300, 400],
    width: 2,
    height: 2,
  })
  t.end()
})

test('should multiply 2 matrices of the same size (multiply2d)', t => {
  const multiply = math.multiply2d(
    {
      data: [10, 20, 30, 40],
      width: 2,
      height: 2,
    },
    {
      data: [1, 2, 3, 4],
      width: 2,
      height: 2,
    }
  )

  t.deepEqual(multiply, {
    data: [10, 40, 90, 160],
    width: 2,
    height: 2,
  })
  t.end()
})

test('should compute the square value for each matrix element (square2d)', t => {
  const square = math.square2d({
    data: [1, 2, 3, 4],
    width: 2,
    height: 2,
  })

  t.deepEqual(square, {
    data: [1, 4, 9, 16],
    width: 2,
    height: 2,
  })
  t.end()
})

test('should compute the mean of all matrix elements (mean2d)', t => {
  const mean = math.mean2d({
    data: [2, 2, 3, 3],
    width: 2,
    height: 2,
  })
  const mean2 = math.mean2d({
    data: [1, 1, 1, 1],
    width: 2,
    height: 2,
  })
  const mean3 = math.mean2d({
    data: [1.52, 12.3, 76, -1],
    width: 2,
    height: 2,
  })

  t.equal(mean, 2.5)
  t.equal(mean2, 1)
  t.equal(mean3, 22.205)
  t.end()
})

test('should get the variance between 2 numbers (variance)', t => {
  const variance = math.variance([0, 2])

  t.equal(variance, 1)
  t.end()
})

test('adding a constant value to variance should not change its value (variance)', t => {
  const variance = math.variance([1, 2, 3])
  const varianceAdd4 = math.variance([1 + 4, 2 + 4, 3 + 4])

  t.equal(variance, varianceAdd4)
  t.end()
})

test('multiply by a constant should increase the variance by the square of the constant (variance)', t => {
  const constant = 5
  const variance = math.variance([5, 6, 70, 9])
  const varianceTimes5 = math.variance([
    5 * constant,
    6 * constant,
    70 * constant,
    9 * constant,
  ])

  t.equal(variance * 5 ** 2, varianceTimes5)
  t.end()
})

test('variance should be 0 for constants (variance)', t => {
  const variance = math.variance([3])

  t.equal(variance, 0)
  t.end()
})

test('covariance of two constants should be 0 (covariance)', t => {
  const covariance = math.covariance([2], [4])

  t.equal(covariance, 0)
  t.end()
})

test('covariance should be combinative (covariance)', t => {
  const A = [1, 6, 100]
  const B = [89, 19, 43]
  const covariance = math.covariance(A, B)
  const combinedCovariance = math.covariance(B, A)

  t.equal(covariance, combinedCovariance)
  t.end()
})

test('should get the covariance of two arrays (covariance)', t => {
  const A = [1, 3, 2, 5, 8, 7, 12, 2, 4]
  const B = [8, 6, 9, 4, 3, 3, 2, 7, 7]
  const covariance = math.covariance(A, B)

  t.equal(covariance.toFixed(4), '-7.1728')
  t.end()
})
