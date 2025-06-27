// @ts-ignore
import Module from "./gs.js";

export type Options = {
  args: string[];
  stdin: Uint8Array;
  inputFiles: { filePath: string; content: Uint8Array }[];
  outputFilePaths: string[];
};

export async function gs({
  args,
  stdin,
  inputFiles,
  outputFilePaths,
}: Partial<Options>) {
  args ??= [];
  stdin ??= new Uint8Array();
  inputFiles ??= [];
  outputFilePaths ??= [];

  const outputStreams: { src: "stdout" | "stderr"; charCode: number }[] = [];
  let stdinOffset = 0;

  const module = await Module({
    preRun(mod: any) {
      // https://emscripten.org/docs/api_reference/Filesystem-API.html#FS.init
      mod.FS.init(
        () => (stdinOffset < stdin.length ? stdin[stdinOffset++] : null),
        (charCode: number) => {
          if (charCode !== null)
            outputStreams.push({ src: "stdout", charCode });
        },
        (charCode: number) => {
          if (charCode !== null)
            outputStreams.push({ src: "stderr", charCode });
        },
      );
    },
  });

  for (const { filePath, content } of inputFiles) {
    module.FS.writeFile(filePath, content);
  }

  // https://github.com/emscripten-core/emscripten/pull/14865
  const exitCode = module.callMain(args);

  const outputFiles: Record<string, Uint8Array> = {};
  for (const filePath of outputFilePaths) {
    outputFiles[filePath] = module.FS.readFile(filePath);
  }

  return { exitCode, outputStreams, outputFiles };
}
