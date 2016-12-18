SSIM.JS is a JavaScript library that generates a `0` to `1` score on how similar two images are. It's sensitive to compression artifacts which make it useful to assess quality degradation.

The closer SSIM is to `1` the higher the similarity. The advantage of SSIM over other measures like [PSNR](https://en.wikipedia.org/wiki/Peak_signal-to-noise_ratio) and [MSE](https://en.wikipedia.org/wiki/Mean_squared_error) is that it correlates better with subjective ratings on image quality.

For instance, the following images have a similar MSE rating:

|                                       |                                       |                                       |
| ------------------------------------  | ------------------------------------- | ------------------------------------- |
| ![](https://raw.githubusercontent.com/obartra/ssim/master/spec/samples/einstein/Q1.gif)    | ![](https://raw.githubusercontent.com/obartra/ssim/master/spec/samples/einstein/Q0988.gif) | ![](https://raw.githubusercontent.com/obartra/ssim/master/spec/samples/einstein/Q0913.gif) |
| Original, MSE = 0, SSIM = 1           | MSE = 144, SSIM = 0.988               | MSE = 144, SSIM = 0.913               |
| ![](https://raw.githubusercontent.com/obartra/ssim/master/spec/samples/einstein/Q0840.gif) | ![](https://raw.githubusercontent.com/obartra/ssim/master/spec/samples/einstein/Q0694.gif) | ![](https://raw.githubusercontent.com/obartra/ssim/master/spec/samples/einstein/Q0662.gif) |
| MSE = 144, SSIM = 0.840               | MSE = 144, SSIM = 0.694               | MSE = 142, SSIM = 0.662               |

*Table extracted from http://www.cns.nyu.edu/~lcv/ssim/*

This project is a direct port of algorithms published by [Wang, et al. 2004](/assets/ssim.pdf) on "Image Quality Assessment: From Error Visibility to Structural Similarity". The original Matlab scripts are available [here](https://ece.uwaterloo.ca/~z70wang/research/iwssim/) with their datasets. To view the steps taken to validate `ssim.js` results, check the [wiki](https://github.com/obartra/ssim/wiki/Results-Validation).

For a general overview on SSIM check the Wikipedia [article](https://en.wikipedia.org/wiki/Structural_similarity).

## Installation

```shell
npm install ssim.js
```

This will install the node, web and CLI versions.

Installing it globally (`npm install -g`) will make the `ssim` CLI tool available on your path.

You can also use the web version directly from [unpkg](https://unpkg.com)'s CDN:

`https://unpkg.com/ssim.js@{{semver}}`.

For instance, if you wanted to use the latest `2.x` version, you would require:

```html
<script src="https://unpkg.com/ssim.js@^2.0.0"></script>
```

For any issues during installation, check the [FAQ](https://github.com/obartra/ssim/wiki/FAQ).

## Usage

The API is the same on Node and on the browser:

```javascript
ssim(img1, img2, options)
  .then({ mssim, ssim_map, performance })
  .catch(error);
```

There's a playground for the Node and Web versions [here](https://ssim-comparison.gomix.me/).

For more usage information, check the [wiki](https://github.com/obartra/ssim/wiki/Usage).

### Node Example

```javascript

import ssim from 'ssim.js';

ssim('./img1.jpg', './img2.jpg')
  .then(({ mssim, performance }) => console.log(`SSIM: ${mssim} (${performance}ms)`))
  .catch(err => console.error('Error generating SSIM', err));
```

### Browser Example

```html
  <script src="https://unpkg.com/ssim.js@^2.0.0"></script>
  <script>
    ssim('/img1.jpg', '/img2.jpg')
      .then(function(out) {
        console.log('SSIM:', out.mssim, '(generated in:', out.performance, 'ms)');
      })
      .catch(function(err) {
        console.error('Error generating SSIM', err);
      });
  </script>
```

### CLI Example

```shell
$ ./node_modules/.bin/ssim ./img1.jpg ./img2.jpg --quiet
0.9853
```

## Documentation

The code is fully documented but a prettier version hosted by doclets.io is available [here](https://doclets.io/obartra/ssim/master).

## Supported Environments

CI tests ensure the SSIM package works both on Node and on the browser.

The Node build is tested against Node 0.12 and above. Browser builds are tested on recent versions of browsers and IE9+. Check the [wiki](https://github.com/obartra/ssim/wiki/Old-Node-and-Browsers) for more details.

[![Sauce Browser Matrix](https://saucelabs.com/browser-matrix/saucessim-master.svg)](https://saucelabs.com/u/saucessim-master)
