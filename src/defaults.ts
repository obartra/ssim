import { Options } from './types'

export const defaults: Options = {
  windowSize: 11,
  k1: 0.01,
  k2: 0.03,
  bitDepth: 8,
  downsample: 'original',
  ssim: 'weber',
  maxSize: 256,
  rgb2grayVersion: 'integer',
}
