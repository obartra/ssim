%contrast-structure similarity map and squared error map for each scale, and luminance similarity map for the coarsest scale
function [cs_map l_map se_map]= scale_quality_maps(pyro,pyrd,pind,Nsc,K,L,win)
    if (nargin < 3 | nargin > 7)
        cs_map = -Inf;
        l_map = -Inf;
    	se_map = -Inf;
        disp(['Input argument error']);
        return;
    end
    if (~exist('Nsc'))
        Nsc = size(pind,1);
    end
    if (~exist('K'))
        K = [0.01 0.03]; % default from [Wang et al, IEEE-TIP 2004]
    end
    if (~exist('L'))
        L = 255;
    end
    if (~exist('win'))
        win = fspecial('gaussian', 11, 1.5); % default from [Wang et al, IEEE-TIP 2004]
        win = win/sum(win(:));
    end

    pyro = real(pyro);
    pyrd = real(pyrd);
    C1 = (K(1)*L)^2;
    C2 = (K(2)*L)^2;

    for i=1:Nsc
        y = pyrBand(pyro, pind, i);
        yn = pyrBand(pyrd, pind, i);
        se_map{i} = (y-yn).^2;
        
        mu1 = filter2(win, y, 'valid');
        mu2 = filter2(win, yn, 'valid');
        sigma12 = filter2(win, y.*yn, 'valid') - mu1.*mu2;
        sigma1_sq  = filter2(win, y.^2, 'valid') - mu1.^2;
        sigma2_sq  = filter2(win, yn.^2, 'valid') - mu2.^2;
        sigma1_sq = max(0, sigma1_sq);
        sigma2_sq = max(0, sigma2_sq);
        cs_map{i} = (2*sigma12 + C2)./(sigma1_sq + sigma2_sq + C2);
        
        if (i == Nsc)
            l_map = (2*mu1.*mu2 + C1)./(mu1.^2 + mu2.^2 + C1);
        end
    end