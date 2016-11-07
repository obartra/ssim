[![CircleCI](https://circleci.com/gh/obartra/ssim/tree/master.svg?style=shield)](https://circleci.com/gh/obartra/ssim/tree/master) [![Test Coverage](https://codeclimate.com/github/obartra/ssim/badges/coverage.svg)](https://codeclimate.com/github/obartra/ssim/coverage) [![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://opensource.org/licenses/MIT)

# SSIM.JS

SSIM.JS is a JavaScript implementation of the SSIM algorithms published by [Wang, et al. 2004](/assets/ssim.pdf) on "Image Quality Assessment: From Error Visibility to Structural Similarity".

SSIM measures structural similarity of images in a `[0, 1]` index. The closer SSIM is to `1` the more similar both images are. The advantage of SSIM over other measures like [PSNR](https://en.wikipedia.org/wiki/Peak_signal-to-noise_ratio) and [MSE](https://en.wikipedia.org/wiki/Mean_squared_error) is that it correlates better with subjective ratings on image quality.

For instance, the following images have a similar MSE rating:

|                                       |                                       |                                       |
| ------------------------------------  | ------------------------------------- | ------------------------------------- |
| ![](https://raw.githubusercontent.com/obartra/ssim/master/spec/samples/einstein/Q1.gif)    | ![](https://raw.githubusercontent.com/obartra/ssim/master/spec/samples/einstein/Q0988.gif) | ![](https://raw.githubusercontent.com/obartra/ssim/master/spec/samples/einstein/Q0913.gif) |
| Original, MSE = 0, SSIM = 1           | MSE = 144, SSIM = 0.988               | MSE = 144, SSIM = 0.913               |
| ![](https://raw.githubusercontent.com/obartra/ssim/master/spec/samples/einstein/Q0840.gif) | ![](https://raw.githubusercontent.com/obartra/ssim/master/spec/samples/einstein/Q0694.gif) | ![](https://raw.githubusercontent.com/obartra/ssim/master/spec/samples/einstein/Q0662.gif) |
| MSE = 144, SSIM = 0.840               | MSE = 144, SSIM = 0.694               | MSE = 142, SSIM = 0.662               |

*Table extracted from http://www.cns.nyu.edu/~lcv/ssim/*

For a general overview on SSIM check the Wikipedia article [here](https://en.wikipedia.org/wiki/Structural_similarity).

This project includes a line-by-line port of the original Matlab scripts, they are available [here](https://ece.uwaterloo.ca/~z70wang/research/iwssim/) with their datasets.

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
Run this code on [runkit](https://runkit.com/obartra/runkit-npm-ssim-js).

For more advanced usage, check the wiki [here](https://github.com/obartra/ssim/wiki/Usage).

### Output

| Parameter   | Description                                                 |
| ----------- | ----------------------------------------------------------- |
| mssim       | Mean SSIM, the average of all `ssim_map` values             |
| ssim_map    | An array of arrays containing the ssim value at each window |
| performance | The total time to compute SSIM (in milliseconds)            |

To view the steps taken to validate the results, check the wiki [here](https://github.com/obartra/ssim/wiki/Results-Validation).

## Documentation

The code is fully documented. Documentation is hosted by doclets.io and available [here](https://doclets.io/obartra/ssim/master).

[![API Doc](https://doclets.io/obartra/ssim/master.svg)](https://doclets.io/obartra/ssim/master)

## Metrics

| Process       | Status    |
|---------------|-----------|
| Code Quality  | [![Code Climate](https://codeclimate.com/github/obartra/ssim/badges/gpa.svg)](https://codeclimate.com/github/obartra/ssim) [![Issue Count](https://codeclimate.com/github/obartra/ssim/badges/issue_count.svg)](https://codeclimate.com/github/obartra/ssim) |
| Versioning    | [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) [![npm](https://img.shields.io/npm/v/ssim.js.svg)](https://www.npmjs.com/package/ssim.js) |
| Dependencies  | [![Known Vulnerabilities](https://snyk.io/test/github/obartra/ssim/badge.svg)](https://snyk.io/test/github/obartra/ssim) [![DavidDM](https://david-dm.org/obartra/ssim.svg)](https://david-dm.org/obartra/ssim) |
| Environments  | ![](https://img.shields.io/badge/node-0.12-brightgreen.svg) ![](https://img.shields.io/badge/node-5.7.0-brightgreen.svg) ![](https://img.shields.io/badge/node-6.1-brightgreen.svg) ![](https://img.shields.io/badge/node-7.0-brightgreen.svg) |
| Documentation | [![InchCI](https://inch-ci.org/github/obartra/ssim.svg?branch=master)](https://inch-ci.org/github/obartra/ssim)  |
