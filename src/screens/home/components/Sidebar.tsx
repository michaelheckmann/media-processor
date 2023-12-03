import { Checkbox } from "@/components/Checkbox";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { isMediaFile, isVideoFile } from "@/utils/isMediaFile";
import { isProjectFile } from "@/utils/isProjectFile";
import { isTranscriptJSON } from "@/utils/isTranscriptJSON";
import { Dispatch, SetStateAction } from "react";
import { isValidBlurArea } from "../utils/isValidBlurArea";
import {
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
  openFile: boolean;
  trimTo: string;
  language: string;
  compression: CompressionOption;
  model: ModelOption;
  callbackUrl: string;
  anonymizationStrengthVideo: string;
  anonymizationStrengthAudio: string;
  anonymizeFileName: string;
  blurArea: string;
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
    openFile,
    trimTo,
    language,
    compression,
    model,
    callbackUrl,
    anonymizationStrengthVideo,
    anonymizationStrengthAudio,
    anonymizeFileName,
    redactionConfigFile,
    exportOption,
    speakerMap,
    blurArea,
  } = config;

  const mediaFile = isMediaFile(file);
  const transcriptJSONFile = isTranscriptJSON(file);
  // console.log("transcriptJSONFile:", transcriptJSONFile);

  const projectFile = isProjectFile(file);
  // console.log("projectFile:", projectFile);

  const isValidFileForConfig = (t: TaskOption) =>
    (mediaFile && t !== "export") ||
    (projectFile && t === "export") ||
    (transcriptJSONFile && t === "transcribe");

  const showOptions = task !== "";
  const showOpenFile = task !== "";
  const showTrimTo = task === "compress" || task === "anonymize";
  const showLanguage = task === "transcribe" && !transcriptJSONFile;
  const showCompression = task === "compress";
  const showModel = task === "transcribe" && !transcriptJSONFile;
  const showCallbackUrl = task === "transcribe" && !transcriptJSONFile;
  const showTranscriptFileText = task === "transcribe" && transcriptJSONFile;
  const showAnonymizationStrengthVideo =
    task === "anonymize" && isVideoFile(file);
  const showAnonymizationStrengthAudio = task === "anonymize";
  const showAnonymizeFileName = task === "anonymize";
  const showBlurArea = task === "anonymize" && isVideoFile(file);
  const showRedactionConfig = task === "redact";
  const showExportOptions = task === "export";
  const showSpeakerMap = task === "export" && exportOption === "notion";

  const disableButton =
    // Disable during processing
    processingState === "processing" ||
    // Disable if there is no file
    !file ||
    // Disable if the file that was dropped is not valid for the current config
    !isValidFileForConfig(task) ||
    // Disable if there is no task
    task === "" ||
    // Disable if there is no reduaction config and task is redact
    (!redactionConfigFile.length && task === "redact") ||
    // Disable if the user tries to export to notion but the speaker map is invalid
    (task === "export" &&
      exportOption === "notion" &&
      !isValidSpeakerMap(speakerMap)) ||
    // Disable if the user tries to export to notion but the speaker map is invalid
    (task === "anonymize" && blurArea !== "" && !isValidBlurArea(blurArea));

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
              if (t.value === "" || !file) {
                return t;
              }

              if (isValidFileForConfig(t.value)) {
                return t;
              } else {
                return { ...t, disabled: true };
              }
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
                  onChange={(value) => {
                    const isEmpty = value === "";
                    const number = Number(value);
                    if (isEmpty || number > 0) {
                      onConfigChange("trimTo", value);
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
                  onChange={(value) => onConfigChange("language", value)}
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
              {showCallbackUrl && (
                <Input
                  label="Callback URL"
                  link="https://developers.deepgram.com/docs/using-callbacks-to-return-transcripts-to-your-server"
                  type="url"
                  optional
                  placeholder="Enter a URL"
                  value={callbackUrl}
                  tooltip="Enter the URL where you want to receive the transcript. Deepgram will send a POST request to this URL with the transcript as the body of the request. You can use a service like https://make.com/ for your callback URL."
                  onChange={(value) => onConfigChange("callbackUrl", value)}
                />
              )}
              {showTranscriptFileText && (
                <div className="font-mono select-none text-stone-500 text-2xs">
                  No further configuration necessary to transform
                  transcription.json
                </div>
              )}
              {showAnonymizationStrengthVideo && (
                <Input
                  label="Blur Strength"
                  type="number"
                  placeholder="Enter a number"
                  min={0}
                  value={anonymizationStrengthVideo}
                  tooltip="We recommend a value between 0 and 10. The higher the value, the stronger the blur."
                  onChange={(value) =>
                    onConfigChange("anonymizationStrengthVideo", value)
                  }
                />
              )}
              {showBlurArea && (
                <Input
                  label="Blur area"
                  type="text"
                  optional
                  placeholder="Enter a text"
                  tooltip="Enter the configuration of the area you want to blur. The format is 'w:h:x:y' where x and y are the coordinates of the top left corner of the area, w is the width and h is the height. For example, '20%:20%:40%:0%' will blur the area starting at x=40% and y=0, with a width of 20% and a height of 20%. You can use percentages or pixels."
                  value={blurArea}
                  onChange={(value) => onConfigChange("blurArea", value)}
                />
              )}
              {showAnonymizationStrengthAudio && (
                <Input
                  label="Pitch Shift Strength"
                  type="number"
                  placeholder="Enter a number"
                  min={0}
                  value={anonymizationStrengthAudio}
                  tooltip="We recommend a value between 0 and 4. The higher the value, the stronger the pitch shift."
                  onChange={(value) =>
                    onConfigChange("anonymizationStrengthAudio", value)
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
                  onChange={(value) =>
                    onConfigChange("anonymizeFileName", value)
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
                  onChange={(value) => onConfigChange("speakerMap", value)}
                />
              )}
              {showOpenFile && (
                <Checkbox
                  label="Open file after the transformation"
                  checked={openFile}
                  onChange={({ target }) =>
                    onConfigChange("openFile", target.checked)
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
