function comp = recompile(type, start, fi)

pkg load image;
load LIVE_SSIM_results.mat;
load refnames_all.mat
addpath('../assets/ssim/');

total = fi - start + 1;
S = cell(total, 4);
comp = zeros(1, total);

for i = 1:total
  targetName = cellstr(strcat('img', num2str(i))){1};
  refName = refnames_all(start + i - 1);

  target = cellstr(strcat('../spec/samples/LIVE/', type, '/', targetName, '.bmp')){1};
  ref = cellstr(strcat('../spec/samples/LIVE/refimgs/', refName)){1};

  targeti = rgb2gray(imread(target));
  refi = rgb2gray(imread(ref));

  comp(1, i) = ssim(targeti, refi);
  S(i, 1) = refName;
  S(i, 2) = targetName;
  S(i, 3) = comp(i);
  S(i, 4) = LIVE_ssim_all(start + i - 1);
end;

cell2csv(cellstr(strcat(type, '.csv')){1}, S)

return
