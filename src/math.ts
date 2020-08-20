/**
 * Generates all basic arithmetic and matrix computations required
 *
 * Most of these methods use plain for loops and reduce nested calls. This results in about ~100x
 * improvement on SSIM computation for 512x512 images on recent versions of node (~v6.7) over
 * implementations using map or reduce.
 *
 * @namespace math
 */
import { Matrix } from './types'

/**
 * Computes the mean value of a given array. It is the sum of a list of numbers divided by the
 * number of numbers in the list.
 *
 * @method average
 * @param {Number[]} xn - The target array
 * @returns {Number} average - The mean value of all elements within the array
 * @public
 * @memberOf math
 * @since 0.0.1
 */
export function average(xn: number[]): number {
  return sum(xn) / xn.length
}

/**
 * Computes the sum of a given array. It adds all values within the array and returns the total
 *
 * @method sum
 * @param {Number[]} xn - The target array
 * @returns {Number} sum - The total value
 * @private
 * @memberOf math
 * @since 0.0.1
 */
export function sum(xn: number[]): number {
  let out = 0

  for (let x = 0; x < xn.length; x++) {
    out += xn[x]
  }
  return out
}

/**
 * Computes the largest integer less than or equal to a given number for each member of a given
 * array.
 *
 * @method floor
 * @param {Number[]} xn - The target array
 * @returns {Number[]} floorArr - An array with the Math.floor value for each element of the target
 * array
 * @private
 * @memberOf math
 * @since 0.0.1
 */
export function floor(xn: number[]): number[] {
  const out = new Array(xn.length)

  for (let x = 0; x < xn.length; x++) {
    out[x] = Math.floor(xn[x])
  }

  return out
}

/**
 * Computes the sum of all elements within a matrix
 *
 * @method sum2d
 * @param {Matrix} A - The input matrix
 * @returns {Number} sum - The total value of adding each cell
 * @public
 * @memberOf math
 * @since 0.0.2
 */
export function sum2d({ data }: Matrix): number {
  let out = 0

  for (let x = 0; x < data.length; x++) {
    out += data[x]
  }

  return out
}

/**
 * Adds values of two matrices of the same size
 *
 * @method add2dMx
 * @param {Matrix} A - The first input matrix
 * @param {Matrix} B - The second input matrix
 * @returns {Matrix} out - A matrix with a cell-by-cell sum of `A` and `B`
 * @private
 * @memberOf math
 * @since 0.0.2
 */
function add2dMx(
  { data: ref1, width, height }: Matrix,
  { data: ref2 }: Matrix
): Matrix {
  const data = new Array(ref1.length)

  for (let x = 0; x < height; x++) {
    const offset = x * width

    for (let y = 0; y < width; y++) {
      data[offset + y] = ref1[offset + y] + ref2[offset + y]
    }
  }

  return {
    data,
    width,
    height,
  }
}

/**
 * Subtracts values of second matrix from the first one. It assumes both matrices are of the same
 * size
 *
 * @method subtract2dMx
 * @param {Matrix} A - The first input matrix
 * @param {Matrix} B - The second input matrix
 * @returns {Matrix} out - A matrix with a cell-by-cell subtraction of `A` minus `B`
 * @private
 * @memberOf math
 * @since 0.0.2
 */
function subtract2dMx(
  { data: ref1, width, height }: Matrix,
  { data: ref2 }: Matrix
): Matrix {
  const data = new Array(ref1.length)

  for (let x = 0; x < height; x++) {
    const offset = x * width

    for (let y = 0; y < width; y++) {
      data[offset + y] = ref1[offset + y] - ref2[offset + y]
    }
  }

  return {
    data,
    width,
    height,
  }
}

/**
 * Adds a constant value two each matrix cell
 *
 * @method add2dScalar
 * @param {Matrix} A - The first input matrix
 * @param {Number} increase - The value to add
 * @returns {Matrix} B - The cell-by-cell matrix sum of `A` and `increase`
 * @private
 * @memberOf math
 * @since 0.0.2
 */
function add2dScalar(
  { data: ref, width, height }: Matrix,
  increase: number
): Matrix {
  const data = new Array(ref.length)

  for (let x = 0; x < ref.length; x++) {
    data[x] = ref[x] + increase
  }

  return {
    data,
    width,
    height,
  }
}

/**
 * Adds values of two matrices of the same size or a matrix and a constant
 *
 * @method add2d
 * @param {Matrix} A - The first input matrix
 * @param {Matrix|Number} increase - The second input matrix or the constant value
 * @returns {Matrix} B - A matrix with a cell-by-cell sum of the first and second parameters
 * @public
 * @memberOf math
 * @since 0.0.2
 */
export function add2d(A: Matrix, increase: Matrix | number): Matrix {
  if (typeof increase === 'number') {
    return add2dScalar(A, increase)
  }
  return add2dMx(A, increase)
}

/**
 * Subtracts values of two matrices of the same size or a matrix and a constant
 *
 * @method subtract2d
 * @param {Matrix} A - The first input matrix
 * @param {Matrix|Number} decrease - The second input matrix or the constant value
 * @returns {Matrix} B - A matrix with a cell-by-cell subtraction of the first parameter minus the
 * second one
 * @public
 * @memberOf math
 */
export function subtract2d(A: Matrix, decrease: Matrix | number): Matrix {
  if (typeof decrease === 'number') {
    return add2dScalar(A, -decrease)
  }
  return subtract2dMx(A, decrease)
}

/**
 * Divides each matrix cell by a constant value
 *
 * @method divide2dScalar
 * @param {Matrix} A - The first input matrix
 * @param {Number} divisor - The value to divide by
 * @returns {Matrix} B - The cell-by-cell matrix divison of `A` and `divisor`
 * @private
 * @memberOf math
 * @since 0.0.2
 */
function divide2dScalar(
  { data: ref, width, height }: Matrix,
  divisor: number
): Matrix {
  const data = new Array(ref.length)

  for (let x = 0; x < ref.length; x++) {
    data[x] = ref[x] / divisor
  }

  return {
    data,
    width,
    height,
  }
}

/**
 * Divides, cell-by-cell, values of two matrices of the same size
 *
 * @method divide2dMx
 * @param {Matrix} A - The first input matrix
 * @param {Matrix} B - The second input matrix
 * @returns {Matrix} out - A matrix with a cell-by-cell division of `A`/`B`
 * @private
 * @memberOf math
 * @since 0.0.2
 */
function divide2dMx(
  { data: ref1, width, height }: Matrix,
  { data: ref2 }: Matrix
): Matrix {
  const data = new Array(ref1.length)

  for (let x = 0; x < ref1.length; x++) {
    data[x] = ref1[x] / ref2[x]
  }

  return {
    data,
    width,
    height,
  }
}

/**
 * Divides values of two matrices of the same size or between a matrix and a constant
 *
 * @method divide2d
 * @param {Matrix} A - The first input matrix
 * @param {Matrix|Number} divisor - The second input matrix or the constant value
 * @returns {Matrix} B - A matrix with the cell-by-cell division of the first and second parameters
 * @public
 * @memberOf math
 * @since 0.0.2
 */
export function divide2d(A: Matrix, divisor: Matrix | number): Matrix {
  if (typeof divisor === 'number') {
    return divide2dScalar(A, divisor)
  }
  return divide2dMx(A, divisor)
}

/**
 * Multiplies each matrix cell by a constant value
 *
 * @method multiply2dScalar
 * @param {Matrix} A - The first input matrix
 * @param {Number} multiplier - The value to multiply each cell with
 * @returns {Matrix} B - The cell-by-cell matrix multiplication of `A` and `multiplier`
 * @private
 * @memberOf math
 * @since 0.0.2
 */
function multiply2dScalar(
  { data: ref, width, height }: Matrix,
  multiplier: number
): Matrix {
  const data = new Array(ref.length)

  for (let x = 0; x < ref.length; x++) {
    data[x] = ref[x] * multiplier
  }

  return {
    data,
    width,
    height,
  }
}

/**
 * Multiplies, cell-by-cell, values of two matrices of the same size
 *
 * @method multiply2dMx
 * @param {Matrix} A - The first input matrix
 * @param {Matrix} B - The second input matrix
 * @returns {Matrix} out - A matrix with a cell-by-cell multiplication of `A` * `B`
 * @private
 * @memberOf math
 * @since 0.0.2
 */
function multiply2dMx(
  { data: ref1, width, height }: Matrix,
  { data: ref2 }: Matrix
): Matrix {
  const data = new Array(ref1.length)

  for (let x = 0; x < ref1.length; x++) {
    data[x] = ref1[x] * ref2[x]
  }

  return {
    data,
    width,
    height,
  }
}

/**
 * Multiplies values of two matrices of the same size or between a matrix and a constant
 *
 * @method multiply2d
 * @param {Matrix} A - The first input matrix
 * @param {Matrix|Number} multiplier - The second input matrix or the constant value
 * @returns {Matrix} out - A matrix with the cell-by-cell multiplication of the first and second
 * parameters
 * @public
 * @memberOf math
 * @since 0.0.2
 */
export function multiply2d(A: Matrix, multiplier: Matrix | number): Matrix {
  if (typeof multiplier === 'number') {
    return multiply2dScalar(A, multiplier)
  }
  return multiply2dMx(A, multiplier)
}

/**
 * Generates the cell-by-cell square value of a target matrix
 *
 * @method square2d
 * @param {Matrix} A - The target matrix
 * @returns {Matrix} B - A matrix with squared value of each cell
 * @public
 * @memberOf math
 * @since 0.0.2
 */
export function square2d(A: Matrix): Matrix {
  return multiply2d(A, A)
}

/**
 * Calculates the total mean value for a given matrix
 *
 * @method mean2d
 * @param {Matrix} A - The target matrix
 * @returns {Number} mean - The total mean of each cell
 * @public
 * @memberOf math
 * @since 0.0.2
 */
export function mean2d(A: Matrix): number {
  return sum2d(A) / A.data.length
}

/**
 * Computes the variance for a given array
 *
 * @method variance
 * @param {Array<Number>} values - The target array
 * @param {Number} [avg=average(values)] - If specified, it will use this values as the average of
 * the array values. If not, it will compute the actual average
 * @returns {Number} varx - The resulting variance value
 * @public
 * @memberOf math
 */
export function variance(
  values: number[],
  avg: number = average(values)
): number {
  let varx = 0
  let i = values.length

  while (i--) {
    varx += (values[i] - avg) ** 2
  }

  return varx / values.length
}

/**
 * Computes the covariance between 2 arrays
 *
 * @method covariance
 * @param {Array<Number>} values1 - The first target array
 * @param {Array<Number>} values2 - The second target array
 * @param {Number} [average1=average(values)] - If specified, it will use this values as the average
 * of the first array. If not, it will compute the actual average
 * @param {Number} [average2=average(values)] - If specified, it will use this values as the average
 * of the second array. If not, it will compute the actual average
 * @returns {Number} cov - The resulting covariance
 * @public
 * @memberOf math
 */
export function covariance(
  values1: number[],
  values2: number[],
  average1: number = average(values1),
  average2: number = average(values2)
): number {
  let cov = 0
  let i = values1.length

  while (i--) {
    cov += (values1[i] - average1) * (values2[i] - average2)
  }

  return cov / values1.length
}
