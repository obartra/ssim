# Generate

This folder contains scripts related to the manipulation of the Matlab results published relatd to SSIM so that they can be easily compared with the JS output

## LIVE database

- [SSIM](https://en.wikipedia.org/wiki/Structural_similarity) (Structural Similarity) results were obtained from the "LIVE results" at: https://ece.uwaterloo.ca/~z70wang/research/ssim
- [MOS](https://en.wikipedia.org/wiki/Mean_opinion_score) (Mean Opinion Score) results were obtained from the "Release 2" dataset at: http://live.ece.utexas.edu/research/quality/subjective.htms

### JS Comparison

The `compareLIVESSIM.m` script generates multiple csv files containing the reference image, the compared image, generated MSSIM results and reported MSSIM results.

Reported results and generated ones do not match exactly although they are fairly similar, diverging, on average, by 0.0024 (`mean(abs(computed_ssim - LIVE_ssim_all))`). These are differences between the published results and the results of running the published Matlab scripts. They are likely due to the different aggregation methods of MOS between "Release 1" and "Release 2".

The generated csv files can then be processed by `LIVEresults.js` to generate the JSON file at `spec/samples/LIVE.json`. The main reason for commiting the file (vs. generating it on the fly) is that it takes a couple minutes to create and it would require additional dependencies (Octave or Matlab) to run the integration tests.

### Regeneration

Note that you don't have to regenerate this file to validate the results. If you want to though, you would run (in Matlab / Octave):

```Matlab
>> compareLIVESSIM
```

That will create one csv file per image distorsion type on the LIVE database. Then from your terminal:

```shell
node LIVEresults.js
```

This will create a new JSON file with the results and replace `spec/samples/LIVE.json`. Now if you run:

```shell
node spec/e2e/live.spec.js
```

The integration tests for the LIVE database will run. Make sure you have `npm install`'ed your dependencies and have generated a build (`npm run build`)

### Plot

To reproduce the plot of Figure 8 (d) on the [SSIM paper](assets/ssim.pdf), you can run:

```Matlab
plot
```

This will create 2 graphs:
- `reported_results.png`: Generated with the published results
- `computed_results.png`: Generated with the results derived from the published Matlab scripts

Note that in order to be able to generate `computed_results.png` you'll need to have run `compareLIVESSIM` first so that the computed results are available.

Also note that graphs are generated including all distorsions. The paper only includes the JPEG and JPEG2000 ones because those where the only ones available for "Release 1" at publication time. Another difference is that these graphs do not exclude any outliers.

### Numerical comparison

To compute the values from this section we'll need to load `LIVE_SSIM_results`, `dmos.mat` and `computed_ssim` (generated after running `compareLIVESSIM`). In addition, we'll convert dmos values to mos (0-100). The following snipet would do it:

```Matlab
>> compareLIVESSIM
>> load LIVE_SSIM_results
>> load computed_ssim
>> load dmos
>> nmos = 100 - (dmos_all - min(dmos_all)) / (max(dmos_all) - min(dmos_all)) * 100;
```

Now we have `LIVE_ssim_all`, `nmos` and `computed_ssim` variables available. They should all be arrays of size `[1:982]`. The first `[1:460]` elements represent the JPEG and JPEG2000 results.

#### Correlation

Focusing only on the JPEG and JPEG2000 results, we can determine the correlation by simply running:

```Matlab
>> corr(LIVE_ssim_all(1:460), nmos(1:460))
ans =  0.91666
>> corr(computed_ssim(1:460), nmos(1:460))
ans =  0.91399
```

If we compare the entire dataset the correlation worsens:

```Matlab
>> corr(LIVE_ssim_all, nmos)
ans =  0.82832
>> corr(computed_ssim, nmos)
ans =  0.82093
```

#### RMSE (Root Mean Squared Error)

Similarly, for RMSE:

```Matlab
>> sqrt(mean((nmos(1:460) - LIVE_ssim_all(1:460)).^2));
ans =  71.735
>> sqrt(mean((nmos(1:460) - computed_ssim(1:460)).^2))
ans =  71.735
>> sqrt(mean((nmos - computed_ssim).^2))
ans =  68.752
>> sqrt(mean((nmos - LIVE_ssim_all).^2))
ans =  68.752
```

#### Discussion

These results include outliers and use a larger dataset so they differ from the ones originally reported. They also suggest a stronger correlation when detecting JPEG artifacts than other kinds of distorsions.
