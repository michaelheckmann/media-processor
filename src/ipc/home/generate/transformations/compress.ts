import { spawnSync } from "child_process";
import ffmpeg from "fluent-ffmpeg";
import { mainWindow } from "../../../../../src";
import { TransformationConfig } from "../../../../screens/home/components/Sidebar";
import { getOutFileName } from "../utils/getOutFileName";

/**
 * The `reduceFile` function takes an input file path, an output file path, a configuration object, and
 * a main window object, and uses FFmpeg to reduce the size of the video file based on the compression
 * level specified in the configuration object, while providing progress updates to the main window.
 * @param {string} pathIn - The `pathIn` parameter is a string that represents the input file path. It
 * is the path of the file that needs to be reduced or compressed.
 * @param {string} pathOut - The `pathOut` parameter is a string that represents the output file path
 * where the reduced file will be saved.
 * @param {TransformationConfig} config - The `config` parameter is an object of type `GenerationConfig`
 * which contains configuration options for the file reduction process.
 * @returns a Promise of type void.
 */
export function reduceFile(
  pathIn: string,
  pathOut: string,
  config: TransformationConfig
) {
  let totalTime = 0;
  let compression = 8;
  if (config.compression === "low") {
    compression = 4;
  } else if (config.compression === "high") {
    compression = 16;
  }

  return new Promise<void>((resolve, reject) => {
    ffmpeg(pathIn)
      .videoFilter(
        `scale=trunc(iw/${compression})*2:trunc(ih/${compression})*2`
      )
      .outputOptions(["-vcodec libx264", "-preset ultrafast"])
      .on("codecData", (data) => {
        totalTime = parseInt(data.duration.replace(/:/g, ""));
      })
      .on("progress", (progress) => {
        const time = parseInt(progress.timemark.replace(/:/g, ""));
        const percent = (time / totalTime) * 100;
        mainWindow.webContents.send("progress", percent);
        console.info(`[ffmpeg] progress: ${Math.round(percent)}%`);
      })
      .on("error", (err) => {
        console.error(`[ffmpeg] error: ${err.message}`);
        reject(err);
      })
      .on("end", () => {
        mainWindow.webContents.send("progress", null);
        console.log("[ffmpeg] finished");
        resolve();
      })
      .save(pathOut);
  });
}

/**
 * The `compressTransformation` function compresses a file using a specified configuration and opens
 * the compressed file.
 * @param {string} filePath - The `filePath` parameter is a string that represents the path to the file
 * that needs to be compressed.
 * @param {TransformationConfig} config - The `config` parameter is an object of type `GenerationConfig`.
 * It contains configuration options for the compression process. The specific properties and their
 * meanings would depend on the implementation of the `reduceFile` function.
 */
export const compressTransformation = async (
  filePath: string,
  config: TransformationConfig
) => {
  const compressedFilePath = getOutFileName(filePath, "compressed");
  await reduceFile(filePath, compressedFilePath, config);
  spawnSync("open", [compressedFilePath]);
};
