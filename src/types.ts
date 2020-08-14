export type Options = {
  k1: number;
  k2: number;
  ssim: "fast" | "original" | "bezkrovny" | "weber";
  windowSize: number;
  bitDepth: number;
  downsample: "original" | "fast" | false;
  maxSize?: number;
};

export type Matrix = {
  width: number;
  height: number;
  data: number[];
};

export type ImageMatrix = Matrix | ImageData;
export type MSSIMMatrix = Matrix & {
  mssim: number;
};

export type Shape = "full" | "same" | "valid";

export type Images = [ImageData, ImageData, Options];
export type Matrices = [Matrix, Matrix, Options];
