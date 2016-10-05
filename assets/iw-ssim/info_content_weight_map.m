%compute information content weight map for Scale 1 to Nsc-1
function [iw_map]= info_content_weight_map(pyro,pyrd,pind,Nsc,parent,blSzX,blSzY,sigma_nsq)
tol = 1e-15;

if (~exist('Nsc'))
   Nsc = size(pind, 1);
end
if (~exist('parent'))
   parent = 1; % include parent neighbor
end
if (~exist('blSzX'))
   blSzX = 3;
end
if (~exist('blSzY'))
   blSzY = 3;
end
if (~exist('sigma_nsq'))
   sigma_nsq = 0.4; % default from [Sheikh & Bovik, IEEE-TIP 2006]
end
Nband = Nsc-1;    
win = ones(3); % window for estimating gain factor g
win = win/sum(sum(win));

pyro = real(pyro);
pyrd = real(pyrd);
for nband=1:Nband
    y = pyrBand(pyro, pind, nband);
    yn = pyrBand(pyrd, pind, nband);
    
    mean_x   = filter2(win, y, 'same');
    mean_y   = filter2(win, yn, 'same');
    cov_xy = filter2(win, y.*yn, 'same') - mean_x.*mean_y;
    ss_x  = filter2(win, y.^2, 'same') - mean_x.^2;
    ss_y  = filter2(win, yn.^2, 'same') - mean_y.^2;
    ss_x(ss_x<0)=0;
    ss_y(ss_y<0)=0;
    
    g = cov_xy./(ss_x+tol);  % estimate gain factor
    vv = (ss_y - g.*cov_xy); % estimation error
    g (ss_x < tol) = 0;
    vv (ss_x < tol) = ss_y (ss_x < tol);
    ss_x(ss_x<tol)=0;
    g (ss_y < tol) = 0;
    vv (ss_y < tol) = 0;
    
    aux = y;
    [Nsy,Nsx] = size(aux);
    prnt = parent & (nband < Nsc-1);   % check parent availability
    BL = zeros(size(aux,1),size(aux,2),1 + prnt);
    BL(:,:,1) = aux;
    if prnt,
        auxp = pyrBand(pyro, pind, nband+1);
        auxp = real(imenlarge2(auxp));
        BL(:,:,2) = auxp(1:Nsy,1:Nsx);
    end
    y=BL;
    [nv,nh,nb] = size(y);
    block = [blSzX blSzY];
      
    nblv = nv-block(1)+1;	% discard outer coefficients 
    nblh = nh-block(2)+1;   % for centrral coefficients (avoid boundary effects)
    nexp = nblv*nblh;		% number of coefficients
    N = prod(block) + prnt; % size of the neighborhood
    Ly = (block(1)-1)/2;
    Lx = (block(2)-1)/2;
    if (Ly~=floor(Ly))|(Lx~=floor(Lx)),
        error('Spatial dimensions of neighborhood must be odd!');
    end

    % Next: rearrange 'nexp' neighborhoods
    Y = zeros(nexp,N);
    n = 0;
    for ny=-Ly:Ly,	% spatial neighbors
        for nx=-Lx:Lx,
            n = n + 1;
            foo = shift(y(:,:,1),[ny nx]);
            foo = foo(Ly+1:Ly+nblv,Lx+1:Lx+nblh);
            Y(:,n) = foo(:);
        end
    end
    if prnt,	% parent
        n = n + 1;
        foo = y(:,:,2);
        foo = foo(Ly+1:Ly+nblv,Lx+1:Lx+nblh);
        Y(:,n) = foo(:);
    end

    C_u = innerProd(Y)/nexp;    % positive-definete covariance matrix
    [Q,L] = eig(C_u);           % eigenvalues with orthogonal matrix Q
    L = diag(diag(L).*(diag(L)>0))*sum(diag(L))/(sum(diag(L).*(diag(L)>0))+(sum(diag(L).*(diag(L)>0))==0)); % correct negative eigenvalues, maintaining variance
    C_u = Q*L*Q';
    ss = (Y*inv(C_u)).*Y/N;
    ss = sum(ss,2);
    ss = reshape(ss,nblv,nblh);
    L = diag(L);    
    g = g(Ly+1:Ly+nblv,Lx+1:Lx+nblh);
    vv = vv(Ly+1:Ly+nblv,Lx+1:Lx+nblh);
    
% compute info-weight using I(R;E|S)+I(R;F|S)-I(E;F|S), discarded
%     temp1=0; temp2=0; temp3=0;
%     for j=1:length(L)
%         temp1=temp1+(((log2(1+g.*g.*ss.*L(j)./(vv+sigma_nsq))))); % distorted image information for the i'th subband
%         temp2=temp2+(((log2(1+ss.*L(j)./(sigma_nsq))))); % reference image information
%  %       temp3=temp3+log2((ss.*L(j)+sigma_nsq).*(g.*g.*ss.*L(j)+vv+sigma_nsq)./(ss.*L(j).*(vv+sigma_nsq)+g.*g.*ss.*L(j)*sigma_nsq+sigma_nsq.*(sigma_nsq+vv))); % mutual information of E F
%        temp3=temp3+log2(1 + (ss.*g.*L(j)).^2./(ss.*(sigma_nsq+vv+g.*g.*sigma_nsq).*L(j) + sigma_nsq.*(vv+sigma_nsq))); % mutual information of E F
%     end
%     infow = temp1 + temp2 - temp3;

    infow = zeros(size(g));
    for j=1:length(L)
        infow = infow + log2(1 + ((vv+(1+g.*g).*sigma_nsq).*ss.*L(j)+sigma_nsq.*vv)./(sigma_nsq.*sigma_nsq)); % info-weight = I(R;E|S)+I(D;F|S)-I(E;F|S)
    end
    infow(infow < tol) = 0;
    iw_map{nband} = infow;
end  