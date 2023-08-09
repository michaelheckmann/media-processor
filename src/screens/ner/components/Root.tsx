import { useState } from "react";

import { Main } from "./Main";

export type ProcessingState = "idle" | "processing" | "success" | "error";

export const Root = () => {
  const [scriptFile, setScriptFile] = useState<File | null>(null);
  const [txtFile, setTXTFile] = useState<File | null>(null);
  const [processingState, setProcessingState] =
    useState<ProcessingState>("idle");

  const handleScriptDrop = (file: File) => {
    setScriptFile(file);
  };

  const handleTXTDrop = (file: File) => {
    setTXTFile(file);
  };

  const runScript = async () => {
    if (!scriptFile || !txtFile) return;
    setProcessingState("processing");
    const success = await window.electronAPI.runNER(
      scriptFile.path,
      txtFile.path
    );
    if (success) {
      setProcessingState("success");
    } else {
      setProcessingState("error");
    }
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="w-full flex items-center pl-24 pr-4 text-sm font-semibold text-stone-300 border-b-1 h-[2.4rem] border-stone-700 tracking-wide bg-stone-900/80 gap-2">
        <div className="flex items-center justify-center flex-1 drag-header">
          <div>NER</div>
        </div>
        <div>
          <button
            onClick={runScript}
            disabled={!(scriptFile && txtFile) || processingState !== "idle"}
            className="px-3 py-1"
          >
            Run script
          </button>
        </div>
      </div>
      <main className="flex flex-col items-center justify-center flex-1 overflow-hidden">
        {(processingState === "processing" || processingState === "idle") && (
          <Main
            {...{
              handleScriptDrop,
              handleTXTDrop,
              processingState,
              txtFile,
              runScript,
            }}
          />
        )}
        {processingState === "success" && (
          <div className="flex flex-col items-center justify-center flex-1 pb-6 overflow-hidden text-green-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-32 h-32 mb-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>

            <div className="text-xl font-semibold text-stone-300">
              Script ran successfully!
            </div>
            <div className="text-lg font-medium text-stone-600">
              Check the output folder
            </div>
          </div>
        )}
        {processingState === "error" && (
          <div className="flex flex-col items-center justify-center flex-1 overflow-hidden text-red-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-32 h-32 mb-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>

            <div className="text-xl font-semibold text-stone-300">
              Something went wrong
            </div>
            <div className="text-lg font-medium text-stone-600">
              Check the logs
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
