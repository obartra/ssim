function compare(name, start, end)
	[parentdir,~,~]=fileparts(pwd);
	load(fullfile(parentdir,'LIVE_SSIM_results'))
	load(fullfile(parentdir,'computed_ssim'))

	nmos = 100 - (dmos_all - min(dmos_all)) / (max(dmos_all) - min(dmos_all)) * 100;
	fid = fopen('out.dat');
	out = textscan(fid, '%s %s %s %f %f %f');
	fclose(fid);
	total = size(out{1}, 1);

	index = 1;
	set = zeros(1, end - start);
	for i = 1:total
		if (strcmp(out{2}(i), name) || strcmp(name, 'all'))
			set(index) = out{6}(i);
			index += 1;
		end
	end
	clf;
	color1 = [62 150 81] ./ 255;
	color2 = [146 36 40] ./ 255;
	color3 = [0 0 0] ./ 255;
	scatter(LIVE_ssim_all(start:end), nmos(start:end), 6, color1, 's', 'filled');
	hold on;
	scatter(computed_ssim(start:end), nmos(start:end), 6, color2, 'p', 'filled');
	hold on;
	scatter(set, nmos(start:end), 6, color3, 'h', 'filled');
	grid on;
	legend('original', 'ssim.js', 'Bezkrovny', 'location', 'northeastoutside');
	xlabel('mssim score');
	ylabel('subjective rating');
	title(name);
	print(strcat(name, '.png'));

	corr_original = corr(LIVE_ssim_all(start:end), nmos(start:end))
	corr_ssimjs = corr(computed_ssim(start:end), nmos(start:end))
	corr_bezkrovny = corr(set, nmos(start:end))

	mse_original = sqrt(mean((nmos(start:end)/100 - LIVE_ssim_all(start:end)).^2));
	mse_ssimjs = sqrt(mean((nmos(start:end)/100 - computed_ssim(start:end)).^2));
	mse_bezkrovny = sqrt(mean((nmos(start:end)/100 - set).^2));''

	max_original = max(abs(nmos(start:end)/100 - LIVE_ssim_all(start:end)));
	max_ssimjs = max(abs(nmos(start:end)/100 - computed_ssim(start:end)));
	max_bezkrovny = max(abs(nmos(start:end)/100 - set));
end
