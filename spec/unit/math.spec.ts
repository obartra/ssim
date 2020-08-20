import * as math from '../../src/math'

describe('math', () => {
  test('should get the average between 2 numbers (average)', () => {
    const avg = math.average([2, 4])

    expect(avg).toBe(3)
  })

  test('should round to the lowest integer each element of the array (floor)', () => {
    const floor = math.floor([1.1, 1.9, 1, -1.5, -1.9, -1.1])

    expect(floor).toEqual([1, 1, 1, -2, -2, -2])
  })

  test('should add all the values in the matrix (sum2d)', () => {
    const sum = math.sum2d({ data: [1, 1, 2], width: 3, height: 1 })
    const sum2 = math.sum2d({ data: [1, 1, 2, 0, 0, -1], width: 3, height: 2 })

    expect(sum).toEqual(4)
    expect(sum2).toEqual(3)
  })

  test('should add a constant value to each matrix element (add2d)', () => {
    const add = math.add2d(
      {
        data: [1, 2, 3, 4],
        width: 2,
        height: 2,
      },
      10
    )

    expect(add).toEqual({
      data: [11, 12, 13, 14],
      width: 2,
      height: 2,
    })
  })

  test('should add 2 matrices of the same size (add2d)', () => {
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

    expect(add).toEqual({
      data: [0, 0, 0, 0],
      width: 2,
      height: 2,
    })
  })

  test('should subtract a constant value to each matrix element (subtract2d)', () => {
    const sub = math.subtract2d(
      {
        data: [1, 2, 3, 4],
        width: 2,
        height: 2,
      },
      10
    )

    expect(sub).toEqual({
      data: [-9, -8, -7, -6],
      width: 2,
      height: 2,
    })
  })

  test('should subtract 2 matrices of the same size (subtract2d)', () => {
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

    expect(sub).toEqual({
      data: [0, 0, 0, 0],
      width: 2,
      height: 2,
    })
  })

  test('should divide by a constant value each matrix element (divide2d)', () => {
    const divide = math.divide2d(
      {
        data: [10, 20, 30, 40],
        width: 2,
        height: 2,
      },
      10
    )

    expect(divide).toEqual({
      data: [1, 2, 3, 4],
      width: 2,
      height: 2,
    })
  })

  test('should divide 2 matrices of the same size (divide2d)', () => {
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

    expect(divide).toEqual({
      data: [10, 10, 10, 10],
      width: 2,
      height: 2,
    })
  })

  test('should multiply by a constant value each matrix element (multiply2d)', () => {
    const multiply = math.multiply2d(
      {
        data: [10, 20, 30, 40],
        width: 2,
        height: 2,
      },
      10
    )

    expect(multiply).toEqual({
      data: [100, 200, 300, 400],
      width: 2,
      height: 2,
    })
  })

  test('should multiply 2 matrices of the same size (multiply2d)', () => {
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

    expect(multiply).toEqual({
      data: [10, 40, 90, 160],
      width: 2,
      height: 2,
    })
  })

  test('should compute the square value for each matrix element (square2d)', () => {
    const square = math.square2d({
      data: [1, 2, 3, 4],
      width: 2,
      height: 2,
    })

    expect(square).toEqual({
      data: [1, 4, 9, 16],
      width: 2,
      height: 2,
    })
  })

  test('should compute the mean of all matrix elements (mean2d)', () => {
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

    expect(mean).toEqual(2.5)
    expect(mean2).toEqual(1)
    expect(mean3).toEqual(22.205)
  })

  test('should get the variance between 2 numbers (variance)', () => {
    const variance = math.variance([0, 2])

    expect(variance).toEqual(1)
  })

  test('adding a constant value to variance should not change its value (variance)', () => {
    const variance = math.variance([1, 2, 3])
    const varianceAdd4 = math.variance([1 + 4, 2 + 4, 3 + 4])

    expect(variance).toEqual(varianceAdd4)
  })

  test('multiply by a constant should increase the variance by the square of the constant (variance)', () => {
    const constant = 5
    const variance = math.variance([5, 6, 70, 9])
    const varianceTimes5 = math.variance([
      5 * constant,
      6 * constant,
      70 * constant,
      9 * constant,
    ])

    expect(variance * 5 ** 2).toEqual(varianceTimes5)
  })

  test('variance should be 0 for constants (variance)', () => {
    const variance = math.variance([3])

    expect(variance).toEqual(0)
  })

  test('covariance of two constants should be 0 (covariance)', () => {
    const covariance = math.covariance([2], [4])

    expect(covariance).toEqual(0)
  })

  test('covariance should be combinative (covariance)', () => {
    const A = [1, 6, 100]
    const B = [89, 19, 43]
    const covariance = math.covariance(A, B)
    const combinedCovariance = math.covariance(B, A)

    expect(covariance).toEqual(combinedCovariance)
  })

  test('should get the covariance of two arrays (covariance)', () => {
    const A = [1, 3, 2, 5, 8, 7, 12, 2, 4]
    const B = [8, 6, 9, 4, 3, 3, 2, 7, 7]
    const covariance = math.covariance(A, B)

    expect(covariance.toFixed(4)).toEqual('-7.1728')
  })
})
