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

import { gs } from "./index.js";

import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

await test("gs --version", async () => {
  const outputChars: number[] = [];
  const ret = await gs({
    args: ["--version"],
    onStdout: (charCode) => {
      if (charCode !== null) {
        outputChars.push(charCode);
      }
    },
  });
  const log = new TextDecoder().decode(new Uint8Array(outputChars));
  assert.strictEqual(log, "10.05.1\n");
});

await test("gs -dNOPAUSE -dBATCH -sDEVICE=ps2write -sOutputFile=manuscript.ps manuscript.pdf", async () => {
  const write = (charCode: number | null) => {
    if (charCode !== null) {
      process.stderr.write(new Uint8Array([charCode]));
    }
  };
  const ret = await gs({
    args: [
      "-dNOPAUSE",
      "-dBATCH",
      "-sDEVICE=ps2write",
      "-sOutputFile=manuscript.ps",
      "manuscript.pdf",
    ],
    inputFiles: {
      "manuscript.pdf": fs.readFileSync(
        path.resolve(__dirname, "../asset/manuscript.pdf"),
      ),
    },
    onStdout: write,
    onStderr: write,
    outputFilePaths: ["manuscript.ps"],
  });
  assert.strictEqual(ret.exitCode, 0);
  assert.ok("manuscript.ps" in ret.outputFiles);

  fs.writeFileSync(
    path.resolve(__dirname, "../asset/manuscript.ps"),
    ret.outputFiles["manuscript.ps"],
  );
});
