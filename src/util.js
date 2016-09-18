/**
 * Generates an array of size length. Each value matches its index. E.g. `times(3)` will generate a
 * new array like: `[0, 1, 2]`
 *
 * @method times
 * @param {Number} length - The number of items in the array
 * @returns {Number[]} array - The generated array
 * @public
 * @memberOf util
 * @since 0.0.1
 */
function times(length) {
	return Array.apply(null, { length }) // eslint-disable-line prefer-spread
		.map((undef, index) => index);
}

/**
 * Generates an array of size length/step. Only adds items every n * step. E.g. `timesEvery(4, 2)`
 * will generate an array like: `[0, 2]`
 *
 * @method times
 * @param {Number} length - The number of items in the array
 * @param {Number} step - The number of items to skip (i.e. add an item every `step`)
 * @returns {Number[]} array - The generated array
 * @public
 * @memberOf util
 * @since 0.0.1
 */
function timesEvery(length, step) {
	return times(length).filter(x => !(x % step));
}

/**
 * Throws an error specifying a value required. It's used as default value. For instance:
 *
 * ```javascript
 * function test(requiredParam = force('requiredParam')) {
 *   console.log(requiredParam);
 * }
 * ```
 *
 * That will log `requiredParam` if called like `test('blah')` but, if the parameter is not set, it
 * will throw with a message indicating that `requireParam` is needed
 *
 * @method force
 * @param {String} name - The name of the parameter required
 * @public
 * @memberOf util
 * @since 0.0.1
 */
function force(name) {
	throw new Error(`Missing ${name} parameter`);
}

/**
 * Convenience methods used
 *
 * @namespace util
 */
module.exports = {
	times,
	timesEvery,
	force
};
