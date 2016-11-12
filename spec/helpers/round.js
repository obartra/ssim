function roundTo(num, precision = 3) {
	return Math.round(num * (10 ** precision)) / (10 ** precision);
}

function round(num) {
	return roundTo(num, 3);
}

function get(obj, i, j, precision = 4) {
	return roundTo(obj.data[i * obj.width + j], precision);
}

module.exports = {
	round,
	roundTo,
	get
};
