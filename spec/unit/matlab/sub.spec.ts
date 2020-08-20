import { Matrix } from '../../../src'
import { sub } from '../../../src/matlab/sub'

const obj: Matrix = {
  data: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26],
  width: 4,
  height: 4,
}

describe('sub', () => {
  test('should retrieve a subwindow from a matrix', () => {
    const { width, height, data } = sub(obj, 0, 1, 0, 1)

    expect(height).toBe(1)
    expect(width).toBe(1)
    expect(data).toEqual([11])
  })

  test('should retrieve a subwindow of any size with any offset', () => {
    const { width, height, data } = sub(obj, 0, 2, 2, 1)

    expect(height).toBe(2)
    expect(width).toBe(1)
    expect(data).toEqual([19, 23])
  })
})
