import type { Result as GSResult } from "@u1f992/ghostpdl";
import type { OutputStreamItem } from "./App";

import OutputFiles from "./OutputFiles";

function Result({
  result,
  consoleOutput,
}: {
  result: GSResult | null;
  consoleOutput: OutputStreamItem[];
}) {
  return (
    <div className="results">
      <h3>Results</h3>
      <div>
        <h4>Exit Code</h4>
        <div className="exit-code">{result ? result.exitCode : ""}</div>
      </div>
      <div>
        <h4>Console Output</h4>
        <div className="console">
          {consoleOutput.map((stream, index) => {
            const char = String.fromCharCode(stream.charCode);
            const className = stream.src === "stderr" ? "stderr" : "stdout";
            return (
              <span key={index} className={className}>
                {char}
              </span>
            );
          })}
        </div>
      </div>
      {result && Object.keys(result.outputFiles).length !== 0 && (
        <OutputFiles outputFiles={result.outputFiles || {}} />
      )}
    </div>
  );
}

export default Result;
