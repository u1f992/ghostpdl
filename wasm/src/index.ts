/*
 * Copyright (C) <year>  Koutaro Mukai
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import Module from "./gs.js";

export type Options = {
  args: string[];
  stdin: Uint8Array;
  inputFiles: { filePath: string; content: Uint8Array }[];
  outputFilePaths: string[];
};

export type Result = {
  exitCode: number;
  outputStreams: {
    src: "stdout" | "stderr";
    charCode: number;
  }[];
  outputFiles: Record<string, Uint8Array<ArrayBufferLike>>;
};

export async function gs({
  args,
  stdin,
  inputFiles,
  outputFilePaths,
}: Partial<Options>): Promise<Result> {
  args ??= [];
  stdin ??= new Uint8Array();
  inputFiles ??= [];
  outputFilePaths ??= [];

  const outputStreams: Result["outputStreams"] = [];
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
    // @ts-ignore
    module.FS.writeFile(filePath, content);
  }

  // https://github.com/emscripten-core/emscripten/pull/14865
  // @ts-ignore
  const exitCode: Result["exitCode"] = module.callMain(args);

  const outputFiles: Result["outputFiles"] = {};
  for (const filePath of outputFilePaths) {
    // @ts-ignore
    outputFiles[filePath] = module.FS.readFile(filePath);
  }

  return { exitCode, outputStreams, outputFiles };
}
