% Generate the SSIM values for each distorsion type

c0 = recompile('jp2k', 1, 227);
c1 = recompile('jpeg', 228, 460);
c2 = recompile('wn', 461, 634);
c3 = recompile('gblur', 635, 808);
c4 = recompile('fastfading', 809, 982);

% Concatenate all distorsions in the same order than LIVE_ssim_all (so they are comparable)
computed_ssim = horzcat(c0, c1, c2, c3, c4);

save('computed_ssim.mat', 'computed_ssim');
