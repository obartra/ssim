| Process		| Status	|
|---------------|-----------|
| Build Status	| [![CircleCI](https://circleci.com/gh/obartra/ssim/tree/master.svg?style=shield)](https://circleci.com/gh/obartra/ssim/tree/master) |
| Code Coverage	| [![Test Coverage](https://codeclimate.com/github/obartra/ssim/badges/coverage.svg)](https://codeclimate.com/github/obartra/ssim/coverage) |
| Code Quality	| [![Code Climate](https://codeclimate.com/github/obartra/ssim/badges/gpa.svg)](https://codeclimate.com/github/obartra/ssim) [![Issue Count](https://codeclimate.com/github/obartra/ssim/badges/issue_count.svg)](https://codeclimate.com/github/obartra/ssim) |
| Commit format	| [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) |
| Dependencies	| [![Known Vulnerabilities](https://snyk.io/test/github/obartra/ssim/badge.svg)](https://snyk.io/test/github/obartra/ssim) [![DavidDM](https://david-dm.org/obartra/ssim.svg)](https://david-dm.org/obartra/ssim) |
| Environments	| ![](https://img.shields.io/badge/node-0.10-brightgreen.svg) ![](https://img.shields.io/badge/node-0.12-brightgreen.svg) ![](https://img.shields.io/badge/node-5.7.0-brightgreen.svg) ![](https://img.shields.io/badge/node-6.8-brightgreen.svg) |
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

## Installation

```shell
npm install ssim.js
```

If you run into any issues during the installation, check the [node-canvas](https://github.com/Automattic/node-canvas#installation) installation steps.

## Usage

```javascript

import ssim from 'ssim.js';

ssim('./img1.jpg', './img2.jpg')
	.then(out => console.log(`SSIM: ${out.mssim} (generated in: ${out.performance}ms)`))
	.catch(err => console.error('Error generating SSIM', err));
```

You can specify any additional options as a 3rd parameter. Something like:

```javascript

import ssim from 'ssim.js';

ssim('./img1.jpg', './img2.jpg', { downsample: 'fast' })
```

See the parameters section for a full description of options available.

## SSIM

The script generates a 2D SSIM map between two windows `x` and `y` as follows:

![](/assets/ssim.png)

where:
- `μ` is used to indicate the averages
- `σ` is used to indicate the variance and covariance (of xy)
- `c1` and `c2` are small constants added to prevent instability when `μx^2 + μy^2 ≈ 0`

### Parameters

You can pass a 3rd parameter containing a plain object and any of the following options:

|  Parameter | Default    | Description |
| ---------- | ---------- | ----------- |
| windowSize | 11         | Set to a larger size to increase performance. Determines the  |
| k1         | 0.01       | Set k1 and k2 to 0 to use UQI (Universal Quality Index), UQI is a subset of SSIM, when C1 and C2 are 0 |
| k2         | 0.03       | Set k1 and k2 to 0 to use UQI (Universal Quality Index), UQI is a subset of SSIM, when C1 and C2 are 0 |
| bitDepth   | 8          | When using canvas or node-canvas, images will be retrieved as 8 bits/channel. You can use the `bitDepth` parameter to modify how SSIM computes the value but it will have no effect on how the image is read |
| downsample | 'original' | `false` / `'original'` / `'fast'`. `false` disables downsizing, `'original'` implements the same downsizing than the original Matlab scripts and `fast` relies on the `canvas` to do the downsizing |

All defaults match the implementation of the original Matlab scripts. Any changes may lead to significantly different results.

### Output

The program returns a SSIM map, a mean SSIM (MSSIM) and a performance metric (ms to compute). The MSSIM returned value is computed by averaging all SSIM values from the map. To view the steps taken to validate the results, check the wiki page [here](https://github.com/obartra/ssim/wiki/Results-Validation).
