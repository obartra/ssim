import { defaults } from "../../src/defaults";
import { downsample } from "../../src/downsample";
import { samples } from "../helpers/matrices";
import { Options } from "../../src/types";

describe("downsample", () => {
  let options: Options;

  beforeEach(() => {
    options = { ...defaults };
  });
  test("should not honor max size parameter if it is more than half the size", () => {
    const A = { data: samples["24x18"].gray, width: 24, height: 18 };
    const B = { data: samples["24x18-degraded"].gray, width: 24, height: 18 };
    const limMaxSize: Options = {
      ...options,
      downsample: "original",
      maxSize: 13
    };

    const resized = downsample([A, B], limMaxSize);

    expect(resized[0]).toEqual(
      expect.objectContaining({
        width: 24,
        height: 18
      })
    );
    expect(resized[1]).toEqual(
      expect.objectContaining({
        width: 24,
        height: 18
      })
    );
    expect(resized.length).toBe(2);
  });

  test("should honor max size parameter if it is at least half the size", () => {
    const A = { data: samples["24x18"].gray, width: 24, height: 18 };
    const B = { data: samples["24x18-degraded"].gray, width: 24, height: 18 };
    const limMaxSize: Options = {
      ...options,
      downsample: "original",
      maxSize: 12
    };

    const resized = downsample([A, B], limMaxSize);

    expect(resized[0]).toEqual(
      expect.objectContaining({
        width: 12,
        height: 9
      })
    );
    expect(resized[1]).toEqual(
      expect.objectContaining({
        width: 12,
        height: 9
      })
    );
    expect(resized.length).toBe(2);
  });

  test("should default max size parameter to 256", () => {
    const A = { data: samples["24x18"].gray, width: 24, height: 18 };
    const B = { data: samples["24x18-degraded"].gray, width: 24, height: 18 };
    const limMaxSize: Options = {
      ...options,
      downsample: "original",
      maxSize: undefined
    };
    const resized = downsample([A, B], limMaxSize);

    expect(resized[0]).toEqual(
      expect.objectContaining({
        width: 24,
        height: 18
      })
    );
    expect(resized[1]).toEqual(
      expect.objectContaining({
        width: 24,
        height: 18
      })
    );
    expect(resized.length).toBe(2);
  });
});
