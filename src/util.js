/**
 * Throws an error specifying a value required. It's used as default value. For instance:
 *
 * ```javascript
 * function test(requiredParam = force('requiredParam')) {
 *   console.log(requiredParam);
 * }
 * ```
 *
 * That will log `reqgetwindowuiredParam` if called like `test('blah')` but, if the parameter is not
 * set, it will throw with a message indicating that `requireParam` is needed
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
 * Convenience methods
 *
 * @namespace util
 */
module.exports = {
	force
};
