import { useState } from "react";
import "./App.css";

import type { Result as GSResult } from "@u1f992/ghostpdl";

import Form from "./Form";
import Result from "./Result";

export type OutputStreamItem = {
  src: "stdout" | "stderr";
  charCode: number;
};

function App() {
  const [result, setResult] = useState<GSResult | null>(null);
  const [consoleOutput, setConsoleOutput] = useState<OutputStreamItem[]>([]);

  return (
    <div className="container">
      <div className="header">
        <h1>Ghostscript Web Interface</h1>
      </div>
      <div className="content">
        <Form
          setResult={setResult}
          addConsoleOutput={(item) => {
            setConsoleOutput((prev) => [...prev, item]);
          }}
          clearConsoleOutput={() => {
            setConsoleOutput([]);
          }}
        />
        <Result result={result} consoleOutput={consoleOutput} />
      </div>
    </div>
  );
}

export default App;
