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

## 💡 Rationale

This project is a direct port of algorithms published by [Wang, et al. 2004](/assets/ssim.pdf) on "Image Quality Assessment: From Error Visibility to Structural Similarity". The original Matlab scripts are available [here](https://ece.uwaterloo.ca/~z70wang/research/iwssim/) with their datasets. To view the steps taken to validate `ssim.js` results, check the [wiki](https://github.com/obartra/ssim/wiki/Results-Validation).
