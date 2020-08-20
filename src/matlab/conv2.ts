import { multiply2d } from '../math'
import { ones } from './ones'
import { sub } from './sub'
import { zeros } from './zeros'
import { Matrix, Shape } from '../types'

/**
 * `C = conv2(a,b)` computes the two-dimensional convolution of matrices `a` and `b`. If one of
 * these matrices describes a two-dimensional finite impulse response (FIR) filter, the other matrix
 * is filtered in two dimensions. The size of `c` is determined as follows:
 *
 * ```
 * if [ma,na] = size(a), [mb,nb] = size(b), and [mc,nc] = size(c), then
 * mc = max([ma+mb-1,ma,mb]) and nc = max([na+nb-1,na,nb]).
 * ```
 *
 * `shape` returns a subsection of the two-dimensional convolution, based on one of these values for
 * the parameter:
 *
 * - **full**: Returns the full two-dimensional convolution (default).
 * - **same**: Returns the central part of the convolution of the same size as `a`.
 * - **valid**: Returns only those parts of the convolution that are computed without the
 *   zero-padded edges. Using this option, `size(c) === max([ma-max(0,mb-1),na-max(0,nb-1)],0)`
 *
 * @method mxConv2
 * @param {Matrix} a - The first matrix
 * @param {Matrix} b - The second matrix
 * @param {String} [shape='full'] - One of 'full' / 'same' / 'valid'
 * @returns {Matrix} c - Returns the convolution filtered by `shape`
 * @private
 * @memberOf matlab
 */
function mxConv2(
  { data: ref, width: refWidth, height: refHeight }: Matrix,
  b: Matrix,
  shape: Shape = 'full'
): Matrix {
  const cWidth = refWidth + b.width - 1
  const cHeight = refHeight + b.height - 1
  const { data } = zeros(cHeight, cWidth)

  /**
   * Computing the convolution is the most computentionally intensive task for SSIM and we do it
   * several times.
   *
   * This section has been optimized for performance and readability suffers.
   */
  for (let r1 = 0; r1 < b.height; r1++) {
    for (let c1 = 0; c1 < b.width; c1++) {
      const br1c1 = b.data[r1 * b.width + c1]

      if (br1c1) {
        for (let i = 0; i < refHeight; i++) {
          for (let j = 0; j < refWidth; j++) {
            data[(i + r1) * cWidth + j + c1] += ref[i * refWidth + j] * br1c1
          }
        }
      }
    }
  }

  const c = {
    data,
    width: cWidth,
    height: cHeight,
  }

  return reshape(c, shape, refHeight, b.height, refWidth, b.width)
}

/**
 * `C = boxConv(a,b)` computes the two-dimensional convolution of a matrix `a` and box kernel `b`.
 *
 * The `shape` parameter returns a subsection of the two-dimensional convolution as defined by
 * mxConv2.
 *
 * @method boxConv
 * @param {Matrix} a - The first matrix
 * @param {Matrix} b - The box kernel
 * @param {String} [shape='full'] - One of 'full' / 'same' / 'valid'
 * @returns {Matrix} c - Returns the convolution filtered by `shape`
 * @private
 * @memberOf matlab
 */
function boxConv(
  a: Matrix,
  { data, width, height }: Matrix,
  shape: Shape = 'full'
): Matrix {
  const b1 = ones(height, 1)
  const b2 = ones(1, width)
  const out = convn(a, b1, b2, shape)

  return multiply2d(out, data[0])
}

/**
 * Determines whether all values in an array are the same so that the kernel can be treated as a box
 * kernel
 *
 * @method isBoxKernel
 * @param {Matrix} a - The input matrix
 * @returns {Boolean} boxKernel - Returns true if all values in the matrix are the same, false
 * otherwise
 * @private
 * @memberOf matlab
 */
function isBoxKernel({ data }: Matrix): boolean {
  const expected = data[0]

  for (let i = 1; i < data.length; i++) {
    if (data[i] !== expected) {
      return false
    }
  }
  return true
}

/**
 * `C = convn(a,b1, b2)` computes the two-dimensional convolution of matrices `a.*b1.*b2`.
 *
 * The size of `c` is determined as follows:
 *
 * ```
 * if [ma,na] = size(a), [mb] = size(b1), [nb] = size(b2) and [mc,nc] = size(c), then
 * mc = max([ma+mb-1,ma,mb]) and nc = max([na+nb-1,na,nb]).
 * ```
 *
 * `shape` returns a section of the two-dimensional convolution, based on one of these values for
 * the parameter:
 *
 * - **full**: Returns the full two-dimensional convolution (default).
 * - **same**: Returns the central part of the convolution of the same size as `a`.
 * - **valid**: Returns only those parts of the convolution that are computed without the
 *   zero-padded edges. Using this option, `size(c) === max([ma-max(0,mb-1),na-max(0,nb-1)],0)`
 *
 * This method mimics Matlab's `convn` method but limited to 2 1 dimensional kernels.
 *
 * @method convn
 * @param {Matrix} a - The first matrix
 * @param {Matrix} b1 - The first 1-D kernel
 * @param {Matrix} b2 - The second 1-D kernel
 * @param {String} [shape='full'] - One of 'full' / 'same' / 'valid'
 * @returns {Matrix} c - Returns the convolution filtered by `shape`
 * @private
 * @memberOf matlab
 */
function convn(
  a: Matrix,
  b1: Matrix,
  b2: Matrix,
  shape: Shape = 'full'
): Matrix {
  const mb = Math.max(b1.height, b1.width)
  const nb = Math.max(b2.height, b2.width)
  const temp = mxConv2(a, b1, 'full')
  const c = mxConv2(temp, b2, 'full')

  return reshape(c, shape, a.height, mb, a.width, nb)
}

/**
 * `reshape` crops the resulting convolution matrix to match the values specified in `shape`.
 *
 * - **full**: Returns the input
 * - **same**: Returns the central part of the convolution of the same size as `a`.
 * - **valid**: Returns only those parts of the convolution that are computed without the
 *   zero-padded edges
 *
 * @method reshape
 * @param {Matrix} c - The output matrix
 * @param {String} shape - One of 'full' / 'same' / 'valid'
 * @param {Number} ma - The number of rows of the input matrix
 * @param {Number} mb - The number of rows of the input filter
 * @param {Number} na - The number of columns of the input matrix
 * @param {Number} nb - The number of columns of the input filter
 * @returns {Matrix} c - Returns the input convolution filtered by `shape`
 * @private
 * @memberOf matlab
 */
function reshape(
  c: Matrix,
  shape: Shape,
  ma: number,
  mb: number,
  na: number,
  nb: number
): Matrix {
  if (shape === 'full') {
    return c
  } else if (shape === 'same') {
    const rowStart = Math.ceil((c.height - ma) / 2)
    const colStart = Math.ceil((c.width - na) / 2)

    return sub(c, rowStart, ma, colStart, na)
  }

  return sub(c, mb - 1, ma - mb + 1, nb - 1, na - nb + 1)
}

/**
 * `C = conv2(a,b)` computes the two-dimensional convolution of matrices `a` and `b`. If one of
 * these matrices describes a two-dimensional finite impulse response (FIR) filter, the other matrix
 * is filtered in two dimensions.
 *
 * The size of `c` is determined as follows:
 *
 * ```
 * if [ma,na] = size(a), [mb,nb] = size(b), and [mc,nc] = size(c), then
 * mc = max([ma+mb-1,ma,mb]) and nc = max([na+nb-1,na,nb]).
 * ```
 *
 * `shape` returns a subsection of the two-dimensional convolution, based on one of these values for
 * the parameter:
 *
 * - **full**: Returns the full two-dimensional convolution (default).
 * - **same**: Returns the central part of the convolution of the same size as `a`.
 * - **valid**: Returns only those parts of the convolution that are computed without the
 *   zero-padded edges. Using this option, `size(c) === max([ma-max(0,mb-1),na-max(0,nb-1)],0)`
 *
 * Alternatively, 2 1-D filters may be provided as parameters, following the format:
 * `conv2(a, b1, b2, shape)`. This is similar to Matlab's implementation allowing any number of 1-D
 * filters to be applied but limited to 2
 *
 * This method mimics Matlab's `conv2` method.
 *
 * Given:
 * const A = rand(3);
 * const B = rand(4);
 *
 * @example conv2(A,B); // output is 6-by-6
 * {
 *   data: [
 *     0.1838, 0.2374, 0.9727, 1.2644, 0.7890, 0.3750,
 *     0.6929, 1.2019, 1.5499, 2.1733, 1.3325, 0.3096,
 *     0.5627, 1.5150, 2.3576, 3.1553, 2.5373, 1.0602,
 *     0.9986, 2.3811, 3.4302, 3.5128, 2.4489, 0.8462,
 *     0.3089, 1.1419, 1.8229, 2.1561, 1.6364, 0.6841,
 *     0.3287, 0.9347, 1.6464, 1.7928, 1.2422, 0.5423
 *   ],
 *   width: 6,
 *   height: 6
 * }
 *
 * @example conv2(A,B,'same') => // output is the same size as A: 3-by-3
 * {
 *   data: [
 *     2.3576, 3.1553, 2.5373,
 *     3.4302, 3.5128, 2.4489,
 *     1.8229, 2.1561, 1.6364
 *   ],
 *   width: 3,
 *   height: 3
 * }
 *
 * @method conv2
 * @param {Array} args - The list of arguments, see `mxConv2` and `convn` for the exact parameters
 * @returns {Matrix} c - Returns the convolution filtered by `shape`
 * @public
 * @memberOf matlab
 * @since 0.0.2
 */
export function conv2(
  ...args: Parameters<typeof boxConv | typeof convn | typeof mxConv2>
) {
  if (args[2] && (args[2] as Matrix).data) {
    return convn(...(args as Parameters<typeof convn>))
  } else if (isBoxKernel(args[1])) {
    return boxConv(...(args as Parameters<typeof boxConv>))
  }
  return mxConv2(...(args as Parameters<typeof mxConv2>))
}
