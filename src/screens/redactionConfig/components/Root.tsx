import { useRef, useState } from "react";

import { Dropzone } from "@/components/Dropzone";
import { loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { TextEditor } from "./TextEditor";

loader.config({ monaco });

const validator = (file: File) => {
  if (
    !file.path?.endsWith("transcript.txt") &&
    !file.path?.endsWith("redaction-config.txt")
  ) {
    return {
      code: "wrong-file",
      message:
        "Please select a transcript or redaction config file to get started.",
    };
  }

  return null;
};

export const Root = () => {
  const [transcript, setTranscript] = useState("");

  const filePath = useRef("");

  const handleDrop = async (file: File) => {
    const t = await file.text();
    setTranscript(t);
    filePath.current = file.path ?? "";
  };

  const handleSave = async (value: string) => {
    // Save the value to a new file and put in the same
    // directory as the original file
    const newFileName = "redaction-config.txt";
    const newFilePath = filePath.current.endsWith(newFileName)
      ? filePath.current
      : filePath.current.replace(/transcript\.txt$/, newFileName);

    if (newFilePath) {
      return await window.electronAPI.saveRedactionConfig(newFilePath, value);
    }
    return false;
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="w-full flex items-center text-sm justify-center font-semibold text-stone-300 border-b-1 h-[2.4rem] border-stone-700 tracking-wide bg-stone-900/80 gap-2 drag-header">
        Redaction Configuration
      </div>
      <main className="flex flex-col items-center justify-center flex-1 overflow-hidden">
        <Dropzone
          {...{ handleDrop }}
          dragInactiveText="Drag 'n' drop a redaction-config.txt"
          dropZoneProps={{
            accept: {
              "text/plain": [".txt"],
            },
            multiple: false,
            maxFiles: 1,
            noClick: true,
            validator,
          }}
        >
          <TextEditor initialValue={transcript} onSave={handleSave} />
        </Dropzone>
      </main>
    </div>
  );
};
