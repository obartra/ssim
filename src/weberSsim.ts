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

function edgeHandler(w: number, width: number, h: number, height: number, sumArray: Int32Array, matrixWidth: number) {
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

      sumArray[h*matrixWidth+w] = f(data1[h*width+w],data2[h*width+w],w,h) + rightEdge
        + bottomEdge - bottomRightEdge;
    }
  }
  // console.timeEnd("partialSumMatrix2");
  return { data: sumArray, height: matrixHeight, width: matrixWidth };
}





export function windowMatrix(sumMatrix : any, windowSize: number)  {
  // console.time("windowMatrix");
  const windowSquared =  windowSize * windowSize;
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
        windows[h*windowWidth + w] = sum / windowSquared;
      }
    }
  }
  // console.timeEnd("windowMatrix");
  return { height: windowHeight, width: windowWidth, data: windows };
}




export function windowMeans(pixels: ImageMatrix, windowSize: number)  {
  return windowMatrix(partialSumMatrix1(pixels, a => a), windowSize);
}

export function windowVariance(pixels: ImageMatrix, means: any, windowSize: number)  {
  // console.time("windowVariance");
  const widthFrac = means.width/pixels.width;
  const heightFrac = means.height/pixels.height;
  const roundarray = new Uint32Array(2);
  const varianceCalculation = (v: number, x: number, y: number) =>{
    roundarray[0] = y*heightFrac + 0.5;
    roundarray[1] = x*widthFrac + 0.5;
    const offset = means.width*roundarray[0] + roundarray[1];
    const mean = means.data[offset];
    return (v-mean)*(v-mean);
  };
  // console.timeEnd("windowVariance");
  return windowMatrix(partialSumMatrix1(pixels, varianceCalculation), windowSize);
}

export function windowCovariance(pixels1: ImageMatrix, pixels2: ImageMatrix, means1: any, means2: any, windowSize: number) {
  // console.time("windowCovariance");
  const widthFrac = means1.width/pixels1.width;
  const heightFrac = means1.height/pixels1.height;
  const roundarray = new Uint32Array(2);
  const covarianceCalculation = (vx: number, vy:number, x: number, y: number) =>{
    roundarray[0] = y*heightFrac + 0.5;
    roundarray[1] = x*widthFrac + 0.5;
    const offset = means1.width*roundarray[0]+ roundarray[1];
    const meanx = means1.data[offset];
    const meany = means2.data[offset];
    return (vx-meanx)*(vy-meany);
  };
  // console.timeEnd("windowCovariance");
  return windowMatrix(partialSumMatrix2(pixels1, pixels2, covarianceCalculation), windowSize);
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
  // console.time("weberSsim");
  // console.time("weberSsimp1");


  const { bitDepth, k1, k2, windowSize } = options;
  const L = 2 ** bitDepth - 1;
  const c1 = (k1 * L) ** 2;
  const c2 = (k2 * L) ** 2;
  const means1 = windowMeans(pixels1, windowSize);
  const variance1 = windowVariance(pixels1, means1, windowSize);

  const means2 = windowMeans(pixels2, windowSize);
  const variance2 = windowVariance(pixels2, means2,  windowSize);
  const covariance = windowCovariance(pixels1, pixels2, means1, means2, windowSize);
  const size = means1.data.length;

  let mssim = 0;
  const ssims = new Array(size);
  // console.timeEnd("weberSsimp1");
  // console.time("weberSsimp2");
  for (let i = 0; i < size; ++i) {
    const meanx = means1.data[i];
    const meany = means2.data[i];
    const varx = variance1.data[i];
    const vary = variance2.data[i];
    const cov = covariance.data[i];
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
  // Shouldn't I calculate the mean here?  I can do a running mean on ssim...
  // console.timeEnd("weberSsimp2");
  // console.timeEnd("weberSsim");
  return { data: ssims, width: means1.width, height: means1.height, mssim };
}

