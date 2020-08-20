import { Matrix } from '../types'

/**
 * `Y = normpdf(X,μ,σ)` computes the pdf at each of the values in `X` using the normal
 * distribution with mean `μ` and standard deviation `σ`. `X`, `μ`, and `σ` can be vectors,
 * matrices, or multidimensional arrays that all have the same size. A scalar input is expanded to a
 * constant array with the same dimensions as the other inputs. The parameters in `σ` must be
 * positive.
 *
 * The normal pdf is: `y = f(x|μ,σ) = (1 / (σ√(2π))) * e^(-(x-μ)^2/2σ^2)`
 *
 * The likelihood function is the pdf viewed as a function of the parameters. Maximum likelihood
 * estimators (MLEs) are the values of the parameters that maximize the likelihood function for a
 * fixed value of `x`.
 *
 * The standard normal distribution has `µ = 0` and `σ = 1`.
 * If x is standard normal, then `xσ + µ` is also normal with mean `µ` and standard deviation `σ`.
 * Conversely, if `y` is normal with mean `µ` and standard deviation `σ`, then `x = (y – µ) / σ` is
 * standard normal.
 *
 * `Y = normpdf(X)` uses the standard normal distribution (`µ = 0`, `σ = 1`).
 * `Y = normpdf(X,µ)` uses the normal distribution with unit standard deviation (`σ = 1`).
 *
 * @example normpdf({ data: [2, 1, 0, 1, 2], width: 5, height: 1 }, 0, 1.5) =>
 *   { data: [ 0.10934, 0.21297, 0.26596, 0.21297, 0.10934], width: 5, height: 1 }
 *
 * @method normpdf
 * @param {Matrix} X - The input matrix
 * @param {Number} [µ=0] - The length of the filter
 * @param {Number} [σ=1] - The filter sigma value
 * @returns {Matrix} Y - Returns the central part of the convolution of the same
 * size as `a`.
 * @public
 * @memberOf matlab
 * @since 0.0.2
 */
export function normpdf(
  { data: ref, width, height }: Matrix,
  µ = 0,
  σ = 1
): Matrix {
  // data = ((2 * pi)^(-1 / 2)) * exp(-((x - µ) / σ)^2 / 2) / σ;
  const SQ2PI = 2.506628274631000502415765284811
  const data = new Array(ref.length)

  for (let i = 0; i < ref.length; i++) {
    const z = (ref[i] - µ) / σ

    data[i] = Math.exp(-(z ** 2) / 2) / (σ * SQ2PI)
  }

  return {
    data,
    width,
    height,
  }
}
