function roundTo(num, precision = 3) {
	return Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision);
}

function round(num) {
	return roundTo(num, 3);
}

module.exports = {
	round,
	roundTo
};
