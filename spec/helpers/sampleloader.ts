import { join } from "path";
import { readFileSync } from "fs";

const testPath = join(__dirname, "../");

function toMx(txt: Buffer): number[][] {
  return txt
    .toString()
    .trim()
    .split("\n")
    .map(line => line.split(",").map(val => parseInt(val || "0", 10)));
}

export function loadCsv(samples: { [key: string]: string }) {
  const csvs = Object.keys(samples).map(key => ({
    [key]: toMx(readFileSync(join(testPath, samples[key])))
  }));

  return Object.assign({}, ...csvs);
}
