import { defaults } from "../../src/defaults";
import { mean2d } from "../../src/math";
import { originalSsim } from "../../src/originalSsim";
import { bezkrovnySsim } from "../../src/bezkrovnySsim";
import { roundTo } from "../helpers/round";
import { ssim as fastSsim } from "../../src/ssim";
import { Options } from "../../src/types";
import { samples, sampleCsv } from "../helpers/matrices";

describe.each`
  ssim             | name
  ${fastSsim}      | ${"fast"}
  ${originalSsim}  | ${"original"}
  ${bezkrovnySsim} | ${"bezkrovny"}
`(`$name`, ({ ssim }) => {
  let options: Options;
  let k0Options: Options;

  beforeEach(() => {
    options = { ...defaults };
    k0Options = { ...defaults, k1: 0, k2: 0 };
  });

  test("should return 1 for equal data", () => {
    const A = samples["24x18"].gray;
    const ssimMap = ssim(A, A, options);

    expect(ssimMap.data.every((datum: number) => datum === 1)).toBe(true);
  });

  test("should return 1 when k1 and k2 are 0", () => {
    const A = samples["24x18"].gray;
    const ssimMap = ssim(A, A, k0Options);

    expect(ssimMap.data.every((datum: number) => datum === 1)).toBe(true);
  });
});

describe.each`
  ssim            | name
  ${fastSsim}     | ${"fast"}
  ${originalSsim} | ${"original"}
`(`$name`, ({ ssim }) => {
  let options: Options;
  let k0Options: Options;

  beforeEach(() => {
    options = { ...defaults };
    k0Options = { ...defaults, k1: 0, k2: 0 };
  });

  test("should return same results than original script", () => {
    const A = samples["24x18"].gray;
    const B = samples["24x18-degraded"].gray;
    const ssimMap = ssim(A, B, defaults);

    expect(roundTo(mean2d(ssimMap), 5)).toBe(0.46275);
  });

  test("should return same results than original when k1 and k2 are 0", () => {
    const A = samples["24x18"].gray;
    const B = samples["24x18-degraded"].gray;
    const ssimMap = ssim(A, B, k0Options);

    expect(roundTo(mean2d(ssimMap), 5)).toBe(0.45166);
  });

  test("UQI should match script results", () => {
    const uqiMap = ssim(sampleCsv.lena, sampleCsv.lena02876, k0Options);
    const uqiOut = roundTo(mean2d(uqiMap), 5);

    expect(uqiOut).toBe(0.2392);
  });
});
