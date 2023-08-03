import { TransformationConfig } from "@/screens/home/components/Sidebar";
import { spawnSync } from "child_process";
import ffmpeg from "fluent-ffmpeg";
import { lookup } from "mime-types";
import { onEnd, onError, onProgress } from "../utils/ffmpegOptions";
import { getOutFilePath } from "../utils/getOutPaths";

const anonymizeAudio = (pathIn: string, config: TransformationConfig) => {
  const anonymizationMap = {
    low: 7.5,
    medium: 7,
    high: 6.5,
  };
  const anonymization = anonymizationMap[config.anonymizationStrength];
  return ffmpeg(pathIn).audioFilters([
    `asetrate=48000*${anonymization / 10}`,
    `atempo=${10 / anonymization}`,
  ]);
};

const anonymizeVideo = (pathIn: string, config: TransformationConfig) => {
  const anonymizationMap = {
    low: 2,
    medium: 6,
    high: 10,
  };
  const anonymization = anonymizationMap[config.anonymizationStrength];

  return anonymizeAudio(pathIn, config)
    .videoFilter(`boxblur=${anonymization}`)
    .outputOptions(["-vcodec libx264", "-preset ultrafast"]);
};

const anonymizeFile = async (
  pathIn: string,
  pathOut: string,
  config: TransformationConfig
) => {
  let totalTime = 0;

  const mimeType = lookup(pathIn);
  const isAudioFile = mimeType && mimeType?.includes("audio");
  let ffmpegCommand = isAudioFile
    ? anonymizeAudio(pathIn, config)
    : anonymizeVideo(pathIn, config);

  ffmpegCommand =
    config.trimTo === ""
      ? ffmpegCommand
      : ffmpegCommand.setDuration(config.trimTo);

  return new Promise<void>((resolve, reject) => {
    ffmpegCommand
      .on("codecData", (data) => {
        totalTime = parseInt(data.duration.replace(/:/g, ""));
      })
      .on("progress", (progress) => onProgress(progress, totalTime))
      .on("error", (err) => onError(err, reject))
      .on("end", () => onEnd(resolve))
      .save(pathOut);
  });
};

export const anonymizeTransformation = async (
  pathIn: string,
  config: TransformationConfig
) => {
  const pathOut = getOutFilePath(
    pathIn,
    "anonymized",
    config.anonymizeFileName
  );
  await anonymizeFile(pathIn, pathOut, config);
  spawnSync("open", [pathOut]);
};
