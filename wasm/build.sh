#!/bin/sh

apt update && apt install --yes autoconf

cd ..
cp arch/windows-x86-msvc.h arch/wasm32-unknown-emscripten.h
NOCONFIGURE=1 ./autogen.sh
emconfigure ./configure CCAUX=gcc --with-arch_h=arch/wasm32-unknown-emscripten.h --host=wasm32-unknown-emscripten
emmake make --jobs=$(nproc) XE=".html" GS_LDFLAGS="-s ALLOW_MEMORY_GROWTH=1 -s EXIT_RUNTIME=1 -s SINGLE_FILE=1"
cp bin/gs.js wasm/src/gs.js
