import { filter2 } from '../../../src/matlab/filter2'
import { conv2 } from '../../../src/matlab/conv2'
import { round } from '../../helpers/round'
import { samples } from '../../helpers/matrices'

describe('filter2', () => {
  test('should rotate 180 and generate the convolution', () => {
    const out = filter2(
      samples['11x11'].window,
      samples['11x11'].gray,
      'valid'
    ).data.map(round)

    expect(out).toEqual(samples['11x11'].conv2.data)
  })

  test('should rotate180 images with different dimensions', () => {
    const out = filter2(
      samples['24x18'].window,
      samples['24x18'].gray,
      'valid'
    ).data.map(round)

    expect(out).toEqual(samples['24x18'].conv2.data)
  })

  test('should match Mattlab filter2', () => {
    const mx = {
      data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6],
      width: 4,
      height: 4,
    }
    const f = {
      data: [0, 1, 1, 0],
      width: 2,
      height: 2,
    }
    const C = {
      data: [
        0,
        1,
        2,
        3,
        4,
        1,
        7,
        9,
        11,
        8,
        5,
        15,
        7,
        9,
        2,
        9,
        3,
        5,
        7,
        6,
        3,
        4,
        5,
        6,
        0,
      ],
      width: 5,
      height: 5,
    }
    const filter = filter2(f, mx, 'full')

    expect(filter).toEqual(C)
  })

  test('filter2 should match conv2 for symmetric filters', () => {
    const mx = {
      data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6],
      width: 4,
      height: 4,
    }
    const f = {
      data: [0, 1, 1, 0],
      width: 2,
      height: 2,
    }
    const filterF = filter2(f, mx, 'full')
    const convF = conv2(mx, f, 'full')

    const filterS = filter2(f, mx, 'same')
    const convS = conv2(mx, f, 'same')

    const filterV = filter2(f, mx, 'valid')
    const convV = conv2(mx, f, 'valid')

    expect(filterF).toEqual(convF)
    expect(filterS).toEqual(convS)
    expect(filterV).toEqual(convV)
  })

  test('filter2 shape should default to "same"', () => {
    const mx = {
      data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6],
      width: 4,
      height: 4,
    }
    const f = {
      data: [0, 1, 1, 0],
      width: 2,
      height: 2,
    }
    const filterDefault = filter2(f, mx)
    const filterSame = filter2(f, mx, 'same')

    expect(filterDefault).toEqual(filterSame)
  })
})
