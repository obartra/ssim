LABORATORY FOR IMAGE AND VIDEO ENGINEERING
in collaboration with
CENTER FOR PERCEPTUAL SYSTEMS
at The University of Texas at Austin


-----------COPYRIGHT NOTICE STARTS WITH THIS LINE------------
Copyright (c) 2005 The University of Texas at Austin
All rights reserved.

Permission is hereby granted, without written agreement and without
license or royalty fees, to use, copy, modify, and distribute this
database (the images, the results and the source files) and its 
documentation for any purpose, provided that the copyright 
notice in its entirity appear in all copies of this 
database, and the original source of this database, Laboratory for 
Image and Video Engineering (LIVE, http://live.ece.utexas.edu) and 
Center for Perceptual Systems (CPS, http://www.cps.utexas.edu) at the 
University of Texas at Austin (UT Austin, http://www.utexas.edu), 
is acknowledged in any publication that reports research using this database.
The database is to be cited in the bibliography as:

H. R. Sheikh, Z. Wang, L. Cormack and A. C. Bovik, "LIVE Image Quality 
Assessment Database Release 2", http://live.ece.utexas.edu/research/quality.

IN NO EVENT SHALL THE UNIVERSITY OF TEXAS AT AUSTIN BE LIABLE TO ANY PARTY 
FOR DIRECT, INDIRECT, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES 
ARISING OUT OF THE USE OF THIS DATABASE AND ITS DOCUMENTATION, EVEN IF 
THE UNIVERSITY OF TEXAS AT AUSTIN HAS BEEN ADVISED OF THE POSSIBILITY OF 
SUCH DAMAGE.

THE UNIVERSITY OF TEXAS AT AUSTIN SPECIFICALLY DISCLAIMS ANY WARRANTIES,
INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE. THE DATABASE
PROVIDED HEREUNDER IS ON AN "AS IS" BASIS, AND THE UNIVERSITY OF
TEXAS AT AUSTIN HAS NO OBLIGATION TO PROVIDE MAINTENANCE, SUPPORT, UPDATES,
ENHANCEMENTS, OR MODIFICATIONS.

The following input images are from the CD "Austin and Vicinity" by Visual Delights Inc. 
(http://www.visualdelights.net) coinsinfountain.bmp, dancers.bmp, 
flowersonih35.bmp, studentsculpture.bmp, carnivaldolls.bmp, cemetry.bmp, 
manfishing.bmp, churchandcapitol.bmp, building2.bmp
These images were modified from the original (resized) and then distorted
to obtain images in the database. Permission to release these images and their 
distorted versions was graciously granted by Visual Delights Inc. These images may
not be used outside the scope of this database without their prior permission.
The rest of the images were public domain Kodak PhotoCD images obtained from the Internet.
-----------COPYRIGHT NOTICE ENDS WITH THIS LINE------------

Please contact Hamid Rahim Sheikh (hamid.sheikh@ieee.org) if you have any questions.
This investigators on this research were:
Dr. Hamid Rahim Sheikh (hamid.sheikh@ieee.org) 
Dr. Alan C. Bovik (bovik@ece.utexas.edu) -- Department of ECE at UT Austin
Dr. Lawrence Cormack (cormack@psy.utexas.edu) -- Department of Psychology at UT Austin
Dr. Zhou Wang (zhouwang@ieee.org)

-------------------------------------------------------------------------

The subjective experiment release comes with the following files:

* This readme file containing copyright information and usage information.
* Information files describing parameters used for generating the images
* Two subjective score files containing raw subject scores in text format
* alot of images in bmp format. Images of the filename img%%.bmp are the ones 
  used in the subjective testing. 



DETAILS OF THE DATABASE
~~~~~~~~~~~~~~~~~~~~~~~

29 input images were used to create a database whose results are being provided. 
These were distorted using the following distortion types: JPEG2000, JPEG, White noise
in the RGB components, Gaussian blur in the RGB components, and bit errors in JPEG2000
bitstream when transmitted over a simulated fast-fading Rayleigh channel. The details are
as follows:

JPEG2000:
The JPEG2000 codec used was Kakadu version 2.2 that comes with the book: 
"JPEG2000 Image compression fundamentls, standards and practice" by David 
Taubman and Michael Marcellin, 2002 Kluwer Academic Publishers.

The command for generation of the database was: 
kdu_compress -i  source_filename -o destination_filename -rate bitrate -no_weights
The source, destination and the bitrates are given in the info.txt file in the jp2k folder.


JPEG:
MATLAB's imwrite command was used to write JPEG files.

The command for generation of the database was: "imwrite(image, jpegfilename, 'Quality', q);"
The source, destination and the bitrates are given in the info.txt file in the JPEG folder. Note that 
the info file contains the "achieved" bit rate. The "Quality" parameter is not available.

White Noise:
White Gaussian noise of standard deviation sigma was added to RGB components of the images. 
The same sigma was used for R, G, and B components. The values of sigma uses are given in the 
info.txt file in the wn folder

Gaussian Blur:
R, G, and B components were filtered using a circular-symmetric 2-D Gaussian kernel of standard deviation sigma.
The value of sigma is given in the info.txt file in the gblur folder.

Fast Fading Rayleigh:
Receiver SNR (simulated) was used to generate images with different proportions of bit errors. 
The JPEG2000 bitstream was generated using the same codec as above using the following command:
kdu_compress -i image.bmp -o image.jp2 Sprecision=8 Ssigned={no} Cuse_sop={no} Cuse_eph={no} Corder={LRCP} -rate 2.5 "Cmodes=ERTERM|RESTART|RESET|CAUSAL|SEGMARK" Cuse_precincts={yes} Cprecincts={64,64}
Note that the source rate is 2.5 bits per pixel, and error resilience features in JPEG2000 were enabled.
The receiver SNR used to vary the distortion strenghts is given in the info.txt file in the fastfading folder.

DETAILS OF THE EXPERIMENTS AND PROCESSING OF RAW SCORES
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Details of the subjective testing can be found in:
H. R. Sheikh, "Image Quality Assessment Using Natural Scene Statistics," Ph.D. dissertation,
University of Texas at Austin, May 2004.

Briefly they are as follows:

Twenty-nine high-resolution 24-bits/pixel RGB color images
(typically 768 X 512) were distorted using five distortion
types: JPEG2000, JPEG, white noise in the RGB components, Gaussian
blur, and transmission errors in the JPEG2000 bit stream using a
fast-fading Rayleigh channel model. A database was derived from
the $29$ images such that each image had test versions with each
distortion type, and for each distortion type the perceptual
quality roughly covered the entire quality range. Observers were
asked to provide their perception of quality on a continuous
linear scale that was divided into five equal regions marked with
adjectives ``Bad", ``Poor", ``Fair", ``Good" and ``Excellent".
About 20-29 human observers rated each image. Each distortion type
was evaluated by different subjects in different experiments using
the same equipment and viewing conditions. In this way a total of
982 images, out of which 203 were the reference images, were
evaluated by human subjects in seven experiments. The raw scores
for each subject were converted to difference scores (between
the test and the reference) and then Z-scores and
then scaled and shifted to the full range (1 to 100). Finally, a 
Difference Mean Opinion Score (DMOS) value for each distorted image
was computed.


DETAILS OF FILES PROVIDED IN THIS RELEASE
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

INFORMATION FILES
The information fileS contains a list which describes how the database was created. 
Each line is separate entry in the image database: 
<Source image> <Destination image> <parameter>
where parameter depends on the distortion type as described above.

MATLAB mat files
The file dmos.mat has two arrays of length 982 each: dmos and orgs. orgs(i)==0 for distorted images.
The arrays dmos and orgs are arranged by concatenating the dmos (and orgs) variables
for each database as follows:

dmos=[dmos_jpeg2000(1:227) dmos_jpeg(1:233) white_noise(1:174) gaussian_blur(1:174) fast_fading(1:174)] where
dmos_distortion(i) is the dmos value for image "distortion\imgi.bmp" where distortion can be one of the five
described above.

The values of dmos when corresponding orgs==1 are zero (they are reference images). Note that imperceptible
loss of quality does not necessarily mean a dmos value of zero due to the nature of the score processing used.

The file refnames_all.mat contains a cell array refnames_all. Entry refnames_all{i} is the name of
the reference image for image i whose dmos value is given by dmos(i). If orgs(i)==0, then this is a valid
dmos entry. Else if orgs(i)==1 then image i denotes a copy of the reference image. The reference images are
provided in the folder refimgs.

Currently raw scores and standard deviations are not being released. They will be
released in the future.
