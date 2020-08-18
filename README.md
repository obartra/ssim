[![CircleCI](https://circleci.com/gh/obartra/ssim/tree/master.svg?style=shield)](https://circleci.com/gh/obartra/ssim/tree/master) [![Test Coverage](https://codeclimate.com/github/obartra/ssim/badges/coverage.svg)](https://codeclimate.com/github/obartra/ssim/coverage) [![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://opensource.org/licenses/MIT) [![npm](https://img.shields.io/npm/v/ssim.js.svg)](https://www.npmjs.com/package/ssim.js)

# SSIM.JS

> Get a `0` to `1` score on how similar two images are

The closer [SSIM](https://en.wikipedia.org/wiki/Structural_similarity) is to `1` the higher the similarity. It correlates better with subjective ratings than other measures like [PSNR](https://en.wikipedia.org/wiki/Peak_signal-to-noise_ratio) and [MSE](https://en.wikipedia.org/wiki/Mean_squared_error). For instance:

|                                                                                            |                                                                                            |                                                                                            |
| ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| ![](https://raw.githubusercontent.com/obartra/ssim/master/spec/samples/einstein/Q1.gif)    | ![](https://raw.githubusercontent.com/obartra/ssim/master/spec/samples/einstein/Q0988.gif) | ![](https://raw.githubusercontent.com/obartra/ssim/master/spec/samples/einstein/Q0913.gif) |
| Original, MSE = 0, SSIM = 1                                                                | MSE = 144, SSIM = 0.988                                                                    | MSE = 144, SSIM = 0.913                                                                    |
| ![](https://raw.githubusercontent.com/obartra/ssim/master/spec/samples/einstein/Q0840.gif) | ![](https://raw.githubusercontent.com/obartra/ssim/master/spec/samples/einstein/Q0694.gif) | ![](https://raw.githubusercontent.com/obartra/ssim/master/spec/samples/einstein/Q0662.gif) |
| MSE = 144, SSIM = 0.840                                                                    | MSE = 144, SSIM = 0.694                                                                    | MSE = 142, SSIM = 0.662                                                                    |

_Table extracted from http://www.cns.nyu.edu/~lcv/ssim/_

## 🖥 Install

```shell
npm install ssim.js
```

You can also use the web version directly from [unpkg](https://unpkg.com)'s CDN: `https://unpkg.com/ssim.js@{{version}}/dist/ssim.web.js`.

## 📝 Usage

Check out the [playground](https://ssim-comparison.gomix.me/) for node and web usage examples.

SSIM.js takes in 2 image buffers and optional options parameter. You can find all options available [here](https://github.com/obartra/ssim/wiki/Usage#options).

For examples on how to implement image loading strategies for both node and the web, check out [this wiki page](https://github.com/obartra/ssim/wiki/Node-and-Browsers).

```js
import ssim from "ssim.js";

const img1 = loadImage("./img1.jpg");
const img2 = loadImage("./img2.jpg");

const { mssim, performance } = ssim(img1, img2);

console.log(`SSIM: ${mssim} (${performance}ms)`);
```

## 📖 Documentation

If you run into any issues or want a more info, check the [wiki](https://github.com/obartra/ssim/wiki).

The code is fully documented but feel free to create an issue [here](https://github.com/obartra/ssim/issues/new) if you have any questions.

## 🏁 Metrics

| Process      | Status                                                                                                                                                                                                                                                                                                |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Versioning   | [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) |
| Dependencies | [![Known Vulnerabilities](https://snyk.io/test/github/obartra/ssim/badge.svg)](https://snyk.io/test/github/obartra/ssim) [![DavidDM](https://david-dm.org/obartra/ssim.svg)](https://david-dm.org/obartra/ssim)                                                                                       |

## 💡 Credits

This project is a direct port of algorithms published by [Wang, et al. 2004](/assets/ssim.pdf) on "Image Quality Assessment: From Error Visibility to Structural Similarity". The original Matlab scripts are available [here](https://ece.uwaterloo.ca/~z70wang/research/iwssim/) with their datasets. To view the steps taken to validate `ssim.js` results, check the [wiki](https://github.com/obartra/ssim/wiki/Results-Validation).

The current (default) implementation uses the Weber algorithm, originally developed by Dan Weber, 2020 at [notatypical.agency](https://notatypical.agency/).
