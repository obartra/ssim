function [iwssim iwmse iwpsnr]= iwssim(oimg, img, iw_flag, Nsc, K, L, weight, win, blk_size, parent, sigma_nsq)

MAX_PSNR = 1000;

if (nargin < 2 | nargin > 11)
    iwssim = -Inf;
    iwmse = -Inf;
    iwpsnr = -Inf;
    disp(['Input argument error']);
    return;
end

if (size(oimg) ~= size(img))
    iwssim = -Inf;
    iwmse = -Inf;
    iwpsnr = -Inf;
    disp(['Input argument error: images should have the same size']);
    return;
end

if (~exist('iw_flag'))
   iw_flag = 1;
end

if (~exist('Nsc'))
   Nsc = 5;
end

if (~exist('K'))
   K = [0.01 0.03]; % default from [Wang et al, IEEE-TIP 2004]
end

if (~exist('L'))
   L = 255;
end

if (~exist('weight'))
   weight = [0.0448 0.2856 0.3001 0.2363 0.1333]; % default from [Wang et al, IEEE-Asilomar 2003]
end

if (exist('win'))
    winSz = size(win);
    if (winSz(1) ~= winSz(2))
        iwssim = -Inf;
        iwmse = -Inf;
        iwpsnr = -Inf;
        disp(['Window size error']);
        return;
    end
    win_size = winSz(1);
else
    win_size = 11; % default from [Wang et al, IEEE-TIP 2004]
    gwin_std = 1.5; % default from [Wang et al, IEEE-TIP 2004]
    win = fspecial('gaussian', win_size, gwin_std); % default from [Wang et al, IEEE-TIP 2004]
    win = win/sum(win(:));
end

if (~exist('blk_size'))
   blk_size = 3; % spatial neighborhood size
end

if (~exist('parent'))
   parent = 1; % include parent neighbor
end

if (~exist('sigma_nsq'))
   sigma_nsq = 0.4; % default from [Sheikh & Bovik, IEEE-TIP 2006]
end

blSzX = blk_size; 
blSzY = blk_size;
Nsc = min(5,Nsc);
weight = weight(1:Nsc);
weight = weight/sum(weight);
if (min(size(oimg)) < win_size*(2^(Nsc-1)))
    iwssim = -Inf;
    iwmse = -Inf;
    iwpsnr = -Inf;
    disp(['Image size too small for ' num2str(Nsc) ' scale IW-SSIM evaluation.']);
    return;
end
bound = ceil((win_size-1)/2);
bound1 = bound - floor((blSzX-1)/2);

[pyro,pind]= buildLpyr(double(oimg),Nsc);
[pyrd,pind]= buildLpyr(double(img),Nsc);

[cs_map l_map se_map] = scale_quality_maps(pyro,pyrd,pind,Nsc,K,L,win);
if (iw_flag)
    iw_map = info_content_weight_map(pyro,pyrd,pind,Nsc,parent,blSzX,blSzY,sigma_nsq);
end

for s = 1:Nsc
    se = se_map{s};
    cs = cs_map{s};
    if (s==Nsc)
        cs = cs.*l_map;
    end
    if (iw_flag)
        if (s<Nsc)
            iw = iw_map{s};
            iw = iw(bound1+1:end-bound1, bound1+1:end-bound1);
        else
            iw = ones(size(cs));
        end
        se = se(bound+1:end-bound, bound+1:end-bound);        
        wmcs(s) = sum(sum(cs.*iw))/sum(sum(iw));
        wmse(s) = sum(sum(se.*iw))/sum(sum(iw));
    else
        wmcs(s) = mean2(cs);
        wmse(s) = mean2(se);
    end
end

iwmse = prod(wmse(1:Nsc).^weight(1:Nsc));
iwpsnr = min(10*log10(255^2/iwmse), MAX_PSNR);
iwssim = prod(wmcs(1:Nsc).^weight(1:Nsc));
