const test = require('blue-tape')
const { transpose } = require('../../../src/matlab/transpose')
const { conv2 } = require('../../../src/matlab/conv2')
const { ones } = require('../../../src/matlab/ones')
const { roundTo, get } = require('../../helpers/round')

test('should generate the same matrix with a kernel of 1', t => {
  const A = {
    data: [
      0.4366211,
      0.9054124,
      0.5962102,
      0.6371818,
      0.1158246,
      0.6470448,
      0.0063498,
      0.2951452,
      0.6623801,
    ],
    width: 3,
    height: 3,
  }
  const B = {
    data: [0, 0, 0, 0, 1, 0, 0, 0, 0],
    width: 3,
    height: 3,
  }
  const out = conv2(A, B, 'same')

  t.deepEqual(out, A)
  t.end()
})

test('should offset and divide the matrix with a moved kernel of 0.5', t => {
  const A = {
    data: [
      0.4366211,
      0.9054124,
      0.5962102,
      0.6371818,
      0.1158246,
      0.6470448,
      0.0063498,
      0.2951452,
      0.6623801,
    ],
    width: 3,
    height: 3,
  }
  const B = {
    data: [0, 0.5, 0, 0, 0, 0, 0, 0, 0],
    width: 3,
    height: 3,
  }
  const C = {
    data: [
      0.3185909,
      0.0579123,
      0.3235224,
      0.0031749,
      0.1475726,
      0.33119005,
      0.0,
      0.0,
      0.0,
    ],
    width: 3,
    height: 3,
  }
  const out = conv2(A, B, 'same')

  t.deepEqual(out, C)
  t.end()
})

test('should generate the convolution of "same" values like Matlab', t => {
  const A = {
    data: [
      0.4366211,
      0.9054124,
      0.5962102,
      0.6371818,
      0.1158246,
      0.6470448,
      0.0063498,
      0.2951452,
      0.6623801,
    ],
    width: 3,
    height: 3,
  }
  const B = {
    data: [
      0.180854,
      0.650212,
      0.848889,
      0.661308,
      0.09809,
      0.877106,
      0.662927,
      0.2424,
      0.62519,
      0.318765,
      0.920264,
      0.668719,
      0.873018,
      0.264735,
      0.082795,
      0.51667,
    ],
    width: 4,
    height: 4,
  }
  const C = {
    data: [
      1.9677205305226,
      2.7994413827229,
      2.3686256720085,
      2.1522248148631005,
      1.9755068456836002,
      1.7007216437643,
      1.1623389165626001,
      0.9970991503065001,
      0.9203489336432,
    ],
    width: 3,
    height: 3,
  }
  const out = conv2(A, B, 'same')

  t.deepEqual(out, C)
  t.end()
})

test('should generate "full" convolution by default', t => {
  const A = {
    data: [
      0.4366211,
      0.9054124,
      0.5962102,
      0.6371818,
      0.1158246,
      0.6470448,
      0.0063498,
      0.2951452,
      0.6623801,
    ],
    width: 3,
    height: 3,
  }
  const B = {
    data: [
      0.180854,
      0.650212,
      0.848889,
      0.661308,
      0.09809,
      0.877106,
      0.662927,
      0.2424,
      0.62519,
      0.318765,
      0.920264,
      0.668719,
      0.873018,
      0.264735,
      0.082795,
      0.51667,
    ],
    width: 4,
    height: 4,
  }
  const C = {
    data: [
      0.07896467241939999,
      0.4476437328628,
      1.0671798558974999,
      1.4449986797848,
      1.1048727438869999,
      0.3942785749416,
      0.1580650409562,
      0.9070254836025999,
      1.8753006290867003,
      2.1694107685774,
      1.2405807528194,
      0.5724172550784,
      0.3366206950002,
      1.3329784243407001,
      1.9677205305226,
      2.7994413827229,
      2.3686256720085,
      0.9935780074245999,
      0.7801606209038,
      1.2160740880295,
      2.1522248148631005,
      1.9755068456836002,
      1.7007216437643,
      0.9012960118852,
      0.5602410121344,
      0.45634720605080004,
      1.1623389165626001,
      0.9970991503065001,
      0.9203489336432,
      0.7772547949079,
      0.0055434896964,
      0.25934808651659996,
      0.6569307463548001,
      0.20307249377349998,
      0.20733443086349998,
      0.342231926267,
    ],
    width: 6,
    height: 6,
  }

  const outSame = conv2(A, B, 'full')
  const out = conv2(A, B)

  t.deepEqual(out, C)
  t.deepEqual(out, outSame)
  t.end()
})

test('should generate the convolution of "valid" values', t => {
  const A = {
    data: [
      0.4366211,
      0.9054124,
      0.5962102,
      0.6371818,
      0.1158246,
      0.6470448,
      0.0063498,
      0.2951452,
      0.6623801,
    ],
    width: 3,
    height: 3,
  }
  const B = {
    data: [
      0.909911,
      0.824447,
      0.880526,
      0.970307,
      0.86725,
      0.097273,
      0.075271,
      0.940705,
      0.281154,
    ],
    width: 3,
    height: 3,
  }
  const out = conv2(A, B, 'valid')

  t.equal(roundTo(out.data[0], 4), 2.6613)
  t.equal(out.height, 1)
  t.equal(out.width, 1)
  t.end()
})

test('should generate the decomposed convolution of "valid" values', t => {
  const A = {
    data: [
      0.4366211,
      0.9054124,
      0.5962102,
      0.6371818,
      0.1158246,
      0.6470448,
      0.0063498,
      0.2951452,
      0.6623801,
    ],
    width: 3,
    height: 3,
  }
  const v = {
    data: [-0.3078, -0.3844, -0.3078],
    width: 1,
    height: 3,
  }
  const h = {
    data: [-0.3078, -0.3844, -0.3078],
    width: 3,
    height: 1,
  }
  const { data } = conv2(A, v, h, 'valid')

  t.deepEqual(roundTo(data, 5), 0.47232)
  t.end()
})

test('decomposed convolutions should match the matching matrix if rank is one', t => {
  const A = {
    data: [
      0.4366211,
      0.9054124,
      0.5962102,
      0.6371818,
      0.1158246,
      0.6470448,
      0.0063498,
      0.2951452,
      0.6623801,
    ],
    width: 3,
    height: 3,
  }
  const B = {
    data: [
      0.094742,
      0.118318,
      0.094742,
      0.118318,
      0.147761,
      0.118318,
      0.094742,
      0.118318,
      0.094742,
    ],
    width: 3,
    height: 3,
  }
  // since:
  //   rank(B) === 1
  // then:
  //   [U, S, V] = svd(B)
  //   v = U(:,1) * sqrt(S(1,1))
  //   h = V(:,1)' * sqrt(S(1,1))
  const v = {
    data: [-0.3078, -0.3844, -0.3078],
    width: 1,
    height: 3,
  }
  const h = {
    data: [-0.3078, -0.3844, -0.3078],
    width: 3,
    height: 1,
  }

  const { data: out } = conv2(A, B, 'valid')
  const { data: vhOut } = conv2(A, v, h, 'valid')

  t.equal(out.height, vhOut.height)
  t.equal(out.width, vhOut.width)

  for (let i = 0; i < out.height; i++) {
    for (let j = 0; j < out.width; j++) {
      t.equal(get(out, i, j), get(vhOut, i, j))
    }
  }
  t.end()
})

test('should convolve 2 1-D kernels', t => {
  const A = {
    data: [
      0.4366211,
      0.9054124,
      0.5962102,
      0.6371818,
      0.1158246,
      0.6470448,
      0.0063498,
      0.2951452,
      0.6623801,
    ],
    width: 3,
    height: 3,
  }
  const K1 = {
    data: [
      0.0010284,
      0.0075988,
      0.0360008,
      0.1093607,
      0.2130055,
      0.2660117,
      0.2130055,
      0.1093607,
      0.0360008,
      0.0075988,
      0.0010284,
    ],
    width: 11,
    height: 1,
  }
  const K2 = transpose(K1)

  const out = conv2(A, K1, K2, 'full')
  const expected = {
    data: [
      4.6176e-7,
      4.3695e-6,
      2.3871e-5,
      8.7284e-5,
      2.1954e-4,
      3.8483e-4,
      4.7393e-4,
      4.1054e-4,
      2.4859e-4,
      1.0398e-4,
      2.961e-5,
      5.6166e-6,
      6.3053e-7,
      4.0858e-6,
      3.7388e-5,
      2.0156e-4,
      7.2595e-4,
      1.7988e-3,
      3.116e-3,
      3.8149e-3,
      3.3075e-3,
      2.0152e-3,
      8.5039e-4,
      2.4433e-4,
      4.668e-5,
      5.3433e-6,
      2.1151e-5,
      1.9102e-4,
      1.0249e-3,
      3.6709e-3,
      9.0493e-3,
      1.5626e-2,
      1.9131e-2,
      1.6643e-2,
      1.0199e-2,
      4.3319e-3,
      1.2521e-3,
      2.4038e-4,
      2.783e-5,
      7.2744e-5,
      6.4593e-4,
      3.4439e-3,
      1.2242e-2,
      2.9964e-2,
      5.1502e-2,
      6.3035e-2,
      5.5073e-2,
      3.3999e-2,
      1.4561e-2,
      4.241e-3,
      8.1913e-4,
      9.6184e-5,
      1.6754e-4,
      1.4602e-3,
      7.7354e-3,
      2.7282e-2,
      6.6318e-2,
      1.1361e-1,
      1.394e-1,
      1.2281e-1,
      7.6706e-2,
      3.3254e-2,
      9.7879e-3,
      1.9062e-3,
      2.2789e-4,
      2.5973e-4,
      2.2254e-3,
      1.1735e-2,
      4.1144e-2,
      9.9644e-2,
      1.7096e-1,
      2.1159e-1,
      1.8917e-1,
      1.2023e-1,
      5.2979e-2,
      1.5802e-2,
      3.1091e-3,
      3.7933e-4,
      2.7134e-4,
      2.2996e-3,
      1.2129e-2,
      4.2516e-2,
      1.0339e-1,
      1.7936e-1,
      2.2619e-1,
      2.0699e-1,
      1.346e-1,
      6.0462e-2,
      1.8296e-2,
      3.6397e-3,
      4.527e-4,
      1.9042e-4,
      1.6149e-3,
      8.5924e-3,
      3.041e-2,
      7.5206e-2,
      1.338e-1,
      1.7401e-1,
      1.642e-1,
      1.0956e-1,
      5.0159e-2,
      1.5379e-2,
      3.0896e-3,
      3.8999e-4,
      8.9216e-5,
      7.7042e-4,
      4.1848e-3,
      1.5153e-2,
      3.8704e-2,
      7.1625e-2,
      9.694e-2,
      9.4584e-2,
      6.4646e-2,
      3.0068e-2,
      9.3104e-3,
      1.8841e-3,
      2.3994e-4,
      2.7716e-5,
      2.4935e-4,
      1.4026e-3,
      5.2691e-3,
      1.4089e-2,
      2.7363e-2,
      3.8623e-2,
      3.8847e-2,
      2.7065e-2,
      1.2729e-2,
      3.9665e-3,
      8.0643e-4,
      1.0311e-4,
      5.676e-6,
      5.473e-5,
      3.2342e-4,
      1.2746e-3,
      3.5933e-3,
      7.3299e-3,
      1.0741e-2,
      1.1067e-2,
      7.8161e-3,
      3.7023e-3,
      1.1577e-3,
      2.3601e-4,
      3.021e-5,
      7.2348e-7,
      7.7747e-6,
      4.9135e-5,
      2.0527e-4,
      6.133e-4,
      1.3134e-3,
      1.992e-3,
      2.0959e-3,
      1.4975e-3,
      7.1359e-4,
      2.2383e-4,
      4.5732e-5,
      5.8604e-6,
      6.7153e-9,
      3.6176e-7,
      3.242e-6,
      1.6817e-5,
      5.9107e-5,
      1.4088e-4,
      2.2723e-4,
      2.4657e-4,
      1.7852e-4,
      8.5471e-5,
      2.6836e-5,
      5.4882e-6,
      7.0051e-7,
    ],
    width: 13,
    height: 13,
  }

  t.equal(out.height, expected.height)
  t.equal(out.width, expected.width)

  let isMatch = true

  for (let i = 0; i < out.height; i++) {
    for (let j = 0; j < out.width; j++) {
      if (get(out, i, j) !== get(expected, i, j)) {
        isMatch = false
      }
    }
  }
  t.equal(isMatch, true, 'Results do not match')
  t.end()
})

test('decomposed convolutions should default to "full"', t => {
  const A = {
    data: [
      0.4366211,
      0.9054124,
      0.5962102,
      0.6371818,
      0.1158246,
      0.6470448,
      0.0063498,
      0.2951452,
      0.6623801,
    ],
    width: 3,
    height: 3,
  }
  const v = {
    data: [-0.3078, -0.3844, -0.3078],
    width: 1,
    height: 3,
  }
  const h = {
    data: [-0.3078, -0.3844, -0.3078],
    width: 3,
    height: 1,
  }

  const { data: fullOut } = conv2(A, v, h, 'full')
  const { data: defaultOut } = conv2(A, v, h)

  t.deepEqual(defaultOut, fullOut)
  t.end()
})

test('convolutions with box kernels should default to "full"', t => {
  const A = {
    data: [
      0.4366211,
      0.9054124,
      0.5962102,
      0.6371818,
      0.1158246,
      0.6470448,
      0.0063498,
      0.2951452,
      0.6623801,
    ],
    width: 3,
    height: 3,
  }
  const B = ones(3)
  const { data: fullOut } = conv2(A, B, 'full')
  const { data: defaultOut } = conv2(A, B)

  t.deepEqual(defaultOut, fullOut)
  t.end()
})
