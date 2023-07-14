import { useState } from "react";
import { Input } from "../../../components/Input";
import { Select } from "../../../components/Select";
import {
  COMPRESSIONS,
  CompressionOption,
  TASKS,
  TaskOption,
} from "../utils/sidebarOptions";

export type GenerationConfig = {
  task: TaskOption;
  language: string;
  compression: CompressionOption;
};

type Props = {
  file: File | null;
  onGenerate: (config: GenerationConfig) => void;
};

export const Sidebar = ({ file, onGenerate }: Props) => {
  const [config, setConfig] = useState<GenerationConfig>({
    task: "",
    language: "de",
    compression: "medium",
  });

  const showOptions = config.task !== "";
  const showLanguage = config.task === "transcribe" || config.task === "ner";
  const showCompression = config.task === "reduce";

  const disableButton = !file || !showOptions;

  const onConfigChange = (key: keyof GenerationConfig, value: string) => {
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
            value={config.task}
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
                  link="www.google.de"
                  type="text"
                  placeholder="Enter a language code"
                  max={2}
                  value={config.language}
                  onChange={({ target }) =>
                    onConfigChange("language", target.value)
                  }
                />
              )}
              {showCompression && (
                <Select
                  label="Compression"
                  options={COMPRESSIONS}
                  value={config.compression}
                  onChange={({ target }) =>
                    onConfigChange("compression", target.value)
                  }
                />
              )}
            </div>
          </div>
          <div className="px-4">
            <button onClick={onGenerateClick} disabled={disableButton}>
              Generate
            </button>
          </div>
        </>
      )}
    </div>
  );
};
