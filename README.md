| Process		| Status	|
|---------------|-----------|
| Build Status	| [![CircleCI](https://circleci.com/gh/obartra/ssim/tree/master.svg?style=shield)](https://circleci.com/gh/obartra/ssim/tree/master) |
| Code Coverage	| [![Test Coverage](https://codeclimate.com/github/obartra/ssim/badges/coverage.svg)](https://codeclimate.com/github/obartra/ssim/coverage) |
| Code Quality	| [![Code Climate](https://codeclimate.com/github/obartra/ssim/badges/gpa.svg)](https://codeclimate.com/github/obartra/ssim) [![Issue Count](https://codeclimate.com/github/obartra/ssim/badges/issue_count.svg)](https://codeclimate.com/github/obartra/ssim) |
| Commit format	| [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) |
| Dependencies	| [![Known Vulnerabilities](https://snyk.io/test/github/obartra/ssim/badge.svg)](https://snyk.io/test/github/obartra/ssim) [![DavidDM](https://david-dm.org/obartra/ssim.svg)](https://david-dm.org/obartra/ssim) |
| Environments	| ![](https://img.shields.io/badge/node-6.6-brightgreen.svg) |
| Documentation	| [![InchCI](https://inch-ci.org/github/obartra/ssim.svg?branch=master)](https://inch-ci.org/github/obartra/ssim) [![API Doc](https://doclets.io/obartra/ssim/master.svg)](https://doclets.io/obartra/ssim/master) |

# SSIM.JS

SSIM.JS is a pure JavaScript implementation of the multiple SSIM algorithms published by [Wang, Simoncelli & Bovik, 2003](/assets/msssim.pdf) on "Multi-Scale Structural Similarity for Image Quality Assessment", [Wang, et al. 2004](/assets/ssim.pdf) on "Image Quality Assessment: From Error Visibility to Structural Similarity", and [Wang & Qiang, 2011](/assets/iwssim.pdf) on "Information Content Weighting for Perceptual Image Quality Assessment".

For a general overview on SSIM check the Wikipedia article [here](https://en.wikipedia.org/wiki/Structural_similarity).

This code ports the original Matlab scripts, they are available [here](https://ece.uwaterloo.ca/~z70wang/research/iwssim/) with their datasets.

Validation of results has been done against the results from [IVC database](http://www2.irccyn.ec-nantes.fr/ivcdb/).

# TBD
[Li & Bovik, 2008](/assets/3-ssim.pdf) on "Three-Component Weighted Structural Similarity Index"

Because of this projects reliance on [node-canvas](https://www.npmjs.com/package/canvas) and its cross-platform installation difficulties you can use 2 different builds:

- `mx` is an isomorphic build (works on node and on the browser) with no external dependencies that takes 3D matrices as input representing the images.
- `node` is a node-specific build that uses `node-canvas` to retrieve the 3D pixel matrix from each image and accepts `Buffer`, URLs or a file system path as inputs.

Additionally, to make the canvas approach also work on the browser, a `web` build is available:

- `web`: Is a browser-specific build that relies on the [canvas element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas) to retrieve the pixel matrices. It accepts URLs but it's subject to [CORS restrictions](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image).

When using a build that relies on canvas or node-canvas, images will be retrieved as 8 bits/channel. You can use the `bitDepth` parameter to modify how SSIM computes the value but it will have no effect on how the image is read.

`α`, `β` and `γ` are excluded (default to 1) and currently not parametrizable.

## Usage

```javascript

import ssim from 'package-name';

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
- `c<sub>1</sub>` and `c<sub>2</sub>` are small constants added to prevent inestability when `μ<sup>2</sup><sub>x</sub> + μ<sup>2</sup><sub>y</sub> ≈ 0`


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

# Rationale

There are many SSIM implementations already. See for instance:

| Language  | Link |
| --------- | ---- |
| JS 		| [Image SSIM](https://github.com/darosh/image-ssim-js) [image-ms-ssim](https://www.npmjs.com/package/image-ms-ssim) |
| TS		| [image-quantization](https://github.com/igor-bezkrovny/image-quantization/blob/9f62764ac047c3e53accdf1d7e4e424b0ef2fb60/src/quality/ssim.ts) |
| C++		| [Lefungus](http://perso.wanadoo.fr/reservoir/) [Mehdi Rabah](http://mehdi.rabah.free.fr/SSIM/) |
| Java 		| [Gabriel Prieto](http://www.ucm.es/gabriel_prieto/ssim) |
| Python 	| [Helder](https://github.com/helderc/src/blob/master/SSIM_Index.py) |

So, why another one? My goals are:

- Exact reproduction of the original Matlab scripts
- Include appropriate testing to ensure correct behavior
- Validate results against original datasets

# Installation

Not yet published 😞

Some builds uses node canvas to read pixel data. Your system may need additional dependencies to install it. If you run into any issues follow [these steps](https://github.com/Automattic/node-canvas#installation).

# Results

Current results match the originally published script by Wang et al. for single scale SSIM computation, with and without automatic downsampling and automatic grayscale conversion.

These values do not match the original ones reported by Wang et al. on their original paper although they are similar. I assume it's due to different scaling or values for K1 or K2 used.

As reference I'm also including the UQI values using their Matlab script (basically sets K1 and K2 to 0) which shows how small changes on these constants impact the mean SSIM value.

|  reference | comparison			| reported	| ssim.m	| diff		| UQI		|
| ---------- | -------------------- | --------- | --------- | --------- | --------- |
| avion.bmp  | avion_j2000_r1.bmp	| 0.97873	| 0.97914	| -0.041%	| 0.81627	|
| avion.bmp  | avion_j2000_r2.bmp	| 0.95488	| 0.95530	| -0.042%	| 0.72424	|
| avion.bmp  | avion_j2000_r3.bmp	| 0.92741	| 0.92811	| -0.070%	| 0.64121	|
| avion.bmp  | avion_j2000_r4.bmp	| 0.91484	| 0.91540	| -0.056%	| 0.61956	|
| avion.bmp  | avion_j2000_r5.bmp	| 0.86476	| 0.86559	| -0.083%	| 0.52559	|
| barba.bmp  | barba_j2000_r1.bmp	| 0.98056	| 0.98093	| -0.037%	| 0.92156	|
| barba.bmp  | barba_j2000_r1.bmp	| 0.96216	| 0.96240	| -0.024%	| 0.88579	|
| barba.bmp  | barba_j2000_r1.bmp	| 0.92613	| 0.92634	| -0.021%	| 0.82417	|
| barba.bmp  | barba_j2000_r1.bmp	| 0.88115	| 0.88208	| -0.093%	| 0.76101	|
| barba.bmp  | barba_j2000_r1.bmp	| 0.77239	| 0.77164	| +0.075%	| 0.61380	|
| boats.bmp  | boats_j2000_r1.bmp	| 0.98386	| 0.97541	| +0.845%	| 0.82059	|
| boats.bmp  | boats_j2000_r2.bmp	| 0.95965	| 0.95624	| +0.341%	| 0.77137	|
| boats.bmp  | boats_j2000_r3.bmp	| 0.94605	| 0.92346	| +2.259%	| 0.70380	|
| boats.bmp  | boats_j2000_r4.bmp	| 0.90338	| 0.89287	| +1.051%	| 0.65141	|
| boats.bmp  | boats_j2000_r5.bmp	| 0.82841	| 0.82815	| +0.026%	| 0.54581	|
