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

import Worker from "web-worker";

export type Options = {
  args: string[];
  stdin: Uint8Array<ArrayBufferLike>;
  inputFiles: Record<string, Uint8Array<ArrayBufferLike>>;
  outputFilePaths: string[];
  onStdout?: (charCode: number | null) => void;
  onStderr?: (charCode: number | null) => void;
  transfer?: Transferable[];
};

export type Result = {
  exitCode: number;
  outputFiles: Record<string, Uint8Array<ArrayBuffer>>;
};

export async function gs({
  args,
  stdin,
  inputFiles,
  outputFilePaths,
  onStdout,
  onStderr,
  transfer,
}: Partial<Options>): Promise<Result> {
  args ??= [];
  stdin ??= new Uint8Array();
  inputFiles ??= {};
  outputFilePaths ??= [];
  onStdout ??= () => {};
  onStderr ??= () => {};
  transfer ??= [];

  const worker = new Worker(new URL("./worker.js", import.meta.url), {
    type: "module",
  });
  return new Promise<Result>((resolve, reject) => {
    worker.addEventListener("message", (e) => {
      const data = e.data as
        | { type: "stdout"; charCode: number | null }
        | { type: "stderr"; charCode: number | null }
        | { type: "complete"; result: Result };
      if (data.type === "stdout") {
        onStdout(data.charCode);
      } else if (data.type === "stderr") {
        onStderr(data.charCode);
      } else if (data.type === "complete") {
        worker.terminate();
        resolve(data.result);
      }
    });
    worker.addEventListener("error", (error) => {
      worker.terminate();
      reject(new Error(`Worker error: ${error.message}`));
    });
    worker.postMessage(
      {
        args,
        stdin,
        inputFiles,
        outputFilePaths,
      },
      transfer,
    );
  });
}
