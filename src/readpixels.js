const fs = require("fs");
const http = require("https");
const Canvas = require("canvas");
const imageType = require("image-type");
const bmp = require("bmp-js");
const { getLimitDimensions } = require("./util");

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
function parse(data, limit) {
  const { ext } = imageType(data);

  return new Promise((resolve, reject) => {
    if (ext === "bmp") {
      resolve(bmp.decode(data));
    } else {
      const img = new Canvas.Image();

      img.onload = () => {
        const { width, height } = getLimitDimensions(
          img.width,
          img.height,
          limit
        );
        const canvas = new Canvas(width, height);
        const ctx = canvas.getContext("2d");

        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, width, height);

        const imageData = ctx.getImageData(0, 0, width, height);

        resolve(imageData);
      };
      img.onerror = reject;

      img.src = data;
    }
  });
}

/**
 * Reads image data from a url and returns it
 *
 * @method loadUrl
 * @param {string} url - url to load image data from
 * @param {function} P - The Promise definition, must be a valid Promises/A+ implementation
 * @returns {Promise} promise - A promise that resolves with the image 3D matrix
 * @private
 * @memberOf readpixels
 * @since 0.0.1
 */
function loadUrl(url, P) {
  return new P((resolve, reject) => {
    http
      .get(url)
      .on("response", res => {
        const chunks = [];

        res.on("data", data => chunks.push(data));
        res.on("end", () => resolve(Buffer.concat(chunks)));
      })
      .on("error", reject);
  });
}

/**
 * Reads image data from the file system and returns it
 *
 * @method loadFs
 * @param {string} path - File path to load image data from
 * @param {function} P - The Promise definition, must be a valid Promises/A+ implementation
 * @returns {Promise} promise - A promise that resolves with the image 3D matrix
 * @private
 * @memberOf readpixels
 * @since 0.0.1
 */
function loadFs(path, P) {
  return new P((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(data);
    });
  });
}

/**
 * Reads image data from the input and returns it
 *
 * @method readpixels
 * @param {string|Buffer} url - A url, file path or buffer to use to load the image data
 * @param {function} P - The Promise definition, must be a valid Promises/A+ implementation
 * @param {number} [limit=0] - A limit that, if set and both dimensions (width / height) surpass it,
 * will downsize the image to that size on the smallest dimension.
 * @returns {Promise} promise - A promise that resolves with the image 3D matrix
 * @public
 * @memberOf readpixels
 * @since 0.0.1
 */
function readpixels(url, P, limit = 0) {
  let bufferPromise;

  if (Buffer.isBuffer(url)) {
    bufferPromise = P.resolve(url);
  } else if (url.indexOf("http://") === 0 || url.indexOf("https://") === 0) {
    bufferPromise = loadUrl(url, P);
  } else {
    bufferPromise = loadFs(url, P);
  }
  return bufferPromise.then(bufferData => parse(bufferData, limit));
}

/**
 * Image loading logic
 *
 * @namespace readpixels
 */
module.exports = {
  readpixels
};
