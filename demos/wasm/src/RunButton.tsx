import { useState } from "react";
import { gs, type Result } from "@u1f992/ghostpdl";
import type { OutputStreamItem } from "./App";
import type { InputFiles } from "./Form";

export default function RunButton({
  args,
  stdin,
  inputFiles,
  outputFilePaths,
  setResult,
  addConsoleOutput,
  clearConsoleOutput,
}: {
  args: string;
  stdin: string;
  inputFiles: InputFiles;
  outputFilePaths: string;
  setResult: (result: Result | null) => void;
  addConsoleOutput: (item: OutputStreamItem) => void;
  clearConsoleOutput: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <button
      className="execute-btn"
      onClick={async () => {
        setIsLoading(true);
        setResult(null);
        clearConsoleOutput();

        try {
          setResult(
            await gs({
              args: args.trim() ? args.trim().split(/\s+/) : [],
              stdin: new TextEncoder().encode(stdin),
              inputFiles: Object.fromEntries(
                Object.entries(inputFiles).map(([, fileObj]) => [
                  fileObj.localName,
                  fileObj.data,
                ]),
              ),
              outputFilePaths: outputFilePaths.trim()
                ? outputFilePaths
                    .trim()
                    .split("\n")
                    .map((p) => p.trim())
                    .filter((p) => p)
                : [],
              onStdout: (charCode: number | null) => {
                if (charCode !== null) {
                  addConsoleOutput({ src: "stdout", charCode });
                }
              },
              onStderr: (charCode: number | null) => {
                if (charCode !== null) {
                  addConsoleOutput({ src: "stderr", charCode });
                }
              },
            }),
          );
        } catch (e) {
          const error = e as Error;
          `Error: ${error.message}`.split("").forEach((char) => {
            addConsoleOutput({
              src: "stderr",
              charCode: char.charCodeAt(0),
            });
          });
          setResult({
            exitCode: -1,
            outputFiles: {},
          });
        } finally {
          setIsLoading(false);
        }
      }}
      disabled={isLoading}
    >
      {isLoading ? "Running..." : "Run Ghostscript"}
    </button>
  );
}
