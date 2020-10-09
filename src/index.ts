/**
 * SSIM External API
 *
 * @module main
 */
import { rgb2gray, rgb2grayInteger } from './matlab'
import { mean2d } from './math'
import { ssim as fastSsim } from './ssim'
import { originalSsim } from './originalSsim'
import { bezkrovnySsim } from './bezkrovnySsim'
import { downsample } from './downsample'
import { defaults } from './defaults'
import {
  Options,
  Images,
  Matrices,
  Matrix,
  MSSIMMatrix,
  ImageData,
} from './types'
import { weberSsim } from './weberSsim'

export { Options, Matrix }

const ssimTargets = {
  fast: fastSsim,
  original: originalSsim,
  bezkrovny: bezkrovnySsim,
  weber: weberSsim,
}

function validateOptions(options: Options) {
  Object.keys(options).forEach((option) => {
    if (!(option in defaults)) {
      throw new Error(`"${option}" is not a valid option`)
    }
  })
  if ('k1' in options && (typeof options.k1 !== 'number' || options.k1 < 0)) {
    throw new Error(`Invalid k1 value. Default is ${defaults.k1}`)
  }
  if ('k2' in options && (typeof options.k2 !== 'number' || options.k2 < 0)) {
    throw new Error(`Invalid k2 value. Default is ${defaults.k2}`)
  }
  if (!(options.ssim in ssimTargets)) {
    throw new Error(
      `Invalid ssim option (use: ${Object.keys(ssimTargets).join(', ')})`
    )
  }
}

export function getOptions(userOptions?: Partial<Options>): Options {
  const options = { ...defaults, ...userOptions }

  validateOptions(options)

  return options
}

function validateDimensions([pixels1, pixels2, options]: Images): Images {
  if (pixels1.width !== pixels2.width || pixels1.height !== pixels2.height) {
    throw new Error('Image dimensions do not match')
  }

  return [pixels1, pixels2, options]
}

function toGrayScale([pixels1, pixels2, options]: Images): Matrices {
  if (options.rgb2grayVersion === 'original') {
    return [rgb2gray(pixels1), rgb2gray(pixels2), options]
  } else {
    return [rgb2grayInteger(pixels1), rgb2grayInteger(pixels2), options]
  }
}

function toResize([pixels1, pixels2, options]: Matrices): Matrices {
  const pixels = downsample([pixels1, pixels2], options)

  return [pixels[0], pixels[1], options]
}

function comparison([pixels1, pixels2, options]: Matrices): Matrix {
  return ssimTargets[options.ssim](pixels1, pixels2, options)
}

/**
 * @method ssim - The ssim method. You can call the package directly or through the `ssim` property.
 * @public
 * @example import mod = from 'ssim.js';
 * mod(imgBuffer1, imgBuffer2);
 * mod.ssim(imgBuffer1, imgBuffer2);
 */
export function ssim(
  image1: ImageData,
  image2: ImageData,
  userOptions?: Partial<Options>
): {
  ssim_map: Matrix
  mssim: number
  performance: number
} {
  const start = new Date().getTime()
  const options = getOptions(userOptions)
  const ssimMap = comparison(
    toResize(toGrayScale(validateDimensions([image1, image2, options])))
  )
  const mssim =
    (ssimMap as MSSIMMatrix).mssim !== undefined
      ? (ssimMap as MSSIMMatrix).mssim
      : mean2d(ssimMap)
  return {
    mssim,
    ssim_map: ssimMap,
    performance: new Date().getTime() - start,
  }
}

export default ssim
