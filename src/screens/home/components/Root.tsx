import { useEffect, useState } from "react";
import { setDefaultGradient, setSuccessGradient } from "../utils/gradients";
import { Header } from "./Header";
import { Main } from "./Main";
import { Sidebar, TransformationConfig } from "./Sidebar";

export type ProcessingState = "idle" | "processing" | "success" | "error";

export const Root = () => {
  const [file, setFile] = useState<File | null>(null);
  const [config, setConfig] = useState<TransformationConfig>({
    task: "",
    trimTo: "",
    language: "de",
    compression: "medium",
    model: "whisper-large",
    callbackUrl: "",
    anonymizationStrengthVideo: "8",
    anonymizationStrengthAudio: "3",
    anonymizeFileName: "",
    blurArea: "",
    redactionConfigFile: "",
    exportOption: "notion",
    speakerMap: "",
  });

  const [processingState, setProcessingState] =
    useState<ProcessingState>("idle");

  const onGenerate = async (config: TransformationConfig) => {
    setProcessingState("processing");
    const success = await window.electronAPI.transformMedia(file.path, config);
    if (success) {
      setProcessingState("success");
      setSuccessGradient();
    } else {
      setProcessingState("error");
      setDefaultGradient();
    }
  };

  const handleDrop = (file: File) => {
    setFile(file);
    setProcessingState("idle");
    setDefaultGradient();
  };

  useEffect(() => {
    window.electronAPI.handleRedactionConfigSaved((_, filePath: string) => {
      setConfig((config) => ({ ...config, redactionConfigFile: filePath }));
    });
  }, []);

  return (
    <div className="flex flex-col w-full h-full">
      <Header />
      <main className="flex flex-1">
        <Sidebar
          {...{ file, config, setConfig, onGenerate, processingState }}
        />
        <Main {...{ file, config, processingState, handleDrop }} />
      </main>
    </div>
  );
};
