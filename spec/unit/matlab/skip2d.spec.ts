import { skip2d } from '../../../src/matlab/skip2d'

describe('skip2d', () => {
  test('should get a window of a matrix', () => {
    const w = skip2d(
      {
        data: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        width: 3,
        height: 3,
      },
      [1, 1, 2],
      [1, 1, 2]
    )

    expect(w.data).toEqual([5])
  })

  test('should skip every n elements for the new matrix', () => {
    const w = skip2d(
      {
        data: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        width: 3,
        height: 3,
      },
      [0, 2, 3],
      [0, 2, 3]
    )

    expect(w).toEqual({ data: [1, 3, 7, 9], width: 2, height: 2 })
  })
})
