#!/bin/sh

LEGO=$HOME/src/lego/lms2012
P="`pwd`"
F="$P"/pxt
set -xe
cd $LEGO/lmssrc/adk/lmsasm
java -jar assembler.jar $F
cd "$P"
node -p 'require("fs").readFileSync("pxt.rbf").toString("hex").replace(/5858585858(58)+/, "XX")'
