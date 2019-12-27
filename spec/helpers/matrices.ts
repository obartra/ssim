import imageSamples from "./imageSamples.json";
import { loadCsv } from "./sampleloader";
import { flatMxToData } from "./util";

const sampleCsv = loadCsv({
  lena: "./samples/lena/q1.csv",
  lena02876: "./samples/lena/q02876.csv"
});
const samples = JSON.parse(JSON.stringify(imageSamples));

Object.keys(samples).forEach(key => {
  Object.keys(samples[key]).forEach(skey => {
    samples[key][skey] = flatMxToData(samples[key][skey]);
  });
});
Object.keys(sampleCsv).forEach(key => {
  sampleCsv[key] = flatMxToData(sampleCsv[key]);
});

export { samples, sampleCsv };
