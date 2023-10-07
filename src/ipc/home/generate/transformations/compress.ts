import { TransformationConfig } from "@/screens/home/components/Sidebar";
import { spawnSync } from "child_process";
import ffmpeg from "fluent-ffmpeg";
import { lookup } from "mime-types";
import { onEnd, onError, onProgress } from "../utils/ffmpegOptions";
import { getOutFilePath } from "../utils/getOutPaths";

/**
 * The compressAudio function takes a file path and a configuration object, and returns a compressed
 * audio file using the specified compression level.
 * @param {string} pathIn - The `pathIn` parameter is a string that represents the path or location of
 * the audio file that needs to be compressed.
 * @param {TransformationConfig} config - The `config` parameter is an object that contains the
 * configuration for the audio compression. It has a property called `compression` which specifies the
 * desired level of compression. The possible values for `config.compression` are "low", "medium", or
 * "high".
 * @returns The function `compressAudio` is returning the result of calling the `audioBitrate` method
 * on the `ffmpeg` object, passing in the `compression` value as the argument.
 */
const compressAudio = (pathIn: string, config: TransformationConfig) => {
  const compressionMap = {
    low: "128k",
    medium: "96k",
    high: "64k",
  };
  const compression = compressionMap[config.compression];
  return ffmpeg(pathIn).audioBitrate(compression);
};

/**
 * The compressVideo function takes a video file path and a configuration object, and uses FFmpeg to
 * compress the video with a specified compression level.
 * @param {string} pathIn - The `pathIn` parameter is a string that represents the path to the input
 * video file that needs to be compressed.
 * @param {TransformationConfig} config - The `config` parameter is an object that contains the
 * configuration for the video compression. It has a property called `compression` which specifies the
 * level of compression to be applied to the video. The possible values for `config.compression` are
 * "low", "medium", or "high".
 * @returns The function `compressVideo` returns a ffmpeg command that compresses a video file using
 * the specified path and configuration.
 */
const compressVideo = (pathIn: string, config: TransformationConfig) => {
  const compressionMap = {
    low: 4,
    medium: 8,
    high: 16,
  };
  const compression = compressionMap[config.compression];

  return ffmpeg(pathIn)
    .videoFilter(`scale=trunc(iw/${compression})*2:trunc(ih/${compression})*2`)
    .outputOptions(["-vcodec libx265", "-preset ultrafast"]);
};

/**
 * The `compressFile` function compresses a file (either audio or video) based on the provided
 * configuration and saves it to the specified output path.
 * @param {string} pathIn - The `pathIn` parameter is a string that represents the path to the input
 * file that needs to be compressed.
 * @param {string} pathOut - The `pathOut` parameter is a string that represents the output path where
 * the compressed file will be saved.
 * @param {TransformationConfig} config - The `config` parameter is an object that contains the
 * configuration settings for the compression process. It likely includes properties such as bitrate,
 * resolution, quality, or any other relevant settings specific to the compression algorithm being used
 * for audio or video files. The specific properties and their values would depend on the
 * implementation of
 * @returns The function `compressFile` returns a Promise that resolves to `void`.
 */
const compressFile = (
  pathIn: string,
  pathOut: string,
  config: TransformationConfig
) => {
  let totalTime = 0;

  const mimeType = lookup(pathIn);
  const isAudioFile = mimeType && mimeType?.includes("audio");

  return new Promise<void>((resolve, reject) => {
    let ffmpegCommand = isAudioFile
      ? compressAudio(pathIn, config)
      : compressVideo(pathIn, config);

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
 * The `compressTransformation` function compresses a file using a specified configuration and opens
 * the compressed file.
 * @param {string} pathIn - The `filePath` parameter is a string that represents the path to the file
 * that needs to be compressed.
 * @param {TransformationConfig} config - The `config` parameter is an object of type `GenerationConfig`.
 * It contains configuration options for the compression process. The specific properties and their
 * meanings would depend on the implementation of the `reduceFile` function.
 */
export const compressTransformation = async (
  pathIn: string,
  config: TransformationConfig
) => {
  const mimeType = lookup(pathIn);
  const isAudioFile = mimeType && mimeType?.includes("audio");

  const pathOut = getOutFilePath(pathIn, "compressed", {
    // We want to make sure to use ogg for audio files
    // as the compression is much better than other formats
    fileExtension: isAudioFile ? "ogg" : undefined,
  });
  await compressFile(pathIn, pathOut, config);
  try {
    // Open the file in the IINA app
    config.openFile && spawnSync("open", ["-a", "IINA", pathOut]);
  } catch (error) {
    console.log("Error opening file in IINA");
  }
};
