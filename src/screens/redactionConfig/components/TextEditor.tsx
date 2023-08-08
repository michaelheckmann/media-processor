import { useEffect, useRef, useState } from "react";

import { Editor, loader } from "@monaco-editor/react";
import { clsx } from "clsx";
import * as monaco from "monaco-editor";

import { ErrorBoundary } from "react-error-boundary";

monaco.languages.register({ id: "vtt" });
monaco.languages.setMonarchTokensProvider("vtt", {
  tokenizer: {
    root: [
      [/^WEBVTT/, "keyword"],
      [/^(\d\d:){2}\d\d\.\d\d\d --> (\d\d:){2}\d\d\.\d\d\d/, "timestamp"],
      [/^WEBVTT/, "keyword"],
      [/^Speaker \d/, "speaker"],
      [/^\/\//, "comment"],
      [/<.*?>/, "speaker"],
      [/(\[.*?\])/, "redaction"],
      [/\((.*?)\)/, "replacement"],
    ],
  },
});
monaco.editor.defineTheme("media-processor", {
  base: "vs-dark",
  inherit: true,
  rules: [
    { token: "keyword", foreground: "BD72A8" },
    { token: "timestamp", foreground: "7E87D6" },
    { token: "comment", foreground: "3E4044" },
    { token: "redaction", foreground: "3E4044", fontStyle: "italic" },
    { token: "replacement", foreground: "46A473" },
    { token: "speaker", foreground: "A38F2D" },
  ],
  colors: {},
});

loader.config({ monaco });

type Props = {
  initialValue: string;
  onSave: (value: string) => Promise<boolean>;
};

export const TextEditor = ({ initialValue, onSave }: Props) => {
  const [mounted, setMounted] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const ref = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const handleMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    ref.current = editor;
    ref.current.onKeyDown(async (e) => {
      if (e.metaKey && e.code === "KeyS") {
        e.preventDefault();
        const success = onSave(ref.current?.getValue() ?? "");
        setIsDirty(!success);
      }
    });
    ref.current.onDidChangeModelContent(() => {
      setIsDirty(true);
    });
    setMounted(true);
    setIsDirty(false);
  };

  useEffect(() => {
    if (ref.current) {
      ref.current.setValue(initialValue);
    }
  }, [initialValue]);

  return (
    <>
      {/* Show a loading indicator that disappears when the editor is mounted */}
      {!mounted && (
        <div className="flex items-center justify-center w-full h-full">
          <div className="w-32 h-32 border-b-2 border-gray-500 rounded-full animate-spin"></div>
        </div>
      )}
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        {isDirty && (
          <div className="absolute z-10 px-2 py-[2px] text-[10px] font-semibold font-mono text-red-50 bg-red-900 rounded-[0.4rem] top-[9px] right-[9px]">
            Unsaved changes
          </div>
        )}
        <Editor
          theme="media-processor"
          defaultLanguage="vtt"
          defaultValue={initialValue}
          onMount={handleMount}
          options={{
            fontFamily: "monospace",
            contextmenu: false,
            wordWrap: "on",
          }}
          className={clsx("transition-opacity duration-700", {
            "opacity-0": !mounted,
            "opacity-100": mounted,
          })}
        />
      </ErrorBoundary>
    </>
  );
};
