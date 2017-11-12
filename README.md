[![CircleCI](https://circleci.com/gh/obartra/ssim/tree/master.svg?style=shield)](https://circleci.com/gh/obartra/ssim/tree/master) [![Test Coverage](https://codeclimate.com/github/obartra/ssim/badges/coverage.svg)](https://codeclimate.com/github/obartra/ssim/coverage) [![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://opensource.org/licenses/MIT)

# SSIM.JS

> Get a `0` to `1` score on how similar two images are

The closer [SSIM](https://en.wikipedia.org/wiki/Structural_similarity) is to `1` the higher the similarity. It correlates better with subjective ratings than other measures like [PSNR](https://en.wikipedia.org/wiki/Peak_signal-to-noise_ratio) and [MSE](https://en.wikipedia.org/wiki/Mean_squared_error). For instance:

|                                       |                                       |                                       |
| ------------------------------------  | ------------------------------------- | ------------------------------------- |
| ![](https://raw.githubusercontent.com/obartra/ssim/master/spec/samples/einstein/Q1.gif)    | ![](https://raw.githubusercontent.com/obartra/ssim/master/spec/samples/einstein/Q0988.gif) | ![](https://raw.githubusercontent.com/obartra/ssim/master/spec/samples/einstein/Q0913.gif) |
| Original, MSE = 0, SSIM = 1           | MSE = 144, SSIM = 0.988               | MSE = 144, SSIM = 0.913               |
| ![](https://raw.githubusercontent.com/obartra/ssim/master/spec/samples/einstein/Q0840.gif) | ![](https://raw.githubusercontent.com/obartra/ssim/master/spec/samples/einstein/Q0694.gif) | ![](https://raw.githubusercontent.com/obartra/ssim/master/spec/samples/einstein/Q0662.gif) |
| MSE = 144, SSIM = 0.840               | MSE = 144, SSIM = 0.694               | MSE = 142, SSIM = 0.662               |

*Table extracted from http://www.cns.nyu.edu/~lcv/ssim/*

## 🖥 Install

```shell
npm install ssim.js
```

This will install the node, web and CLI versions.

Install it globally (`npm install -g`) to make `ssim` available on your path.

You can also use the web version directly from [unpkg](https://unpkg.com)'s CDN: `https://unpkg.com/ssim.js@{{semver}}`.

## 📝 Usage

[Playground](https://ssim-comparison.gomix.me/) for Node and Web versions.

Node:

```javascript

import ssim from 'ssim.js';

ssim('./img1.jpg', './img2.jpg')
  .then(({ mssim, performance }) => console.log(`SSIM: ${mssim} (${performance}ms)`))
  .catch(err => console.error('Error generating SSIM', err));
```

Browser:

```html
  <script src="https://unpkg.com/ssim.js@^2.0.0"></script>
  <script>
    ssim('/img1.jpg', '/img2.jpg')
      .then(function(out) {
        console.log('SSIM:', out.mssim, '(', out.performance, 'ms)');
      })
      .catch(function(err) {
        console.error('Error generating SSIM', err);
      });
  </script>
```

CLI:

```shell
$ ./node_modules/.bin/ssim ./img1.jpg ./img2.jpg
```

## 📖 Documentation

If you run into any issues or want a more info, check the [wiki](https://github.com/obartra/ssim/wiki).

The code is fully documented and a hosted version is available [here](https://doclets.io/obartra/ssim/master).

## 🏁 Metrics

| Process       | Status    |
|---------------|-----------|
| Code Quality  | [![Code Climate](https://codeclimate.com/github/obartra/ssim/badges/gpa.svg)](https://codeclimate.com/github/obartra/ssim) [![Issue Count](https://codeclimate.com/github/obartra/ssim/badges/issue_count.svg)](https://codeclimate.com/github/obartra/ssim) |
| Versioning    | [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) [![npm](https://img.shields.io/npm/v/ssim.js.svg)](https://www.npmjs.com/package/ssim.js) [![Greenkeeper badge](https://badges.greenkeeper.io/obartra/ssim.svg)](https://greenkeeper.io/) |
| Dependencies  | [![Known Vulnerabilities](https://snyk.io/test/github/obartra/ssim/badge.svg)](https://snyk.io/test/github/obartra/ssim) [![DavidDM](https://david-dm.org/obartra/ssim.svg)](https://david-dm.org/obartra/ssim) |
| Documentation | [![InchCI](https://inch-ci.org/github/obartra/ssim.svg?branch=master)](https://inch-ci.org/github/obartra/ssim) |
| Environments  | ![](https://img.shields.io/badge/node-0.12-brightgreen.svg) ![](https://img.shields.io/badge/node-9.1-brightgreen.svg) [![Sauce Test Status](https://saucelabs.com/buildstatus/saucessim-master)](https://saucelabs.com/u/saucessim-master)|

[![Sauce Browser Matrix](https://saucelabs.com/browser-matrix/saucessim-master.svg)](https://saucelabs.com/u/saucessim-master)

## 💡 Credits

This project is a direct port of algorithms published by [Wang, et al. 2004](/assets/ssim.pdf) on "Image Quality Assessment: From Error Visibility to Structural Similarity". The original Matlab scripts are available [here](https://ece.uwaterloo.ca/~z70wang/research/iwssim/) with their datasets. To view the steps taken to validate `ssim.js` results, check the [wiki](https://github.com/obartra/ssim/wiki/Results-Validation).
