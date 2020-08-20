import fs from 'fs'
import http from 'https'
import Canvas from 'canvas'
import imageType from 'image-type'
import bmp from 'bmp-js'

/**
 * If `limit` is set, it will return proportional dimensions to `width` and `height` with the
 * smallest dimesion limited to `limit`.
 *
 * @method getLimitDimensions
 * @param {number} width - The input width size, in pixels
 * @param {number} height - The input height size, in pixels
 * @param {number} [limit] - A limit that, if set and both dimensions (width / height) surpass it,
 * will downsize the image to that size on the smallest dimension.
 * @returns {Object} dimensions - A key value pair containing the width / height to use, downsized
 * when appropriate
 * @memberOf util
 * @since 0.0.4
 */
export function getLimitDimensions(
  width: number,
  height: number,
  limit?: number
) {
  if (limit && width >= limit && height >= limit) {
    const ratio = width / height

    if (ratio > 1) {
      return { height: limit, width: Math.round(limit / ratio) }
    }
    return { height: Math.round(limit * ratio), width: limit }
  }
  return { width, height }
}

/**
 * Parses the buffer data and returns it. If `limit` is set, it will make sure the smallest dimesion
 * will at most be of size `limit`.
 *
 * @method parse
 * @param {Buffer} data - The input image buffer data
 * @param {number} [limit] - A limit that, if set and both dimensions (width / height) surpass it,
 * will downsize the image to that size on the smallest dimension.
 * @returns {Promise} promise - A promise that resolves in an object containing the image 3d matrix
 * @private
 * @memberOf readpixels
 * @since 0.0.1
 */
function parse(data: Buffer, limit: number): Promise<ImageData> {
  const { ext = '' } = imageType(data) || {}

  return new Promise((resolve, reject) => {
    if (ext === 'bmp') {
      resolve(bmp.decode(data))
    } else {
      Canvas.loadImage(data)
        .then((img) => {
          const { width, height } = getLimitDimensions(
            img.width,
            img.height,
            limit
          )
          const canvas = Canvas.createCanvas(width, height)
          const ctx = canvas.getContext('2d')

          ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, width, height)

          return ctx.getImageData(0, 0, width, height)
        })
        .then(resolve)
        .catch(reject)
    }
  })
}

function loadUrl(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    http
      .get(url)
      .on('response', (res) => {
        const chunks: Buffer[] = []

        res.on('data', (data) => chunks.push(data))
        res.on('end', () => {
          resolve(Buffer.concat(chunks))
        })
      })
      .on('error', reject)
  })
}

function loadFs(path: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) {
        reject(err)
        return
      }

      resolve(data)
    })
  })
}

export function readpixels(
  url: string | Buffer,
  limit = 0
): Promise<ImageData> {
  let bufferPromise

  if (Buffer.isBuffer(url)) {
    bufferPromise = Promise.resolve(url)
  } else if (typeof url === 'string' && url.startsWith('http')) {
    bufferPromise = loadUrl(url)
  } else if (typeof url === 'string') {
    bufferPromise = loadFs(url)
  } else {
    throw new Error('Invalid format used')
  }
  return bufferPromise.then((bufferData) => parse(bufferData, limit))
}
