import { imfilter } from '../../../src/matlab/imfilter'

describe('imfilter', () => {
  test('should match Matlab symmetric, same imfilter', () => {
    const A = {
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
      data: [2, 3, 5, 7, 6, 7, 9, 11, 14, 15, 7, 9, 12, 3, 5, 7],
      width: 4,
      height: 4,
    }

    expect(imfilter(A, f)).toEqual(C)
  })

  test('should return a matrix of the same dimensions when resSize is "same"', () => {
    const A = {
      data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6],
      width: 4,
      height: 4,
    }
    const B = {
      data: [1, 2, 3, 5, 6, 7, 9, 0, 1, 3, 4, 5],
      width: 3,
      height: 4,
    }
    const C = {
      data: [1, 2, 3, 5, 6, 7, 9, 0, 1],
      width: 3,
      height: 3,
    }
    const f = {
      data: [0, 1, 1, 0],
      width: 2,
      height: 2,
    }

    const imfilter1 = imfilter(A, f)
    const imfilter2 = imfilter(B, f)
    const imfilter3 = imfilter(C, f)

    expect(imfilter1.height).toEqual(A.height)
    expect(imfilter1.width).toEqual(A.width)
    expect(imfilter2.height).toEqual(B.height)
    expect(imfilter2.width).toEqual(B.width)
    expect(imfilter3.height).toEqual(C.height)
    expect(imfilter3.width).toEqual(C.width)
  })

  test('should produce the same output when resSize is "same", "valid" and omitted', () => {
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
      data: [2, 3, 5, 7, 6, 7, 9, 11, 14, 15, 7, 9, 12, 3, 5, 7],
      width: 4,
      height: 4,
    }

    expect(imfilter(mx, f)).toEqual(C)
    expect(imfilter(mx, f, 'symmetric')).toEqual(C)
    expect(imfilter(mx, f, 'symmetric', 'same')).toEqual(C)
    expect(imfilter(mx, f, 'symmetric', 'valid')).toEqual(C)
  })

  test('should produce different resSize is "same" from when it is "full"', () => {
    const A = {
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
      data: [2, 3, 5, 7, 6, 7, 9, 11, 14, 15, 7, 9, 12, 3, 5, 7],
      width: 4,
      height: 4,
    }

    expect(imfilter(A, f, 'symmetric', 'same')).toEqual(C)
    expect(imfilter(A, f, 'symmetric', 'full')).not.toEqual(
      imfilter(A, f, 'symmetric', 'same')
    )
  })

  test('should not remove the last row when the number of rows is odd', () => {
    const A = {
      data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2],
      width: 4,
      height: 3,
    }
    const f = {
      data: [0, 1, 1, 0],
      width: 2,
      height: 2,
    }

    expect(imfilter(A, f).height).toEqual(3)
  })

  test('should not remove the last column when the number of columns is odd', () => {
    const A = {
      data: [1, 2, 3, 5, 6, 7, 9, 0, 1, 12, 3, 5],
      width: 3,
      height: 4,
    }
    const f = {
      data: [0, 1, 1, 0],
      width: 2,
      height: 2,
    }

    expect(imfilter(A, f).width).toEqual(3)
  })
})
