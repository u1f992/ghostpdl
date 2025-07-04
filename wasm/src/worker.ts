/*
 * Copyright (C) 2025  Koutaro Mukai
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
import type { Options } from "./index.js";

addEventListener(
  "message",
  async (
    e: MessageEvent<
      Pick<Options, "args" | "stdin" | "inputFiles" | "outputFilePaths">
    >,
  ) => {
    const { args, stdin, inputFiles, outputFilePaths } = e.data;

    const module = await Module({
      preRun(mod: any) {
        let stdinOffset = 0;
        // https://emscripten.org/docs/api_reference/Filesystem-API.html#FS.init
        mod.FS.init(
          () => (stdinOffset < stdin.length ? stdin[stdinOffset++] : null),
          (charCode: number | null) => {
            postMessage({ type: "stdout", charCode });
          },
          (charCode: number | null) => {
            postMessage({ type: "stderr", charCode });
          },
        );
      },
    });

    for (const [filePath, content] of Object.entries(inputFiles)) {
      // @ts-ignore
      module.FS.writeFile(filePath, content);
    }

    // @ts-ignore
    const exitCode: number = module.callMain(args);

    const outputFiles: Record<string, Uint8Array<ArrayBufferLike>> = {};
    const transferables: ArrayBuffer[] = [];
    for (const filePath of outputFilePaths) {
      // @ts-ignore
      const fileData = module.FS.readFile(filePath);
      outputFiles[filePath] = fileData;
      transferables.push(fileData.buffer);
    }

    postMessage(
      {
        type: "complete",
        result: { exitCode, outputFiles },
      },
      transferables,
    );
  },
);
