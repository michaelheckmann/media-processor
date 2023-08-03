import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { Dispatch, SetStateAction } from "react";
import {
  COMPRESSIONS,
  CompressionOption,
  MODELS,
  ModelOption,
  TASKS,
  TaskOption,
} from "../utils/sidebarOptions";
import { ProcessingState } from "./Root";

export type TransformationConfig = {
  task: TaskOption;
  language: string;
  compression: CompressionOption;
  model: ModelOption;
};

type Props = {
  file: File | null;
  config: TransformationConfig;
  setConfig: Dispatch<SetStateAction<TransformationConfig>>;
  onGenerate: (config: TransformationConfig) => void;
  processingState: ProcessingState;
};

export const Sidebar = ({
  file,
  config,
  setConfig,
  onGenerate,
  processingState,
}: Props) => {
  const { task, language, compression, model } = config;

  const showOptions = task !== "";
  const showLanguage = task === "transcribe" || task === "ner";
  const showCompression = task === "compress";
  const showModel = task === "transcribe";

  const disableButton =
    processingState === "processing" ||
    !file ||
    !showOptions ||
    (language !== "en" && model === "nova");

  const onConfigChange = (key: keyof TransformationConfig, value: string) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const onGenerateClick = () => {
    onGenerate(config);
  };

  return (
    <div className="flex flex-col w-48 gap-4 py-4 bg-stone-900/80 border-r-1 border-stone-700">
      <div className="pb-5 border-dashed border-b-1 border-stone-700">
        <div className="flex flex-col gap-2 px-4">
          <Select
            label="Task"
            options={TASKS}
            value={task}
            onChange={({ target }) => onConfigChange("task", target.value)}
          />
        </div>
      </div>

      {showOptions && (
        <>
          <div className="border-dashed border-b-1 border-stone-700">
            <div className="flex flex-col gap-4 px-4 mb-6">
              {showLanguage && (
                <Input
                  label="Language"
                  link="developers.deepgram.com/docs/languages-overview"
                  type="text"
                  placeholder="Enter a language code"
                  max={2}
                  value={language}
                  onChange={({ target }) =>
                    onConfigChange("language", target.value)
                  }
                />
              )}
              {showCompression && (
                <Select
                  label="Compression"
                  options={COMPRESSIONS}
                  value={compression}
                  onChange={({ target }) =>
                    onConfigChange("compression", target.value)
                  }
                />
              )}
              {showModel && (
                <Select
                  label="Model"
                  link="developers.deepgram.com/docs/models-overview"
                  options={MODELS}
                  value={model}
                  onChange={({ target }) =>
                    onConfigChange("model", target.value)
                  }
                />
              )}
            </div>
          </div>
          <div className="px-4">
            <button onClick={onGenerateClick} disabled={disableButton}>
              {processingState === "processing" ? "..." : "Generate"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};
