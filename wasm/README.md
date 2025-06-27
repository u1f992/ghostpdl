```
docker run \
  --entrypoint /bin/bash \
  --interactive \
  --mount type=bind,source="$(pwd)",target=/workdir \
  --rm \
  --tty \
  --workdir /workdir \
  emscripten/emsdk:4.0.10
```