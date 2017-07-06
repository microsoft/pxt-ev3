#!/bin/sh

LEGO=$HOME/src/lego/lms2012
F=`pwd`/pxt
set -xe
cd $LEGO/lmssrc/adk/lmsasm
java -jar assembler.jar $F
