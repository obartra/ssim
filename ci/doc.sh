#!/bin/bash
# Makes sure documentation all is present and scores an an A (using inchjs)
#
# B and C stand for 'B' and 'C' rating respectively. 'U' means undocumented
# We want to make sure there are no results (B + C + U = 0) that fall within these categories

err=0
for N in `./node_modules/.bin/inchjs stats --format yaml | grep -oP '(?<=(B|C|U): )[0-9]+'`
do
  err=`expr $err + $N`;
done

if test $err -eq 0; then
  exit 0;
else
  echo "Documentation should be improved before it is mergeable. Only A ratings allowed:"
  ./node_modules/.bin/inchjs
  exit 1;
fi
