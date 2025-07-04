import React, { useState } from "react";
import type { Result } from "@u1f992/ghostpdl";
import FileInput from "./FileInput";
import RunButton from "./RunButton";
import type { OutputStreamItem } from "./App";

export type InputFiles = {
  [fileName: string]: {
    data: Uint8Array;
    localName: string;
  };
};

function Form({
  setResult,
  addConsoleOutput,
  clearConsoleOutput,
}: {
  setResult: React.Dispatch<React.SetStateAction<Result | null>>;
  addConsoleOutput: (item: OutputStreamItem) => void;
  clearConsoleOutput: () => void;
}) {
  const [args, setArgs] = useState("");
  const [stdin, setStdin] = useState("");
  const [outputFilePaths, setOutputFilePaths] = useState("");
  const [inputFiles, setInputFiles] = useState<InputFiles>({});

  return (
    <>
      <div className="grid">
        <div>
          <div className="form-group">
            <label>args:</label>
            <input
              type="text"
              value={args}
              onChange={(e) => setArgs(e.target.value)}
              placeholder="e.g., -dNOPAUSE -dBATCH -sDEVICE=ps2write input.pdf"
            />
          </div>
          <div className="form-group">
            <label>stdin:</label>
            <textarea
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
              placeholder="Enter text to pass to stdin..."
            />
          </div>
        </div>
        <div>
          <FileInput inputFiles={inputFiles} setInputFiles={setInputFiles} />
          <div className="form-group">
            <label>outputFilePaths: (one per line)</label>
            <textarea
              value={outputFilePaths}
              onChange={(e) => setOutputFilePaths(e.target.value)}
              placeholder="output.pdf&#10;output.png&#10;other-output.ps"
            />
          </div>
        </div>
      </div>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <RunButton
          args={args}
          stdin={stdin}
          inputFiles={inputFiles}
          outputFilePaths={outputFilePaths}
          setResult={setResult}
          addConsoleOutput={addConsoleOutput}
          clearConsoleOutput={clearConsoleOutput}
        />
      </div>
    </>
  );
}

export default Form;
