import JSZip from "jszip";
import type { Result } from "@u1f992/ghostpdl";

export function downloadFile(fileName: string, data: Uint8Array) {
  const blob = new Blob([data], { type: "application/octet-stream" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function downloadAllAsZip(
  files: Record<string, Uint8Array>,
  zipName = "ghostpdl-output.zip",
) {
  if (Object.keys(files).length === 0) {
    return;
  }

  const zip = new JSZip();

  // Add all output files to the zip
  Object.entries(files).forEach(([fileName, data]) => {
    zip.file(fileName, data);
  });

  // Generate the zip file
  const zipBlob = await zip.generateAsync({ type: "blob" });

  // Download the zip file
  const url = URL.createObjectURL(zipBlob);
  const a = document.createElement("a");
  a.href = url;
  a.download = zipName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function OutputFiles({ outputFiles }: Pick<Result, "outputFiles">) {
  if (Object.keys(outputFiles).length === 0) {
    return null;
  }

  return (
    <div className="output-files">
      <h4>Output Files</h4>
      <div className="download-buttons">
        {Object.entries(outputFiles).map(([fileName, data]) => (
          <button
            key={fileName}
            className="download-btn"
            onClick={() => downloadFile(fileName, data)}
          >
            Download {fileName}
          </button>
        ))}
      </div>
      {Object.keys(outputFiles).length > 1 && (
        <button
          className="download-all-btn"
          onClick={() => downloadAllAsZip(outputFiles)}
        >
          Download All as ZIP
        </button>
      )}
    </div>
  );
}

export default OutputFiles;
