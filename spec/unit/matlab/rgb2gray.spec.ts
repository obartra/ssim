import { rgb2gray } from "../../../src/matlab/rgb2gray";

describe("rgb2gray", () => {
  test("should calculate luminance for RGB", () => {
    const luma = rgb2gray({ data: [100, 200, 50], width: 3, height: 1 })
      .data[0];

    expect(luma).toBe(153);
  });

  test("should return the same value if all pixels are the same", () => {
    const luma = rgb2gray({ data: [200, 200, 200], width: 3, height: 1 })
      .data[0];

    expect(luma).toBe(200);
  });

  test("should weight each color based on the ITU spec", () => {
    const rLuma = rgb2gray({ data: [100, 0, 0], width: 3, height: 1 }).data[0];
    const gLuma = rgb2gray({ data: [0, 100, 0], width: 3, height: 1 }).data[0];
    const bLuma = rgb2gray({ data: [0, 0, 100], width: 3, height: 1 }).data[0];

    expect(rLuma).toBe(30);
    expect(gLuma).toBe(59);
    expect(bLuma).toBe(11);
  });
});
