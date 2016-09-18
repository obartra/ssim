| Process		| Status	|
|---------------|-----------|
| Build Status	| [![CircleCI](https://circleci.com/gh/obartra/ssim/tree/master.svg?style=shield)](https://circleci.com/gh/obartra/ssim/tree/master) |
| Code Coverage	| [![Test Coverage](https://codeclimate.com/github/obartra/ssim/badges/coverage.svg)](https://codeclimate.com/github/obartra/ssim/coverage) |
| Code Quality	| [![Code Climate](https://codeclimate.com/github/obartra/ssim/badges/gpa.svg)](https://codeclimate.com/github/obartra/ssim) [![Issue Count](https://codeclimate.com/github/obartra/ssim/badges/issue_count.svg)](https://codeclimate.com/github/obartra/ssim) |
| Commit format	| [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) |
| Dependencies	| [![Known Vulnerabilities](https://snyk.io/test/github/obartra/ssim/badge.svg)](https://snyk.io/test/github/obartra/ssim) [![DavidDM](https://david-dm.org/obartra/ssim.svg)](https://david-dm.org/obartra/ssim) |
| Environments	| ![](https://img.shields.io/badge/node-6.6-brightgreen.svg) |
| Documentation	| [![InchCI](https://inch-ci.org/github/obartra/ssim.svg?branch=master)](https://inch-ci.org/github/obartra/ssim) [![API Doc](https://doclets.io/obartra/ssim/master.svg)](https://doclets.io/obartra/ssim/master) |

### This project is under active development and not ready to be used ATM

# SSIM.JS

SSIM.JS is a pure JS implementation of the SSIM algorithm published by [Wong, et al. 2003](/assets/wangetal2003.pdf) on "Image Quality Assessment: From Error Visibility to Structural Similarity".

The code is based on [get-pixels](https://github.com/scijs/get-pixels) for image loading, [ssim](https://github.com/bytespider/ssim) for single window SSIM computation and on Wong's Matlab implementation of [SSIM](/assets/ssim_index.m).

There are many great SSIM implementations already. See for instance:

| Language  | Link |
| --------- | ---- |
| JS 		| [Image SSIM](https://github.com/darosh/image-ssim-js) [image-ms-ssim](https://www.npmjs.com/package/image-ms-ssim) |
| TS		| [image-quantization](https://github.com/igor-bezkrovny/image-quantization/blob/9f62764ac047c3e53accdf1d7e4e424b0ef2fb60/src/quality/ssim.ts) |
| C++		| [Lefungus](http://perso.wanadoo.fr/reservoir/) [Mehdi Rabah](http://mehdi.rabah.free.fr/SSIM/) |
| Java 		| [Gabriel Prieto](http://www.ucm.es/gabriel_prieto/ssim) |
| Python 	| [Helder](https://github.com/helderc/src/blob/master/SSIM_Index.py) |

The rationale for this project is to replicate their logic while adding tests that ensure results match the original datasets.

# Installation

Not yet published 😞

# Usage

```javascript

import ssim from 'package-name';

ssim('./img1.jpg', './img2.jpg')
	.then(out => console.log(`SSIM: ${out}`))
	.catch(err => console.error('Error generating SSIM', err));
```
