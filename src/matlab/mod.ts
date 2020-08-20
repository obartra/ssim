/**
 * `M = mod(X,Y)` returns the remainder `X - Y.*floor(X./Y)` for nonzero `Y`, and returns `X`
 * otherwise. `mod(X,Y)` always differs from `X` by a multiple of `Y`.
 *
 * So long as operands `X` and `Y` are of the same sign, the function `mod(X,Y)` returns the same
 * result as does `rem(X,Y)`. However, for positive `X` and `Y`, `mod(-x,y) = rem(-x,y)+y`.
 *
 * The mod function is useful for congruence relationships: x and y are congruent (mod m) if and
 * only if mod(x,m) == mod(y,m).
 *
 * This method mimics Matlab's `mod` method
 *
 * @method mod
 * @param {Number} x - The dividend
 * @param {Numvwe} y - The divisor
 * @returns {Number} M - Returns the signed remainder after division.
 * @private
 * @memberOf matlab
 * @since 0.0.2
 */
export function mod(x: number, y: number): number {
  return x - y * Math.floor(x / y)
}
