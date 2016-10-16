load LIVE_SSIM_results;
load dmos;
load computed_ssim; % the computed ssim from running 'comparedLIVESSIM'

nmos = 100 - (dmos_all - min(dmos_all)) / (max(dmos_all) - min(dmos_all)) * 100;

% Generate the reported SSIM plot
clf;
scatter(LIVE_ssim_all(809:982), nmos(809:982), 'blue', 'd'); %FAST FADING
hold on;
scatter(LIVE_ssim_all(635:808), nmos(635:808), 'blue', 's'); %GAUSSIAN BLUR
hold on;
scatter(LIVE_ssim_all(461:634), nmos(461:634), 'blue', 'o'); %WHITENOISE
hold on;
scatter(LIVE_ssim_all(228:460), nmos(228:460), 'black', '*'); %JPEG
hold on;
scatter(LIVE_ssim_all(1:227), nmos(1:227), 'black', '+'); %JPEG2000
hold on;
grid on;
legend('FAST FADING', 'GAUSSIAN BLUR', 'WHITE NOISE', 'JPEG Images', 'JPEG2000 Images', 'location', 'northeastoutside');
print('reported_results.png')


% Generate the computed SSIM plot
clf;
scatter(computed_ssim(809:982), nmos(809:982), 'blue', 'd'); %FAST FADING
hold on;
scatter(computed_ssim(635:808), nmos(635:808), 'blue', 's'); %GAUSSIAN BLUR
hold on;
scatter(computed_ssim(461:634), nmos(461:634), 'blue', 'o'); %WHITENOISE
hold on;
scatter(computed_ssim(228:460), nmos(228:460), 'black', '*'); %JPEG
hold on;
scatter(computed_ssim(1:227), nmos(1:227), 'black', '+'); %JPEG2000
hold on;
grid on;
legend('FAST FADING', 'GAUSSIAN BLUR', 'WHITE NOISE', 'JPEG Images', 'JPEG2000 Images', 'location', 'northeastoutside');
print('computed_results.png')
