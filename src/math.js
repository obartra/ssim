
/**
 * Computes the mean value of a given array. It is the sum of a list of numbers divided by the
 * number of numbers in the list.
 *
 * @method average
 * @param {Number[]} xn - The target dataset
 * @returns {Number} average - The mean value of all elements within the array
 * @public
 * @memberOf math
 * @since 0.0.1
 */
function average(xn) {
	return sum(xn) / xn.length;
}

/**
 * Computes the variance value of a given array. It is the expectation of the squared deviation of a
 * random variable from its mean
 *
 * @method variance
 * @param {Number[]} xn - The target dataset
 * @returns {Number} variance - The variance value of all elements within the array
 * @public
 * @memberOf math
 * @since 0.0.1
 */
function variance(xn) {
	const x̄ = average(xn);
	const sqDiff = xn
		.map(diffFn(x̄))
		.map(diff => Math.pow(diff, 2));

	return average(sqDiff);
}

/**
 * Computes the covariance value between 2 arrays. It is a measure of how much two random variables
 * change together. If the greater values of one variable mainly correspond with the greater values
 * of the other variable, and the same holds for the lesser values, i.e., the variables tend to show
 * similar behavior, the covariance is positive.
 *
 * @method covariance
 * @param {Number[]} xn - The first target dataset
 * @param {Number[]} yn - The second target dataset
 * @returns {Number} covariance - The covariance value of xn with yn
 * @public
 * @memberOf math
 * @since 0.0.1
 */
function covariance(xn, yn) {
	const x̄ = average(xn);
	const ȳ = average(yn);

	const diffxn = xn.map(diffFn(x̄));
	const diffny = yn.map(diffFn(ȳ));
	const power = diffxn.map((diffx, index) => diffx * diffny[index]);

	return average(power);
}

/**
 * Computes the sum of a given array. It adds all values within the array and returns the total
 *
 * @method sum
 * @param {Number[]} xn - The target dataset
 * @returns {Number} sum - The total value
 * @private
 * @memberOf math
 * @since 0.0.1
 */
function sum(xn) {
	return xn.reduce((accumulated, current) => accumulated + current);
}

/**
 * Generates a curried function that computes the difference between 2 values
 *
 * @method diff
 * @param {Number} x - The input value to diff
 * @returns {Function} fn - A function that returns the difference of the value passed to the
 * function from the input value
 * @private
 * @memberOf math
 * @since 0.0.1
 */
function diffFn(x) {
	return y => y - x;
}

/**
 * Generates all pure math computations required
 *
 * @namespace math
 */
module.exports = {
	average,
	variance,
	covariance
};
