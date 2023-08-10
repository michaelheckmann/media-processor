import { TransformationConfig } from "@/screens/home/components/Sidebar";
import { spawnSync } from "child_process";
import ffmpeg from "fluent-ffmpeg";
import { lookup } from "mime-types";
import { onEnd, onError, onProgress } from "../utils/ffmpegOptions";
import { getOutFilePath } from "../utils/getOutPaths";

/**
 * The `anonymizeAudio` function takes in a file path and a configuration object, and returns an FFmpeg
 * command that applies audio filters to anonymize the audio based on the specified strength in the
 * configuration.
 * @param {string} pathIn - The `pathIn` parameter is a string that represents the path to the input
 * audio file that needs to be anonymized.
 * @param {TransformationConfig} config - The `config` parameter is an object that contains the
 * configuration for the audio transformation. It has a property called `anonymizationStrength` which
 * represents the level of anonymization to be applied to the audio. The possible values for
 * `anonymizationStrength` are "low", "medium", and
 * @returns a modified ffmpeg command that applies audio filters to the input audio file. The audio
 * filters include changing the sample rate and adjusting the tempo based on the specified
 * anonymization strength in the config object.
 */
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

/**
 * The `anonymizeVideo` function takes a video file path and a configuration object, and applies audio
 * anonymization, video blurring, and output options to the video.
 * @param {string} pathIn - The `pathIn` parameter is a string that represents the path or location of
 * the input video file that needs to be anonymized.
 * @param {TransformationConfig} config - The `config` parameter is an object that contains the
 * configuration for the video anonymization. It has the following properties:
 * @returns an instance of the `anonymizeAudio` function with some video filters and output options
 * applied.
 */
const anonymizeVideo = (pathIn: string, config: TransformationConfig) => {
  const anonymizationMap = {
    low: 2,
    medium: 6,
    high: 10,
  };
  const anonymization = anonymizationMap[config.anonymizationStrength];

  const [_, __, x, y] = config.blurArea.split(":");

  const blurCommand = config.blurArea
    ? anonymizeAudio(pathIn, config)
        .complexFilter(
          `[0:v]crop=${config.blurArea},avgblur=${
            anonymization * 2
          }[fg];[0:v][fg]overlay=${x}:${y}[v]`
        )
        .outputOptions(["-map [v]", "-map 0:a"])
    : anonymizeAudio(pathIn, config).videoFilter(`boxblur=${anonymization}`);

  return blurCommand.outputOptions(["-vcodec libx265", "-preset ultrafast"]);
};

/**
 * The `anonymizeFile` function takes in a file path, an output path, and a configuration object, and
 * uses FFmpeg to anonymize the file by either removing audio or trimming the video based on the
 * configuration.
 * @param {string} pathIn - The path to the input file that needs to be anonymized.
 * @param {string} pathOut - The `pathOut` parameter is a string that represents the output path where
 * the anonymized file will be saved.
 * @param {TransformationConfig} config - The `config` parameter is an object that contains
 * transformation configuration options. It is of type `TransformationConfig`. The specific properties
 * and their types are not provided in the code snippet, so you would need to refer to the
 * documentation or code implementation to determine the available options and their types.
 * @returns a Promise that resolves to void.
 */
const anonymizeFile = async (
  pathIn: string,
  pathOut: string,
  config: TransformationConfig
) => {
  let totalTime = 0;

  const mimeType = lookup(pathIn);
  const isAudioFile = mimeType && mimeType?.includes("audio");

  return new Promise<void>((resolve, reject) => {
    let ffmpegCommand = isAudioFile
      ? anonymizeAudio(pathIn, config)
      : anonymizeVideo(pathIn, config);

    ffmpegCommand =
      config.trimTo === ""
        ? ffmpegCommand
        : ffmpegCommand.setDuration(config.trimTo);

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

/**
 * The `anonymizeTransformation` function takes a file path and a configuration object, and it
 * anonymizes the file using the specified configuration, then opens the anonymized file.
 * @param {string} pathIn - The `pathIn` parameter is a string that represents the path to the input
 * file that needs to be anonymized.
 * @param {TransformationConfig} config - The `config` parameter is an object that contains the
 * configuration options for the anonymization transformation. It likely includes properties such as
 * `anonymizeFileName`, which specifies the name of the anonymized file, and possibly other options
 * related to the anonymization process.
 */
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
