const test = require('blue-tape');
const { transpose } = require('../../../src/matlab/transpose');
const { conv2 } = require('../../../src/matlab/conv2');
const { ones } = require('../../../src/matlab/ones');
const { roundTo, get } = require('../../helpers/round');

test('should generate the same matrix with a kernel of 1', (t) => {
	const A = {
		data: [
			0.4366211, 0.9054124, 0.5962102,
			0.6371818, 0.1158246, 0.6470448,
			0.0063498, 0.2951452, 0.6623801
		],
		width: 3,
		height: 3
	};
	const B = {
		data: [
			0, 0, 0,
			0, 1, 0,
			0, 0, 0
		],
		width: 3,
		height: 3
	};
	const out = conv2(A, B, 'same');

	t.deepEqual(out, A);
	t.end();
});

test('should offset and divide the matrix with a moved kernel of 0.5', (t) => {
	const A = {
		data: [
			0.4366211, 0.9054124, 0.5962102,
			0.6371818, 0.1158246, 0.6470448,
			0.0063498, 0.2951452, 0.6623801
		],
		width: 3,
		height: 3
	};
	const B = {
		data: [
			0, 0.5, 0,
			0, 0, 0,
			0, 0, 0
		],
		width: 3,
		height: 3
	};
	const C = {
		data: [
			0.3185909, 0.0579123, 0.3235224,
			0.0031749, 0.1475726, 0.33119005,
			0.0000000, 0.0000000, 0.0000000
		],
		width: 3,
		height: 3
	};
	const out = conv2(A, B, 'same');

	t.deepEqual(out, C);
	t.end();
});

test('should generate the convolution of "same" values like Matlab', (t) => {
	const A = {
		data: [
			0.4366211, 0.9054124, 0.5962102,
			0.6371818, 0.1158246, 0.6470448,
			0.0063498, 0.2951452, 0.6623801
		],
		width: 3,
		height: 3
	};
	const B = {
		data: [
			0.180854, 0.650212, 0.848889, 0.661308,
			0.098090, 0.877106, 0.662927, 0.242400,
			0.625190, 0.318765, 0.920264, 0.668719,
			0.873018, 0.264735, 0.082795, 0.516670
		],
		width: 4,
		height: 4
	};
	const C = {
		data: [
			1.9677205305226, 2.7994413827229, 2.3686256720085,
			2.1522248148631005, 1.9755068456836002, 1.7007216437643,
			1.1623389165626001, 0.9970991503065001, 0.9203489336432
		],
		width: 3,
		height: 3
	};
	const out = conv2(A, B, 'same');

	t.deepEqual(out, C);
	t.end();
});

test('should generate "full" convolution by default', (t) => {
	const A = {
		data: [
			0.4366211, 0.9054124, 0.5962102,
			0.6371818, 0.1158246, 0.6470448,
			0.0063498, 0.2951452, 0.6623801
		],
		width: 3,
		height: 3
	};
	const B = {
		data: [
			0.180854, 0.650212, 0.848889, 0.661308,
			0.098090, 0.877106, 0.662927, 0.242400,
			0.625190, 0.318765, 0.920264, 0.668719,
			0.873018, 0.264735, 0.082795, 0.516670
		],
		width: 4,
		height: 4
	};
	const C = {
		data: [
			0.07896467241939999, 0.4476437328628, 1.0671798558974999, 1.4449986797848,
			1.1048727438869999, 0.3942785749416,
			0.1580650409562, 0.9070254836025999, 1.8753006290867003, 2.1694107685774,
			1.2405807528194, 0.5724172550784,
			0.3366206950002, 1.3329784243407001, 1.9677205305226, 2.7994413827229,
			2.3686256720085, 0.9935780074245999,
			0.7801606209038, 1.2160740880295, 2.1522248148631005, 1.9755068456836002,
			1.7007216437643, 0.9012960118852,
			0.5602410121344, 0.45634720605080004, 1.1623389165626001, 0.9970991503065001,
			0.9203489336432, 0.7772547949079,
			0.0055434896964, 0.25934808651659996, 0.6569307463548001, 0.20307249377349998,
			0.20733443086349998, 0.342231926267
		],
		width: 6,
		height: 6
	};

	const outSame = conv2(A, B, 'full');
	const out = conv2(A, B);

	t.deepEqual(out, C);
	t.deepEqual(out, outSame);
	t.end();
});

test('should generate the convolution of "valid" values', (t) => {
	const A = {
		data: [
			0.4366211, 0.9054124, 0.5962102,
			0.6371818, 0.1158246, 0.6470448,
			0.0063498, 0.2951452, 0.6623801
		],
		width: 3,
		height: 3
	};
	const B = {
		data: [
			0.909911, 0.824447, 0.880526,
			0.970307, 0.867250, 0.097273,
			0.075271, 0.940705, 0.281154
		],
		width: 3,
		height: 3
	};
	const out = conv2(A, B, 'valid');

	t.equal(roundTo(out.data[0], 4), 2.6613);
	t.equal(out.height, 1);
	t.equal(out.width, 1);
	t.end();
});

test('should generate the decomposed convolution of "valid" values', (t) => {
	const A = {
		data: [
			0.4366211, 0.9054124, 0.5962102,
			0.6371818, 0.1158246, 0.6470448,
			0.0063498, 0.2951452, 0.6623801
		],
		width: 3,
		height: 3
	};
	const v = {
		data: [-0.30780, -0.38440, -0.30780],
		width: 1,
		height: 3
	};
	const h = {
		data: [-0.30780, -0.38440, -0.30780],
		width: 3,
		height: 1
	};
	const { data } = conv2(A, v, h, 'valid');

	t.deepEqual(roundTo(data, 5), 0.47232);
	t.end();
});

test('decomposed convolutions should match the matching matrix if rank is one', (t) => {
	const A = {
		data: [
			0.4366211, 0.9054124, 0.5962102,
			0.6371818, 0.1158246, 0.6470448,
			0.0063498, 0.2951452, 0.6623801
		],
		width: 3,
		height: 3
	};
	const B = {
		data: [
			0.094742, 0.118318, 0.094742,
			0.118318, 0.147761, 0.118318,
			0.094742, 0.118318, 0.094742
		],
		width: 3,
		height: 3
	};
	// since:
	//   rank(B) === 1
	// then:
	//   [U, S, V] = svd(B)
	//   v = U(:,1) * sqrt(S(1,1))
	//   h = V(:,1)' * sqrt(S(1,1))
	const v = {
		data: [-0.30780, -0.38440, -0.30780],
		width: 1,
		height: 3
	};
	const h = {
		data: [-0.30780, -0.38440, -0.30780],
		width: 3,
		height: 1
	};

	const { data: out } = conv2(A, B, 'valid');
	const { data: vhOut } = conv2(A, v, h, 'valid');

	t.equal(out.height, vhOut.height);
	t.equal(out.width, vhOut.width);

	for (let i = 0; i < out.height; i++) {
		for (let j = 0; j < out.width; j++) {
			t.equal(get(out, i, j), get(vhOut, i, j));
		}
	}
	t.end();
});

test('should convolve 2 1-D kernels', (t) => {
	const A = {
		data: [
			0.4366211, 0.9054124, 0.5962102,
			0.6371818, 0.1158246, 0.6470448,
			0.0063498, 0.2951452, 0.6623801
		],
		width: 3,
		height: 3
	};
	const K1 = {
		data: [
			0.0010284, 0.0075988, 0.0360008, 0.1093607, 0.2130055, 0.2660117, 0.2130055, 0.1093607,
			0.0360008, 0.0075988, 0.0010284
		],
		width: 11,
		height: 1
	};
	const K2 = transpose(K1);

	const out = conv2(A, K1, K2, 'full');
	const expected = {
		data: [
			4.6176e-07, 4.3695e-06, 2.3871e-05, 8.7284e-05, 2.1954e-04, 3.8483e-04, 4.7393e-04,
			4.1054e-04, 2.4859e-04, 1.0398e-04, 2.9610e-05, 5.6166e-06, 6.3053e-07,
			4.0858e-06, 3.7388e-05, 2.0156e-04, 7.2595e-04, 1.7988e-03, 3.1160e-03, 3.8149e-03,
			3.3075e-03, 2.0152e-03, 8.5039e-04, 2.4433e-04, 4.6680e-05, 5.3433e-06,
			2.1151e-05, 1.9102e-04, 1.0249e-03, 3.6709e-03, 9.0493e-03, 1.5626e-02, 1.9131e-02,
			1.6643e-02, 1.0199e-02, 4.3319e-03, 1.2521e-03, 2.4038e-04, 2.7830e-05,
			7.2744e-05, 6.4593e-04, 3.4439e-03, 1.2242e-02, 2.9964e-02, 5.1502e-02, 6.3035e-02,
			5.5073e-02, 3.3999e-02, 1.4561e-02, 4.2410e-03, 8.1913e-04, 9.6184e-05,
			1.6754e-04, 1.4602e-03, 7.7354e-03, 2.7282e-02, 6.6318e-02, 1.1361e-01, 1.3940e-01,
			1.2281e-01, 7.6706e-02, 3.3254e-02, 9.7879e-03, 1.9062e-03, 2.2789e-04,
			2.5973e-04, 2.2254e-03, 1.1735e-02, 4.1144e-02, 9.9644e-02, 1.7096e-01, 2.1159e-01,
			1.8917e-01, 1.2023e-01, 5.2979e-02, 1.5802e-02, 3.1091e-03, 3.7933e-04,
			2.7134e-04, 2.2996e-03, 1.2129e-02, 4.2516e-02, 1.0339e-01, 1.7936e-01, 2.2619e-01,
			2.0699e-01, 1.3460e-01, 6.0462e-02, 1.8296e-02, 3.6397e-03, 4.5270e-04,
			1.9042e-04, 1.6149e-03, 8.5924e-03, 3.0410e-02, 7.5206e-02, 1.3380e-01, 1.7401e-01,
			1.6420e-01, 1.0956e-01, 5.0159e-02, 1.5379e-02, 3.0896e-03, 3.8999e-04,
			8.9216e-05, 7.7042e-04, 4.1848e-03, 1.5153e-02, 3.8704e-02, 7.1625e-02, 9.6940e-02,
			9.4584e-02, 6.4646e-02, 3.0068e-02, 9.3104e-03, 1.8841e-03, 2.3994e-04,
			2.7716e-05, 2.4935e-04, 1.4026e-03, 5.2691e-03, 1.4089e-02, 2.7363e-02, 3.8623e-02,
			3.8847e-02, 2.7065e-02, 1.2729e-02, 3.9665e-03, 8.0643e-04, 1.0311e-04,
			5.6760e-06, 5.4730e-05, 3.2342e-04, 1.2746e-03, 3.5933e-03, 7.3299e-03, 1.0741e-02,
			1.1067e-02, 7.8161e-03, 3.7023e-03, 1.1577e-03, 2.3601e-04, 3.0210e-05,
			7.2348e-07, 7.7747e-06, 4.9135e-05, 2.0527e-04, 6.1330e-04, 1.3134e-03, 1.9920e-03,
			2.0959e-03, 1.4975e-03, 7.1359e-04, 2.2383e-04, 4.5732e-05, 5.8604e-06,
			6.7153e-09, 3.6176e-07, 3.2420e-06, 1.6817e-05, 5.9107e-05, 1.4088e-04, 2.2723e-04,
			2.4657e-04, 1.7852e-04, 8.5471e-05, 2.6836e-05, 5.4882e-06, 7.0051e-07
		],
		width: 13,
		height: 13
	};

	t.equal(out.height, expected.height);
	t.equal(out.width, expected.width);

	let isMatch = true;

	for (let i = 0; i < out.height; i++) {
		for (let j = 0; j < out.width; j++) {
			if (get(out, i, j) !== get(expected, i, j)) {
				isMatch = false;
			}
		}
	}
	t.equal(isMatch, true, 'Results do not match');
	t.end();
});

test('decomposed convolutions should default to "full"', (t) => {
	const A = {
		data: [
			0.4366211, 0.9054124, 0.5962102,
			0.6371818, 0.1158246, 0.6470448,
			0.0063498, 0.2951452, 0.6623801
		],
		width: 3,
		height: 3
	};
	const v = {
		data: [-0.30780, -0.38440, -0.30780],
		width: 1,
		height: 3
	};
	const h = {
		data: [-0.30780, -0.38440, -0.30780],
		width: 3,
		height: 1
	};

	const { data: fullOut } = conv2(A, v, h, 'full');
	const { data: defaultOut } = conv2(A, v, h);

	t.deepEqual(defaultOut, fullOut);
	t.end();
});

test('convolutions with box kernels should default to "full"', (t) => {
	const A = {
		data: [
			0.4366211, 0.9054124, 0.5962102,
			0.6371818, 0.1158246, 0.6470448,
			0.0063498, 0.2951452, 0.6623801
		],
		width: 3,
		height: 3
	};
	const B = ones(3);
	const { data: fullOut } = conv2(A, B, 'full');
	const { data: defaultOut } = conv2(A, B);

	t.deepEqual(defaultOut, fullOut);
	t.end();
});
