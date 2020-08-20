import * as matlab from '../../src/matlab'

const methods: Array<keyof typeof matlab> = [
  'conv2',
  'filter2',
  'fspecial',
  'imfilter',
  'normpdf',
  'ones',
  'padarray',
  'rgb2gray',
  'skip2d',
  'transpose',
  'zeros',
]

describe('matlab', () => {
  test('should expose matlab related methods', () => {
    expect(matlab).toEqual(expect.any(Object))

    methods.forEach((method) =>
      expect(matlab[method]).toEqual(expect.any(Function))
    )
  })
})
