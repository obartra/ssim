/**
 * Implements Dan Weber's ssim-specific logic.
 *
 * @namespace weberSsim
 */
import { ImageMatrix, MSSIMMatrix, Options } from './types'

export function weberSumMatrix(pImgData1: any, pImgData2: any, width: number, height: number) {
  const pSumArray = new Array(5 * width * height);
  for (let h = 0; h < height; ++h) {
    let lastValX = 0;
    let lastValY = 0;
    let lastValXX = 0;
    let lastValYY = 0;
    let lastValXY = 0;
    for (let w = 0; w < width; ++w) {
      const imgValX = pImgData1[h * width + w];
      const newValX = lastValX + imgValX;
      const newValXX = lastValXX + imgValX * imgValX;
      const imgValY = pImgData2[h * width + w];
      const newValY = lastValY + imgValY;
      const newValYY = lastValYY + imgValY * imgValY;
      const newValXY = lastValXY + imgValX * imgValY;
      pSumArray[h * width + w] = newValX;
      pSumArray[width * height + h * width + w] = newValY;
      pSumArray[2 * width * height + h * width + w] = newValXX;

      pSumArray[3 * width * height + h * width + w] = newValYY;
      pSumArray[4 * width * height + h * width + w] = newValXY;
      lastValX = newValX;
      lastValXX = newValXX;
      lastValY = newValY;
      lastValYY = newValYY;
      lastValXY = newValXY;
    }
  }

  for (let i = 0; i < 5; ++i) {
    for (let h = 0; h + 1 < height; ++h) {
      for (let w = 0; w < width; ++w) {
        let above = pSumArray[i * width * height + h * width + w];
        let current = pSumArray[i * width * height + (h + 1) * width + w];
        pSumArray[i * width * height + (h + 1) * width + w] = above + current;
      }
    }
  }

  return pSumArray;
}


/**
 * Generates a SSIM map based on two input image matrices.
 * Weber SSIM is an SSIM algorithm that operates in linear time by building
 * partial sum arrays of values, variances, and covariances, making each lookup
 * performable in constant time and each variance calculation, only performed
 * once.
 *
 * Images must be a 2-Dimensional grayscale image.
 *
 * @method weberSsim
 * @param {ImageMatrix} pixels1 - The reference matrix
 * @param {ImageMatrix} pixels2 - The second matrix to compare against
 * @param {Options} options - The input options parameter
 * @returns {ImageMatrix} ssim_map - A matrix containing the map of computed
 * SSIMs
 * @public
 * @memberOf weberSsim
 */
export function weberSsim(
  pixels1: ImageMatrix,
  pixels2: ImageMatrix,
  options: Options
): MSSIMMatrix {
  // console.time("weber ssim");
  const { bitDepth, k1, k2, windowSize} = options
  const L = (1 << bitDepth) - 1
  const c1 = k1 * L * (k1 * L)
  const c2 = k2 * L * (k2 * L)
  const windowSquared = windowSize * windowSize
  const pixels1Data = pixels1.data;
  const pixels2Data = pixels2.data;
  const width = pixels1.width;
  const height = pixels1.height;
  const sumMatrix = weberSumMatrix(pixels1Data, pixels2Data, width, height);
  const windowHeight = height-windowSize+1;
  const windowWidth = width-windowSize+1;
  const imageSize = width*height;
  // let mssim = 0
  const ssims = new Array(windowHeight*windowWidth);


  // lets handle w = 0 h = 0 first and initialize mssim

  let cumulativeSsim;
  const reciprocalWindowSquared =  1 / windowSquared;
  {
    const windowOffset = windowSize - 1;
    let bottomOffset = windowOffset*width;
    {
      const meanx = (sumMatrix[bottomOffset+ windowOffset]) * reciprocalWindowSquared;
      const meany = (
        sumMatrix[imageSize + bottomOffset+ windowOffset]) * reciprocalWindowSquared;
      const varx = (
        sumMatrix[2*imageSize + bottomOffset+ windowOffset]) * reciprocalWindowSquared - meanx*meanx ;
      const vary = (
        sumMatrix[3*imageSize + bottomOffset+ windowOffset])  * reciprocalWindowSquared - meany*meany;
      const cov = (
        sumMatrix[4*imageSize + bottomOffset+ windowOffset])  * reciprocalWindowSquared - meanx*meany;
      const na = 2 * meanx * meany + c1
      const nb = 2 * cov + c2
      const da = meanx * meanx + meany * meany + c1
      const db = varx + vary + c2
      const ssim = (na * nb) / (da * db)
      ssims[0] = ssim
      // mssim = ssim
      cumulativeSsim = ssim;
    }



    // next handle all of the h = 0, w > 0 cases first
    for (let w = 1; w <  windowWidth; ++w) {
      // in h =0 cases, there is no top left or top right
      let leftOffset = w - 1;
      const rightx = sumMatrix[bottomOffset+leftOffset];
      const leftx = sumMatrix[bottomOffset+(windowOffset+w)];
      const meanx = (leftx-rightx)* reciprocalWindowSquared;
      const righty= sumMatrix[imageSize + bottomOffset+ leftOffset];
      const lefty = sumMatrix[imageSize + bottomOffset+ (windowOffset+w)];
      const meany = (lefty-righty) * reciprocalWindowSquared;
      const rightxx = sumMatrix[2*imageSize + bottomOffset+leftOffset];
      const leftxx = sumMatrix[2*imageSize + bottomOffset+ (windowOffset+w)];
      const varx = (leftxx-rightxx) * reciprocalWindowSquared - meanx*meanx ;
      const rightyy = sumMatrix[3*imageSize + bottomOffset+leftOffset];
      const leftyy = sumMatrix[3*imageSize + bottomOffset+ (windowOffset+w)]
      const vary = (leftyy - rightyy)  * reciprocalWindowSquared - meany*meany;
      const rightxy = sumMatrix[4*imageSize + bottomOffset+leftOffset];
      const leftxy = sumMatrix[4*imageSize + bottomOffset+ (windowOffset+w)];
      const cov = (leftxy-rightxy)  * reciprocalWindowSquared - meanx*meany;
      const na = 2 * meanx * meany + c1
      const nb = 2 * cov + c2
      const da = meanx * meanx + meany * meany + c1
      const db = varx + vary + c2
      const ssim = (na * nb) / (da *db)
      ssims[w] = ssim
      cumulativeSsim += ssim;
    }
  }

  const windowOffset = windowSize - 1;
  // There will be lots of branch misses if we don't split the w==0 and h==0 cases
  for (let h = 1; h < windowHeight; ++h) {
    // now the w=0 on each line
    let bottomOffset = (h+windowSize-1)*width;
    let topOffset = (h-1)*width;
    {
      // since there is no left side we can skip two operations
      const topx = sumMatrix[topOffset+ windowOffset];
      const bottomx = sumMatrix[bottomOffset+ windowOffset];
      const meanx = (bottomx - topx) * reciprocalWindowSquared;
      const topy = sumMatrix[imageSize + topOffset+ windowOffset];
      const bottomy = sumMatrix[imageSize + bottomOffset+ windowOffset];
      const meany = (bottomy - topy) * reciprocalWindowSquared;
      const topxx = sumMatrix[2*imageSize + topOffset+ windowOffset];
      const bottomxx = sumMatrix[2*imageSize + bottomOffset+ windowOffset];
      const varx = (bottomxx-topxx)  * reciprocalWindowSquared - meanx*meanx ;
      const topyy = sumMatrix[3*imageSize + topOffset+ windowOffset];
      const bottomyy = sumMatrix[3*imageSize + bottomOffset+ windowOffset];
      const vary = (bottomyy-topyy)  * reciprocalWindowSquared - meany*meany;
      const topxy = sumMatrix[4*imageSize + topOffset+ windowOffset];
      const bottomxy = sumMatrix[4*imageSize + bottomOffset+ windowOffset];
      const cov = (bottomxy-topxy)  * reciprocalWindowSquared - meanx*meany;
      const na = 2 * meanx * meany + c1
      const nb = 2 * cov + c2
      const da = meanx * meanx + meany * meany + c1
      const db = varx + vary + c2
      const ssim = (na * nb) / (da *db)
      ssims[h*windowWidth] = ssim
      cumulativeSsim += ssim;
    }


    for (let w = 1; w < windowWidth; ++w) {
      // add top left sub top right sub bottom left add bottom right
      const rightOffset = w + windowSize - 1;
      const leftOffset = w - 1;
      const meanx = (sumMatrix[topOffset + leftOffset]
        - sumMatrix[topOffset+ rightOffset]
        - sumMatrix[bottomOffset+leftOffset]
        + sumMatrix[bottomOffset+ rightOffset]) * reciprocalWindowSquared;
      const meany = (sumMatrix[imageSize+ topOffset + leftOffset]
        - sumMatrix[imageSize + topOffset+ rightOffset]
        - sumMatrix[imageSize + bottomOffset+leftOffset]
        + sumMatrix[imageSize + bottomOffset+ rightOffset]) * reciprocalWindowSquared;
      const varx = (sumMatrix[2*imageSize+ topOffset + leftOffset]
        - sumMatrix[2*imageSize + topOffset+ rightOffset]
        - sumMatrix[2*imageSize + bottomOffset+leftOffset]
        + sumMatrix[2*imageSize + bottomOffset+ rightOffset]) * reciprocalWindowSquared - meanx*meanx ;
      const vary = (sumMatrix[3*imageSize+ topOffset + leftOffset]
        - sumMatrix[3*imageSize + topOffset+ rightOffset]
        - sumMatrix[3*imageSize + bottomOffset+leftOffset]
        + sumMatrix[3*imageSize + bottomOffset+ rightOffset])  * reciprocalWindowSquared - meany*meany;
      const cov = (sumMatrix[4*imageSize+ topOffset + leftOffset]
        - sumMatrix[4*imageSize + topOffset+ rightOffset]
        - sumMatrix[4*imageSize + bottomOffset+leftOffset]
        + sumMatrix[4*imageSize + bottomOffset+ rightOffset])  * reciprocalWindowSquared - meanx*meany;
      const na = 2 * meanx * meany + c1
      const nb = 2 * cov + c2
      const da = meanx * meanx + meany * meany + c1
      const db = varx + vary + c2
      const ssim = (na * nb) / (da * db)
      ssims[h*windowWidth+w] = ssim
      cumulativeSsim += ssim;
    }
  }
  const mssim = cumulativeSsim / (windowHeight*windowWidth);


  // console.timeEnd("weber ssim");
  return { data: ssims, width, height, mssim }
}
