/**
 * Implements Matlab functions or functionality.
 *
 * The goal here is not a perfect reproduction of matlab logic but just a minimal implementation
 * needed to correctly reproduce the SSIM matlab script.
 *
 * That means that functionality used will be implemented but additional / unused parameters will
 * not.
 *
 * @namespace matlab
 */
export * from './conv2'
export * from './filter2'
export * from './fspecial'
export * from './imfilter'
export * from './normpdf'
export * from './ones'
export * from './padarray'
export * from './rgb2gray'
export * from './skip2d'
export * from './sub'
export * from './transpose'
export * from './zeros'
