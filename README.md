| Process		| Status	|
|---------------|-----------|
| Build Status	| [![CircleCI](https://circleci.com/gh/obartra/ssim/tree/master.svg?style=shield)](https://circleci.com/gh/obartra/ssim/tree/master) |
| Code Coverage	| [![Test Coverage](https://codeclimate.com/github/obartra/ssim/badges/coverage.svg)](https://codeclimate.com/github/obartra/ssim/coverage) |
| Code Quality	| [![Code Climate](https://codeclimate.com/github/obartra/ssim/badges/gpa.svg)](https://codeclimate.com/github/obartra/ssim) [![Issue Count](https://codeclimate.com/github/obartra/ssim/badges/issue_count.svg)](https://codeclimate.com/github/obartra/ssim) |
| Commit format	| [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) |
| Dependencies	| [![Known Vulnerabilities](https://snyk.io/test/github/obartra/ssim/badge.svg)](https://snyk.io/test/github/obartra/ssim) [![DavidDM](https://david-dm.org/obartra/ssim.svg)](https://david-dm.org/obartra/ssim) |
| Environments	| ![](https://img.shields.io/badge/node-6.7-brightgreen.svg) |
| Documentation	| [![InchCI](https://inch-ci.org/github/obartra/ssim.svg?branch=master)](https://inch-ci.org/github/obartra/ssim) [![API Doc](https://doclets.io/obartra/ssim/master.svg)](https://doclets.io/obartra/ssim/master) |

# SSIM.JS

SSIM.JS is a JavaScript implementation of the SSIM algorithms published by [Wang, et al. 2004](/assets/ssim.pdf) on "Image Quality Assessment: From Error Visibility to Structural Similarity".

SSIM measures structural similarity of images in a `[0, 1]` index. The closer SSIM is to `1` the more similar both images are. The advantage of SSIM over other measures like [PSNR](https://en.wikipedia.org/wiki/Peak_signal-to-noise_ratio) and [MSE](https://en.wikipedia.org/wiki/Mean_squared_error) is that it correlates better with subjective ratings on image quality.

For instance, the following images have a similar MSE rating:

|                                       |                                       |                                       |
| ------------------------------------  | ------------------------------------- | ------------------------------------- |
| ![](/spec/samples/einstein/Q1.gif)    | ![](/spec/samples/einstein/Q0988.gif) | ![](/spec/samples/einstein/Q0913.gif) |
| Original, MSE = 0, SSIM = 1           | MSE = 144, SSIM = 0.988               | MSE = 144, SSIM = 0.913               |
| ![](/spec/samples/einstein/Q0840.gif) | ![](/spec/samples/einstein/Q0694.gif) | ![](/spec/samples/einstein/Q0662.gif) |
| MSE = 144, SSIM = 0.840               | MSE = 144, SSIM = 0.694               | MSE = 142, SSIM = 0.662               |

*Table extracted from http://www.cns.nyu.edu/~lcv/ssim/*

For a general overview on SSIM check the Wikipedia article [here](https://en.wikipedia.org/wiki/Structural_similarity).

This code is a line-by-line port of the original Matlab scripts, they are available [here](https://ece.uwaterloo.ca/~z70wang/research/iwssim/) with their datasets.

Validation of results has been done against the results from the Matlab scripts using the [IVC database](http://www2.irccyn.ec-nantes.fr/ivcdb/) compared with the javascript implementation and they match the original results exactly.

Note that the original Matlab scripts published by Wang et al., 2004 generate slightly different results than the ones they published (~1%). I have been unable to find any specific parameters or modifications they used that would account for these differences. This project focuses instead on the exact reproduction of their Matlab scripts.

## Installation

```shell
npm install ssim.js
```

If you run into any issues during the installation, check the [node-canvas](https://github.com/Automattic/node-canvas#installation) installation steps.

## Usage

```javascript

import ssim from 'ssim.js';

ssim('./img1.jpg', './img2.jpg')
	.then(out => console.log(`SSIM: ${out}`))
	.catch(err => console.error('Error generating SSIM', err));
```

## SSIM

The script generates a 2D SSIM map between two windows `x` and `y` as follows:

![](/assets/ssim.png)

where:
- `μ` is used to indicate the averages
- `σ` is used to indicate the variance and covariance (of xy)
- `c1` and `c2` are small constants added to prevent inestability when `μx^2 + μy^2 ≈ 0`

### Parameters

You can pass a 3rd parameter containing a plain object and any of the following options:

|  Parameter | Default |
| ---------- | ------- |
| windowSize | 11      |
| k1         | 0.01    |
| k2         | 0.03    |
| bitDepth   | 8       |
| downsample | true    |

### Output

The program returns a SSIM map, a mean SSIM (MSSIM) and a performance metric (ms to compute). The MSSIM returned value is computed by averaging all SSIM values from the map.

## Rationale

The goal of this project is to implement a fully-tested, exact reproduction of the original Matlab scripts to compute SSIM. It also needs to be easy to use, performant and work in as many environments as reasonably possible:

- Isomorphic build (node / browser)
- Reproduction of the original Matlab scripts with a resolution of 10^-7 (±0.0000001)
- Appropriate testing to ensure correct behavior
- Validate results against original datasets

## Caveats

- Because of this projects reliance on [node-canvas](https://www.npmjs.com/package/canvas) you may run into installation difficulties. Make sure you follow the steps for your platform [here](https://github.com/Automattic/node-canvas#installation).
- When using canvas or node-canvas, images will be retrieved as 8 bits/channel. You can use the `bitDepth` parameter to modify how SSIM computes the value but it will have no effect on how the image is read.

## Roadmap

- Add support for MS-SSIM from [Wang, Simoncelli & Bovik, 2003](/assets/msssim.pdf) on "Multi-Scale Structural Similarity for Image Quality Assessment",
- Add support for IW-SSIM from [Wang & Qiang, 2011](/assets/iwssim.pdf) on "Information Content Weighting for Perceptual Image Quality Assessment".
- Potentially adding support 3-SSIM and 3-MS-SSIM for [Li & Bovik, 2008](/assets/3-ssim.pdf) on "Three-Component Weighted Structural Similarity Index"
- Multiple builds, something like:
  - `mx` as an isomorphic build (works on node and on the browser) with no external dependencies that takes 3D matrices as input representing the images.
  - `node` as a node-specific build that uses `node-canvas` to retrieve the 3D pixel matrix from each image and accepts `Buffer`, URLs or a file system path as inputs.
  - `web` as a browser-specific build that relies on the [canvas element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas) to retrieve the pixel matrices. It accepts URLs but it's subject to [CORS restrictions](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image).
- `α`, `β` and `γ` are currently excluded (default to 1). Parametrize.
