import { useState } from "react";
import { setDefaultGradient, setSuccessGradient } from "../utils/gradients";
import { Header } from "./Header";
import { Main } from "./Main";
import { Sidebar, TransformationConfig } from "./Sidebar";

export const Root = () => {
  const [file, setFile] = useState<File | null>(null);

  const onGenerate = async (config: TransformationConfig) => {
    const success = await window.electronAPI.transformMedia(file.path, config);
    if (success) {
      setSuccessGradient();
    } else {
      setDefaultGradient();
    }
  };

  return (
    <div className="flex flex-col w-full h-full">
      <Header />
      <main className="flex flex-1">
        <Sidebar {...{ file, onGenerate }} />
        <Main handleDrop={setFile} {...{ file }} />
      </main>
    </div>
  );
};
