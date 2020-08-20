import { Options } from './types'

export const defaults: Options = {
  windowSize: 11,
  k1: 0.01,
  k2: 0.03,
  bitDepth: 8,
  downsample: 'original',
  ssim: 'fast',
  maxSize: 256,
}
