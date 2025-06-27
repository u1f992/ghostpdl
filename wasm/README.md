# @u1f992/ghostpdl

WASM build variant of [ArtifexSoftware/ghostpdl](https://github.com/ArtifexSoftware/ghostpdl).

This build only provides an interface to run the Ghostscript CLI, and is not a WASM build as a library (JavaScript bindings).

## Build

```
$ npm run clean
$ npm run build
```

## Test

```
$ npm run test
```

## License

The build scripts and glue codes I created are provided under [GPL-3.0](./LICENSE).

For the license of ArtifexSoftware/ghostpdl, please see [LICENSE-ghostpdl](./LICENSE-ghostpdl).
