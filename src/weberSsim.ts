/**
 * Implements Dan Weber's ssim-specific logic.
 * Copyright (c) 2020 Dan Weber <dan@notatypical.agency>
 *
 * @namespace weberSsim
 */


import { ImageMatrix, MSSIMMatrix, Options } from "./types";

// For storage in case we determine Uint32Arrays do not provide enough speed or precision.
// function edgeHandler(w: number, width: number, h: number, height: number, sumArray: Array<any>, matrixWidth: number) {
//   const isRightEdge = w == width - 1;
//   const isBottomEdge = h == height - 1;
//   if (isRightEdge && isBottomEdge) {
//     sumArray[(h + 1) * matrixWidth + w + 1] = 0;
//
//   }
//   if (isRightEdge) {
//     sumArray[h * matrixWidth + w + 1] = 0;
//   }
//   if (isBottomEdge) {
//     sumArray[(h + 1) * matrixWidth + w] = 0;
//   }
//
//   const rightEdge = sumArray[h * matrixWidth + w + 1];
//   const bottomEdge = sumArray[(h + 1) * matrixWidth + w];
//   const bottomRightEdge = sumArray[(h + 1) * matrixWidth + w + 1];
//   return { rightEdge, bottomEdge, bottomRightEdge };
// }

function edgeHandler(w: number, width: number, h: number, height: number, sumArray: any, matrixWidth: number) {
  const rightEdge = sumArray[h * matrixWidth + w + 1];
  const bottomEdge = sumArray[(h + 1) * matrixWidth + w];
  const bottomRightEdge = sumArray[(h + 1) * matrixWidth + w + 1];
  return { rightEdge, bottomEdge, bottomRightEdge };
}

export function partialSumMatrix1(pixels: ImageMatrix, f: (v: number, x: number, y: number) => number) {
  // console.time("partialSumMatrix1");
  const {width, height, data} = pixels;
  const matrixWidth = width+1;
  const matrixHeight = height+1;
  // Javascript defaults to zeroing the array
  // testing should be done to determine if a benefit is acheived by using a uint32array
  const sumArray = new Int32Array(matrixWidth*matrixHeight);
  for (let h = height-1; h >= 0; --h) {
    for (let w = width-1; w >= 0; --w) {
      const { rightEdge, bottomEdge, bottomRightEdge } = edgeHandler(w, width, h, height, sumArray, matrixWidth);

      sumArray[h*matrixWidth+w] = f(data[h*width+w], w,h) + rightEdge
         + bottomEdge - bottomRightEdge;
    }
  }
  // console.timeEnd("partialSumMatrix1");
  return { data: sumArray, height: matrixHeight, width: matrixWidth };
}



export function partialSumMatrix2(pixels1: ImageMatrix, pixels2: ImageMatrix, f: (a: number, b: number, x: number, y: number) => number) {
  // console.time("partialSumMatrix2");
  const {width, height, data: data1} = pixels1;
  const {data: data2} = pixels2;
  const matrixWidth = width+1;
  const matrixHeight = height+1;
  // Javascript defaults to zeroing the array
  // testing should be done to determine if a benefit is acheived by using a uint32array
  const sumArray = new Int32Array(matrixWidth*matrixHeight);
  for (let h = height-1; h >= 0; --h) {
    for (let w = width-1; w >= 0; --w) {
      const { rightEdge, bottomEdge, bottomRightEdge } = edgeHandler(w, width, h, height, sumArray, matrixWidth);
      const offset = h*width+w;
      sumArray[h*matrixWidth+w] = f(data1[offset],data2[offset],w,h) + rightEdge
        + bottomEdge - bottomRightEdge;
    }
  }
  // console.timeEnd("partialSumMatrix2");
  return { data: sumArray, height: matrixHeight, width: matrixWidth };
}





export function windowMatrix(sumMatrix : any, windowSize: number, divisor: number )  {
  const {width: matrixWidth, height: matrixHeight, data: sumArray} = sumMatrix;
  const imageWidth = matrixWidth-1;
  const imageHeight = matrixHeight-1;
  const windowWidth = (imageWidth-windowSize+1);
  const windowHeight = (imageHeight-windowSize+1);
  const windows = new Int32Array(windowWidth*windowHeight);
  for (let h = 0; h < imageHeight; ++h) {
    for (let w = 0; w < imageWidth; ++w) {
      if (w < windowWidth && h < windowHeight) {
        const sum = sumArray[matrixWidth*h+w] // value at (w,h)
        - sumArray[matrixWidth*h+w+windowSize] // value at (w+windowSize,h) == right side
        - sumArray[matrixWidth*(h+windowSize)+w] // value at (w,h+windowSize) == bottom side
        + sumArray[matrixWidth*(h+windowSize)+w+windowSize]; // value at (w+windowSize, h+windowSize) == bottomRight corner
        windows[h*windowWidth + w] = sum / divisor;
      }
    }
  }
  return { height: windowHeight, width: windowWidth, data: windows };
}




export function windowSums(pixels: ImageMatrix, windowSize: number)  {
  return windowMatrix(partialSumMatrix1(pixels, a => a), windowSize, 1);
}

export function windowVariance(pixels: ImageMatrix, sums: any, windowSize: number)  {
  const varianceCalculation=(v: number) => v*v;
  const windowSquared = windowSize * windowSize;
  const varX = windowMatrix(partialSumMatrix1(pixels, varianceCalculation), windowSize, 1)
  for (let i = 0; i < sums.data.length; ++i) {
    const mean = (sums.data[i]/windowSquared);
    const sumSquares = varX.data[i]/windowSquared;

    const squareMeans = mean*mean;
    varX.data[i] = /*windowSquared/(windowSquared-1)**/1024*(sumSquares - squareMeans);
  }
  return varX;
}

export function windowCovariance(pixels1: ImageMatrix, pixels2: ImageMatrix, sums1: any, sums2: any, windowSize: number) {
  const covarianceCalculation = (a:number,b:number) => a*b;
  const windowSquared = windowSize * windowSize;
  const covXY = windowMatrix(partialSumMatrix2(pixels1, pixels2, covarianceCalculation), windowSize,1);
  for (let i = 0; i < sums1.data.length; ++i) {
    covXY.data[i] = /*windowSquared/(windowSquared-1)**/1024*(covXY.data[i]/windowSquared -  (sums1.data[i]/windowSquared)*(sums2.data[i]/windowSquared));
  }
  return covXY;
}



/**
 * Generates a SSIM map based on two input image matrices.
 * Weber SSIM is an SSIM algorithm that operates in linear time by building
 * partial sum arrays of values, variances, and covariances, making each lookup
 * performable in constant time and each variance calculation, only performed once.
 *
 * Images must be a 2-Dimensional grayscale image.
 *
 *
 * @method weberSsim
 * @param {Matrix} pixels1 - The reference matrix
 * @param {Matrix} pixels2 - The second matrix to compare against
 * @param {Options} options - The input options parameter
 * @returns {Matrix} ssim_map - A matrix containing the map of computed SSIMs
 * @public
 * @memberOf weberSsim
 */
export function weberSsim(
  pixels1: ImageMatrix,
  pixels2: ImageMatrix,
  options: Options
) : MSSIMMatrix {
  const { bitDepth, k1, k2, windowSize } = options;
  const L = 2 ** bitDepth - 1;
  const c1 = (k1 * L) * (k1 * L);
  const c2 = (k2 * L) * (k2 * L);
  const windowSquared = windowSize*windowSize;
  const pixels1Rounded = { ...pixels1, data: Uint32Array.from(pixels1.data, (v => v + 0.5))};
  const pixels2Rounded = { ...pixels2, data: Uint32Array.from(pixels2.data, (v => v + 0.5))};
  const sums1 = windowSums(pixels1Rounded, windowSize);
  const variance1 = windowVariance(pixels1Rounded, sums1, windowSize);

  const sums2 = windowSums(pixels2Rounded, windowSize);
  const variance2 = windowVariance(pixels2Rounded, sums2,  windowSize);
  const covariance = windowCovariance(pixels1Rounded, pixels2Rounded, sums1, sums2, windowSize);
  const size = sums1.data.length;

  let mssim = 0;
  const ssims = new Array(size);
  for (let i = 0; i < size; ++i) {
    const meanx = sums1.data[i] / windowSquared;
    const meany = sums2.data[i] / windowSquared;
    const varx = variance1.data[i] / 1024;
    const vary = variance2.data[i] / 1024;
    const cov = covariance.data[i] / 1024;
    const na = 2*meanx*meany+c1;
    const nb = 2*cov + c2;
    const da = meanx*meanx + meany*meany + c1;
    const db = varx + vary + c2;
    // rs.Push(ssim);
    const ssim = na *nb / da / db;
    ssims[i] = ssim;
    if (i == 0) {
      mssim = ssim;
    } else {
      mssim = mssim + (ssim - mssim)/(i+1);
    }
  }

  return { data: ssims, width: sums1.width, height: sums1.height, mssim };
}

