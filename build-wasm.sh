#!/bin/sh

docker run \
  --entrypoint /bin/bash \
  --interactive \
  --mount type=bind,source="$(pwd)",target=/workdir \
  --rm \
  --tty \
  --workdir /workdir \
  emscripten/emsdk:4.0.10 \
  -c '
    apt update &&
    apt install --yes autoconf &&
    NOCONFIGURE=1 ./autogen.sh &&
    cp arch/windows-x86-msvc.h arch/wasm32-unknown-emscripten.h &&
    emconfigure ./configure CCAUX=gcc --with-arch_h=arch/wasm32-unknown-emscripten.h --host=wasm32-unknown-emscripten &&
    emmake make --jobs=$(nproc) XE=".html" GS_LDFLAGS="-s ALLOW_MEMORY_GROWTH=1 -s EXIT_RUNTIME=1 -s SINGLE_FILE=1" &&
    cp bin/gs.js src/gs.js &&
    rm -f arch/wasm32-unknown-emscripten.h'
