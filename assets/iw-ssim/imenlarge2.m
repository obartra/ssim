function imu = imenlarge2(im)

[M N] = size(im);
t1 = imresize(im, [4*M-3 4*N-3], 'bilinear');
t2 = zeros(4*M-1, 4*N-1);
t2(2:end-1, 2:end-1) = t1;
t2(1,:) = 2*t2(2,:) - t2(3,:);
t2(end,:) = 2*t2(end-1,:) - t2(end-2,:);
t2(:,1) = 2*t2(:,2) - t2(:,3);
t2(:,end) = 2*t2(:,end-1) - t2(:,end-2);
imu = t2(1:2:end, 1:2:end);