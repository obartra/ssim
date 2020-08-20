import { Options } from '../../src/types'
import { mean2d } from '../../src/math'
import { defaults } from '../../src/defaults'
import { bezkrovnySsim as ssim } from '../../src/bezkrovnySsim'
import { roundTo } from '../helpers/round'
import { samples, sampleCsv } from '../helpers/matrices'

describe('bezkrovnySsim', () => {
  let options: Options
  let k0Options: Options

  beforeEach(() => {
    options = { ...defaults }
    k0Options = { ...defaults, k1: 0, k2: 0 }
  })
  test("should return same results than Bezkrovny's implementation", () => {
    const A = samples['24x18'].gray
    const B = samples['24x18-degraded'].gray
    const ssimMap = ssim(A, B, options)

    expect(roundTo(mean2d(ssimMap), 5)).toBe(0.86598)
  })

  test("should return same results than than Bezkrovny's implementation when k1 / k2 are 0", () => {
    const A = samples['24x18'].gray
    const B = samples['24x18-degraded'].gray
    const ssimMap = ssim(A, B, k0Options)

    expect(roundTo(mean2d(ssimMap), 5)).toBe(0.86284)
  })

  test("UQI should match Bezkrovny's implementation results", () => {
    const uqiMap = ssim(sampleCsv.lena, sampleCsv.lena02876, k0Options)
    expect(roundTo(mean2d(uqiMap), 5)).toBe(0.35528)
  })

  test('should calculate width and height properly according to window size', () => {
    const primeWindowSize = 13
    expect(sampleCsv.lena.width % primeWindowSize).toBeGreaterThan(0)
    expect(sampleCsv.lena.height % primeWindowSize).toBeGreaterThan(0)
    const properWidth = Math.ceil(sampleCsv.lena.width / primeWindowSize)
    const properHeight = Math.ceil(sampleCsv.lena.height / primeWindowSize)
    const uqiMap = ssim(sampleCsv.lena, sampleCsv.lena02876, {
      ...k0Options,
      windowSize: primeWindowSize,
    })
    expect(uqiMap.data).toHaveLength(properWidth * properHeight)
  })
})
