import { useRef, useState } from "react";

import { Dropzone } from "@/components/Dropzone";
import { loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { TextEditor } from "./TextEditor";

loader.config({ monaco });

export const Root = () => {
  const [fileContent, setFileContent] = useState("");

  const filePath = useRef("");

  const handleDrop = async (file: File) => {
    const t = await file.text();
    setFileContent(t);
    filePath.current = file.path ?? "";
  };

  const handleSave = async (value: string) => {
    return await window.electronAPI.saveFile(filePath.current, value);
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="w-full flex items-center text-sm justify-center font-semibold text-stone-300 border-b-1 h-[2.4rem] border-stone-700 tracking-wide bg-stone-900/80 gap-2 drag-header">
        Editor
      </div>
      <main className="flex flex-col items-center justify-center flex-1 overflow-hidden">
        <Dropzone
          {...{ handleDrop }}
          dragInactiveText="Drag 'n' drop a file"
          dropZoneProps={{
            multiple: false,
            maxFiles: 1,
            noClick: true,
          }}
        >
          <TextEditor
            initialValue={fileContent}
            onSave={handleSave}
            defaultLanguage="markdown"
          />
        </Dropzone>
      </main>
    </div>
  );
};
