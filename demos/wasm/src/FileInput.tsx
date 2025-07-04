import { useRef, type ChangeEvent } from "react";
import type { InputFiles } from "./Form";

function FileInput({
  inputFiles,
  setInputFiles,
}: {
  inputFiles: InputFiles;
  setInputFiles: React.Dispatch<React.SetStateAction<InputFiles>>;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files) return;

    const newFiles: InputFiles = {};

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const arrayBuffer = await file.arrayBuffer();
      newFiles[file.name] = {
        data: new Uint8Array(arrayBuffer),
        localName: file.name,
      };
    }

    setInputFiles((prev) => ({ ...prev, ...newFiles }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function removeFile(fileName: string) {
    setInputFiles((prev) => {
      const newFiles = { ...prev };
      delete newFiles[fileName];
      return newFiles;
    });
  }

  function updateLocalName(fileName: string, newLocalName: string) {
    setInputFiles((prev) => ({
      ...prev,
      [fileName]: {
        ...prev[fileName],
        localName: newLocalName,
      },
    }));
  }

  return (
    <div className="form-group">
      <label>inputFiles:</label>
      <div className="file-input" onClick={() => fileInputRef.current?.click()}>
        <input
          type="file"
          multiple
          ref={fileInputRef}
          onChange={handleFileUpload}
        />
        <div>Click to select files or drag and drop</div>
      </div>
      {Object.keys(inputFiles).length > 0 && (
        <div className="file-list">
          {Object.entries(inputFiles).map(([fileName, fileObj]) => (
            <div key={fileName} className="file-item">
              <div className="file-info">
                <div className="original-name">Original: {fileName}</div>
                <div className="local-name-input">
                  <label>Local name:</label>
                  <input
                    type="text"
                    value={fileObj.localName}
                    onChange={(e) => updateLocalName(fileName, e.target.value)}
                    placeholder="Enter local file name"
                  />
                </div>
              </div>
              <button
                className="remove-btn"
                onClick={() => removeFile(fileName)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FileInput;
