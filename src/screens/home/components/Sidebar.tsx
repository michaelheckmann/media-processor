import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { isMediaFile } from "@/utils/isMediaFile";
import { Dispatch, SetStateAction } from "react";
import {
  ANONYMIZATIONS,
  AnonymizationStrengthOption,
  COMPRESSIONS,
  CompressionOption,
  EXPORTS,
  ExportOption,
  MODELS,
  ModelOption,
  TASKS,
  TaskOption,
} from "../utils/sidebarOptions";
import { isValidSpeakerMap } from "../utils/transformSpeakerMap";
import { ProcessingState } from "./Root";

export type TransformationConfig = {
  task: TaskOption;
  trimTo: string;
  language: string;
  compression: CompressionOption;
  model: ModelOption;
  anonymizationStrength: AnonymizationStrengthOption;
  anonymizeFileName: string;
  redactionConfigFile: string;
  exportOption: ExportOption;
  speakerMap: string;
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
  const {
    task,
    trimTo,
    language,
    compression,
    model,
    anonymizationStrength,
    anonymizeFileName,
    redactionConfigFile,
    exportOption,
    speakerMap,
  } = config;

  const showOptions = task !== "";
  const showTrimTo = task === "compress" || task === "anonymize";
  const showLanguage = task === "transcribe";
  const showCompression = task === "compress";
  const showModel = task === "transcribe";
  const showAnonymizationStrength = task === "anonymize";
  const showAnonymizeFileName = task === "anonymize";
  const showRedactionConfig = task === "redact";
  const showExportOptions = task === "export";
  const showSpeakerMap = task === "export" && exportOption === "notion";

  const mediaFile = isMediaFile(file);
  const isValidFileForConfig =
    (mediaFile && task !== "export") || (!mediaFile && task === "export");

  const disableButton =
    // Disable during processing
    processingState === "processing" ||
    // Disable if there is no file
    !file ||
    // Disable if the file that was dropped is not valid for the current config
    !isValidFileForConfig ||
    // Disable if there is no task
    task === "" ||
    // Disable if there is no reduaction config and task is redact
    (!redactionConfigFile.length && task === "redact") ||
    // Disable if the user tries to use the 'nova' model with a language other than 'en'
    (language !== "en" && model === "nova") ||
    // Disable if there is no spea
    (task === "export" &&
      exportOption === "notion" &&
      !isValidSpeakerMap(speakerMap));

  const onConfigChange = (key: keyof TransformationConfig, value: unknown) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const onGenerateClick = () => {
    onGenerate(config);
  };

  const onOpenRedactionConfig = () => {
    window.electronAPI.openRedactionConfig(redactionConfigFile);
  };

  const onOpenNER = () => {
    window.electronAPI.openNER();
  };

  return (
    <div className="flex flex-col w-48 gap-4 py-4 bg-stone-900/80 border-r-1 border-stone-700">
      <div className="pb-5 border-dashed border-b-1 border-stone-700">
        <div className="flex flex-col gap-2 px-4">
          <Select
            label="Task"
            options={TASKS.map((t) => {
              if (t.value === "") {
                return t;
              }
              if (!file) {
                return t;
              }
              if (t.value === "export" && mediaFile) {
                return { ...t, disabled: true };
              }
              if (t.value !== "export" && !mediaFile) {
                return { ...t, disabled: true };
              }
              return t;
            })}
            value={task}
            onChange={({ target }) => onConfigChange("task", target.value)}
          />
        </div>
      </div>

      {showOptions && (
        <>
          <div className="border-dashed border-b-1 border-stone-700">
            <div className="flex flex-col gap-6 px-4 mb-4">
              {showTrimTo && (
                <Input
                  label="Trim to (seconds)"
                  type="number"
                  min={1}
                  optional
                  placeholder="Enter a number"
                  value={trimTo}
                  onChange={({ target }) => {
                    const isEmpty = target.value === "";
                    const number = Number(target.value);
                    if (isEmpty || number > 0) {
                      onConfigChange("trimTo", target.value);
                    }
                  }}
                />
              )}
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
              {showAnonymizationStrength && (
                <Select
                  label="Anonymization Strength"
                  options={ANONYMIZATIONS}
                  value={anonymizationStrength}
                  onChange={({ target }) =>
                    onConfigChange("anonymizationStrength", target.value)
                  }
                />
              )}
              {showAnonymizeFileName && (
                <Input
                  label="Anonymize Filename"
                  type="text"
                  optional
                  placeholder="Enter a text"
                  tooltip="Enter the text you want to anonymize in the file name. Entering a text like 'michael' will turn a filname like 'michael__001.mp4' into 'blue_flamingo__001.mp4'"
                  value={anonymizeFileName}
                  onChange={({ target }) =>
                    onConfigChange("anonymizeFileName", target.value)
                  }
                />
              )}
              {showRedactionConfig && (
                <div className="flex flex-col gap-6">
                  <button onClick={onOpenNER}>Run NER Script</button>
                  <button onClick={onOpenRedactionConfig}>
                    Edit Redaction Config
                  </button>
                </div>
              )}
              {showExportOptions && (
                <Select
                  label="Export Options"
                  options={EXPORTS}
                  value={exportOption}
                  onChange={({ target }) =>
                    onConfigChange("exportOption", target.value)
                  }
                />
              )}
              {showSpeakerMap && (
                <Input
                  label="Map Speakers"
                  type="text"
                  optional
                  placeholder="Enter a configuration"
                  tooltip="Enter the names of the speakers. It should follow the format '0:john, 1:mary'."
                  value={speakerMap}
                  onChange={({ target }) =>
                    onConfigChange("speakerMap", target.value)
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
