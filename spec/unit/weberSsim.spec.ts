import { Options } from '../../src/types'
import { mean2d } from '../../src/math'
import { defaults } from '../../src/defaults'
import { roundTo } from '../helpers/round'
import { sampleCsv, samples } from '../helpers/matrices'
import { weberSsim } from '../../src/weberSsim'

const testDataImg = {
  width: 4,
  height: 4,
  data: [
    0x10,
    0x20,
    0x30,
    0x40,
    0x50,
    0x60,
    0x70,
    0x80,
    0x90,
    0xa0,
    0xb0,
    0xc0,
    0xd0,
    0xe0,
    0xf0,
    0xff,
  ],
}
const testDataImg2 = {
  width: 4,
  height: 4,
  data: [
    0x0c,
    0x1c,
    0x2c,
    0x3c,
    0x4c,
    0x5c,
    0x6c,
    0x7c,
    0x8c,
    0x9c,
    0xac,
    0xbc,
    0xcc,
    0xdc,
    0xec,
    0xfc,
  ],
}

describe('weberSsim', () => {
  let options: Options
  let k0Options: Options

  beforeEach(() => {
    options = { ...defaults, ssim: 'weber' }
    k0Options = { ...defaults, ssim: 'weber', k1: 0, k2: 0 }
  })

  test("should return same results than Webers's implementation", () => {
    const A = samples['24x18'].gray
    const B = samples['24x18-degraded'].gray
    const ssimMap = weberSsim(A, B, options)
    expect(roundTo(mean2d(ssimMap), 5)).toMatchInlineSnapshot(`0.56119`)
  })

  test('rolling ssim mssim should be the same as mean2d ssim', () => {
    const A = sampleCsv.lena
    const B = sampleCsv.lena02876
    const ssimMap = weberSsim(A, B, options)
    expect(roundTo(mean2d(ssimMap), 5)).toMatchInlineSnapshot(`0.67643`)
    expect(roundTo(ssimMap.mssim, 5)).toMatchInlineSnapshot(`0.67643`)
  })

  test('24x18 test when k1 / k2 are 0', () => {
    const A = samples['24x18'].gray
    const B = samples['24x18-degraded'].gray
    const ssimMap = weberSsim(A, B, k0Options)
    expect(ssimMap.mssim).toMatchInlineSnapshot(`0.5533214496932441`)
    expect(mean2d(ssimMap)).toMatchInlineSnapshot(`0.5533214496932441`)
  })

  test('24x18 test with regular options', () => {
    const A = samples['24x18'].gray
    const B = samples['24x18-degraded'].gray
    const ssimMap = weberSsim(A, B, options)
    expect(ssimMap.mssim).toMatchInlineSnapshot(`0.561185528617847`)
    expect(mean2d(ssimMap)).toMatchInlineSnapshot(`0.561185528617847`)
  })
})
