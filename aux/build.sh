#!/bin/sh

LEGO=$HOME/src/lego/lms2012
P="`pwd`"
F="$P"/pxt
set -e
cd $LEGO/lmssrc/adk/lmsasm
echo "Compiling..."
java -jar assembler.jar $F
cd "$P"
echo "Hex to paste:"
echo
echo "const rbfTemplate = \`"
node -p 'require("fs").readFileSync("pxt.rbf").toString("hex").replace(/5858585858(58)+/, "XX").replace(/.{1,80}/g, f => f + "\n").trim()'
echo "\`"
echo
rm -f pxt.rbf
